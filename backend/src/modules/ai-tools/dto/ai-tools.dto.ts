import { IsString } from 'class-validator';

export class GenerateContentDto {
    @IsString()
    context: string;
}
