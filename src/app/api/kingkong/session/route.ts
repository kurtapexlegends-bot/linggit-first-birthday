import { adminConfigured, endAdminSession, isSameOrigin, privateJson, startAdminSession } from "@/lib/kingkong-auth";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return privateJson({ error: "Invalid request origin." }, 403);
  if (!adminConfigured()) return privateJson({ error: "The editor is unavailable." }, 503);
  const body = await request.json().catch(() => null);
  if (typeof body?.key !== "string" || !(await startAdminSession(body.key))) {
    return privateJson({ error: "That access key did not match." }, 401);
  }
  return privateJson({ ok: true });
}

export async function DELETE(request: Request) {
  if (!isSameOrigin(request)) return privateJson({ error: "Invalid request origin." }, 403);
  await endAdminSession();
  return privateJson({ ok: true });
}
