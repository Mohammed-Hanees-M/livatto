import {
    Controller,
    Get,
    Patch,
    Post,
    Delete,
    Body,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SettingsService } from './settings.service';
import { UpdateStreamConfigDto, UpdateChatConfigDto } from './dto/settings.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) { }

    // Stream Configuration Endpoints
    @Get('stream-config')
    getStreamConfig() {
        return this.settingsService.getStreamConfig();
    }

    @Patch('stream-config')
    updateStreamConfig(@Body() updateDto: UpdateStreamConfigDto) {
        return this.settingsService.updateStreamConfig(updateDto);
    }

    @Post('stream-config/logo')
    @UseInterceptors(FileInterceptor('file'))
    uploadLogo(@UploadedFile() file: Express.Multer.File) {
        return this.settingsService.uploadLogo(file);
    }

    @Post('stream-config/intro')
    @UseInterceptors(FileInterceptor('file'))
    uploadIntro(@UploadedFile() file: Express.Multer.File) {
        return this.settingsService.uploadIntroVideo(file);
    }

    @Post('stream-config/outro')
    @UseInterceptors(FileInterceptor('file'))
    uploadOutro(@UploadedFile() file: Express.Multer.File) {
        return this.settingsService.uploadOutroVideo(file);
    }

    // Chat Configuration Endpoints
    @Get('chat-config')
    getChatConfig() {
        return this.settingsService.getChatConfig();
    }

    @Patch('chat-config')
    updateChatConfig(@Body() updateDto: UpdateChatConfigDto) {
        return this.settingsService.updateChatConfig(updateDto);
    }

    @Post('chat-config/auto-reply')
    addAutoReplyRule(@Body() body: { keyword: string; response: string }) {
        return this.settingsService.addAutoReplyRule(body.keyword, body.response);
    }

    @Delete('chat-config/auto-reply')
    removeAutoReplyRule(@Query('keyword') keyword: string) {
        return this.settingsService.removeAutoReplyRule(keyword);
    }
}
