import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { FFmpegWorkerService } from './ffmpeg-worker.service';
import { StartStreamDto, StopStreamDto, SwitchVideoDto, StopActiveStreamDto } from './dto/stream.dto';
import * as fs from 'fs';

@Injectable()
export class StreamsService {
    private readonly logger = new Logger(StreamsService.name);

    constructor(
        private prisma: PrismaService,
        private ffmpegWorker: FFmpegWorkerService,
    ) { }

    /**
     * 🚀 START 24/7 LIVE TV STREAM (YouTube Loop Mode)
     */
    async startStream(startStreamDto: StartStreamDto) {
        const { videoPath, rtmpUrl, streamKey, videoId } = startStreamDto;

        // Validate video path
        if (!videoPath) {
            throw new BadRequestException('Video path is required');
        }

        // 🔥 NEW: Check if video file exists
        if (!fs.existsSync(videoPath)) {
            throw new BadRequestException(`Video file not found: ${videoPath}`);
        }

        // Validate RTMP credentials
        if (!rtmpUrl || !streamKey) {
            throw new BadRequestException('RTMP URL and Stream Key are required');
        }

        const fullRtmpUrl = `${rtmpUrl}/${streamKey}`;

        // Check if another stream is running
        const existingStream = await this.prisma.stream.findFirst({
            where: {
                status: { in: ['RUNNING', 'STARTING'] },
            },
        });

        if (existingStream) {
            throw new BadRequestException('Another stream is already running');
        }

        // 🔥 CREATE STREAM WITH VIDEO ID TRACKING
        const stream = await this.prisma.stream.create({
            data: {
                rtmpUrl,
                streamKey,
                status: 'STARTING',
                videoId: videoId || null, // 🎬 Track which video is streaming
            },
        });

        try {
            // 🔥 Register failure callback for auto-restart failures
            this.ffmpegWorker.registerFailureCallback(
                stream.id,
                async (streamId, error, retryCount) => {
                    this.logger.error(
                        `Stream ${streamId} failed after ${retryCount} retries: ${error}`,
                    );

                    // Update stream status to FAILED
                    await this.prisma.stream.update({
                        where: { id: streamId },
                        data: {
                            status: 'FAILED',
                            failureCount: retryCount,
                            lastError: error,
                        },
                    });

                    // Log failure
                    await this.prisma.streamLog.create({
                        data: {
                            streamId,
                            event: 'FAILED',
                            message: `Stream failed after ${retryCount} retries: ${error}`,
                        },
                    });
                },
            );

            // 🎬 Start REAL FFmpeg 24/7 Loop Streaming
            await this.ffmpegWorker.startStream({
                streamId: stream.id,
                videoPath,
                rtmpUrl,
                streamKey,
            });

            // Update to RUNNING
            await this.prisma.stream.update({
                where: { id: stream.id },
                data: {
                    status: 'RUNNING',
                    startedAt: new Date(),
                },
            });

            // 📝 Log
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
        } catch (error: any) {
            await this.prisma.stream.update({
                where: { id: stream.id },
                data: {
                    status: 'FAILED',
                    lastError: error.message,
                },
            });

            // Log failure
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

    /**
     * 🛑 STOP LIVE STREAM
     */
    async stopStream(id: string, stopStreamDto?: StopStreamDto) {
        const stream = await this.prisma.stream.findUnique({
            where: { id },
        });

        if (!stream) {
            throw new NotFoundException('Stream not found');
        }

        if (stream.status === 'STOPPED' || stream.status === 'FAILED') {
            this.logger.warn(
                `Stream ${id} is already ${stream.status}, will attempt cleanup anyway`,
            );
        }

        try {
            await this.prisma.stream.update({
                where: { id },
                data: { status: 'STOPPING' },
            });

            // Kill FFmpeg
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
        } catch (error: any) {
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

    /**
     * 🔥 NEW: SWITCH VIDEO (Live TV Channel Switching)
     */
    async switchVideo(switchVideoDto: SwitchVideoDto) {
        const { videoId, videoPath, streamKey } = switchVideoDto;

        // 🔥 Get current active stream
        const activeStream = await this.getActiveStream();

        if (!activeStream) {
            throw new BadRequestException('No active stream to switch from');
        }

        this.logger.log(
            `🔄 Switching stream ${activeStream.id} from video ${activeStream.videoId || 'unknown'} to ${videoId}`,
        );

        // Validate new video exists
        if (!fs.existsSync(videoPath)) {
            throw new BadRequestException(`Video file not found: ${videoPath}`);
        }

        try {
            // 🔥 Stop current stream
            await this.ffmpegWorker.stopStream(activeStream.id);

            // Update old stream status
            await this.prisma.stream.update({
                where: { id: activeStream.id },
                data: {
                    status: 'STOPPED',
                    stoppedAt: new Date(),
                },
            });

            // Log switch
            await this.prisma.streamLog.create({
                data: {
                    streamId: activeStream.id,
                    event: 'STOP',
                    message: `Stopped for video switch to ${videoId}`,
                },
            });

            // 🔥 Start new stream with new video
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
        } catch (error: any) {
            this.logger.error(`Failed to switch video: ${error.message}`);
            throw error;
        }
    }

    /**
     * 🔥 NEW: STOP ACTIVE STREAM (no ID required)
     */
    async stopActiveStream(stopActiveStreamDto?: StopActiveStreamDto) {
        const activeStream = await this.getActiveStream();

        if (!activeStream) {
            throw new BadRequestException('No active stream found');
        }

        return this.stopStream(activeStream.id, stopActiveStreamDto);
    }

    async getActiveStream() {
        return this.prisma.stream.findFirst({
            where: {
                status: { in: ['RUNNING', 'STARTING'] },
            },
            include: {
                video: true, // Include video details if available
            },
        });
    }

    async getStreamStatus(id: string) {
        const stream = await this.prisma.stream.findUnique({
            where: { id },
            include: {
                video: true, // Include video details
                logs: {
                    orderBy: { timestamp: 'desc' },
                    take: 10,
                },
            },
        });

        if (!stream) {
            throw new NotFoundException('Stream not found');
        }

        // 🔥 NEW: Calculate stream duration
        let durationMinutes: number | null = null;
        if (stream.startedAt) {
            const endTime = stream.stoppedAt || new Date();
            const durationMs = endTime.getTime() - stream.startedAt.getTime();
            durationMinutes = Math.floor(durationMs / 60000); // Convert to minutes
        }

        return {
            ...stream,
            durationMinutes, // Add calculated duration
        };
    }

    async getStreamLogs(id: string) {
        return this.prisma.streamLog.findMany({
            where: { streamId: id },
            orderBy: { timestamp: 'desc' },
        });
    }
}
