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
exports.UpdateChatConfigDto = exports.CreateChatConfigDto = exports.UpdateStreamConfigDto = void 0;
const class_validator_1 = require("class-validator");
class UpdateStreamConfigDto {
    logoPosition;
    scrollingText;
    overlaySettings;
}
exports.UpdateStreamConfigDto = UpdateStreamConfigDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateStreamConfigDto.prototype, "logoPosition", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateStreamConfigDto.prototype, "scrollingText", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateStreamConfigDto.prototype, "overlaySettings", void 0);
class CreateChatConfigDto {
    welcomeMessage;
    autoReplyRules;
    isEnabled;
}
exports.CreateChatConfigDto = CreateChatConfigDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateChatConfigDto.prototype, "welcomeMessage", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateChatConfigDto.prototype, "autoReplyRules", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateChatConfigDto.prototype, "isEnabled", void 0);
class UpdateChatConfigDto {
    welcomeMessage;
    autoReplyRules;
    isEnabled;
}
exports.UpdateChatConfigDto = UpdateChatConfigDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateChatConfigDto.prototype, "welcomeMessage", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateChatConfigDto.prototype, "autoReplyRules", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateChatConfigDto.prototype, "isEnabled", void 0);
//# sourceMappingURL=settings.dto.js.map