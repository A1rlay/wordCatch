import Link from "next/link";

import { HomeHero } from "@/components/home/home-hero";
import { homeHighlights } from "@/lib/placeholders";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-6 py-10 sm:px-10 lg:px-12">
      <HomeHero />

      <section className="grid gap-5 md:grid-cols-3">
        {homeHighlights.map((item) => (
          <article
            key={item.title}
            className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_20px_60px_rgba(13,34,66,0.08)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
              {item.eyebrow}
            </p>
            <h2 className="mt-3 font-serif text-2xl text-[var(--foreground)]">
              {item.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              {item.description}
            </p>
          </article>
        ))}
      </section>

      <section className="flex flex-col gap-5 rounded-[32px] border border-[var(--border)] bg-[var(--panel)] p-8 shadow-[0_24px_80px_rgba(13,34,66,0.08)] lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
            Project structure ready
          </p>
          <h2 className="mt-3 font-serif text-3xl text-[var(--foreground)] sm:text-4xl">
            Topics, audio lessons, quiz checkpoints, API routes, and PostgreSQL models are scaffolded.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-base">
            Start with the learning routes now, then we can add real playback checkpoints, database queries, and the quiz modal flow feature by feature.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/topics"
            className="rounded-full bg-[var(--foreground)] px-6 py-3 text-sm font-semibold text-[var(--background)] transition-transform duration-200 hover:-translate-y-0.5"
          >
            Browse topics
          </Link>
          <Link
            href="/topics/verb-to-be-in-past"
            className="rounded-full border border-[var(--border-strong)] px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition-colors duration-200 hover:bg-[var(--surface-strong)]"
          >
            Open sample route
          </Link>
        </div>
      </section>
    </main>
  );
}
