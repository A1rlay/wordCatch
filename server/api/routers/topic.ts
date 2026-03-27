import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const topicRouter = createTRPCRouter({
  bySlug: publicProcedure
    .input(
      z.object({
        slug: z.string().min(1),
      }),
    )
    .query(({ ctx, input }) =>
      ctx.prisma.topic.findUnique({
        include: {
          audios: {
            include: {
              questions: {
                include: {
                  options: true,
                },
                orderBy: {
                  order: "asc",
                },
              },
            },
            orderBy: {
              order: "asc",
            },
          },
        },
        where: {
          slug: input.slug,
        },
      }),
    ),
  list: publicProcedure.query(({ ctx }) =>
    ctx.prisma.topic.findMany({
      include: {
        _count: {
          select: {
            audios: true,
          },
        },
      },
      orderBy: {
        title: "asc",
      },
    }),
  ),
});
