import { Prisma } from "@prisma/client";

import { prisma } from "@/server/db";

const topicCatalogArgs = Prisma.validator<Prisma.TopicDefaultArgs>()({
  include: {
    _count: {
      select: {
        videos: true,
      },
    },
  },
});

const topicDetailArgs = Prisma.validator<Prisma.TopicDefaultArgs>()({
  include: {
    videos: {
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

const videoLessonArgs = Prisma.validator<Prisma.VideoDefaultArgs>()({
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
type VideoLessonRecord = Prisma.VideoGetPayload<typeof videoLessonArgs>;

export type TopicCard = {
  description: string | null;
  id: string;
  level: string | null;
  tags: string[];
  title: string;
  videoCount: number;
};

export type TopicVideoSummary = {
  description: string | null;
  id: string;
  questionCount: number;
  title: string;
};

export type TopicDetail = {
  description: string | null;
  id: string;
  level: string | null;
  tags: string[];
  title: string;
  videos: TopicVideoSummary[];
};

export type QuizQuestion = {
  checkpointSeconds: number;
  id: string;
  options: {
    id: string;
    text: string;
  }[];
  order: number;
  prompt: string;
};

export type VideoLesson = {
  description: string | null;
  questions: QuizQuestion[];
  title: string;
  topic: {
    id: string;
    title: string;
  };
  videoUrl: string;
};

export type SingleAnswerResult = {
  correct: boolean;
  correctOptionId: string | null;
};

function mapTopicCard(topic: TopicCatalogRecord): TopicCard {
  return {
    description: topic.description,
    id: topic.id,
    level: topic.level,
    tags: topic.tags,
    title: topic.title,
    videoCount: topic._count.videos,
  };
}

function mapTopicDetail(topic: TopicDetailRecord): TopicDetail {
  return {
    description: topic.description,
    id: topic.id,
    level: topic.level,
    tags: topic.tags,
    title: topic.title,
    videos: topic.videos.map((video) => ({
      description: video.description,
      id: video.id,
      questionCount: video._count.questions,
      title: video.title,
    })),
  };
}

function mapVideoLesson(video: VideoLessonRecord): VideoLesson {
  return {
    description: video.description,
    questions: video.questions.map((question) => ({
      checkpointSeconds: question.checkpointSeconds,
      id: question.id,
      options: question.options.map((option) => ({
        id: option.id,
        text: option.text,
      })),
      order: question.order,
      prompt: question.prompt,
    })),
    title: video.title,
    topic: {
      id: video.topic.id,
      title: video.topic.title,
    },
    videoUrl: video.videoUrl,
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

export async function getTopicById(id: string) {
  const topic = await prisma.topic.findUnique({
    ...topicDetailArgs,
    where: { id },
  });

  return topic ? mapTopicDetail(topic) : null;
}

export async function getVideoLessonById(videoId: string) {
  const video = await prisma.video.findUnique({
    ...videoLessonArgs,
    where: { id: videoId },
  });

  return video ? mapVideoLesson(video) : null;
}

export async function submitSingleAnswer(
  questionId: string,
  optionId: string,
): Promise<SingleAnswerResult | null> {
  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: { options: true },
  });

  if (!question) return null;

  const correctOption = question.options.find((o) => o.isCorrect) ?? null;

  return {
    correct: optionId === correctOption?.id,
    correctOptionId: correctOption?.id ?? null,
  };
}
