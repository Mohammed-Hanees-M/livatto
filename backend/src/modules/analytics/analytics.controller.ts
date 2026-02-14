import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

// 🔥 JWT REMOVED (analytics should be accessible to dashboard)
@Controller('analytics')
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @Get('dashboard')
    getDashboardStats() {
        return this.analyticsService.getDashboardStats();
    }

    @Get('history')
    getStreamHistory(@Query('limit') limit?: string) {
        return this.analyticsService.getStreamHistory(limit ? parseInt(limit) : 20);
    }

    @Get('trends')
    getStreamingTrends(@Query('days') days?: string) {
        return this.analyticsService.getStreamingTrends(days ? parseInt(days) : 30);
    }
}
