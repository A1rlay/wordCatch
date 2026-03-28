import { notFound } from "next/navigation";

import { createVideoAction } from "../actions";
import { VideoFields } from "../[videoId]/edit/page";
import { adminGetTopic } from "@/server/data/admin";

type NewVideoPageProps = {
  params: Promise<{ id: string }>;
};

export default async function NewVideoPage({ params }: NewVideoPageProps) {
  const { id } = await params;
  const topic = await adminGetTopic(id);
  if (!topic) notFound();

  const create = createVideoAction.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
          Admin · {topic.title}
        </p>
        <h1 className="mt-2 font-serif text-4xl text-[var(--foreground)]">
          New video
        </h1>
      </div>

      <form
        action={create}
        className="flex flex-col gap-5 rounded-[28px] border border-[var(--border)] bg-[var(--panel)] p-8"
      >
        <VideoFields />
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="rounded-full bg-[var(--foreground)] px-6 py-3 text-sm font-semibold text-[var(--background)] transition-transform duration-200 hover:-translate-y-0.5"
          >
            Create video
          </button>
        </div>
      </form>
    </div>
  );
}
