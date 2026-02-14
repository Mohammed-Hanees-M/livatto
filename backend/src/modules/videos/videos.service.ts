import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { StorageService } from './storage.service';
import { CreateVideoDto, UpdateVideoDto } from './dto/video.dto';

@Injectable()
export class VideosService {
    constructor(
        private prisma: PrismaService,
        private storage: StorageService,
    ) { }

    async create(file: Express.Multer.File, createVideoDto: CreateVideoDto) {
        const filepath = await this.storage.upload(file);

        const video = await this.prisma.video.create({
            data: {
                title: createVideoDto.title,
                filename: file.originalname,
                filepath: filepath,
                filesize: BigInt(file.size),
                mimetype: file.mimetype,
                // Duration can be extracted using ffprobe in the future
            },
        });

        return {
            ...video,
            filesize: video.filesize.toString(), // Convert BigInt to string for JSON
            url: this.storage.getUrl(filepath),
        };
    }

    async findAll() {
        const videos = await this.prisma.video.findMany({
            orderBy: {
                uploadedAt: 'desc',
            },
        });

        return videos.map(video => ({
            ...video,
            filesize: video.filesize.toString(),
            url: this.storage.getUrl(video.filepath),
        }));
    }

    async findOne(id: string) {
        const video = await this.prisma.video.findUnique({
            where: { id },
        });

        if (!video) {
            throw new NotFoundException('Video not found');
        }

        return {
            ...video,
            filesize: video.filesize.toString(),
            url: this.storage.getUrl(video.filepath),
        };
    }

    async update(id: string, updateVideoDto: UpdateVideoDto) {
        const video = await this.prisma.video.update({
            where: { id },
            data: updateVideoDto,
        });

        return {
            ...video,
            filesize: video.filesize.toString(),
            url: this.storage.getUrl(video.filepath),
        };
    }

    async remove(id: string) {
        const video = await this.prisma.video.findUnique({
            where: { id },
        });

        if (!video) {
            throw new NotFoundException('Video not found');
        }

        // Delete file from storage
        await this.storage.delete(video.filepath);

        // Delete from database
        await this.prisma.video.delete({
            where: { id },
        });

        return { message: 'Video deleted successfully' };
    }
}
