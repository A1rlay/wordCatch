-- Rename Audio table to Video (preserves all data)
ALTER TABLE "Audio" RENAME TO "Video";

-- Rename audioUrl column to videoUrl
ALTER TABLE "Video" RENAME COLUMN "audioUrl" TO "videoUrl";

-- Rename the unique index on Video
ALTER INDEX "Audio_topicId_slug_key" RENAME TO "Video_topicId_slug_key";

-- Rename audioId column in Question to videoId
ALTER TABLE "Question" RENAME COLUMN "audioId" TO "videoId";

-- Rename the unique index on Question
ALTER INDEX "Question_audioId_order_key" RENAME TO "Question_videoId_order_key";
