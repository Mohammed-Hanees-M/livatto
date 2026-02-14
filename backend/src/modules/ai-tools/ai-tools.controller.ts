import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AiToolsService } from './ai-tools.service';
import { GenerateContentDto } from './dto/ai-tools.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ai-tools')
@UseGuards(JwtAuthGuard)
export class AiToolsController {
    constructor(private readonly aiToolsService: AiToolsService) { }

    @Post('generate/title')
    generateTitle(@Body() generateContentDto: GenerateContentDto) {
        return this.aiToolsService.generateTitle(generateContentDto);
    }

    @Post('generate/description')
    generateDescription(@Body() generateContentDto: GenerateContentDto) {
        return this.aiToolsService.generateDescription(generateContentDto);
    }

    @Post('generate/keywords')
    generateKeywords(@Body() generateContentDto: GenerateContentDto) {
        return this.aiToolsService.generateKeywords(generateContentDto);
    }
}
