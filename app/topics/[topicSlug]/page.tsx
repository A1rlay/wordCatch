import { notFound } from "next/navigation";

import { VideoList } from "@/components/video/video-list";
import { getTopicBySlug } from "@/server/data/learning";

type TopicPageProps = {
  params: Promise<{ topicSlug: string }>;
};

export default async function TopicPage({ params }: TopicPageProps) {
  const { topicSlug } = await params;
  const topic = await getTopicBySlug(topicSlug);

  if (!topic) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10 sm:px-10 lg:px-12">
      <section className="grid gap-5 lg:grid-cols-[1.35fr_0.9fr]">
        <article className="rounded-[32px] border border-[var(--border)] bg-[var(--panel)] p-8 shadow-[0_24px_80px_rgba(13,34,66,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
            {topic.level}
          </p>
          <h1 className="mt-3 font-serif text-4xl text-[var(--foreground)] sm:text-5xl">
            {topic.title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">
            {topic.description}
          </p>
        </article>

        <article className="glass-panel rounded-[32px] border border-[var(--border)] p-8 shadow-[0_24px_80px_rgba(13,34,66,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
            Flow
          </p>
          <ol className="mt-4 space-y-4 text-sm leading-7 text-[var(--muted)]">
            <li>1. Student opens a grammar topic.</li>
            <li>2. Student selects one video lesson.</li>
            <li>3. Video stops at a configured checkpoint.</li>
            <li>4. A four-question modal measures comprehension.</li>
          </ol>
        </article>
      </section>

      <VideoList topic={topic} />
    </main>
  );
}
