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
exports.SchedulesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
let SchedulesService = class SchedulesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createScheduleDto) {
        const schedule = await this.prisma.schedule.create({
            data: {
                ...createScheduleDto,
                startTime: new Date(createScheduleDto.startTime),
                endTime: createScheduleDto.endTime ? new Date(createScheduleDto.endTime) : null,
            },
            include: {
                video: true,
            },
        });
        return schedule;
    }
    async findAll() {
        return this.prisma.schedule.findMany({
            include: {
                video: true,
                streams: true,
            },
            orderBy: {
                startTime: 'asc',
            },
        });
    }
    async findUpcoming() {
        return this.prisma.schedule.findMany({
            where: {
                status: 'PENDING',
                startTime: {
                    gte: new Date(),
                },
            },
            include: {
                video: true,
            },
            orderBy: {
                startTime: 'asc',
            },
        });
    }
    async findActive() {
        return this.prisma.schedule.findMany({
            where: {
                status: 'ACTIVE',
            },
            include: {
                video: true,
                streams: true,
            },
        });
    }
    async findOne(id) {
        const schedule = await this.prisma.schedule.findUnique({
            where: { id },
            include: {
                video: true,
                streams: true,
            },
        });
        if (!schedule) {
            throw new common_1.NotFoundException('Schedule not found');
        }
        return schedule;
    }
    async update(id, updateScheduleDto) {
        const data = { ...updateScheduleDto };
        if (updateScheduleDto.startTime) {
            data.startTime = new Date(updateScheduleDto.startTime);
        }
        if (updateScheduleDto.endTime) {
            data.endTime = new Date(updateScheduleDto.endTime);
        }
        return this.prisma.schedule.update({
            where: { id },
            data,
            include: {
                video: true,
            },
        });
    }
    async remove(id) {
        await this.prisma.schedule.delete({
            where: { id },
        });
        return { message: 'Schedule deleted successfully' };
    }
};
exports.SchedulesService = SchedulesService;
exports.SchedulesService = SchedulesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SchedulesService);
//# sourceMappingURL=schedules.service.js.map