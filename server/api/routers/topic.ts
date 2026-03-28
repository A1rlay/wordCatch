import { z } from "zod";

import { getTopicBySlug, getTopicCatalog } from "@/server/data/learning";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const topicRouter = createTRPCRouter({
  bySlug: publicProcedure
    .input(
      z.object({
        slug: z.string().min(1),
      }),
    )
    .query(({ input }) => getTopicBySlug(input.slug)),

  list: publicProcedure.query(() => getTopicCatalog()),
});
