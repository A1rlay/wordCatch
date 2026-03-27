import Link from "next/link";

export function HomeHero() {
  return (
    <section className="grid gap-5 lg:grid-cols-[1.3fr_0.92fr]">
      <article className="rounded-[36px] border border-[var(--border)] bg-[var(--panel)] p-8 shadow-[0_24px_80px_rgba(13,34,66,0.08)] sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
          Listening platform foundation
        </p>
        <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-none text-[var(--foreground)] sm:text-6xl lg:text-7xl">
          Build an English listening site around topics, audio checkpoints, and quiz moments.
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-8 text-[var(--muted)] sm:text-base">
          The project now has dedicated frontend routes, backend entry points, Prisma models for PostgreSQL, and tRPC plumbing so we can add each feature cleanly without reshaping the app later.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/topics"
            className="rounded-full bg-[var(--foreground)] px-6 py-3 text-sm font-semibold text-[var(--background)] transition-transform duration-200 hover:-translate-y-0.5"
          >
            Start with topics
          </Link>
          <Link
            href="/topics/present-continuous"
            className="rounded-full border border-[var(--border-strong)] px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition-colors duration-200 hover:bg-[var(--surface-strong)]"
          >
            Explore a sample lesson
          </Link>
        </div>
      </article>

      <article className="glass-panel rounded-[36px] border border-[var(--border)] p-8 shadow-[0_24px_80px_rgba(13,34,66,0.08)] sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
          Core flow
        </p>
        <div className="mt-5 space-y-4">
          {[
            "Choose a grammar topic from the library.",
            "Open one audio lesson under that topic.",
            "Stop playback at the configured checkpoint.",
            "Launch a four-question comprehension modal.",
          ].map((step, index) => (
            <div
              key={step}
              className="rounded-[24px] border border-[var(--border)] bg-[rgba(255,255,255,0.74)] p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                Step {index + 1}
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{step}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
