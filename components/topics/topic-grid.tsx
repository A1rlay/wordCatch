import Link from "next/link";

import type { TopicCard } from "@/server/data/learning";

export function TopicGrid({ topics }: { topics: TopicCard[] }) {
  return (
    <section className="grid gap-5 lg:grid-cols-2">
      {topics.map((topic) => (
        <article
          key={topic.slug}
          className="glass-panel rounded-[30px] border border-[var(--border)] p-7 shadow-[0_20px_60px_rgba(13,34,66,0.08)]"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                {topic.level}
              </p>
              <h2 className="mt-3 font-serif text-3xl text-[var(--foreground)]">
                {topic.title}
              </h2>
            </div>
            <span className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              {topic.videoCount} videos
            </span>
          </div>

          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            {topic.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {topic.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[var(--surface-strong)] px-3 py-1 text-xs font-semibold text-[var(--foreground)]"
              >
                {tag}
              </span>
            ))}
          </div>

          <Link
            href={`/topics/${topic.slug}`}
            className="mt-7 inline-flex rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-[var(--background)] transition-transform duration-200 hover:-translate-y-0.5"
          >
            Open topic
          </Link>
        </article>
      ))}
    </section>
  );
}
