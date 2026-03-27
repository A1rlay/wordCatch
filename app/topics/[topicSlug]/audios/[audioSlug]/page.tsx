import Link from "next/link";
import { notFound } from "next/navigation";

import { QuizBlueprint } from "@/components/audio/quiz-blueprint";
import { getAudioLessonBySlug } from "@/server/data/learning";

type AudioPageProps = {
  params: Promise<{ audioSlug: string; topicSlug: string }>;
};

export default async function AudioPage({ params }: AudioPageProps) {
  const { audioSlug, topicSlug } = await params;
  const audio = await getAudioLessonBySlug(topicSlug, audioSlug);

  if (!audio) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10 sm:px-10 lg:px-12">
      <Link
        href={`/topics/${audio.topic.slug}`}
        className="w-fit text-sm font-semibold text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
      >
        Back to {audio.topic.title}
      </Link>

      <section className="grid gap-5 lg:grid-cols-[1.3fr_0.92fr]">
        <article className="rounded-[32px] border border-[var(--border)] bg-[var(--panel)] p-8 shadow-[0_24px_80px_rgba(13,34,66,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
            Audio lesson
          </p>
          <h1 className="mt-3 font-serif text-4xl text-[var(--foreground)] sm:text-5xl">
            {audio.title}
          </h1>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)] sm:text-base">
            {audio.description}
          </p>

          <div className="mt-8 rounded-[28px] border border-[var(--border)] bg-[rgba(255,255,255,0.76)] p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                  Player checkpoint
                </p>
                <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                  Pause at {audio.checkpointLabel}
                </p>
              </div>
              <span className="rounded-full bg-[var(--foreground)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--background)]">
                Modal with 4 questions
              </span>
            </div>

            <div className="mt-6 grid gap-4 rounded-[24px] border border-dashed border-[var(--border-strong)] p-6 text-sm text-[var(--muted)]">
              <p>
                The real audio player, playback timer, and quiz modal will be added in the next implementation steps.
              </p>
              <p>
                Database shape and route structure are already ready for that flow.
              </p>
            </div>
          </div>
        </article>

        <QuizBlueprint questions={audio.questions} />
      </section>
    </main>
  );
}
