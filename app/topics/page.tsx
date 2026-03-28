import Link from "next/link";

import { TopicGrid } from "@/components/topics/topic-grid";
import { getTopicCatalog } from "@/server/data/learning";

export default async function TopicsPage() {
  const topics = await getTopicCatalog();

  return (
    <main className="mx-auto flex w-full max-w-lg flex-col gap-6 px-6 py-12 sm:py-16">
      <Link
        href="/"
        className="text-sm font-semibold text-[rgba(255,255,255,0.55)] transition-colors hover:text-white"
      >
        ← Back
      </Link>

      <h1 className="text-3xl font-extrabold text-white">Select a topic</h1>

      <TopicGrid topics={topics} />
    </main>
  );
}
