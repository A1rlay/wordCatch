import { Prisma } from "@prisma/client";

import { prisma } from "@/server/db";

const topicCatalogArgs = Prisma.validator<Prisma.TopicDefaultArgs>()({
  include: {
    _count: {
      select: {
        audios: true,
      },
    },
  },
});

const topicDetailArgs = Prisma.validator<Prisma.TopicDefaultArgs>()({
  include: {
    audios: {
      include: {
        _count: {
          select: {
            questions: true,
          },
        },
      },
      orderBy: {
        order: "asc",
      },
    },
  },
});

const audioLessonArgs = Prisma.validator<Prisma.AudioDefaultArgs>()({
  include: {
    questions: {
      include: {
        options: {
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: {
        order: "asc",
      },
    },
    topic: true,
  },
});

type TopicCatalogRecord = Prisma.TopicGetPayload<typeof topicCatalogArgs>;
type TopicDetailRecord = Prisma.TopicGetPayload<typeof topicDetailArgs>;
type AudioLessonRecord = Prisma.AudioGetPayload<typeof audioLessonArgs>;

export type TopicCard = {
  audioCount: number;
  description: string | null;
  level: string | null;
  slug: string;
  tags: string[];
  title: string;
};

export type TopicAudioSummary = {
  checkpointLabel: string;
  description: string | null;
  questionCount: number;
  slug: string;
  title: string;
};

export type TopicDetail = {
  audios: TopicAudioSummary[];
  description: string | null;
  level: string | null;
  slug: string;
  tags: string[];
  title: string;
};

export type QuizQuestion = {
  id: string;
  options: {
    id: string;
    text: string;
  }[];
  order: number;
  prompt: string;
};

export type AudioLesson = {
  audioUrl: string;
  checkpointLabel: string;
  checkpointSeconds: number;
  description: string | null;
  durationSeconds: number | null;
  questions: QuizQuestion[];
  slug: string;
  title: string;
  topic: {
    slug: string;
    title: string;
  };
  transcript: string | null;
};

export type QuizAnswerInput = {
  optionId: string;
  questionId: string;
};

export type QuizSubmission = {
  correctCount: number;
  results: {
    correct: boolean;
    correctOptionId: string | null;
    questionId: string;
    selectedOptionId: string | null;
  }[];
  total: number;
};

function formatCheckpointLabel(seconds: number) {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");

  return `${mins}:${secs}`;
}

function mapTopicCard(topic: TopicCatalogRecord): TopicCard {
  return {
    audioCount: topic._count.audios,
    description: topic.description,
    level: topic.level,
    slug: topic.slug,
    tags: topic.tags,
    title: topic.title,
  };
}

function mapTopicDetail(topic: TopicDetailRecord): TopicDetail {
  return {
    audios: topic.audios.map((audio) => ({
      checkpointLabel: formatCheckpointLabel(audio.checkpointSeconds),
      description: audio.description,
      questionCount: audio._count.questions,
      slug: audio.slug,
      title: audio.title,
    })),
    description: topic.description,
    level: topic.level,
    slug: topic.slug,
    tags: topic.tags,
    title: topic.title,
  };
}

function mapAudioLesson(audio: AudioLessonRecord): AudioLesson {
  return {
    audioUrl: audio.audioUrl,
    checkpointLabel: formatCheckpointLabel(audio.checkpointSeconds),
    checkpointSeconds: audio.checkpointSeconds,
    description: audio.description,
    durationSeconds: audio.durationSeconds,
    questions: audio.questions.map((question) => ({
      id: question.id,
      options: question.options.map((option) => ({
        id: option.id,
        text: option.text,
      })),
      order: question.order,
      prompt: question.prompt,
    })),
    slug: audio.slug,
    title: audio.title,
    topic: {
      slug: audio.topic.slug,
      title: audio.topic.title,
    },
    transcript: audio.transcript,
  };
}

export async function getTopicCatalog() {
  const topics = await prisma.topic.findMany({
    ...topicCatalogArgs,
    orderBy: {
      title: "asc",
    },
  });

  return topics.map(mapTopicCard);
}

export async function getTopicBySlug(slug: string) {
  const topic = await prisma.topic.findUnique({
    ...topicDetailArgs,
    where: {
      slug,
    },
  });

  return topic ? mapTopicDetail(topic) : null;
}

export async function getAudioLessonBySlug(topicSlug: string, audioSlug: string) {
  const audio = await prisma.audio.findFirst({
    ...audioLessonArgs,
    where: {
      slug: audioSlug,
      topic: {
        slug: topicSlug,
      },
    },
  });

  return audio ? mapAudioLesson(audio) : null;
}

export async function submitAudioQuizAnswers(
  topicSlug: string,
  audioSlug: string,
  answers: QuizAnswerInput[],
) {
  const audio = await prisma.audio.findFirst({
    ...audioLessonArgs,
    where: {
      slug: audioSlug,
      topic: {
        slug: topicSlug,
      },
    },
  });

  if (!audio) {
    return null;
  }

  const selectedOptionIdByQuestion = new Map(
    answers.map((answer) => [answer.questionId, answer.optionId]),
  );

  const results = audio.questions.map((question) => {
    const correctOption = question.options.find((option) => option.isCorrect) ?? null;
    const selectedOptionId = selectedOptionIdByQuestion.get(question.id) ?? null;

    return {
      correct: selectedOptionId !== null && selectedOptionId === correctOption?.id,
      correctOptionId: correctOption?.id ?? null,
      questionId: question.id,
      selectedOptionId,
    };
  });

  return {
    correctCount: results.filter((result) => result.correct).length,
    results,
    total: results.length,
  } satisfies QuizSubmission;
}
