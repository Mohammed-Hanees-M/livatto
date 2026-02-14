import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { PrismaService } from '../../prisma.service';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@Module({
    imports: [
        MulterModule.register({
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const uploadDir = process.env.UPLOAD_DIR || './uploads';
                    cb(null, join(uploadDir, 'overlays'));
                },
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, `overlay-${uniqueSuffix}${extname(file.originalname)}`);
                },
            }),
        }),
    ],
    controllers: [SettingsController],
    providers: [SettingsService, PrismaService],
    exports: [SettingsService],
})
export class SettingsModule { }
