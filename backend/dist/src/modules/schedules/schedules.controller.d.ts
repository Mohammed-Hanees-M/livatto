import { SchedulesService } from './schedules.service';
import { CreateScheduleDto, UpdateScheduleDto } from './dto/schedule.dto';
export declare class SchedulesController {
    private readonly schedulesService;
    constructor(schedulesService: SchedulesService);
    create(createScheduleDto: CreateScheduleDto): Promise<{
        video: {
            title: string;
            id: string;
            filename: string;
            filepath: string;
            duration: number | null;
            filesize: bigint;
            mimetype: string;
            uploadedAt: Date;
        };
    } & {
        id: string;
        videoId: string;
        startTime: Date;
        endTime: Date | null;
        timezone: string;
        status: import("@prisma/client").$Enums.ScheduleStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<({
        video: {
            title: string;
            id: string;
            filename: string;
            filepath: string;
            duration: number | null;
            filesize: bigint;
            mimetype: string;
            uploadedAt: Date;
        };
        streams: {
            id: string;
            videoId: string | null;
            status: import("@prisma/client").$Enums.StreamStatus;
            createdAt: Date;
            updatedAt: Date;
            rtmpUrl: string | null;
            streamKey: string | null;
            scheduleId: string | null;
            channelId: string | null;
            startedAt: Date | null;
            stoppedAt: Date | null;
            failureCount: number;
            lastError: string | null;
        }[];
    } & {
        id: string;
        videoId: string;
        startTime: Date;
        endTime: Date | null;
        timezone: string;
        status: import("@prisma/client").$Enums.ScheduleStatus;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findUpcoming(): Promise<({
        video: {
            title: string;
            id: string;
            filename: string;
            filepath: string;
            duration: number | null;
            filesize: bigint;
            mimetype: string;
            uploadedAt: Date;
        };
    } & {
        id: string;
        videoId: string;
        startTime: Date;
        endTime: Date | null;
        timezone: string;
        status: import("@prisma/client").$Enums.ScheduleStatus;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findActive(): Promise<({
        video: {
            title: string;
            id: string;
            filename: string;
            filepath: string;
            duration: number | null;
            filesize: bigint;
            mimetype: string;
            uploadedAt: Date;
        };
        streams: {
            id: string;
            videoId: string | null;
            status: import("@prisma/client").$Enums.StreamStatus;
            createdAt: Date;
            updatedAt: Date;
            rtmpUrl: string | null;
            streamKey: string | null;
            scheduleId: string | null;
            channelId: string | null;
            startedAt: Date | null;
            stoppedAt: Date | null;
            failureCount: number;
            lastError: string | null;
        }[];
    } & {
        id: string;
        videoId: string;
        startTime: Date;
        endTime: Date | null;
        timezone: string;
        status: import("@prisma/client").$Enums.ScheduleStatus;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): Promise<{
        video: {
            title: string;
            id: string;
            filename: string;
            filepath: string;
            duration: number | null;
            filesize: bigint;
            mimetype: string;
            uploadedAt: Date;
        };
        streams: {
            id: string;
            videoId: string | null;
            status: import("@prisma/client").$Enums.StreamStatus;
            createdAt: Date;
            updatedAt: Date;
            rtmpUrl: string | null;
            streamKey: string | null;
            scheduleId: string | null;
            channelId: string | null;
            startedAt: Date | null;
            stoppedAt: Date | null;
            failureCount: number;
            lastError: string | null;
        }[];
    } & {
        id: string;
        videoId: string;
        startTime: Date;
        endTime: Date | null;
        timezone: string;
        status: import("@prisma/client").$Enums.ScheduleStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateScheduleDto: UpdateScheduleDto): Promise<{
        video: {
            title: string;
            id: string;
            filename: string;
            filepath: string;
            duration: number | null;
            filesize: bigint;
            mimetype: string;
            uploadedAt: Date;
        };
    } & {
        id: string;
        videoId: string;
        startTime: Date;
        endTime: Date | null;
        timezone: string;
        status: import("@prisma/client").$Enums.ScheduleStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
