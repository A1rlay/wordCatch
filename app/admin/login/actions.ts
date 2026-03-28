"use server";

import { redirect } from "next/navigation";

import { clearSession, createSession } from "@/lib/session";

export async function loginAction(formData: FormData) {
  const email = formData.get("email")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  const adminEmail = process.env.ADMIN_EMAIL ?? "";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";

  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD env vars must be set.");
  }

  if (email !== adminEmail || password !== adminPassword) {
    redirect("/admin/login?error=1");
  }

  await createSession(email);
  redirect("/admin");
}

export async function logoutAction() {
  await clearSession();
  redirect("/admin/login");
}
