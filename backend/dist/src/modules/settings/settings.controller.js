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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const settings_service_1 = require("./settings.service");
const settings_dto_1 = require("./dto/settings.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let SettingsController = class SettingsController {
    settingsService;
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    getStreamConfig() {
        return this.settingsService.getStreamConfig();
    }
    updateStreamConfig(updateDto) {
        return this.settingsService.updateStreamConfig(updateDto);
    }
    uploadLogo(file) {
        return this.settingsService.uploadLogo(file);
    }
    uploadIntro(file) {
        return this.settingsService.uploadIntroVideo(file);
    }
    uploadOutro(file) {
        return this.settingsService.uploadOutroVideo(file);
    }
    getChatConfig() {
        return this.settingsService.getChatConfig();
    }
    updateChatConfig(updateDto) {
        return this.settingsService.updateChatConfig(updateDto);
    }
    addAutoReplyRule(body) {
        return this.settingsService.addAutoReplyRule(body.keyword, body.response);
    }
    removeAutoReplyRule(keyword) {
        return this.settingsService.removeAutoReplyRule(keyword);
    }
};
exports.SettingsController = SettingsController;
__decorate([
    (0, common_1.Get)('stream-config'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "getStreamConfig", null);
__decorate([
    (0, common_1.Patch)('stream-config'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [settings_dto_1.UpdateStreamConfigDto]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "updateStreamConfig", null);
__decorate([
    (0, common_1.Post)('stream-config/logo'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "uploadLogo", null);
__decorate([
    (0, common_1.Post)('stream-config/intro'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "uploadIntro", null);
__decorate([
    (0, common_1.Post)('stream-config/outro'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "uploadOutro", null);
__decorate([
    (0, common_1.Get)('chat-config'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "getChatConfig", null);
__decorate([
    (0, common_1.Patch)('chat-config'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [settings_dto_1.UpdateChatConfigDto]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "updateChatConfig", null);
__decorate([
    (0, common_1.Post)('chat-config/auto-reply'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "addAutoReplyRule", null);
__decorate([
    (0, common_1.Delete)('chat-config/auto-reply'),
    __param(0, (0, common_1.Query)('keyword')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "removeAutoReplyRule", null);
exports.SettingsController = SettingsController = __decorate([
    (0, common_1.Controller)('settings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], SettingsController);
//# sourceMappingURL=settings.controller.js.map