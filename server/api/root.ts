import { healthRouter } from "@/server/api/routers/health";
import { topicRouter } from "@/server/api/routers/topic";
import { videoRouter } from "@/server/api/routers/video";
import { createTRPCRouter } from "@/server/api/trpc";

export const appRouter = createTRPCRouter({
  health: healthRouter,
  topic: topicRouter,
  video: videoRouter,
});

export type AppRouter = typeof appRouter;
