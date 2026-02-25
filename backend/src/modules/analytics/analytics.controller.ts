import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// 🚨 SECURED: JWT GUARD ADDED
@Controller('analytics')
@UseGuards(JwtAuthGuard)
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
