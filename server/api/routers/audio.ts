import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  getAudioLessonBySlug,
  getTopicBySlug,
  submitAudioQuizAnswers,
} from "@/server/data/learning";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const audioRouter = createTRPCRouter({
  bySlug: publicProcedure
    .input(
      z.object({
        audioSlug: z.string().min(1),
        topicSlug: z.string().min(1),
      }),
    )
    .query(({ input }) => getAudioLessonBySlug(input.topicSlug, input.audioSlug)),
  listByTopic: publicProcedure
    .input(
      z.object({
        topicSlug: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      const topic = await getTopicBySlug(input.topicSlug);

      return topic?.audios ?? [];
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
        audioSlug: z.string().min(1),
        topicSlug: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      const submission = await submitAudioQuizAnswers(
        input.topicSlug,
        input.audioSlug,
        input.answers,
      );

      if (!submission) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Audio lesson not found.",
        });
      }

      return submission;
    }),
});
