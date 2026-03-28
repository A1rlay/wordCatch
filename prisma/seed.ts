import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.questionOption.deleteMany();
  await prisma.question.deleteMany();
  await prisma.video.deleteMany();
  await prisma.topic.deleteMany();

  await prisma.topic.createMany({
    data: [
      {
        description:
          "Introduce students to past descriptions with was and were through short stories and school-life conversations.",
        level: "A1 - A2",
        slug: "verb-to-be-in-past",
        tags: ["was", "were", "past descriptions"],
        title: "Verb To Be in Past",
      },
      {
        description:
          "Help students recognize actions happening right now using rich present continuous listening scenes.",
        level: "A1 - A2",
        slug: "present-continuous",
        tags: ["actions now", "ing forms", "describing scenes"],
        title: "Present Continuous",
      },
    ],
  });

  const topics = await prisma.topic.findMany({
    select: {
      id: true,
      slug: true,
    },
  });

  const topicIdBySlug = new Map(topics.map((topic) => [topic.slug, topic.id]));

  await prisma.video.create({
    data: {
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      checkpointSeconds: 75,
      description:
        "A short story about what two students did last weekend, focused on was and were usage.",
      order: 1,
      slug: "weekend-memory",
      title: "Weekend Memory",
      topicId: topicIdBySlug.get("verb-to-be-in-past")!,
      transcript:
        "Ana and Miguel were at the library on Saturday morning. Later, Ana was excited about a trip, and Miguel had an old photo in his backpack.",
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
  });

  await prisma.video.create({
    data: {
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      checkpointSeconds: 50,
      description:
        "A classroom dialogue describing where objects and people were during a school event.",
      order: 2,
      slug: "school-event-recap",
      title: "School Event Recap",
      topicId: topicIdBySlug.get("verb-to-be-in-past")!,
      transcript:
        "The principal was in the gym, the banner was red, four teachers were near the entrance, and there was a microphone on the stage.",
      questions: {
        create: [
          {
            order: 1,
            prompt: "Where was the principal?",
            options: {
              create: [
                { isCorrect: true, order: 1, text: "In the gym" },
                { order: 2, text: "In the cafeteria" },
                { order: 3, text: "In the hallway" },
                { order: 4, text: "In the office" },
              ],
            },
          },
          {
            order: 2,
            prompt: "What color was the banner?",
            options: {
              create: [
                { order: 1, text: "Blue" },
                { isCorrect: true, order: 2, text: "Red" },
                { order: 3, text: "Green" },
                { order: 4, text: "Yellow" },
              ],
            },
          },
          {
            order: 3,
            prompt: "How many teachers were near the entrance?",
            options: {
              create: [
                { order: 1, text: "Three" },
                { isCorrect: true, order: 2, text: "Four" },
                { order: 3, text: "Five" },
                { order: 4, text: "Six" },
              ],
            },
          },
          {
            order: 4,
            prompt: "What was on the stage?",
            options: {
              create: [
                { isCorrect: true, order: 1, text: "A microphone" },
                { order: 2, text: "A notebook" },
                { order: 3, text: "A speaker" },
                { order: 4, text: "A camera" },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.video.create({
    data: {
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      checkpointSeconds: 65,
      description:
        "A city scene where people are doing different actions right now.",
      order: 1,
      slug: "busy-city-morning",
      title: "Busy City Morning",
      topicId: topicIdBySlug.get("present-continuous")!,
      transcript:
        "A tourist is reading a map, a boy is carrying a bicycle helmet, musicians are playing at the market, and people are opening umbrellas because it is raining.",
      questions: {
        create: [
          {
            order: 1,
            prompt: "What is the tourist doing?",
            options: {
              create: [
                { isCorrect: true, order: 1, text: "Reading a map" },
                { order: 2, text: "Buying fruit" },
                { order: 3, text: "Waiting for a bus" },
                { order: 4, text: "Taking pictures" },
              ],
            },
          },
          {
            order: 2,
            prompt: "What is the boy carrying?",
            options: {
              create: [
                { order: 1, text: "A dog" },
                { isCorrect: true, order: 2, text: "A bicycle helmet" },
                { order: 3, text: "A newspaper" },
                { order: 4, text: "An umbrella" },
              ],
            },
          },
          {
            order: 3,
            prompt: "Where are the musicians playing?",
            options: {
              create: [
                { order: 1, text: "In a cafe" },
                { order: 2, text: "At the station" },
                { order: 3, text: "In a park" },
                { isCorrect: true, order: 4, text: "At the market" },
              ],
            },
          },
          {
            order: 4,
            prompt: "Why are people opening umbrellas?",
            options: {
              create: [
                { order: 1, text: "Because it is cold" },
                { isCorrect: true, order: 2, text: "Because it is raining" },
                { order: 3, text: "Because it is windy" },
                { order: 4, text: "Because it is sunny" },
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
