import { TopicGrid } from "@/components/topics/topic-grid";
import { placeholderTopics } from "@/lib/placeholders";

export default function TopicsPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10 sm:px-10 lg:px-12">
      <section className="flex flex-col gap-4 rounded-[32px] border border-[var(--border)] bg-[var(--panel)] p-8 shadow-[0_24px_80px_rgba(13,34,66,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
          Topic library
        </p>
        <h1 className="max-w-3xl font-serif text-4xl text-[var(--foreground)] sm:text-5xl">
          Grammar-first listening tracks for focused English practice.
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">
          This route is ready for database-driven topic discovery. Right now it uses placeholder data shaped like the Prisma models so we can build features on top of it safely.
        </p>
      </section>

      <TopicGrid topics={placeholderTopics} />
    </main>
  );
}
