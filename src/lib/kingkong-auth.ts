import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const cookieName = process.env.VERCEL ? "__Host-kingkong" : "kingkong";
const sessionSeconds = 8 * 60 * 60;

function secrets() {
  const hash = process.env.KINGKONG_ADMIN_HASH?.trim();
  const secret = process.env.KINGKONG_SESSION_SECRET?.trim();
  return hash && /^[a-f\d]{64}$/.test(hash) && secret && secret.length >= 32 ? { hash, secret } : null;
}

export function adminConfigured() {
  return Boolean(secrets());
}

function sameHash(a: string, b: string) {
  return a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

function signature(value: string, secret: string, hash: string) {
  return createHmac("sha256", secret).update(`kingkong:${hash}:${value}`).digest("hex");
}

export async function startAdminSession(key: string) {
  const config = secrets();
  if (!config || key.length > 128) return false;
  if (!sameHash(createHash("sha256").update(key.trim()).digest("hex"), config.hash)) return false;
  const value = `${Math.floor(Date.now() / 1000) + sessionSeconds}.${randomBytes(16).toString("hex")}`;
  (await cookies()).set(cookieName, `${value}.${signature(value, config.secret, config.hash)}`, {
    httpOnly: true, secure: Boolean(process.env.VERCEL), sameSite: "strict", path: "/", maxAge: sessionSeconds,
  });
  return true;
}

export async function isAdmin() {
  const config = secrets();
  const value = (await cookies()).get(cookieName)?.value;
  const match = value && /^(\d+)\.([a-f\d]{32})\.([a-f\d]{64})$/.exec(value);
  if (!config || !match || Number(match[1]) <= Date.now() / 1000) return false;
  return sameHash(match[3], signature(`${match[1]}.${match[2]}`, config.secret, config.hash));
}

export async function endAdminSession() {
  (await cookies()).set(cookieName, "", {
    httpOnly: true, secure: Boolean(process.env.VERCEL), sameSite: "strict", path: "/", maxAge: 0,
  });
}

export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return origin !== null && origin === new URL(request.url).origin;
}

export function privateJson(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "private, no-store" } });
}
