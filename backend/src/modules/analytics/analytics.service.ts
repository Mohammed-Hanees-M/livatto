import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class AnalyticsService {
    constructor(private prisma: PrismaService) { }

    async getDashboardStats() {
        const [totalStreams, totalVideos, completedStreams, failedStreams] =
            await Promise.all([
                this.prisma.stream.count(),
                this.prisma.video.count(),
                this.prisma.stream.count({ where: { status: 'STOPPED' } }),
                this.prisma.stream.count({ where: { status: 'FAILED' } }),
            ]);

        const totalStreamingHours = await this.getTotalStreamingHours();
        const videoUsageStats = await this.getVideoUsageStats();
        const uptimePercentage = this.calculateUptimePercentage(
            completedStreams,
            failedStreams,
        );

        return {
            totalStreams,
            totalVideos,
            totalStreamingHours,
            uptimePercentage,
            successfulStreams: completedStreams,
            failedStreams,
            videoUsageStats,
        };
    }

    async getTotalStreamingHours(): Promise<number> {
        const streams = await this.prisma.stream.findMany({
            where: {
                status: 'STOPPED',
                startedAt: { not: null },
                stoppedAt: { not: null },
            },
            select: {
                startedAt: true,
                stoppedAt: true,
            },
        });

        const totalMs = streams.reduce((acc, stream) => {
            if (stream.startedAt && stream.stoppedAt) {
                const duration =
                    stream.stoppedAt.getTime() - stream.startedAt.getTime();
                return acc + duration;
            }
            return acc;
        }, 0);

        // Convert milliseconds to hours
        return Math.round((totalMs / (1000 * 60 * 60)) * 100) / 100;
    }

    /**
     * 🔥 FIXED: Supports NULL videoId (24/7 Live TV mode)
     */
    async getVideoUsageStats() {
        const logs = await this.prisma.streamLog.groupBy({
            by: ['videoId'],
            _count: {
                videoId: true,
            },
            orderBy: {
                _count: {
                    videoId: 'desc',
                },
            },
            take: 10,
        });

        const videosWithDetails = await Promise.all(
            logs.map(async (log) => {
                // ⚠️ CRITICAL FIX: handle nullable videoId
                if (!log.videoId) {
                    return {
                        videoId: null,
                        title: '24/7 Live TV Loop',
                        usageCount: log._count.videoId,
                    };
                }

                const video = await this.prisma.video.findUnique({
                    where: { id: log.videoId }, // SAFE now (never null)
                    select: { id: true, title: true },
                });

                return {
                    videoId: log.videoId,
                    title: video?.title || 'Deleted Video',
                    usageCount: log._count.videoId,
                };
            }),
        );

        return videosWithDetails;
    }

    calculateUptimePercentage(successful: number, failed: number): number {
        const total = successful + failed;
        if (total === 0) return 100;
        return Math.round((successful / total) * 100 * 100) / 100;
    }

    async getStreamHistory(limit = 20) {
        return this.prisma.stream.findMany({
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                schedule: {
                    include: {
                        video: true,
                    },
                },
                logs: true,
            },
        });
    }

    async getStreamingTrends(days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const streams = await this.prisma.stream.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                },
            },
            select: {
                createdAt: true,
                status: true,
                startedAt: true,
                stoppedAt: true,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });

        const trendsByDate: Record<
            string,
            { total: number; successful: number; failed: number }
        > = {};

        for (const stream of streams) {
            const date = stream.createdAt.toISOString().split('T')[0];

            if (!trendsByDate[date]) {
                trendsByDate[date] = {
                    total: 0,
                    successful: 0,
                    failed: 0,
                };
            }

            trendsByDate[date].total++;

            if (stream.status === 'STOPPED') {
                trendsByDate[date].successful++;
            }

            if (stream.status === 'FAILED') {
                trendsByDate[date].failed++;
            }
        }

        return Object.entries(trendsByDate).map(([date, stats]) => ({
            date,
            ...stats,
        }));
    }
}
