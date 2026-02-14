"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var FFmpegWorkerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FFmpegWorkerService = void 0;
const common_1 = require("@nestjs/common");
const child_process_1 = require("child_process");
const fs = __importStar(require("fs"));
let FFmpegWorkerService = FFmpegWorkerService_1 = class FFmpegWorkerService {
    logger = new common_1.Logger(FFmpegWorkerService_1.name);
    activeProcesses = new Map();
    restartTimers = new Map();
    streamConfigs = new Map();
    failureCounts = new Map();
    failureCallbacks = new Map();
    MAX_RETRIES = 5;
    BASE_RETRY_DELAY = 5000;
    async startStream(config) {
        const { streamId, videoPath, rtmpUrl, streamKey } = config;
        if (!fs.existsSync(videoPath)) {
            throw new Error(`Video file not found: ${videoPath}`);
        }
        const fullRtmp = `${rtmpUrl}/${streamKey}`;
        const ffmpegPath = process.env.FFMPEG_PATH || 'ffmpeg';
        this.streamConfigs.set(streamId, config);
        if (!this.failureCounts.has(streamId)) {
            this.failureCounts.set(streamId, 0);
        }
        this.logger.log(`🎥 Starting 24/7 Stream: ${streamId}`);
        this.logger.log(`📁 Video: ${videoPath}`);
        this.logger.log(`📡 RTMP: ${fullRtmp}`);
        const ffmpegArgs = [
            '-re',
            '-stream_loop', '-1',
            '-i', videoPath,
            '-c:v', 'libx264',
            '-preset', 'veryfast',
            '-maxrate', '3000k',
            '-bufsize', '6000k',
            '-pix_fmt', 'yuv420p',
            '-g', '50',
            '-c:a', 'aac',
            '-b:a', '128k',
            '-ar', '44100',
            '-f', 'flv',
            fullRtmp,
        ];
        const ffmpegProcess = (0, child_process_1.spawn)(ffmpegPath, ffmpegArgs, {
            windowsHide: true,
        });
        this.activeProcesses.set(streamId, ffmpegProcess);
        ffmpegProcess.stdout.on('data', (data) => {
            this.logger.log(`[FFMPEG STDOUT]: ${data}`);
        });
        ffmpegProcess.stderr.on('data', (data) => {
            this.logger.log(`[FFMPEG]: ${data}`);
        });
        ffmpegProcess.on('close', (code) => {
            this.logger.warn(`⚠️ Stream ${streamId} stopped with code ${code}`);
            this.activeProcesses.delete(streamId);
            if (!this.streamConfigs.has(streamId)) {
                this.logger.log(`Stream ${streamId} was stopped manually, no restart`);
                return;
            }
            const currentFailures = (this.failureCounts.get(streamId) || 0) + 1;
            this.failureCounts.set(streamId, currentFailures);
            if (currentFailures >= this.MAX_RETRIES) {
                this.logger.error(`❌ Stream ${streamId} exceeded max retries (${this.MAX_RETRIES}). Marking as FAILED.`);
                const callback = this.failureCallbacks.get(streamId);
                if (callback) {
                    callback(streamId, `Max retries (${this.MAX_RETRIES}) exceeded`, currentFailures);
                }
                this.streamConfigs.delete(streamId);
                this.failureCounts.delete(streamId);
                this.failureCallbacks.delete(streamId);
                return;
            }
            const retryDelay = this.BASE_RETRY_DELAY * Math.pow(1.5, currentFailures - 1);
            this.logger.warn(`🔄 Auto-restarting stream ${streamId} in ${retryDelay / 1000}s (Attempt ${currentFailures}/${this.MAX_RETRIES})...`);
            const restartTimer = setTimeout(() => {
                const storedConfig = this.streamConfigs.get(streamId);
                if (storedConfig) {
                    this.startStream(storedConfig);
                }
            }, retryDelay);
            this.restartTimers.set(streamId, restartTimer);
        });
        ffmpegProcess.on('error', (error) => {
            this.logger.error(`❌ FFmpeg error: ${error.message}`);
        });
    }
    async stopStream(streamId) {
        this.logger.log(`🛑 Stopping stream: ${streamId}`);
        const process = this.activeProcesses.get(streamId);
        const timer = this.restartTimers.get(streamId);
        if (timer) {
            clearTimeout(timer);
            this.restartTimers.delete(streamId);
        }
        this.streamConfigs.delete(streamId);
        this.failureCounts.delete(streamId);
        this.failureCallbacks.delete(streamId);
        if (process) {
            process.kill('SIGINT');
            this.activeProcesses.delete(streamId);
            this.logger.log(`✅ Stream ${streamId} stopped successfully`);
        }
        else {
            this.logger.warn(`No active stream found for ID: ${streamId}`);
        }
    }
    registerFailureCallback(streamId, callback) {
        this.failureCallbacks.set(streamId, callback);
    }
    getStreamStatus(streamId) {
        return this.activeProcesses.has(streamId) ? 'RUNNING' : 'STOPPED';
    }
    getFailureCount(streamId) {
        return this.failureCounts.get(streamId) || 0;
    }
    onModuleDestroy() {
        this.logger.log('🧹 Cleaning up FFmpeg processes...');
        this.restartTimers.forEach((timer) => clearTimeout(timer));
        this.restartTimers.clear();
        this.activeProcesses.forEach((proc) => proc.kill('SIGINT'));
        this.activeProcesses.clear();
        this.streamConfigs.clear();
        this.failureCounts.clear();
        this.failureCallbacks.clear();
    }
};
exports.FFmpegWorkerService = FFmpegWorkerService;
exports.FFmpegWorkerService = FFmpegWorkerService = FFmpegWorkerService_1 = __decorate([
    (0, common_1.Injectable)()
], FFmpegWorkerService);
//# sourceMappingURL=ffmpeg-worker.service.js.map