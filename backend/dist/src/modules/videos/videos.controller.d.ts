import { VideosService } from './videos.service';
import { CreateVideoDto, UpdateVideoDto } from './dto/video.dto';
export declare class VideosController {
    private readonly videosService;
    constructor(videosService: VideosService);
    create(file: Express.Multer.File, createVideoDto: CreateVideoDto): Promise<{
        filesize: string;
        url: string;
        title: string;
        id: string;
        filename: string;
        filepath: string;
        duration: number | null;
        mimetype: string;
        uploadedAt: Date;
    }>;
    findAll(): Promise<{
        filesize: string;
        url: string;
        title: string;
        id: string;
        filename: string;
        filepath: string;
        duration: number | null;
        mimetype: string;
        uploadedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        filesize: string;
        url: string;
        title: string;
        id: string;
        filename: string;
        filepath: string;
        duration: number | null;
        mimetype: string;
        uploadedAt: Date;
    }>;
    update(id: string, updateVideoDto: UpdateVideoDto): Promise<{
        filesize: string;
        url: string;
        title: string;
        id: string;
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
