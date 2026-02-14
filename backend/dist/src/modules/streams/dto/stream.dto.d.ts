export declare class StartStreamDto {
    videoId?: string;
    videoPath: string;
    rtmpUrl: string;
    streamKey: string;
}
export declare class StopStreamDto {
    reason?: string;
}
export declare class SwitchVideoDto {
    videoId: string;
    videoPath: string;
    streamKey?: string;
}
export declare class StopActiveStreamDto {
    reason?: string;
}
