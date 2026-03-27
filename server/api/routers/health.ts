import { publicProcedure, createTRPCRouter } from "@/server/api/trpc";

export const healthRouter = createTRPCRouter({
  ping: publicProcedure.query(() => ({
    ok: true,
    timestamp: new Date().toISOString(),
  })),
});
