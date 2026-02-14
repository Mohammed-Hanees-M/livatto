export interface StorageProvider {
    upload(file: Express.Multer.File): Promise<string>;
    delete(filepath: string): Promise<void>;
    getUrl(filepath: string): string;
}
export declare class StorageService implements StorageProvider {
    private readonly logger;
    upload(file: Express.Multer.File): Promise<string>;
    delete(filepath: string): Promise<void>;
    getUrl(filepath: string): string;
}
