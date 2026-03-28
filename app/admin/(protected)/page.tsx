import Link from "next/link";

import { adminGetDashboardCounts } from "@/server/data/admin";

export default async function AdminDashboardPage() {
  const { topicCount, videoCount, questionCount } = await adminGetDashboardCounts();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
          Dashboard
        </p>
        <h1 className="mt-3 font-serif text-4xl text-[var(--foreground)]">
          WordCatch Admin
        </h1>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        {[
          { label: "Topics", count: topicCount, href: "/admin/topics" },
          { label: "Videos", count: videoCount, href: "/admin/topics" },
          { label: "Questions", count: questionCount, href: "/admin/topics" },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-[28px] border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_20px_60px_rgba(13,34,66,0.06)] transition-transform duration-200 hover:-translate-y-0.5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
              {stat.label}
            </p>
            <p className="mt-3 font-serif text-5xl text-[var(--foreground)]">
              {stat.count}
            </p>
          </Link>
        ))}
      </div>

      <div className="rounded-[28px] border border-[var(--border)] bg-[var(--panel)] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
          Quick actions
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/admin/topics/new"
            className="rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-[var(--background)] transition-transform duration-200 hover:-translate-y-0.5"
          >
            New topic
          </Link>
          <Link
            href="/admin/topics"
            className="rounded-full border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--muted)] transition-colors hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
          >
            Manage topics
          </Link>
        </div>
      </div>
    </div>
  );
}
