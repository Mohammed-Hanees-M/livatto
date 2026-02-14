"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const prisma_service_1 = require("./prisma.service");
const express = __importStar(require("express"));
const path_1 = require("path");
const child_process_1 = require("child_process");
const fs = __importStar(require("fs"));
BigInt.prototype['toJSON'] = function () {
    return this.toString();
};
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log(`✅ Created uploads directory: ${uploadDir}`);
    }
    app.use('/uploads', express.static((0, path_1.join)(process.cwd(), uploadDir)));
    const prismaService = app.get(prisma_service_1.PrismaService);
    try {
        await prismaService.$connect();
        console.log('✅ Database connected successfully');
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
        console.error('Please ensure PostgreSQL is running and DATABASE_URL is correct');
        process.exit(1);
    }
    await prismaService.enableShutdownHooks(app);
    const ffmpegPath = process.env.FFMPEG_PATH || 'ffmpeg';
    try {
        (0, child_process_1.execSync)(`"${ffmpegPath}" -version`, { stdio: 'ignore' });
        console.log('✅ FFmpeg verified successfully');
    }
    catch {
        console.warn('⚠️  FFmpeg not found at:', ffmpegPath);
        console.warn('⚠️  Streaming features will not work until FFmpeg is installed');
    }
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 Livatto API is running on: http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map