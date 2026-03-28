import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { getVideoLessonById, submitSingleAnswer } from "@/server/data/learning";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const videoRouter = createTRPCRouter({
  byId: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(({ input }) => getVideoLessonById(input.id)),

  submitAnswer: publicProcedure
    .input(
      z.object({
        optionId: z.string().min(1),
        questionId: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      const result = await submitSingleAnswer(input.questionId, input.optionId);

      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Question not found.",
        });
      }

      return result;
    }),
});
