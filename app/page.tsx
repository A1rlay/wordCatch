import Link from "next/link";

import { HomeHero } from "@/components/home/home-hero";

const highlights = [
  {
    description:
      "Dedicated topic routes, video lesson routes, and an API entry point make it easy to build the student flow progressively.",
    eyebrow: "Frontend",
    title: "Learning paths are mapped into the App Router.",
  },
  {
    description:
      "tRPC routers separate health checks, topic lookups, and video lookups so backend features can grow without mixing concerns.",
    eyebrow: "Backend",
    title: "Server structure is ready for business logic and validation.",
  },
  {
    description:
      "Prisma models represent topics, videos, questions, and multiple-choice options for PostgreSQL.",
    eyebrow: "Database",
    title: "Your domain schema matches the listening experience.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-6 py-10 sm:px-10 lg:px-12">
      <HomeHero />

      <section className="grid gap-5 md:grid-cols-3">
        {highlights.map((item) => (
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
            Ready to explore
          </p>
          <h2 className="mt-3 font-serif text-3xl text-[var(--foreground)] sm:text-4xl">
            Topics, video lessons, quiz checkpoints, and PostgreSQL are all live.
          </h2>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/topics"
            className="rounded-full bg-[var(--foreground)] px-6 py-3 text-sm font-semibold text-[var(--background)] transition-transform duration-200 hover:-translate-y-0.5"
          >
            Browse topics
          </Link>
          <Link
            href="/admin"
            className="rounded-full border border-[var(--border-strong)] px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition-colors duration-200 hover:bg-[var(--surface-strong)]"
          >
            Admin panel
          </Link>
        </div>
      </section>
    </main>
  );
}
