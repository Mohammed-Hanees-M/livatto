export declare class UpdateStreamConfigDto {
    logoPosition?: string;
    scrollingText?: string;
    overlaySettings?: any;
}
export declare class CreateChatConfigDto {
    welcomeMessage?: string;
    autoReplyRules?: Array<{
        keyword: string;
        response: string;
    }>;
    isEnabled?: boolean;
}
export declare class UpdateChatConfigDto {
    welcomeMessage?: string;
    autoReplyRules?: Array<{
        keyword: string;
        response: string;
    }>;
    isEnabled?: boolean;
}
