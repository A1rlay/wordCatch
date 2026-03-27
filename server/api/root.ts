import { audioRouter } from "@/server/api/routers/audio";
import { healthRouter } from "@/server/api/routers/health";
import { topicRouter } from "@/server/api/routers/topic";
import { createTRPCRouter } from "@/server/api/trpc";

export const appRouter = createTRPCRouter({
  audio: audioRouter,
  health: healthRouter,
  topic: topicRouter,
});

export type AppRouter = typeof appRouter;
