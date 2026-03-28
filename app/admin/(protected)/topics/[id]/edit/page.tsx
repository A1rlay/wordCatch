import { notFound } from "next/navigation";

import { TopicFields } from "../../new/page";
import { updateTopicAction } from "../../actions";
import { adminGetTopic } from "@/server/data/admin";

type EditTopicPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditTopicPage({ params }: EditTopicPageProps) {
  const { id } = await params;
  const topic = await adminGetTopic(id);
  if (!topic) notFound();

  const update = updateTopicAction.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
          Admin · Topics
        </p>
        <h1 className="mt-2 font-serif text-4xl text-[var(--foreground)]">
          Edit topic
        </h1>
      </div>

      <form
        action={update}
        className="flex flex-col gap-5 rounded-[28px] border border-[var(--border)] bg-[var(--panel)] p-8"
      >
        <TopicFields defaults={topic} />
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="rounded-full bg-[#0F9C00] px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}
