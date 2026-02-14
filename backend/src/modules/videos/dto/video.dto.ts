import { IsString, IsOptional } from 'class-validator';

export class CreateVideoDto {
    @IsString()
    title: string;
}

export class UpdateVideoDto {
    @IsString()
    @IsOptional()
    title?: string;
}
