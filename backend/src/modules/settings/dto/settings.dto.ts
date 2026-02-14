import { IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class UpdateStreamConfigDto {
    @IsString()
    @IsOptional()
    logoPosition?: string;

    @IsString()
    @IsOptional()
    scrollingText?: string;

    @IsOptional()
    overlaySettings?: any;
}

export class CreateChatConfigDto {
    @IsString()
    @IsOptional()
    welcomeMessage?: string;

    @IsArray()
    @IsOptional()
    autoReplyRules?: Array<{ keyword: string; response: string }>;

    @IsBoolean()
    @IsOptional()
    isEnabled?: boolean;
}

export class UpdateChatConfigDto {
    @IsString()
    @IsOptional()
    welcomeMessage?: string;

    @IsArray()
    @IsOptional()
    autoReplyRules?: Array<{ keyword: string; response: string }>;

    @IsBoolean()
    @IsOptional()
    isEnabled?: boolean;
}
