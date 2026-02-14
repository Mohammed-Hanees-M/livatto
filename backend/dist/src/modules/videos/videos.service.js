"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
const storage_service_1 = require("./storage.service");
let VideosService = class VideosService {
    prisma;
    storage;
    constructor(prisma, storage) {
        this.prisma = prisma;
        this.storage = storage;
    }
    async create(file, createVideoDto) {
        const filepath = await this.storage.upload(file);
        const video = await this.prisma.video.create({
            data: {
                title: createVideoDto.title,
                filename: file.originalname,
                filepath: filepath,
                filesize: BigInt(file.size),
                mimetype: file.mimetype,
            },
        });
        return {
            ...video,
            filesize: video.filesize.toString(),
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
    async findOne(id) {
        const video = await this.prisma.video.findUnique({
            where: { id },
        });
        if (!video) {
            throw new common_1.NotFoundException('Video not found');
        }
        return {
            ...video,
            filesize: video.filesize.toString(),
            url: this.storage.getUrl(video.filepath),
        };
    }
    async update(id, updateVideoDto) {
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
    async remove(id) {
        const video = await this.prisma.video.findUnique({
            where: { id },
        });
        if (!video) {
            throw new common_1.NotFoundException('Video not found');
        }
        await this.storage.delete(video.filepath);
        await this.prisma.video.delete({
            where: { id },
        });
        return { message: 'Video deleted successfully' };
    }
};
exports.VideosService = VideosService;
exports.VideosService = VideosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService])
], VideosService);
//# sourceMappingURL=videos.service.js.map