import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class StartStreamDto {
    @IsOptional()
    @IsString()
    videoId?: string; // 🎬 Track which video is being streamed (for analytics)

    @IsString()
    @IsNotEmpty()
    videoPath: string; // e.g. uploads/videos/video.mp4

    @IsString()
    @IsNotEmpty()
    rtmpUrl: string; // rtmp://a.rtmp.youtube.com/live2

    @IsString()
    @IsNotEmpty()
    streamKey: string; // YouTube Stream Key
}

export class StopStreamDto {
    @IsOptional()
    @IsString()
    reason?: string;
}

// 🔥 NEW: Switch Video DTO (for Live TV channel switching)
export class SwitchVideoDto {
    @IsString()
    @IsNotEmpty()
    videoId: string; // New video ID to switch to

    @IsString()
    @IsNotEmpty()
    videoPath: string; // Path to new video file

    @IsOptional()
    @IsString()
    streamKey?: string; // Optional: reuse current stream key if not provided
}

// 🔥 NEW: Stop Active Stream DTO (no ID required)
export class StopActiveStreamDto {
    @IsOptional()
    @IsString()
    reason?: string;
}
