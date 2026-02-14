import { GenerateContentDto } from './dto/ai-tools.dto';
export declare class AiToolsService {
    private readonly logger;
    generateTitle(generateContentDto: GenerateContentDto): Promise<string>;
    generateDescription(generateContentDto: GenerateContentDto): Promise<string>;
    generateKeywords(generateContentDto: GenerateContentDto): Promise<string[]>;
    regenerate(type: 'title' | 'description' | 'keywords', generateContentDto: GenerateContentDto): Promise<string | string[]>;
}
