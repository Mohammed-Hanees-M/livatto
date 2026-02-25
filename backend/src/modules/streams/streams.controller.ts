import {
    Controller,
    Post,
    Body,
    Param,
    Get,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { StreamsService } from './streams.service';
import { StartStreamDto, StopStreamDto, SwitchVideoDto, StopActiveStreamDto } from './dto/stream.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// 🚨 SECURED: JWT GUARD ADDED
@Controller('streams')
@UseGuards(JwtAuthGuard)
export class StreamsController {
    constructor(private readonly streamsService: StreamsService) { }

    // Start 24/7 Stream (YouTube / RTMP)
    @Post('start')
    async startStream(@Body() startStreamDto: StartStreamDto) {
        return this.streamsService.startStream(startStreamDto);
    }

    // 🔥 NEW: Stop Active Stream (no ID required)
    @Post('stop-active')
    async stopActiveStream(@Body() stopActiveStreamDto?: StopActiveStreamDto) {
        return this.streamsService.stopActiveStream(stopActiveStreamDto);
    }

    // Stop Stream by ID
    @Post('stop/:id')
    async stopStream(
        @Param('id') id: string,
        @Body() stopStreamDto?: StopStreamDto,
    ) {
        return this.streamsService.stopStream(id, stopStreamDto);
    }

    // 🔥 NEW: Switch Video (Live TV Mode)
    @Post('switch')
    async switchVideo(@Body() switchVideoDto: SwitchVideoDto) {
        return this.streamsService.switchVideo(switchVideoDto);
    }

    // Get Active Stream
    @Get('active')
    async getActiveStream() {
        return this.streamsService.getActiveStream();
    }

    // Stream Status
    @Get(':id/status')
    async getStreamStatus(@Param('id') id: string) {
        return this.streamsService.getStreamStatus(id);
    }

    // Stream Logs
    @Get(':id/logs')
    async getStreamLogs(@Param('id') id: string) {
        return this.streamsService.getStreamLogs(id);
    }
}
