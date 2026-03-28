import { redirect } from "next/navigation";

// Old audio route — redirects to the renamed video route.
type Params = Promise<{ audioSlug: string; topicSlug: string }>;

export default async function OldAudioPage({ params }: { params: Params }) {
  const { topicSlug, audioSlug } = await params;
  redirect(`/topics/${topicSlug}/videos/${audioSlug}`);
}
