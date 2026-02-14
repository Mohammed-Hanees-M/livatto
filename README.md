# Livatto - Production-Grade Live Streaming Platform

A production-ready web application for automated 24×7 live streaming of pre-recorded videos to RTMP platforms (YouTube/Facebook).

## Features

- 🔐 **Secure Authentication** - JWT-based authentication with bcrypt password hashing
- 📹 **Video Library** - Upload and manage video files with file validation
- 📅 **Stream Scheduler** - Manual scheduling with timezone support
- 🎥 **Stream Control** - Start/stop streams with status tracking
- 🤖 **AI Content Assistant** - SEO tools for titles, descriptions, and keywords (mock service)
- 📊 **Analytics** - Dashboard with stream metrics and usage statistics
- ⚙️ **Settings** - Logo watermarks, intro/outro videos, chat automation

## Tech Stack

### Backend
- **NestJS** - Production-grade Node.js framework
- **Prisma** - Type-safe ORM for PostgreSQL
- **JWT** - Authentication
- **Multer** - File uploads
- **PostgreSQL** - Database

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Hook Form** - Form management

## Project Structure

```
livatto/
├── backend/              # NestJS API
│   ├── prisma/          # Database schema & migrations
│   ├── src/
│   │   ├── modules/     # Feature modules
│   │   │   ├── auth/
│   │   │   ├── videos/
│   │   │   ├── schedules/
│   │   │   ├── streams/
│   │   │   ├── ai-tools/
│   │   │   ├── analytics/
│   │   │   └── settings/
│   │   ├── filters/     # Exception filters
│   │   └── main.ts
│   └── uploads/         # File storage
│
└── frontend/            # Next.js application
    ├── app/            # Pages & layouts
    ├── components/     # React components
    └── lib/            # Utilities
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- FFmpeg (for future stream execution)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Run Prisma migrations:
```bash
npx prisma migrate dev --name init
```

5. Generate Prisma Client:
```bash
npx prisma generate
```

6. Seed initial user (optional):
```bash
# Create a user via API or Prisma Studio
npx prisma studio
```

7. Start development server:
```bash
npm run start:dev
```

Backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
# Create .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
```

4. Start development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## API Endpoints

### Auth
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `GET /auth/me` - Get current user (protected)

### Videos
- `POST /videos` - Upload video (protected)
- `GET /videos` - Get all videos (protected)
- `GET /videos/:id` - Get video by ID (protected)
- `PATCH /videos/:id` - Update video (protected)
- `DELETE /videos/:id` - Delete video (protected)

### Schedules
- `POST /schedules` - Create schedule (protected)
- `GET /schedules` - Get all schedules (protected)
- `GET /schedules/upcoming` - Get upcoming schedules (protected)
- `GET /schedules/active` - Get active schedules (protected)
- `GET /schedules/:id` - Get schedule by ID (protected)
- `PATCH /schedules/:id` - Update schedule (protected)
- `DELETE /schedules/:id` - Delete schedule (protected)

### Streams
- `POST /streams/start` - Start stream (protected)
- `POST /streams/:id/stop` - Stop stream (protected)
- `GET /streams/active` - Get active stream (protected)
- `GET /streams/:id/status` - Get stream status (protected)
- `GET /streams/:id/logs` - Get stream logs (protected)

### AI Tools
- `POST /ai-tools/generate/title` - Generate SEO title (protected)
- `POST /ai-tools/generate/description` - Generate description (protected)
- `POST /ai-tools/generate/keywords` - Generate keywords (protected)

### Analytics
- `GET /analytics/dashboard` - Dashboard stats (protected)
- `GET /analytics/history` - Stream history (protected)
- `GET /analytics/trends` - Streaming trends (protected)

### Settings
- `GET /settings/stream-config` - Get stream config (protected)
- `PATCH /settings/stream-config` - Update stream config (protected)
- `POST /settings/stream-config/logo` - Upload logo (protected)
- `POST /settings/stream-config/intro` - Upload intro video (protected)
- `POST /settings/stream-config/outro` - Upload outro video (protected)
- `GET /settings/chat-config` - Get chat config (protected)
- `PATCH /settings/chat-config` - Update chat config (protected)
- `POST /settings/chat-config/auto-reply` - Add auto-reply rule (protected)
- `DELETE /settings/chat-config/auto-reply` - Remove auto-reply rule (protected)

## Database Schema

See `backend/prisma/schema.prisma` for complete schema including:
- User
- Video
- Schedule
- Stream
- StreamLog
- StreamConfig
- ChatConfig

## FFmpeg Integration (Placeholder)

The `FFmpegWorkerService` is designed as a placeholder for future FFmpeg integration. When ready:

1. Install FFmpeg on your server
2. Update `ffmpeg-worker.service.ts` with actual FFmpeg commands
3. Implement process spawning and monitoring
4. Add overlay and watermark composition

Example FFmpeg command structure:
```bash
ffmpeg -re -i input.mp4 \
  -i logo.png \
  -filter_complex "overlay=10:10" \
  -c:v libx264 -c:a aac \
  -f flv rtmp://a.rtmp.youtube.com/live2/[stream-key]
```

## Production Deployment

### Database
1. Set up PostgreSQL instance
2. Run migrations: `npx prisma migrate deploy`
3. Update `DATABASE_URL` in environment

### Backend
1. Build: `npm run build`
2. Start: `npm run start:prod`
3. Set `NODE_ENV=production`
4. Use PM2 or similar for process management

### Frontend
1. Build: `npm run build`
2. Start: `npm start`
3. Or deploy to Vercel/Netlify

### Environment Variables
- Update `JWT_SECRET` with strong secret
- Configure proper `CORS_ORIGIN`
- Set up cloud storage (S3) for production file uploads

## Future Enhancements

- [ ] Real FFmpeg stream execution
- [ ] Multi-user system with roles
- [ ] Real AI API integrations (OpenAI, Anthropic)
- [ ] Cloud storage (S3, Google Cloud Storage)
- [ ] Advanced analytics (viewer count, engagement)
- [ ] Multi-platform streaming (simultaneous RTMP)
- [ ] Playlist support
- [ ] Live preview of active streams
- [ ] Stream recording/archiving
- [ ] Mobile app (React Native)

## License

Proprietary - All rights reserved

## Support

For issues and questions, please create an issue in the repository.

---

Built with ❤️ for professional live streaming
