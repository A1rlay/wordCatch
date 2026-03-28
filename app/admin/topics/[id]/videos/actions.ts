"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  adminCreateVideo,
  adminDeleteVideo,
  adminUpdateVideo,
} from "@/server/data/admin";

function parseIntOrNull(value: string): number | null {
  const n = parseInt(value, 10);
  return isNaN(n) ? null : n;
}

export async function createVideoAction(topicId: string, formData: FormData) {
  const title = formData.get("title")?.toString().trim() ?? "";
  const slug = formData.get("slug")?.toString().trim() ?? "";
  const description = formData.get("description")?.toString().trim() ?? "";
  const videoUrl = formData.get("videoUrl")?.toString().trim() ?? "";
  const transcript = formData.get("transcript")?.toString().trim() ?? "";
  const checkpointSeconds = parseInt(formData.get("checkpointSeconds")?.toString() ?? "0", 10);
  const durationSeconds = parseIntOrNull(formData.get("durationSeconds")?.toString() ?? "");
  const order = parseInt(formData.get("order")?.toString() ?? "0", 10);

  await adminCreateVideo({
    checkpointSeconds,
    description,
    durationSeconds,
    order,
    slug,
    title,
    topicId,
    transcript,
    videoUrl,
  });

  revalidatePath(`/admin/topics/${topicId}/videos`);
  redirect(`/admin/topics/${topicId}/videos`);
}

export async function updateVideoAction(
  topicId: string,
  videoId: string,
  formData: FormData,
) {
  const title = formData.get("title")?.toString().trim() ?? "";
  const slug = formData.get("slug")?.toString().trim() ?? "";
  const description = formData.get("description")?.toString().trim() ?? "";
  const videoUrl = formData.get("videoUrl")?.toString().trim() ?? "";
  const transcript = formData.get("transcript")?.toString().trim() ?? "";
  const checkpointSeconds = parseInt(formData.get("checkpointSeconds")?.toString() ?? "0", 10);
  const durationSeconds = parseIntOrNull(formData.get("durationSeconds")?.toString() ?? "");
  const order = parseInt(formData.get("order")?.toString() ?? "0", 10);

  await adminUpdateVideo(videoId, {
    checkpointSeconds,
    description,
    durationSeconds,
    order,
    slug,
    title,
    transcript,
    videoUrl,
  });

  revalidatePath(`/admin/topics/${topicId}/videos`);
  redirect(`/admin/topics/${topicId}/videos`);
}

export async function deleteVideoAction(topicId: string, videoId: string) {
  await adminDeleteVideo(videoId);
  revalidatePath(`/admin/topics/${topicId}/videos`);
  redirect(`/admin/topics/${topicId}/videos`);
}
