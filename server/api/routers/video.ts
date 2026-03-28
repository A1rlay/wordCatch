import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  getTopicBySlug,
  getVideoLessonBySlug,
  submitVideoQuizAnswers,
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

  submitQuiz: publicProcedure
    .input(
      z.object({
        answers: z
          .array(
            z.object({
              optionId: z.string().min(1),
              questionId: z.string().min(1),
            }),
          )
          .min(1),
        topicSlug: z.string().min(1),
        videoSlug: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      const submission = await submitVideoQuizAnswers(
        input.topicSlug,
        input.videoSlug,
        input.answers,
      );

      if (!submission) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Video lesson not found.",
        });
      }

      return submission;
    }),
});
