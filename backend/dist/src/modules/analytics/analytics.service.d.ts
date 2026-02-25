import { PrismaService } from '../../prisma.service';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<{
        totalStreams: number;
        totalVideos: number;
        totalStreamingHours: number;
        uptimePercentage: number;
        successfulStreams: number;
        failedStreams: number;
        videoUsageStats: ({
            videoId: null;
            title: string;
            usageCount: number;
        } | {
            videoId: string;
            title: string;
            usageCount: number;
        })[];
    }>;
    getTotalStreamingHours(): Promise<number>;
    getVideoUsageStats(): Promise<({
        videoId: null;
        title: string;
        usageCount: number;
    } | {
        videoId: string;
        title: string;
        usageCount: number;
    })[]>;
    calculateUptimePercentage(successful: number, failed: number): number;
    getStreamHistory(limit?: number): Promise<({
        schedule: ({
            video: {
                title: string;
                id: string;
                filename: string;
                filepath: string;
                duration: number | null;
                filesize: bigint;
                mimetype: string;
                uploadedAt: Date;
            };
        } & {
            id: string;
            videoId: string;
            startTime: Date;
            endTime: Date | null;
            timezone: string;
            status: import("@prisma/client").$Enums.ScheduleStatus;
            createdAt: Date;
            updatedAt: Date;
        }) | null;
        logs: {
            id: string;
            videoId: string | null;
            streamId: string;
            event: string;
            message: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            timestamp: Date;
        }[];
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
    })[]>;
    getStreamingTrends(days?: number): Promise<{
        total: number;
        successful: number;
        failed: number;
        date: string;
    }[]>;
}
