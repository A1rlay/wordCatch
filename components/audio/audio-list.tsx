import Link from "next/link";

import type { PlaceholderTopic } from "@/lib/placeholders";

export function AudioList({ topic }: { topic: PlaceholderTopic }) {
  return (
    <section className="grid gap-5 lg:grid-cols-2">
      {topic.audios.map((audio, index) => (
        <article
          key={audio.slug}
          className="glass-panel rounded-[30px] border border-[var(--border)] p-7 shadow-[0_20px_60px_rgba(13,34,66,0.08)]"
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Audio {index + 1}
            </p>
            <span className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              Stop at {audio.checkpointLabel}
            </span>
          </div>

          <h2 className="mt-4 font-serif text-3xl text-[var(--foreground)]">
            {audio.title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            {audio.description}
          </p>

          <div className="mt-6 rounded-[22px] border border-[var(--border)] bg-[rgba(255,255,255,0.72)] p-4 text-sm text-[var(--muted)]">
            {audio.questions.length} comprehension questions are attached to this audio in the same shape as the database schema.
          </div>

          <Link
            href={`/topics/${topic.slug}/audios/${audio.slug}`}
            className="mt-6 inline-flex rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-[var(--background)] transition-transform duration-200 hover:-translate-y-0.5"
          >
            Open audio lesson
          </Link>
        </article>
      ))}
    </section>
  );
}
