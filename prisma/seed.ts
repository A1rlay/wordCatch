import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.questionOption.deleteMany();
  await prisma.question.deleteMany();
  await prisma.audio.deleteMany();
  await prisma.topic.deleteMany();

  await prisma.topic.create({
    data: {
      description:
        "Introduce students to past descriptions with was and were through short stories and school-life conversations.",
      level: "A1 - A2",
      slug: "verb-to-be-in-past",
      tags: ["was", "were", "past descriptions"],
      title: "Verb To Be in Past",
      audios: {
        create: [
          {
            audioUrl: "https://example.com/audio/weekend-memory.mp3",
            checkpointSeconds: 75,
            description:
              "A short story about what two students did last weekend, focused on was and were usage.",
            order: 1,
            slug: "weekend-memory",
            title: "Weekend Memory",
            questions: {
              create: [
                {
                  order: 1,
                  prompt: "Where were the students on Saturday morning?",
                  options: {
                    create: [
                      { isCorrect: true, order: 1, text: "They were at the library." },
                      { order: 2, text: "They were at the beach." },
                      { order: 3, text: "They were at home." },
                      { order: 4, text: "They were at school." },
                    ],
                  },
                },
                {
                  order: 2,
                  prompt: "How was Ana feeling after the trip?",
                  options: {
                    create: [
                      { order: 1, text: "Tired" },
                      { order: 2, text: "Hungry" },
                      { isCorrect: true, order: 3, text: "Excited" },
                      { order: 4, text: "Late" },
                    ],
                  },
                },
                {
                  order: 3,
                  prompt: "What was inside Miguel's backpack?",
                  options: {
                    create: [
                      { order: 1, text: "A sandwich" },
                      { order: 2, text: "A grammar quiz" },
                      { isCorrect: true, order: 3, text: "An old photo" },
                      { order: 4, text: "A jacket" },
                    ],
                  },
                },
                {
                  order: 4,
                  prompt: "When were they back at home?",
                  options: {
                    create: [
                      { order: 1, text: "At noon" },
                      { isCorrect: true, order: 2, text: "In the evening" },
                      { order: 3, text: "Before class" },
                      { order: 4, text: "After lunch" },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
