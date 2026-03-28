import { z } from "zod";

import { getTopicById, getTopicCatalog } from "@/server/data/learning";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const topicRouter = createTRPCRouter({
  byId: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(({ input }) => getTopicById(input.id)),

  list: publicProcedure.query(() => getTopicCatalog()),
});
