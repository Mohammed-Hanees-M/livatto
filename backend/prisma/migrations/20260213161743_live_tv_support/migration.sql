-- DropForeignKey
ALTER TABLE "stream_logs" DROP CONSTRAINT "stream_logs_videoId_fkey";

-- DropForeignKey
ALTER TABLE "streams" DROP CONSTRAINT "streams_scheduleId_fkey";

-- AlterTable
ALTER TABLE "stream_logs" ALTER COLUMN "videoId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "streams" ADD COLUMN     "channelId" TEXT,
ALTER COLUMN "scheduleId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "channels" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is24x7" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "channels_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "streams" ADD CONSTRAINT "streams_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "schedules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "streams" ADD CONSTRAINT "streams_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stream_logs" ADD CONSTRAINT "stream_logs_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "videos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
