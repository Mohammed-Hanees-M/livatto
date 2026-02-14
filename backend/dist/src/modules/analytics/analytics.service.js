"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const [totalStreams, totalVideos, completedStreams, failedStreams] = await Promise.all([
            this.prisma.stream.count(),
            this.prisma.video.count(),
            this.prisma.stream.count({ where: { status: 'STOPPED' } }),
            this.prisma.stream.count({ where: { status: 'FAILED' } }),
        ]);
        const totalStreamingHours = await this.getTotalStreamingHours();
        const videoUsageStats = await this.getVideoUsageStats();
        const uptimePercentage = this.calculateUptimePercentage(completedStreams, failedStreams);
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
    async getTotalStreamingHours() {
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
                const duration = stream.stoppedAt.getTime() - stream.startedAt.getTime();
                return acc + duration;
            }
            return acc;
        }, 0);
        return Math.round((totalMs / (1000 * 60 * 60)) * 100) / 100;
    }
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
        const videosWithDetails = await Promise.all(logs.map(async (log) => {
            if (!log.videoId) {
                return {
                    videoId: null,
                    title: '24/7 Live TV Loop',
                    usageCount: log._count.videoId,
                };
            }
            const video = await this.prisma.video.findUnique({
                where: { id: log.videoId },
                select: { id: true, title: true },
            });
            return {
                videoId: log.videoId,
                title: video?.title || 'Deleted Video',
                usageCount: log._count.videoId,
            };
        }));
        return videosWithDetails;
    }
    calculateUptimePercentage(successful, failed) {
        const total = successful + failed;
        if (total === 0)
            return 100;
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
        const trendsByDate = {};
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
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map