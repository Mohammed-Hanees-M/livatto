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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var StreamsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
const ffmpeg_worker_service_1 = require("./ffmpeg-worker.service");
const fs = __importStar(require("fs"));
let StreamsService = StreamsService_1 = class StreamsService {
    prisma;
    ffmpegWorker;
    logger = new common_1.Logger(StreamsService_1.name);
    constructor(prisma, ffmpegWorker) {
        this.prisma = prisma;
        this.ffmpegWorker = ffmpegWorker;
    }
    async startStream(startStreamDto) {
        const { videoPath, rtmpUrl, streamKey, videoId } = startStreamDto;
        if (!videoPath) {
            throw new common_1.BadRequestException('Video path is required');
        }
        if (!fs.existsSync(videoPath)) {
            throw new common_1.BadRequestException(`Video file not found: ${videoPath}`);
        }
        if (!rtmpUrl || !streamKey) {
            throw new common_1.BadRequestException('RTMP URL and Stream Key are required');
        }
        const fullRtmpUrl = `${rtmpUrl}/${streamKey}`;
        const existingStream = await this.prisma.stream.findFirst({
            where: {
                status: { in: ['RUNNING', 'STARTING'] },
            },
        });
        if (existingStream) {
            throw new common_1.BadRequestException('Another stream is already running');
        }
        const stream = await this.prisma.stream.create({
            data: {
                rtmpUrl,
                streamKey,
                status: 'STARTING',
                videoId: videoId || null,
            },
        });
        try {
            this.ffmpegWorker.registerFailureCallback(stream.id, async (streamId, error, retryCount) => {
                this.logger.error(`Stream ${streamId} failed after ${retryCount} retries: ${error}`);
                await this.prisma.stream.update({
                    where: { id: streamId },
                    data: {
                        status: 'FAILED',
                        failureCount: retryCount,
                        lastError: error,
                    },
                });
                await this.prisma.streamLog.create({
                    data: {
                        streamId,
                        event: 'FAILED',
                        message: `Stream failed after ${retryCount} retries: ${error}`,
                    },
                });
            });
            await this.ffmpegWorker.startStream({
                streamId: stream.id,
                videoPath,
                rtmpUrl,
                streamKey,
            });
            await this.prisma.stream.update({
                where: { id: stream.id },
                data: {
                    status: 'RUNNING',
                    startedAt: new Date(),
                },
            });
            await this.prisma.streamLog.create({
                data: {
                    streamId: stream.id,
                    event: 'START',
                    message: videoId
                        ? `24/7 Live TV Stream started with video ${videoId}`
                        : '24/7 Live TV Stream started successfully',
                },
            });
            this.logger.log(`🚀 24/7 YouTube Live started: ${stream.id}${videoId ? ` (Video: ${videoId})` : ''}`);
            return {
                message: '24/7 YouTube Live started successfully',
                streamId: stream.id,
                videoId: videoId,
                rtmp: fullRtmpUrl,
            };
        }
        catch (error) {
            await this.prisma.stream.update({
                where: { id: stream.id },
                data: {
                    status: 'FAILED',
                    lastError: error.message,
                },
            });
            await this.prisma.streamLog.create({
                data: {
                    streamId: stream.id,
                    event: 'ERROR',
                    message: `Failed to start stream: ${error.message}`,
                },
            });
            this.logger.error(`Stream failed: ${error.message}`);
            throw error;
        }
    }
    async stopStream(id, stopStreamDto) {
        const stream = await this.prisma.stream.findUnique({
            where: { id },
        });
        if (!stream) {
            throw new common_1.NotFoundException('Stream not found');
        }
        if (stream.status === 'STOPPED' || stream.status === 'FAILED') {
            this.logger.warn(`Stream ${id} is already ${stream.status}, will attempt cleanup anyway`);
        }
        try {
            await this.prisma.stream.update({
                where: { id },
                data: { status: 'STOPPING' },
            });
            await this.ffmpegWorker.stopStream(id);
            await this.prisma.stream.update({
                where: { id },
                data: {
                    status: 'STOPPED',
                    stoppedAt: new Date(),
                },
            });
            await this.prisma.streamLog.create({
                data: {
                    streamId: id,
                    event: 'STOP',
                    message: stopStreamDto?.reason || 'Stream stopped manually',
                },
            });
            this.logger.log(`🛑 Stream ${id} stopped successfully`);
            return { message: 'Stream stopped successfully' };
        }
        catch (error) {
            await this.prisma.stream.update({
                where: { id },
                data: {
                    status: 'FAILED',
                    lastError: error.message,
                },
            });
            throw error;
        }
    }
    async switchVideo(switchVideoDto) {
        const { videoId, videoPath, streamKey } = switchVideoDto;
        const activeStream = await this.getActiveStream();
        if (!activeStream) {
            throw new common_1.BadRequestException('No active stream to switch from');
        }
        this.logger.log(`🔄 Switching stream ${activeStream.id} from video ${activeStream.videoId || 'unknown'} to ${videoId}`);
        if (!fs.existsSync(videoPath)) {
            throw new common_1.BadRequestException(`Video file not found: ${videoPath}`);
        }
        try {
            await this.ffmpegWorker.stopStream(activeStream.id);
            await this.prisma.stream.update({
                where: { id: activeStream.id },
                data: {
                    status: 'STOPPED',
                    stoppedAt: new Date(),
                },
            });
            await this.prisma.streamLog.create({
                data: {
                    streamId: activeStream.id,
                    event: 'STOP',
                    message: `Stopped for video switch to ${videoId}`,
                },
            });
            const newStreamKey = streamKey || activeStream.streamKey || '';
            const newRtmpUrl = activeStream.rtmpUrl || 'rtmp://a.rtmp.youtube.com/live2';
            const newStream = await this.startStream({
                videoPath,
                videoId,
                rtmpUrl: newRtmpUrl,
                streamKey: newStreamKey,
            });
            this.logger.log(`✅ Successfully switched to video ${videoId}`);
            return {
                message: 'Video switched successfully',
                oldStreamId: activeStream.id,
                newStreamId: newStream.streamId,
                videoId,
            };
        }
        catch (error) {
            this.logger.error(`Failed to switch video: ${error.message}`);
            throw error;
        }
    }
    async stopActiveStream(stopActiveStreamDto) {
        const activeStream = await this.getActiveStream();
        if (!activeStream) {
            throw new common_1.BadRequestException('No active stream found');
        }
        return this.stopStream(activeStream.id, stopActiveStreamDto);
    }
    async getActiveStream() {
        return this.prisma.stream.findFirst({
            where: {
                status: { in: ['RUNNING', 'STARTING'] },
            },
            include: {
                video: true,
            },
        });
    }
    async getStreamStatus(id) {
        const stream = await this.prisma.stream.findUnique({
            where: { id },
            include: {
                video: true,
                logs: {
                    orderBy: { timestamp: 'desc' },
                    take: 10,
                },
            },
        });
        if (!stream) {
            throw new common_1.NotFoundException('Stream not found');
        }
        let durationMinutes = null;
        if (stream.startedAt) {
            const endTime = stream.stoppedAt || new Date();
            const durationMs = endTime.getTime() - stream.startedAt.getTime();
            durationMinutes = Math.floor(durationMs / 60000);
        }
        return {
            ...stream,
            durationMinutes,
        };
    }
    async getStreamLogs(id) {
        return this.prisma.streamLog.findMany({
            where: { streamId: id },
            orderBy: { timestamp: 'desc' },
        });
    }
};
exports.StreamsService = StreamsService;
exports.StreamsService = StreamsService = StreamsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ffmpeg_worker_service_1.FFmpegWorkerService])
], StreamsService);
//# sourceMappingURL=streams.service.js.map