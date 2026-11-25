import { BlobNotFoundError, BlobPreconditionFailedError, head } from "@vercel/blob";
import { z } from "zod";
import { invitationSettingsSchema } from "@/lib/invitation-settings";
import { isAdmin, isSameOrigin, privateJson } from "@/lib/kingkong-auth";
import { invitationMediaPath, publishInvitation, readInvitation, storageConfigured } from "@/lib/kingkong-store";

const publishRequest = z.object({
  settings: invitationSettingsSchema,
  revision: z.string().max(120).nullable(),
});

export async function PUT(request: Request) {
  if (!isSameOrigin(request)) return privateJson({ error: "Invalid request origin." }, 403);
  if (!(await isAdmin())) return privateJson({ error: "Sign in again to publish." }, 401);
  if (!storageConfigured()) return privateJson({ error: "Invitation storage is unavailable." }, 503);

  const parsed = publishRequest.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const field = issue.path.slice(1).join(" · ");
    return privateJson({ error: field ? `${field} — ${issue.message}` : issue.message }, 400);
  }
  const { settings, revision } = parsed.data;
  const conflict = () => privateJson({ error: "Someone published a newer version. Reload the editor and try again." }, 409);
  try {
    const current = await readInvitation();
    if (revision !== current.revision) return conflict();
    const newMedia = Object.entries(settings.media)
      .filter(([key, name]) => name && name !== current.settings.media[key as keyof typeof settings.media]);
    await Promise.all(newMedia.map(([, name]) => head(invitationMediaPath(name))));
    const published = await publishInvitation(settings, revision);
    return privateJson({ ...published, settings });
  } catch (error) {
    if (error instanceof BlobPreconditionFailedError) return conflict();
    if (error instanceof BlobNotFoundError) return privateJson({ error: "A media upload is missing. Upload it again before publishing." }, 400);
    if (revision === null && (await readInvitation().catch(() => null))?.revision) return conflict();
    return privateJson({ error: "Changes could not be published. Your draft is still here." }, 503);
  }
}
