import { IsString, IsDateString, IsOptional, IsEnum } from 'class-validator';

export enum ScheduleStatus {
    PENDING = 'PENDING',
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export class CreateScheduleDto {
    @IsString()
    videoId: string;

    @IsDateString()
    startTime: string;

    @IsDateString()
    @IsOptional()
    endTime?: string;

    @IsString()
    @IsOptional()
    timezone?: string;
}

export class UpdateScheduleDto {
    @IsDateString()
    @IsOptional()
    startTime?: string;

    @IsDateString()
    @IsOptional()
    endTime?: string;

    @IsEnum(ScheduleStatus)
    @IsOptional()
    status?: ScheduleStatus;
}
