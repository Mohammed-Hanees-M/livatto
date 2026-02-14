import * as dotenv from 'dotenv';
dotenv.config(); // 🔥 THIS LINE FIXES YOUR ENV (VERY IMPORTANT)


import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';
import * as express from 'express';
import { join } from 'path';
import { execSync } from 'child_process';
import * as fs from 'fs';

// 🔥 FIX: BigInt serialization for JSON
BigInt.prototype['toJSON'] = function () {
  return this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Serve static files (uploads folder)
  const uploadDir = process.env.UPLOAD_DIR || './uploads';

  // Create uploads directory if it doesn't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`✅ Created uploads directory: ${uploadDir}`);
  }

  app.use('/uploads', express.static(join(process.cwd(), uploadDir)));

  // Prisma connection and shutdown hooks
  const prismaService = app.get(PrismaService);

  // Verify database connection
  try {
    await prismaService.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.error('Please ensure PostgreSQL is running and DATABASE_URL is correct');
    process.exit(1);
  }

  await prismaService.enableShutdownHooks(app);

  // Verify FFmpeg installation (optional warning)
  const ffmpegPath = process.env.FFMPEG_PATH || 'ffmpeg';
  try {
    execSync(`"${ffmpegPath}" -version`, { stdio: 'ignore' });
    console.log('✅ FFmpeg verified successfully');
  } catch {
    console.warn('⚠️  FFmpeg not found at:', ffmpegPath);
    console.warn('⚠️  Streaming features will not work until FFmpeg is installed');
  }

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 Livatto API is running on: http://localhost:${port}`);
}

bootstrap();
