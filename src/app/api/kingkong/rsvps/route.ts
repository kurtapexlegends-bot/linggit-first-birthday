import { z } from "zod";
import { isAdmin, isSameOrigin, privateJson } from "@/lib/kingkong-auth";
import { readRsvps, RsvpNotFoundError, saveRsvp } from "@/lib/kingkong-rsvps";
import { rsvpFields } from "@/lib/rsvp";

const submission = z.object({ id: z.uuid(), create: z.boolean(), fields: rsvpFields });

export async function GET() {
  if (!(await isAdmin())) return privateJson({ error: "Sign in again to view replies." }, 401);
  try {
    return privateJson({ entries: await readRsvps() });
  } catch {
    return privateJson({ error: "The guest list could not be loaded. Try again." }, 503);
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return privateJson({ error: "Invalid request origin." }, 403);
  if (!(await isAdmin())) return privateJson({ error: "Sign in again to update replies." }, 401);
  const parsed = submission.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return privateJson({ error: "Enter a name and valid guest counts." }, 400);
  try {
    const { id, create, fields } = parsed.data;
    return privateJson({ entry: await saveRsvp(fields, { id, allowCreate: create }) });
  } catch (error) {
    if (error instanceof RsvpNotFoundError) return privateJson({ error: "This response could not be found." }, 404);
    return privateJson({ error: "The reply could not be saved. Try again." }, 503);
  }
}
