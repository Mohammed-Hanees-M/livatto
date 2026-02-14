import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VideosService } from './videos.service';
import { CreateVideoDto, UpdateVideoDto } from './dto/video.dto';

@Controller('videos')
export class VideosController {
    constructor(private readonly videosService: VideosService) { }

    // Upload Video (Public for now - internal dashboard usage)
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    create(
        @UploadedFile() file: Express.Multer.File,
        @Body() createVideoDto: CreateVideoDto,
    ) {
        return this.videosService.create(file, createVideoDto);
    }

    // 🔥 IMPORTANT: Scheduler & Dashboard need this without JWT
    @Get()
    findAll() {
        return this.videosService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.videosService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
        return this.videosService.update(id, updateVideoDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.videosService.remove(id);
    }
}
