-- Drop unique index on Video(topicId, slug)
DROP INDEX IF EXISTS "Video_topicId_slug_key";

-- Drop unique index on Topic(slug)
DROP INDEX IF EXISTS "Topic_slug_key";

-- Drop slug columns
ALTER TABLE "Topic" DROP COLUMN IF EXISTS "slug";
ALTER TABLE "Video" DROP COLUMN IF EXISTS "slug";
