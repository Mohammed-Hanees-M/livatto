#!/bin/bash

# Navigate to project root
cd "$(dirname "$0")"

echo "🚀 Starting Public Deployment Calibration..."

# 1. Update Backend .env for Linux and Public Access
echo "📝 Calibrating Backend Environment..."
cat <<EOT > backend/.env
DATABASE_URL="postgresql://postgres:815695@localhost:5432/livatto?schema=public"
JWT_SECRET="livatto-super-secure-secret-key"
JWT_EXPIRATION="24h"
ADMIN_USERNAME="admin@gmail.com"
ADMIN_PASSWORD="Haneeska@123"
PORT=3001
NODE_ENV=production
FRONTEND_URL="http://20.43.157.104:3000"
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=5368709120
CORS_ORIGIN="http://20.43.157.104:3000"

# Linux FFMPEG Paths
FFMPEG_PATH=/usr/bin/ffmpeg
FFPROBE_PATH=/usr/bin/ffprobe

YOUTUBE_RTMP_URL=rtmp://a.rtmp.youtube.com/live2
EOT

# 2. Update Frontend .env.local
echo "📝 Calibrating Frontend Environment..."
cat <<EOT > frontend/.env.local
NEXT_PUBLIC_API_URL=http://20.43.157.104:3001
EOT

# 3. Rebuild Frontend (Critical for baking in the new API URL)
echo "🏗️ Rebuilding Frontend Matrix..."
cd frontend
npm install
npm run build
cd ..

# 4. Rebuild Backend
echo "🏗️ Rebuilding Backend Core..."
cd backend
npm install
npm run build
cd ..

# 5. Restart Services
echo "🔄 Reloading Transmission Nodes..."
pm2 restart all

echo "✅ SUCCESS: Livatto is now live at http://20.43.157.104:3000"
