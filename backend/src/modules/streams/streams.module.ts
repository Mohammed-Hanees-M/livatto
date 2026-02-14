import { Module } from '@nestjs/common';
import { StreamsController } from './streams.controller';
import { StreamsService } from './streams.service';
import { FFmpegWorkerService } from './ffmpeg-worker.service';
import { PrismaService } from '../../prisma.service';

@Module({
    controllers: [StreamsController],
    providers: [StreamsService, FFmpegWorkerService, PrismaService],
    exports: [StreamsService],
})
export class StreamsModule { }
