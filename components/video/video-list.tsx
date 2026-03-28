import Link from "next/link";

import type { TopicDetail } from "@/server/data/learning";

export function VideoList({ topic }: { topic: TopicDetail }) {
  if (topic.videos.length === 0) {
    return (
      <p className="text-sm text-[rgba(255,255,255,0.55)]">No videos yet.</p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {topic.videos.map((video, index) => (
        <Link
          key={video.id}
          href={`/topics/${topic.id}/videos/${video.id}`}
          className="flex items-center justify-between rounded-2xl border border-[rgba(255,255,255,0.18)] bg-[rgba(255,255,255,0.1)] px-6 py-5 font-bold text-white backdrop-blur-sm transition-colors hover:bg-[rgba(255,255,255,0.18)]"
        >
          <span className="text-base">{video.title}</span>
          <span className="ml-4 shrink-0 rounded-full border border-[rgba(255,255,255,0.25)] px-3 py-1 text-xs font-semibold text-[rgba(255,255,255,0.7)]">
            {index + 1}
          </span>
        </Link>
      ))}
    </div>
  );
}
