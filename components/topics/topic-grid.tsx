import Link from "next/link";

import type { TopicCard } from "@/server/data/learning";

export function TopicGrid({ topics }: { topics: TopicCard[] }) {
  if (topics.length === 0) {
    return (
      <p className="text-sm text-[rgba(255,255,255,0.55)]">No topics yet.</p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {topics.map((topic) => (
        <Link
          key={topic.id}
          href={`/topics/${topic.id}`}
          className="flex items-start justify-between gap-4 rounded-2xl border border-[rgba(255,255,255,0.18)] bg-[rgba(255,255,255,0.1)] px-6 py-5 text-white backdrop-blur-sm transition-colors hover:bg-[rgba(255,255,255,0.18)]"
        >
          <div className="min-w-0">
            {topic.level && (
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.22em] text-[rgba(255,255,255,0.5)]">
                {topic.level}
              </p>
            )}
            <p className="font-bold text-base">{topic.title}</p>
            {topic.description && (
              <p className="mt-1 text-sm text-[rgba(255,255,255,0.6)] line-clamp-2">
                {topic.description}
              </p>
            )}
            {topic.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {topic.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[rgba(255,255,255,0.2)] px-2.5 py-0.5 text-xs text-[rgba(255,255,255,0.6)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <span className="mt-0.5 shrink-0 rounded-full bg-[#0F9C00] px-3 py-1 text-xs font-bold">
            {topic.videoCount} {topic.videoCount === 1 ? "video" : "videos"}
          </span>
        </Link>
      ))}
    </div>
  );
}
