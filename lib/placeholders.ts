export type PlaceholderQuestionOption = {
  id: string;
  text: string;
};

export type PlaceholderQuestion = {
  id: string;
  options: PlaceholderQuestionOption[];
  order: number;
  prompt: string;
};

export type PlaceholderAudio = {
  checkpointLabel: string;
  description: string;
  questions: PlaceholderQuestion[];
  slug: string;
  title: string;
};

export type PlaceholderTopic = {
  audios: PlaceholderAudio[];
  description: string;
  level: string;
  slug: string;
  tags: string[];
  title: string;
};

export const homeHighlights = [
  {
    description:
      "Dedicated topic routes, audio lesson routes, and an API entry point make it easy to build the student flow progressively.",
    eyebrow: "Frontend",
    title: "Learning paths are already mapped into the App Router.",
  },
  {
    description:
      "tRPC routers separate health checks, topic lookups, and audio lookups so backend features can grow without mixing concerns.",
    eyebrow: "Backend",
    title: "Server structure is ready for business logic and validation.",
  },
  {
    description:
      "Prisma models already represent topics, audios, questions, and multiple-choice options for PostgreSQL.",
    eyebrow: "Database",
    title: "Your domain schema matches the listening experience you described.",
  },
];

export const placeholderTopics: PlaceholderTopic[] = [
  {
    audios: [
      {
        checkpointLabel: "01:15",
        description:
          "A short story about what two students did last weekend, focused on was and were usage.",
        questions: [
          {
            id: "past-q1",
            options: [
              { id: "past-q1-a", text: "They were at the library." },
              { id: "past-q1-b", text: "They were at the beach." },
              { id: "past-q1-c", text: "They were at home." },
              { id: "past-q1-d", text: "They were at school." },
            ],
            order: 1,
            prompt: "Where were the students on Saturday morning?",
          },
          {
            id: "past-q2",
            options: [
              { id: "past-q2-a", text: "Tired" },
              { id: "past-q2-b", text: "Hungry" },
              { id: "past-q2-c", text: "Excited" },
              { id: "past-q2-d", text: "Late" },
            ],
            order: 2,
            prompt: "How was Ana feeling after the trip?",
          },
          {
            id: "past-q3",
            options: [
              { id: "past-q3-a", text: "A sandwich" },
              { id: "past-q3-b", text: "A grammar quiz" },
              { id: "past-q3-c", text: "An old photo" },
              { id: "past-q3-d", text: "A jacket" },
            ],
            order: 3,
            prompt: "What was inside Miguel's backpack?",
          },
          {
            id: "past-q4",
            options: [
              { id: "past-q4-a", text: "At noon" },
              { id: "past-q4-b", text: "In the evening" },
              { id: "past-q4-c", text: "Before class" },
              { id: "past-q4-d", text: "After lunch" },
            ],
            order: 4,
            prompt: "When were they back at home?",
          },
        ],
        slug: "weekend-memory",
        title: "Weekend Memory",
      },
      {
        checkpointLabel: "00:50",
        description:
          "A classroom dialogue describing where objects and people were during a school event.",
        questions: [
          {
            id: "past-dialogue-q1",
            options: [
              { id: "past-dialogue-q1-a", text: "In the gym" },
              { id: "past-dialogue-q1-b", text: "In the cafeteria" },
              { id: "past-dialogue-q1-c", text: "In the hallway" },
              { id: "past-dialogue-q1-d", text: "In the office" },
            ],
            order: 1,
            prompt: "Where was the principal?",
          },
          {
            id: "past-dialogue-q2",
            options: [
              { id: "past-dialogue-q2-a", text: "Blue" },
              { id: "past-dialogue-q2-b", text: "Red" },
              { id: "past-dialogue-q2-c", text: "Green" },
              { id: "past-dialogue-q2-d", text: "Yellow" },
            ],
            order: 2,
            prompt: "What color was the banner?",
          },
          {
            id: "past-dialogue-q3",
            options: [
              { id: "past-dialogue-q3-a", text: "Three" },
              { id: "past-dialogue-q3-b", text: "Four" },
              { id: "past-dialogue-q3-c", text: "Five" },
              { id: "past-dialogue-q3-d", text: "Six" },
            ],
            order: 3,
            prompt: "How many teachers were near the entrance?",
          },
          {
            id: "past-dialogue-q4",
            options: [
              { id: "past-dialogue-q4-a", text: "A microphone" },
              { id: "past-dialogue-q4-b", text: "A notebook" },
              { id: "past-dialogue-q4-c", text: "A speaker" },
              { id: "past-dialogue-q4-d", text: "A camera" },
            ],
            order: 4,
            prompt: "What was on the stage?",
          },
        ],
        slug: "school-event-recap",
        title: "School Event Recap",
      },
    ],
    description:
      "Introduce students to past descriptions with was and were through short stories and school-life conversations.",
    level: "A1 - A2",
    slug: "verb-to-be-in-past",
    tags: ["was", "were", "past descriptions"],
    title: "Verb To Be in Past",
  },
  {
    audios: [
      {
        checkpointLabel: "01:05",
        description:
          "A city scene where people are doing different actions right now.",
        questions: [
          {
            id: "pc-q1",
            options: [
              { id: "pc-q1-a", text: "Reading a map" },
              { id: "pc-q1-b", text: "Buying fruit" },
              { id: "pc-q1-c", text: "Waiting for a bus" },
              { id: "pc-q1-d", text: "Taking pictures" },
            ],
            order: 1,
            prompt: "What is the tourist doing?",
          },
          {
            id: "pc-q2",
            options: [
              { id: "pc-q2-a", text: "A dog" },
              { id: "pc-q2-b", text: "A bicycle" },
              { id: "pc-q2-c", text: "A newspaper" },
              { id: "pc-q2-d", text: "An umbrella" },
            ],
            order: 2,
            prompt: "What is the boy carrying?",
          },
          {
            id: "pc-q3",
            options: [
              { id: "pc-q3-a", text: "In a cafe" },
              { id: "pc-q3-b", text: "At the station" },
              { id: "pc-q3-c", text: "In a park" },
              { id: "pc-q3-d", text: "At the market" },
            ],
            order: 3,
            prompt: "Where are the musicians playing?",
          },
          {
            id: "pc-q4",
            options: [
              { id: "pc-q4-a", text: "Because it is cold" },
              { id: "pc-q4-b", text: "Because it is raining" },
              { id: "pc-q4-c", text: "Because it is windy" },
              { id: "pc-q4-d", text: "Because it is sunny" },
            ],
            order: 4,
            prompt: "Why are people opening umbrellas?",
          },
        ],
        slug: "busy-city-morning",
        title: "Busy City Morning",
      },
    ],
    description:
      "Help students recognize actions happening right now using rich present continuous listening scenes.",
    level: "A1 - A2",
    slug: "present-continuous",
    tags: ["actions now", "ing forms", "describing scenes"],
    title: "Present Continuous",
  },
];
