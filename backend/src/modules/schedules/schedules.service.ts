import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateScheduleDto, UpdateScheduleDto } from './dto/schedule.dto';

@Injectable()
export class SchedulesService {
    constructor(private prisma: PrismaService) { }

    async create(createScheduleDto: CreateScheduleDto) {
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

    async findOne(id: string) {
        const schedule = await this.prisma.schedule.findUnique({
            where: { id },
            include: {
                video: true,
                streams: true,
            },
        });

        if (!schedule) {
            throw new NotFoundException('Schedule not found');
        }

        return schedule;
    }

    async update(id: string, updateScheduleDto: UpdateScheduleDto) {
        const data: any = { ...updateScheduleDto };

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

    async remove(id: string) {
        await this.prisma.schedule.delete({
            where: { id },
        });

        return { message: 'Schedule deleted successfully' };
    }
}
