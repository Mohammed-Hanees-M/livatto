import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { UpdateStreamConfigDto, CreateChatConfigDto, UpdateChatConfigDto } from './dto/settings.dto';
import { unlink } from 'fs/promises';

@Injectable()
export class SettingsService {
    private readonly logger = new Logger(SettingsService.name);
    constructor(private prisma: PrismaService) { }

    // ============================================
    // Stream Configuration
    // ============================================

    async getStreamConfig() {
        let config = await this.prisma.streamConfig.findFirst();

        if (!config) {
            config = await this.prisma.streamConfig.create({
                data: {},
            });
        }

        return config;
    }

    async updateStreamConfig(updateDto: UpdateStreamConfigDto) {
        const config = await this.getStreamConfig();

        return this.prisma.streamConfig.update({
            where: { id: config.id },
            data: updateDto,
        });
    }

    async uploadLogo(file: Express.Multer.File) {
        const config = await this.getStreamConfig();

        // Delete old logo if exists
        if (config.logoPath) {
            try {
                await unlink(config.logoPath);
            } catch (error) {
                this.logger.warn(`Failed to delete old logo: ${config.logoPath}`, error);
            }
        }

        // Update with new logo path
        return this.prisma.streamConfig.update({
            where: { id: config.id },
            data: { logoPath: file.path },
        });
    }

    async uploadIntroVideo(file: Express.Multer.File) {
        const config = await this.getStreamConfig();

        if (config.introVideoPath) {
            try {
                await unlink(config.introVideoPath);
            } catch (error) {
                this.logger.warn(`Failed to delete old intro: ${config.introVideoPath}`, error);
            }
        }

        return this.prisma.streamConfig.update({
            where: { id: config.id },
            data: { introVideoPath: file.path },
        });
    }

    async uploadOutroVideo(file: Express.Multer.File) {
        const config = await this.getStreamConfig();

        if (config.outroVideoPath) {
            try {
                await unlink(config.outroVideoPath);
            } catch (error) {
                this.logger.warn(`Failed to delete old outro: ${config.outroVideoPath}`, error);
            }
        }

        return this.prisma.streamConfig.update({
            where: { id: config.id },
            data: { outroVideoPath: file.path },
        });
    }

    // ============================================
    // Chat Automation Configuration
    // ============================================

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

    async updateChatConfig(updateDto: UpdateChatConfigDto) {
        const config = await this.getChatConfig();

        return this.prisma.chatConfig.update({
            where: { id: config.id },
            data: updateDto,
        });
    }

    async addAutoReplyRule(keyword: string, response: string) {
        const config = await this.getChatConfig();
        const rules = (config.autoReplyRules as any[]) || [];

        rules.push({ keyword, response });

        return this.prisma.chatConfig.update({
            where: { id: config.id },
            data: { autoReplyRules: rules },
        });
    }

    async removeAutoReplyRule(keyword: string) {
        const config = await this.getChatConfig();
        const rules = (config.autoReplyRules as any[]) || [];

        const updatedRules = rules.filter((rule: any) => rule.keyword !== keyword);

        return this.prisma.chatConfig.update({
            where: { id: config.id },
            data: { autoReplyRules: updatedRules },
        });
    }
}
