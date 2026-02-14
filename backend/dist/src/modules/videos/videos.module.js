"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideosModule = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const videos_controller_1 = require("./videos.controller");
const videos_service_1 = require("./videos.service");
const storage_service_1 = require("./storage.service");
const prisma_service_1 = require("../../prisma.service");
const multer_1 = require("multer");
const path_1 = require("path");
let VideosModule = class VideosModule {
};
exports.VideosModule = VideosModule;
exports.VideosModule = VideosModule = __decorate([
    (0, common_1.Module)({
        imports: [
            platform_express_1.MulterModule.register({
                storage: (0, multer_1.diskStorage)({
                    destination: (req, file, cb) => {
                        const uploadDir = process.env.UPLOAD_DIR || './uploads';
                        cb(null, (0, path_1.join)(uploadDir, 'videos'));
                    },
                    filename: (req, file, cb) => {
                        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                        cb(null, `video-${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
                    },
                }),
                limits: {
                    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5368709120'),
                },
                fileFilter: (req, file, cb) => {
                    const allowedMimeTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/quicktime', 'video/x-msvideo'];
                    if (allowedMimeTypes.includes(file.mimetype)) {
                        cb(null, true);
                    }
                    else {
                        cb(new Error('Invalid file type. Only video files are allowed.'), false);
                    }
                },
            }),
        ],
        controllers: [videos_controller_1.VideosController],
        providers: [videos_service_1.VideosService, storage_service_1.StorageService, prisma_service_1.PrismaService],
        exports: [videos_service_1.VideosService],
    })
], VideosModule);
//# sourceMappingURL=videos.module.js.map