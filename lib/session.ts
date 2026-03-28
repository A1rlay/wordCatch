import { cookies } from "next/headers";

const SESSION_COOKIE = "admin_session";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

async function getKey(usage: "sign" | "verify"): Promise<CryptoKey> {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET env var is not set.");
  return crypto.subtle.importKey(
    "raw",
    Buffer.from(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    [usage],
  );
}

async function sign(payload: string): Promise<string> {
  const key = await getKey("sign");
  const buf = await crypto.subtle.sign("HMAC", key, Buffer.from(payload));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function verifyHmac(payload: string, sig: string): Promise<boolean> {
  const expected = await sign(payload);
  if (expected.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  }
  return diff === 0;
}

export async function createSession(email: string): Promise<void> {
  const payload = JSON.stringify({ email, exp: Date.now() + SESSION_TTL_MS });
  const encoded = btoa(payload);
  const sig = await sign(payload);
  const value = `${encoded}.${sig}`;

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, value, {
    httpOnly: true,
    maxAge: SESSION_TTL_MS / 1000,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function getSession(): Promise<{ email: string } | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE);
  if (!cookie) return null;
  return verifySessionValue(cookie.value);
}

export async function verifySessionValue(
  value: string,
): Promise<{ email: string } | null> {
  const dotIndex = value.lastIndexOf(".");
  if (dotIndex === -1) return null;

  const encoded = value.slice(0, dotIndex);
  const sig = value.slice(dotIndex + 1);

  try {
    const payload = atob(encoded);
    const valid = await verifyHmac(payload, sig);
    if (!valid) return null;

    const data = JSON.parse(payload) as { email: string; exp: number };
    if (Date.now() > data.exp) return null;

    return { email: data.email };
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
