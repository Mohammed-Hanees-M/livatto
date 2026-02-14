import { AiToolsService } from './ai-tools.service';
import { GenerateContentDto } from './dto/ai-tools.dto';
export declare class AiToolsController {
    private readonly aiToolsService;
    constructor(aiToolsService: AiToolsService);
    generateTitle(generateContentDto: GenerateContentDto): Promise<string>;
    generateDescription(generateContentDto: GenerateContentDto): Promise<string>;
    generateKeywords(generateContentDto: GenerateContentDto): Promise<string[]>;
}
