-- AlterTable
ALTER TABLE "Video" RENAME CONSTRAINT "Audio_pkey" TO "Video_pkey";

-- RenameForeignKey
ALTER TABLE "Question" RENAME CONSTRAINT "Question_audioId_fkey" TO "Question_videoId_fkey";

-- RenameForeignKey
ALTER TABLE "Video" RENAME CONSTRAINT "Audio_topicId_fkey" TO "Video_topicId_fkey";
