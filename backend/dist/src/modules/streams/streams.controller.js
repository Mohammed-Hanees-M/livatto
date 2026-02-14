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
exports.StreamsController = void 0;
const common_1 = require("@nestjs/common");
const streams_service_1 = require("./streams.service");
const stream_dto_1 = require("./dto/stream.dto");
let StreamsController = class StreamsController {
    streamsService;
    constructor(streamsService) {
        this.streamsService = streamsService;
    }
    async startStream(startStreamDto) {
        return this.streamsService.startStream(startStreamDto);
    }
    async stopActiveStream(stopActiveStreamDto) {
        return this.streamsService.stopActiveStream(stopActiveStreamDto);
    }
    async stopStream(id, stopStreamDto) {
        return this.streamsService.stopStream(id, stopStreamDto);
    }
    async switchVideo(switchVideoDto) {
        return this.streamsService.switchVideo(switchVideoDto);
    }
    async getActiveStream() {
        return this.streamsService.getActiveStream();
    }
    async getStreamStatus(id) {
        return this.streamsService.getStreamStatus(id);
    }
    async getStreamLogs(id) {
        return this.streamsService.getStreamLogs(id);
    }
};
exports.StreamsController = StreamsController;
__decorate([
    (0, common_1.Post)('start'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [stream_dto_1.StartStreamDto]),
    __metadata("design:returntype", Promise)
], StreamsController.prototype, "startStream", null);
__decorate([
    (0, common_1.Post)('stop-active'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [stream_dto_1.StopActiveStreamDto]),
    __metadata("design:returntype", Promise)
], StreamsController.prototype, "stopActiveStream", null);
__decorate([
    (0, common_1.Post)('stop/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, stream_dto_1.StopStreamDto]),
    __metadata("design:returntype", Promise)
], StreamsController.prototype, "stopStream", null);
__decorate([
    (0, common_1.Post)('switch'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [stream_dto_1.SwitchVideoDto]),
    __metadata("design:returntype", Promise)
], StreamsController.prototype, "switchVideo", null);
__decorate([
    (0, common_1.Get)('active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StreamsController.prototype, "getActiveStream", null);
__decorate([
    (0, common_1.Get)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StreamsController.prototype, "getStreamStatus", null);
__decorate([
    (0, common_1.Get)(':id/logs'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StreamsController.prototype, "getStreamLogs", null);
exports.StreamsController = StreamsController = __decorate([
    (0, common_1.Controller)('streams'),
    __metadata("design:paramtypes", [streams_service_1.StreamsService])
], StreamsController);
//# sourceMappingURL=streams.controller.js.map