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

  if (!video) notFound();

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-6 py-12 sm:py-16">
      <Link
        href={`/topics/${video.topic.slug}`}
        className="text-sm font-semibold text-[rgba(255,255,255,0.55)] transition-colors hover:text-white"
      >
        ← {video.topic.title}
      </Link>

      <h1 className="text-2xl font-extrabold text-white">{video.title}</h1>

      <VideoPlayer video={video} />
    </main>
  );
}
