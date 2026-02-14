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
var SettingsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
const promises_1 = require("fs/promises");
let SettingsService = SettingsService_1 = class SettingsService {
    prisma;
    logger = new common_1.Logger(SettingsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStreamConfig() {
        let config = await this.prisma.streamConfig.findFirst();
        if (!config) {
            config = await this.prisma.streamConfig.create({
                data: {},
            });
        }
        return config;
    }
    async updateStreamConfig(updateDto) {
        const config = await this.getStreamConfig();
        return this.prisma.streamConfig.update({
            where: { id: config.id },
            data: updateDto,
        });
    }
    async uploadLogo(file) {
        const config = await this.getStreamConfig();
        if (config.logoPath) {
            try {
                await (0, promises_1.unlink)(config.logoPath);
            }
            catch (error) {
                this.logger.warn(`Failed to delete old logo: ${config.logoPath}`, error);
            }
        }
        return this.prisma.streamConfig.update({
            where: { id: config.id },
            data: { logoPath: file.path },
        });
    }
    async uploadIntroVideo(file) {
        const config = await this.getStreamConfig();
        if (config.introVideoPath) {
            try {
                await (0, promises_1.unlink)(config.introVideoPath);
            }
            catch (error) {
                this.logger.warn(`Failed to delete old intro: ${config.introVideoPath}`, error);
            }
        }
        return this.prisma.streamConfig.update({
            where: { id: config.id },
            data: { introVideoPath: file.path },
        });
    }
    async uploadOutroVideo(file) {
        const config = await this.getStreamConfig();
        if (config.outroVideoPath) {
            try {
                await (0, promises_1.unlink)(config.outroVideoPath);
            }
            catch (error) {
                this.logger.warn(`Failed to delete old outro: ${config.outroVideoPath}`, error);
            }
        }
        return this.prisma.streamConfig.update({
            where: { id: config.id },
            data: { outroVideoPath: file.path },
        });
    }
    async getChatConfig() {
        let config = await this.prisma.chatConfig.findFirst();
        if (!config) {
            config = await this.prisma.chatConfig.create({
                data: {
                    autoReplyRules: [],
                },
            });
        }
        return config;
    }
    async updateChatConfig(updateDto) {
        const config = await this.getChatConfig();
        return this.prisma.chatConfig.update({
            where: { id: config.id },
            data: updateDto,
        });
    }
    async addAutoReplyRule(keyword, response) {
        const config = await this.getChatConfig();
        const rules = config.autoReplyRules || [];
        rules.push({ keyword, response });
        return this.prisma.chatConfig.update({
            where: { id: config.id },
            data: { autoReplyRules: rules },
        });
    }
    async removeAutoReplyRule(keyword) {
        const config = await this.getChatConfig();
        const rules = config.autoReplyRules || [];
        const updatedRules = rules.filter((rule) => rule.keyword !== keyword);
        return this.prisma.chatConfig.update({
            where: { id: config.id },
            data: { autoReplyRules: updatedRules },
        });
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = SettingsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map