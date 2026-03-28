import { notFound } from "next/navigation";

import { createQuestionAction } from "../actions";
import { QuestionFields } from "../[questionId]/edit/page";
import { adminGetVideo } from "@/server/data/admin";

type NewQuestionPageProps = {
  params: Promise<{ id: string; videoId: string }>;
};

export default async function NewQuestionPage({ params }: NewQuestionPageProps) {
  const { id, videoId } = await params;
  const video = await adminGetVideo(videoId);
  if (!video) notFound();

  const nextOrder = video.questions.length + 1;
  const create = createQuestionAction.bind(null, id, videoId);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
          Admin · {video.title}
        </p>
        <h1 className="mt-2 font-serif text-4xl text-[var(--foreground)]">
          New question
        </h1>
      </div>

      <form
        action={create}
        className="flex flex-col gap-5 rounded-[28px] border border-[var(--border)] bg-[var(--panel)] p-8"
      >
        <QuestionFields defaultOrder={nextOrder} />
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="rounded-full bg-[var(--foreground)] px-6 py-3 text-sm font-semibold text-[var(--background)] transition-transform duration-200 hover:-translate-y-0.5"
          >
            Create question
          </button>
        </div>
      </form>
    </div>
  );
}
