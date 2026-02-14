"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AiToolsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiToolsService = void 0;
const common_1 = require("@nestjs/common");
let AiToolsService = AiToolsService_1 = class AiToolsService {
    logger = new common_1.Logger(AiToolsService_1.name);
    async generateTitle(generateContentDto) {
        const { context } = generateContentDto;
        this.logger.log(`[MOCK AI] Generating title for: ${context}`);
        const titles = [
            `${context} - Live Stream 24/7 🔴`,
            `LIVE: ${context} | Non-Stop Streaming`,
            `${context} - Continuous Live Broadcast`,
            `🔴 ${context} Live Now - Join Us!`,
            `${context} - 24/7 Live Streaming`,
        ];
        return titles[Math.floor(Math.random() * titles.length)];
    }
    async generateDescription(generateContentDto) {
        const { context } = generateContentDto;
        this.logger.log(`[MOCK AI] Generating description for: ${context}`);
        return `Welcome to our ${context} live stream! 🎥

📺 Watch 24/7 non-stop content
✨ High quality streaming
💬 Join our community in the chat
🔔 Subscribe and turn on notifications

This is an automated live stream running continuously. We hope you enjoy the content!

For more information and updates:
📧 Contact us through our website
🌐 Visit our social media pages

Thank you for watching! ❤️

#${context.replace(/\s+/g, '')} #LiveStream #24x7 #Streaming`;
    }
    async generateKeywords(generateContentDto) {
        const { context } = generateContentDto;
        this.logger.log(`[MOCK AI] Generating keywords for: ${context}`);
        const baseKeywords = [
            'live stream',
            '24/7 streaming',
            'non-stop',
            'continuous',
            'automated streaming',
            'live broadcast',
        ];
        const contextKeywords = context.toLowerCase().split(' ').slice(0, 3);
        return [...baseKeywords, ...contextKeywords].map(k => `#${k.replace(/\s+/g, '')}`);
    }
    async regenerate(type, generateContentDto) {
        switch (type) {
            case 'title':
                return this.generateTitle(generateContentDto);
            case 'description':
                return this.generateDescription(generateContentDto);
            case 'keywords':
                return this.generateKeywords(generateContentDto);
            default:
                throw new Error('Invalid content type');
        }
    }
};
exports.AiToolsService = AiToolsService;
exports.AiToolsService = AiToolsService = AiToolsService_1 = __decorate([
    (0, common_1.Injectable)()
], AiToolsService);
//# sourceMappingURL=ai-tools.service.js.map