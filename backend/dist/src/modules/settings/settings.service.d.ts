import { PrismaService } from '../../prisma.service';
import { UpdateStreamConfigDto, UpdateChatConfigDto } from './dto/settings.dto';
export declare class SettingsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getStreamConfig(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        logoPosition: string | null;
        scrollingText: string | null;
        overlaySettings: import("@prisma/client/runtime/library").JsonValue | null;
        logoPath: string | null;
        introVideoPath: string | null;
        outroVideoPath: string | null;
    }>;
    updateStreamConfig(updateDto: UpdateStreamConfigDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        logoPosition: string | null;
        scrollingText: string | null;
        overlaySettings: import("@prisma/client/runtime/library").JsonValue | null;
        logoPath: string | null;
        introVideoPath: string | null;
        outroVideoPath: string | null;
    }>;
    uploadLogo(file: Express.Multer.File): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        logoPosition: string | null;
        scrollingText: string | null;
        overlaySettings: import("@prisma/client/runtime/library").JsonValue | null;
        logoPath: string | null;
        introVideoPath: string | null;
        outroVideoPath: string | null;
    }>;
    uploadIntroVideo(file: Express.Multer.File): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        logoPosition: string | null;
        scrollingText: string | null;
        overlaySettings: import("@prisma/client/runtime/library").JsonValue | null;
        logoPath: string | null;
        introVideoPath: string | null;
        outroVideoPath: string | null;
    }>;
    uploadOutroVideo(file: Express.Multer.File): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        logoPosition: string | null;
        scrollingText: string | null;
        overlaySettings: import("@prisma/client/runtime/library").JsonValue | null;
        logoPath: string | null;
        introVideoPath: string | null;
        outroVideoPath: string | null;
    }>;
    getChatConfig(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        welcomeMessage: string | null;
        autoReplyRules: import("@prisma/client/runtime/library").JsonValue;
        isEnabled: boolean;
    }>;
    updateChatConfig(updateDto: UpdateChatConfigDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        welcomeMessage: string | null;
        autoReplyRules: import("@prisma/client/runtime/library").JsonValue;
        isEnabled: boolean;
    }>;
    addAutoReplyRule(keyword: string, response: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        welcomeMessage: string | null;
        autoReplyRules: import("@prisma/client/runtime/library").JsonValue;
        isEnabled: boolean;
    }>;
    removeAutoReplyRule(keyword: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        welcomeMessage: string | null;
        autoReplyRules: import("@prisma/client/runtime/library").JsonValue;
        isEnabled: boolean;
    }>;
}
