import { loginAction } from "./actions";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-[32px] border border-[var(--border)] bg-[var(--panel)] p-8 shadow-[0_24px_80px_rgba(13,34,66,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
            Admin
          </p>
          <h1 className="mt-3 font-serif text-3xl text-[var(--foreground)]">
            Sign in
          </h1>

          {error && (
            <p className="mt-4 rounded-[16px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Incorrect email or password.
            </p>
          )}

          <form action={loginAction} className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="rounded-[14px] border border-[var(--border)] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--foreground)] focus:ring-0"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="rounded-[14px] border border-[var(--border)] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--foreground)] focus:ring-0"
              />
            </div>

            <button
              type="submit"
              className="mt-2 rounded-full bg-[var(--foreground)] py-3 text-sm font-semibold text-[var(--background)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
