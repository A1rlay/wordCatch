import Link from "next/link";

import type { TopicDetail } from "@/server/data/learning";

export function VideoList({ topic }: { topic: TopicDetail }) {
  return (
    <section className="grid gap-5 lg:grid-cols-2">
      {topic.videos.map((video, index) => (
        <article
          key={video.slug}
          className="glass-panel rounded-[30px] border border-[var(--border)] p-7 shadow-[0_20px_60px_rgba(13,34,66,0.08)]"
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Video {index + 1}
            </p>
            <span className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              Stop at {video.checkpointLabel}
            </span>
          </div>

          <h2 className="mt-4 font-serif text-3xl text-[var(--foreground)]">
            {video.title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            {video.description}
          </p>

          <div className="mt-6 rounded-[22px] border border-[var(--border)] bg-[rgba(255,255,255,0.72)] p-4 text-sm text-[var(--muted)]">
            {video.questionCount} comprehension questions attached.
          </div>

          <Link
            href={`/topics/${topic.slug}/videos/${video.slug}`}
            className="mt-6 inline-flex rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-[var(--background)] transition-transform duration-200 hover:-translate-y-0.5"
          >
            Open video lesson
          </Link>
        </article>
      ))}
    </section>
  );
}
