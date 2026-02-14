import { PrismaService } from '../../prisma.service';
import { StorageService } from './storage.service';
import { CreateVideoDto, UpdateVideoDto } from './dto/video.dto';
export declare class VideosService {
    private prisma;
    private storage;
    constructor(prisma: PrismaService, storage: StorageService);
    create(file: Express.Multer.File, createVideoDto: CreateVideoDto): Promise<{
        filesize: string;
        url: string;
        id: string;
        title: string;
        filename: string;
        filepath: string;
        duration: number | null;
        mimetype: string;
        uploadedAt: Date;
    }>;
    findAll(): Promise<{
        filesize: string;
        url: string;
        id: string;
        title: string;
        filename: string;
        filepath: string;
        duration: number | null;
        mimetype: string;
        uploadedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        filesize: string;
        url: string;
        id: string;
        title: string;
        filename: string;
        filepath: string;
        duration: number | null;
        mimetype: string;
        uploadedAt: Date;
    }>;
    update(id: string, updateVideoDto: UpdateVideoDto): Promise<{
        filesize: string;
        url: string;
        id: string;
        title: string;
        filename: string;
        filepath: string;
        duration: number | null;
        mimetype: string;
        uploadedAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
