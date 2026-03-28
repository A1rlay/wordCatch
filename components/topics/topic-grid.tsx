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
          key={topic.slug}
          href={`/topics/${topic.slug}`}
          className="flex items-center justify-between rounded-2xl border border-[rgba(255,255,255,0.18)] bg-[rgba(255,255,255,0.1)] px-6 py-5 font-bold text-white backdrop-blur-sm transition-colors hover:bg-[rgba(255,255,255,0.18)]"
        >
          <span className="text-base">{topic.title}</span>
          <span className="ml-4 shrink-0 rounded-full bg-[#0F9C00] px-3 py-1 text-xs font-bold">
            {topic.videoCount} {topic.videoCount === 1 ? "video" : "videos"}
          </span>
        </Link>
      ))}
    </div>
  );
}
