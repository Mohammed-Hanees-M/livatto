-- AlterTable
ALTER TABLE "streams" ADD COLUMN     "videoId" TEXT;

-- AddForeignKey
ALTER TABLE "streams" ADD CONSTRAINT "streams_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "videos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
