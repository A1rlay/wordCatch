-- Move checkpointSeconds from Video to Question

-- AddColumn
ALTER TABLE "Question" ADD COLUMN "checkpointSeconds" INTEGER NOT NULL DEFAULT 0;

-- DropColumn
ALTER TABLE "Video" DROP COLUMN "checkpointSeconds";
