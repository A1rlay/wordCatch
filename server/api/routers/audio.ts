import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const audioRouter = createTRPCRouter({
  bySlug: publicProcedure
    .input(
      z.object({
        audioSlug: z.string().min(1),
        topicSlug: z.string().min(1),
      }),
    )
    .query(({ ctx, input }) =>
      ctx.prisma.audio.findFirst({
        include: {
          questions: {
            include: {
              options: true,
            },
            orderBy: {
              order: "asc",
            },
          },
          topic: true,
        },
        where: {
          slug: input.audioSlug,
          topic: {
            slug: input.topicSlug,
          },
        },
      }),
    ),
  listByTopic: publicProcedure
    .input(
      z.object({
        topicSlug: z.string().min(1),
      }),
    )
    .query(({ ctx, input }) =>
      ctx.prisma.audio.findMany({
        orderBy: {
          order: "asc",
        },
        where: {
          topic: {
            slug: input.topicSlug,
          },
        },
      }),
    ),
});
