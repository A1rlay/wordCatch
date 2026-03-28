import Link from "next/link";

import { deleteTopicAction } from "./actions";
import { adminGetAllTopics } from "@/server/data/admin";

export default async function AdminTopicsPage() {
  const topics = await adminGetAllTopics();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
            Admin
          </p>
          <h1 className="mt-2 font-serif text-4xl text-[var(--foreground)]">
            Topics
          </h1>
        </div>
        <Link
          href="/admin/topics/new"
          className="rounded-full bg-[#0F9C00] px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          New topic
        </Link>
      </div>

      {topics.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-[var(--border)] p-12 text-center text-sm text-[var(--muted)]">
          No topics yet.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-[var(--border)] bg-[var(--panel)] px-6 py-5"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                  {topic.level ?? "No level"}
                </p>
                <p className="mt-1 font-semibold text-[var(--foreground)]">
                  {topic.title}
                </p>
                <p className="mt-0.5 text-xs text-[var(--muted)]">
                  {topic._count.videos} video{topic._count.videos !== 1 ? "s" : ""} ·{" "}
                  slug: {topic.slug}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/topics/${topic.id}/videos`}
                  className="rounded-full border border-[rgba(255,255,255,0.25)] px-4 py-2 text-xs font-semibold text-[rgba(255,255,255,0.7)] transition-colors hover:border-white hover:text-white"
                >
                  Videos
                </Link>
                <Link
                  href={`/admin/topics/${topic.id}/edit`}
                  className="rounded-full border border-[rgba(255,255,255,0.25)] px-4 py-2 text-xs font-semibold text-[rgba(255,255,255,0.7)] transition-colors hover:border-white hover:text-white"
                >
                  Edit
                </Link>
                <form action={deleteTopicAction.bind(null, topic.id)}>
                  <button
                    type="submit"
                    className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-500 transition-colors hover:border-red-400 hover:text-red-700"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
