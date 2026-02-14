export declare enum ScheduleStatus {
    PENDING = "PENDING",
    ACTIVE = "ACTIVE",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
export declare class CreateScheduleDto {
    videoId: string;
    startTime: string;
    endTime?: string;
    timezone?: string;
}
export declare class UpdateScheduleDto {
    startTime?: string;
    endTime?: string;
    status?: ScheduleStatus;
}
