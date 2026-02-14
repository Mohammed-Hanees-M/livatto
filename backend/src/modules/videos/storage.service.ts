import { Injectable, Logger } from '@nestjs/common';
import { unlink } from 'fs/promises';

export interface StorageProvider {
    upload(file: Express.Multer.File): Promise<string>;
    delete(filepath: string): Promise<void>;
    getUrl(filepath: string): string;
}

@Injectable()
export class StorageService implements StorageProvider {
    private readonly logger = new Logger(StorageService.name);

    async upload(file: Express.Multer.File): Promise<string> {
        // For local storage, Multer already saved the file
        // Return the relative path
        return file.path;
    }

    async delete(filepath: string): Promise<void> {
        try {
            await unlink(filepath);
        } catch (error) {
            this.logger.warn(`Failed to delete file: ${filepath}`, error);
        }
    }

    getUrl(filepath: string): string {
        // Return URL path for serving static files
        const baseUrl = process.env.BACKEND_URL || 'http://localhost:3001';
        return `${baseUrl}/${filepath.replace(/\\/g, '/')}`;
    }
}
