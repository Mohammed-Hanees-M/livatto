import { SchedulesService } from './schedules.service';
import { CreateScheduleDto, UpdateScheduleDto } from './dto/schedule.dto';
export declare class SchedulesController {
    private readonly schedulesService;
    constructor(schedulesService: SchedulesService);
    create(createScheduleDto: CreateScheduleDto): Promise<{
        video: {
            id: string;
            title: string;
            filename: string;
            filepath: string;
            duration: number | null;
            filesize: bigint;
            mimetype: string;
            uploadedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        videoId: string;
        startTime: Date;
        endTime: Date | null;
        timezone: string;
        status: import("@prisma/client").$Enums.ScheduleStatus;
    }>;
    findAll(): Promise<({
        video: {
            id: string;
            title: string;
            filename: string;
            filepath: string;
            duration: number | null;
            filesize: bigint;
            mimetype: string;
            uploadedAt: Date;
        };
        streams: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            videoId: string | null;
            status: import("@prisma/client").$Enums.StreamStatus;
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
        createdAt: Date;
        updatedAt: Date;
        videoId: string;
        startTime: Date;
        endTime: Date | null;
        timezone: string;
        status: import("@prisma/client").$Enums.ScheduleStatus;
    })[]>;
    findUpcoming(): Promise<({
        video: {
            id: string;
            title: string;
            filename: string;
            filepath: string;
            duration: number | null;
            filesize: bigint;
            mimetype: string;
            uploadedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        videoId: string;
        startTime: Date;
        endTime: Date | null;
        timezone: string;
        status: import("@prisma/client").$Enums.ScheduleStatus;
    })[]>;
    findActive(): Promise<({
        video: {
            id: string;
            title: string;
            filename: string;
            filepath: string;
            duration: number | null;
            filesize: bigint;
            mimetype: string;
            uploadedAt: Date;
        };
        streams: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            videoId: string | null;
            status: import("@prisma/client").$Enums.StreamStatus;
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
        createdAt: Date;
        updatedAt: Date;
        videoId: string;
        startTime: Date;
        endTime: Date | null;
        timezone: string;
        status: import("@prisma/client").$Enums.ScheduleStatus;
    })[]>;
    findOne(id: string): Promise<{
        video: {
            id: string;
            title: string;
            filename: string;
            filepath: string;
            duration: number | null;
            filesize: bigint;
            mimetype: string;
            uploadedAt: Date;
        };
        streams: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            videoId: string | null;
            status: import("@prisma/client").$Enums.StreamStatus;
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
        createdAt: Date;
        updatedAt: Date;
        videoId: string;
        startTime: Date;
        endTime: Date | null;
        timezone: string;
        status: import("@prisma/client").$Enums.ScheduleStatus;
    }>;
    update(id: string, updateScheduleDto: UpdateScheduleDto): Promise<{
        video: {
            id: string;
            title: string;
            filename: string;
            filepath: string;
            duration: number | null;
            filesize: bigint;
            mimetype: string;
            uploadedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        videoId: string;
        startTime: Date;
        endTime: Date | null;
        timezone: string;
        status: import("@prisma/client").$Enums.ScheduleStatus;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
