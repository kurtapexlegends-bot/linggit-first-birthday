import { z } from "zod";
import { isSameOrigin, privateJson } from "@/lib/kingkong-auth";
import { RsvpOwnershipError, saveRsvp } from "@/lib/kingkong-rsvps";
import { rsvpFields } from "@/lib/rsvp";

const submission = z.object({ id: z.uuid(), editKey: z.uuid(), fields: rsvpFields });

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return privateJson({ error: "Invalid request origin." }, 403);
  const parsed = submission.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return privateJson({ error: "Check your name and guest counts, then try again." }, 400);
  try {
    const { fields, id, editKey } = parsed.data;
    await saveRsvp(fields, { id, editKey });
    return privateJson({ ok: true });
  } catch (error) {
    if (error instanceof RsvpOwnershipError) return privateJson({ error: "This response could not be updated from this browser." }, 409);
    return privateJson({ error: "Your RSVP could not be saved yet. Try again in a moment." }, 503);
  }
}
