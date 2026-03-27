import type { QuizQuestion } from "@/server/data/learning";

export function QuizBlueprint({
  questions,
}: {
  questions: QuizQuestion[];
}) {
  return (
    <aside className="glass-panel rounded-[32px] border border-[var(--border)] p-8 shadow-[0_24px_80px_rgba(13,34,66,0.08)]">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
        Quiz blueprint
      </p>
      <h2 className="mt-3 font-serif text-3xl text-[var(--foreground)]">
        Modal content can come straight from the database.
      </h2>

      <div className="mt-6 space-y-4">
        {questions.map((question) => (
          <article
            key={question.id}
            className="rounded-[24px] border border-[var(--border)] bg-[rgba(255,255,255,0.72)] p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
              Question {question.order}
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--foreground)]">
              {question.prompt}
            </p>
            <div className="mt-4 space-y-2">
              {question.options.map((option) => (
                <div
                  key={option.id}
                  className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted)]"
                >
                  {option.text}
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </aside>
  );
}
