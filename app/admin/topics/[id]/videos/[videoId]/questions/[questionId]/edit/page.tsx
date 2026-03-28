import { notFound } from "next/navigation";

import { updateQuestionAction } from "../../actions";
import { adminGetQuestion } from "@/server/data/admin";

type EditQuestionPageProps = {
  params: Promise<{ id: string; questionId: string; videoId: string }>;
};

export default async function EditQuestionPage({ params }: EditQuestionPageProps) {
  const { id, questionId, videoId } = await params;
  const question = await adminGetQuestion(questionId);
  if (!question) notFound();

  const update = updateQuestionAction.bind(null, id, videoId, questionId);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
          Admin · {question.video.title}
        </p>
        <h1 className="mt-2 font-serif text-4xl text-[var(--foreground)]">
          Edit question {question.order}
        </h1>
      </div>

      <form
        action={update}
        className="flex flex-col gap-5 rounded-[28px] border border-[var(--border)] bg-[var(--panel)] p-8"
      >
        <QuestionFields
          defaults={{
            options: question.options,
            prompt: question.prompt,
          }}
        />
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="rounded-full bg-[var(--foreground)] px-6 py-3 text-sm font-semibold text-[var(--background)] transition-transform duration-200 hover:-translate-y-0.5"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}

export function QuestionFields({
  defaultOrder,
  defaults,
}: {
  defaultOrder?: number;
  defaults?: {
    options?: { id: string; isCorrect: boolean; order: number; text: string }[];
    prompt?: string;
  };
}) {
  const correctIndex =
    defaults?.options?.find((o) => o.isCorrect)?.order ?? 1;

  return (
    <>
      {defaultOrder !== undefined && (
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="order"
            className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]"
          >
            Order <span className="text-[var(--accent)]">*</span>
          </label>
          <input
            id="order"
            name="order"
            defaultValue={defaultOrder}
            required
            className="rounded-[14px] border border-[var(--border)] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--foreground)]"
          />
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="prompt"
          className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]"
        >
          Prompt <span className="text-[var(--accent)]">*</span>
        </label>
        <input
          id="prompt"
          name="prompt"
          defaultValue={defaults?.prompt}
          required
          className="rounded-[14px] border border-[var(--border)] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--foreground)]"
        />
      </div>

      <fieldset className="flex flex-col gap-3 rounded-[20px] border border-[var(--border)] p-5">
        <legend className="px-1 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
          Options — select the correct answer
        </legend>
        {[1, 2, 3, 4].map((n) => {
          const opt = defaults?.options?.find((o) => o.order === n);
          return (
            <div key={n} className="flex items-center gap-3">
              <input
                type="radio"
                id={`correct-${n}`}
                name="correct"
                value={n}
                defaultChecked={n === correctIndex}
                className="h-4 w-4 accent-[var(--foreground)]"
              />
              {opt && (
                <input type="hidden" name={`option${n}Id`} value={opt.id} />
              )}
              <input
                id={`option${n}`}
                name={`option${n}`}
                defaultValue={opt?.text}
                placeholder={`Option ${n}`}
                required
                className="flex-1 rounded-[14px] border border-[var(--border)] bg-[rgba(255,255,255,0.72)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--foreground)]"
              />
            </div>
          );
        })}
        <p className="text-xs text-[var(--muted)]">
          Select the radio button next to the correct option.
        </p>
      </fieldset>
    </>
  );
}
