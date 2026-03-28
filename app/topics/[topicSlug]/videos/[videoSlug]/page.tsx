import Link from "next/link";
import { notFound } from "next/navigation";

import { VideoPlayer } from "@/components/video/video-player";
import { getVideoLessonBySlug } from "@/server/data/learning";

type VideoPageProps = {
  params: Promise<{ topicSlug: string; videoSlug: string }>;
};

export default async function VideoPage({ params }: VideoPageProps) {
  const { topicSlug, videoSlug } = await params;
  const video = await getVideoLessonBySlug(topicSlug, videoSlug);

  if (!video) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10 sm:px-10 lg:px-12">
      <Link
        href={`/topics/${video.topic.slug}`}
        className="w-fit text-sm font-semibold text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
      >
        Back to {video.topic.title}
      </Link>

      <article className="rounded-[32px] border border-[var(--border)] bg-[var(--panel)] p-8 shadow-[0_24px_80px_rgba(13,34,66,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
          Video lesson
        </p>
        <h1 className="mt-3 font-serif text-4xl text-[var(--foreground)] sm:text-5xl">
          {video.title}
        </h1>
        <p className="mt-4 text-sm leading-7 text-[var(--muted)] sm:text-base">
          {video.description}
        </p>

        <VideoPlayer video={video} />
      </article>
    </main>
  );
}
