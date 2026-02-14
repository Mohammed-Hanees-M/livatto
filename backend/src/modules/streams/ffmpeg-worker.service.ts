import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import * as fs from 'fs';

export interface StreamConfig {
    streamId: string;
    videoPath: string;
    rtmpUrl: string;
    streamKey: string;
}

// 🔥 NEW: Callback type for failure notifications
type FailureCallback = (streamId: string, error: string, retryCount: number) => void;

@Injectable()
export class FFmpegWorkerService implements OnModuleDestroy {
    private readonly logger = new Logger(FFmpegWorkerService.name);
    private activeProcesses = new Map<string, ChildProcessWithoutNullStreams>();
    private restartTimers = new Map<string, NodeJS.Timeout>();
    private streamConfigs = new Map<string, StreamConfig>(); // 🔥 Store configs for restart
    private failureCounts = new Map<string, number>(); // 🔥 Track failure attempts
    private failureCallbacks = new Map<string, FailureCallback>(); // 🔥 Notify service on max retries

    private readonly MAX_RETRIES = 5; // 🛡️ Prevent infinite crash loops
    private readonly BASE_RETRY_DELAY = 5000; // 5 seconds

    /**
     * 🚀 START 24/7 LOOP STREAM (YouTube / RTMP)
     */
    async startStream(config: StreamConfig): Promise<void> {
        const { streamId, videoPath, rtmpUrl, streamKey } = config;

        if (!fs.existsSync(videoPath)) {
            throw new Error(`Video file not found: ${videoPath}`);
        }

        const fullRtmp = `${rtmpUrl}/${streamKey}`;
        const ffmpegPath = process.env.FFMPEG_PATH || 'ffmpeg';

        // 🔥 Store config for potential restarts
        this.streamConfigs.set(streamId, config);

        // 🔥 Reset failure count on fresh start
        if (!this.failureCounts.has(streamId)) {
            this.failureCounts.set(streamId, 0);
        }

        this.logger.log(`🎥 Starting 24/7 Stream: ${streamId}`);
        this.logger.log(`📁 Video: ${videoPath}`);
        this.logger.log(`📡 RTMP: ${fullRtmp}`);

        // 🔥 24/7 LOOP + AUTO RECONNECT + LIVE TV MODE
        const ffmpegArgs = [
            '-re',
            '-stream_loop', '-1', // 🔁 Infinite loop (24/7)
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

        const ffmpegProcess = spawn(ffmpegPath, ffmpegArgs, {
            windowsHide: true,
        });

        this.activeProcesses.set(streamId, ffmpegProcess);

        ffmpegProcess.stdout.on('data', (data) => {
            this.logger.log(`[FFMPEG STDOUT]: ${data}`);
        });

        ffmpegProcess.stderr.on('data', (data) => {
            this.logger.log(`[FFMPEG]: ${data}`);
        });

        // 💀 AUTO RESTART IF STREAM DROPS (WITH RETRY LIMIT)
        ffmpegProcess.on('close', (code) => {
            this.logger.warn(`⚠️ Stream ${streamId} stopped with code ${code}`);

            this.activeProcesses.delete(streamId);

            // 🔥 Check if this was a manual stop (config cleared)
            if (!this.streamConfigs.has(streamId)) {
                this.logger.log(`Stream ${streamId} was stopped manually, no restart`);
                return;
            }

            // 🔥 Increment failure count
            const currentFailures = (this.failureCounts.get(streamId) || 0) + 1;
            this.failureCounts.set(streamId, currentFailures);

            // 🛡️ Check max retries
            if (currentFailures >= this.MAX_RETRIES) {
                this.logger.error(
                    `❌ Stream ${streamId} exceeded max retries (${this.MAX_RETRIES}). Marking as FAILED.`,
                );

                // 🔥 Notify service layer
                const callback = this.failureCallbacks.get(streamId);
                if (callback) {
                    callback(
                        streamId,
                        `Max retries (${this.MAX_RETRIES}) exceeded`,
                        currentFailures,
                    );
                }

                // 🧹 Cleanup
                this.streamConfigs.delete(streamId);
                this.failureCounts.delete(streamId);
                this.failureCallbacks.delete(streamId);
                return;
            }

            // 🔁 Auto Restart with exponential backoff
            const retryDelay = this.BASE_RETRY_DELAY * Math.pow(1.5, currentFailures - 1);
            this.logger.warn(
                `🔄 Auto-restarting stream ${streamId} in ${retryDelay / 1000}s (Attempt ${currentFailures}/${this.MAX_RETRIES})...`,
            );

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

    /**
     * 🛑 STOP STREAM (Manual Stop)
     */
    async stopStream(streamId: string): Promise<void> {
        this.logger.log(`🛑 Stopping stream: ${streamId}`);

        const process = this.activeProcesses.get(streamId);
        const timer = this.restartTimers.get(streamId);

        // 🔥 Clear restart timer
        if (timer) {
            clearTimeout(timer);
            this.restartTimers.delete(streamId);
        }

        // 🔥 Clear config to prevent auto-restart
        this.streamConfigs.delete(streamId);
        this.failureCounts.delete(streamId);
        this.failureCallbacks.delete(streamId);

        if (process) {
            process.kill('SIGINT');
            this.activeProcesses.delete(streamId);
            this.logger.log(`✅ Stream ${streamId} stopped successfully`);
        } else {
            this.logger.warn(`No active stream found for ID: ${streamId}`);
        }
    }

    /**
     * 🔥 NEW: Register callback for max retry failures
     */
    registerFailureCallback(streamId: string, callback: FailureCallback): void {
        this.failureCallbacks.set(streamId, callback);
    }

    /**
     * 📊 Get Stream Status (Live TV Dashboard)
     */
    getStreamStatus(streamId: string): string {
        return this.activeProcesses.has(streamId) ? 'RUNNING' : 'STOPPED';
    }

    /**
     * 🔥 NEW: Get current failure count for a stream
     */
    getFailureCount(streamId: string): number {
        return this.failureCounts.get(streamId) || 0;
    }

    /**
     * 🧹 Cleanup on server shutdown
     */
    onModuleDestroy() {
        this.logger.log('🧹 Cleaning up FFmpeg processes...');

        // Clear all timers
        this.restartTimers.forEach((timer) => clearTimeout(timer));
        this.restartTimers.clear();

        // Kill all processes
        this.activeProcesses.forEach((proc) => proc.kill('SIGINT'));
        this.activeProcesses.clear();

        // Clear all state
        this.streamConfigs.clear();
        this.failureCounts.clear();
        this.failureCallbacks.clear();
    }
}
