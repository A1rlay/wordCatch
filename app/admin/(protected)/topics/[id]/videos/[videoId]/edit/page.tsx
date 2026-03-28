import { notFound } from "next/navigation";

import { updateVideoAction } from "../../actions";
import { adminGetVideo } from "@/server/data/admin";

type EditVideoPageProps = {
  params: Promise<{ id: string; videoId: string }>;
};

export default async function EditVideoPage({ params }: EditVideoPageProps) {
  const { id, videoId } = await params;
  const video = await adminGetVideo(videoId);
  if (!video) notFound();

  const update = updateVideoAction.bind(null, id, videoId);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
          Admin · {video.topic.title}
        </p>
        <h1 className="mt-2 font-serif text-4xl text-[var(--foreground)]">
          Edit video
        </h1>
      </div>

      <form
        action={update}
        className="flex flex-col gap-5 rounded-[28px] border border-[var(--border)] bg-[var(--panel)] p-8"
      >
        <VideoFields defaults={video} />
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="rounded-full bg-[var(--foreground)] px-6 py-3 text-sm font-semibold text-[var(--background)] transition-transform duration-200 hover:-translate-y-0.5"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}

export function VideoFields({
  defaults,
}: {
  defaults?: {
    description?: string | null;
    order?: number;
    slug?: string;
    title?: string;
    transcript?: string | null;
    videoUrl?: string;
  };
} = {}) {
  return (
    <>
      <Field label="Title" name="title" defaultValue={defaults?.title} required />
      <Field
        label="Slug"
        name="slug"
        defaultValue={defaults?.slug}
        hint="URL-safe identifier, e.g. weekend-memory"
        required
      />
      <Field
        label="YouTube URL"
        name="videoUrl"
        defaultValue={defaults?.videoUrl}
        hint="e.g. https://www.youtube.com/watch?v=VIDEO_ID"
        required
      />
      <Field
        label="Order"
        name="order"
        defaultValue={defaults?.order?.toString() ?? "0"}
        hint="Display order within topic"
        required
      />
      <Field
        label="Description"
        name="description"
        defaultValue={defaults?.description ?? ""}
        multiline
      />
      <Field
        label="Transcript"
        name="transcript"
        defaultValue={defaults?.transcript ?? ""}
        multiline
        hint="Optional — full transcript text"
      />
    </>
  );
}

function Field({
  defaultValue,
  hint,
  label,
  multiline,
  name,
  required,
}: {
  defaultValue?: string;
  hint?: string;
  label: string;
  multiline?: boolean;
  name: string;
  required?: boolean;
}) {
  const inputClass =
    "rounded-[14px] border border-[var(--border)] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--foreground)]";

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={name}
        className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]"
      >
        {label}
        {required && <span className="ml-1 text-[var(--accent)]">*</span>}
      </label>
      {multiline ? (
        <textarea
          id={name}
          name={name}
          defaultValue={defaultValue}
          rows={3}
          className={inputClass}
        />
      ) : (
        <input
          id={name}
          name={name}
          defaultValue={defaultValue}
          required={required}
          className={inputClass}
        />
      )}
      {hint && <p className="text-xs text-[var(--muted)]">{hint}</p>}
    </div>
  );
}
