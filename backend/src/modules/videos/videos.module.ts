import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { StorageService } from './storage.service';
import { PrismaService } from '../../prisma.service';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@Module({
    imports: [
        MulterModule.register({
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const uploadDir = process.env.UPLOAD_DIR || './uploads';
                    cb(null, join(uploadDir, 'videos'));
                },
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, `video-${uniqueSuffix}${extname(file.originalname)}`);
                },
            }),
            limits: {
                fileSize: parseInt(process.env.MAX_FILE_SIZE || '5368709120'),
            },
            fileFilter: (req, file, cb) => {
                const allowedMimeTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/quicktime', 'video/x-msvideo'];
                if (allowedMimeTypes.includes(file.mimetype)) {
                    cb(null, true);
                } else {
                    cb(new Error('Invalid file type. Only video files are allowed.'), false);
                }
            },
        }),
    ],
    controllers: [VideosController],
    providers: [VideosService, StorageService, PrismaService],
    exports: [VideosService],
})
export class VideosModule { }
