import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  getTopicBySlug,
  getVideoLessonBySlug,
  submitSingleAnswer,
} from "@/server/data/learning";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const videoRouter = createTRPCRouter({
  bySlug: publicProcedure
    .input(
      z.object({
        topicSlug: z.string().min(1),
        videoSlug: z.string().min(1),
      }),
    )
    .query(({ input }) => getVideoLessonBySlug(input.topicSlug, input.videoSlug)),

  listByTopic: publicProcedure
    .input(
      z.object({
        topicSlug: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      const topic = await getTopicBySlug(input.topicSlug);
      return topic?.videos ?? [];
    }),

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
