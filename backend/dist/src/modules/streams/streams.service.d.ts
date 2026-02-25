import { PrismaService } from '../../prisma.service';
import { FFmpegWorkerService } from './ffmpeg-worker.service';
import { StartStreamDto, StopStreamDto, SwitchVideoDto, StopActiveStreamDto } from './dto/stream.dto';
export declare class StreamsService {
    private prisma;
    private ffmpegWorker;
    private readonly logger;
    constructor(prisma: PrismaService, ffmpegWorker: FFmpegWorkerService);
    startStream(startStreamDto: StartStreamDto): Promise<{
        message: string;
        streamId: string;
        videoId: string | undefined;
        rtmp: string;
    }>;
    stopStream(id: string, stopStreamDto?: StopStreamDto): Promise<{
        message: string;
    }>;
    switchVideo(switchVideoDto: SwitchVideoDto): Promise<{
        message: string;
        oldStreamId: string;
        newStreamId: string;
        videoId: string;
    }>;
    stopActiveStream(stopActiveStreamDto?: StopActiveStreamDto): Promise<{
        message: string;
    }>;
    getActiveStream(): Promise<({
        video: {
            title: string;
            id: string;
            filename: string;
            filepath: string;
            duration: number | null;
            filesize: bigint;
            mimetype: string;
            uploadedAt: Date;
        } | null;
    } & {
        id: string;
        videoId: string | null;
        status: import("@prisma/client").$Enums.StreamStatus;
        createdAt: Date;
        updatedAt: Date;
        rtmpUrl: string | null;
        streamKey: string | null;
        scheduleId: string | null;
        channelId: string | null;
        startedAt: Date | null;
        stoppedAt: Date | null;
        failureCount: number;
        lastError: string | null;
    }) | null>;
    getStreamStatus(id: string): Promise<{
        durationMinutes: number | null;
        video: {
            title: string;
            id: string;
            filename: string;
            filepath: string;
            duration: number | null;
            filesize: bigint;
            mimetype: string;
            uploadedAt: Date;
        } | null;
        logs: {
            id: string;
            videoId: string | null;
            streamId: string;
            event: string;
            message: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            timestamp: Date;
        }[];
        id: string;
        videoId: string | null;
        status: import("@prisma/client").$Enums.StreamStatus;
        createdAt: Date;
        updatedAt: Date;
        rtmpUrl: string | null;
        streamKey: string | null;
        scheduleId: string | null;
        channelId: string | null;
        startedAt: Date | null;
        stoppedAt: Date | null;
        failureCount: number;
        lastError: string | null;
    }>;
    getStreamLogs(id: string): Promise<{
        id: string;
        videoId: string | null;
        streamId: string;
        event: string;
        message: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        timestamp: Date;
    }[]>;
}
