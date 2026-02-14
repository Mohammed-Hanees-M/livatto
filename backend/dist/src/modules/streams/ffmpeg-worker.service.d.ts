import { OnModuleDestroy } from '@nestjs/common';
export interface StreamConfig {
    streamId: string;
    videoPath: string;
    rtmpUrl: string;
    streamKey: string;
}
type FailureCallback = (streamId: string, error: string, retryCount: number) => void;
export declare class FFmpegWorkerService implements OnModuleDestroy {
    private readonly logger;
    private activeProcesses;
    private restartTimers;
    private streamConfigs;
    private failureCounts;
    private failureCallbacks;
    private readonly MAX_RETRIES;
    private readonly BASE_RETRY_DELAY;
    startStream(config: StreamConfig): Promise<void>;
    stopStream(streamId: string): Promise<void>;
    registerFailureCallback(streamId: string, callback: FailureCallback): void;
    getStreamStatus(streamId: string): string;
    getFailureCount(streamId: string): number;
    onModuleDestroy(): void;
}
export {};
