import { get, put } from "@vercel/blob";
import { unstable_cache, revalidateTag } from "next/cache";
import { defaultInvitationSettings, invitationSettingsSchema, type InvitationSettings } from "@/lib/invitation-settings";

const documentPath = "kingkong/invitation.json";
const cacheTag = "kingkong-published-invitation";

export function storageRevision(etag: string) {
  // Compressed reads use a weak HTTP tag. The write API expects the matching strong tag.
  return etag.replace(/^W\//, "");
}

export function storageConfigured() {
  return Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN);
}

export async function readInvitation() {
  if (!storageConfigured()) return { settings: defaultInvitationSettings, revision: null, publishedAt: null };
  const file = await get(documentPath, { access: "private", useCache: false });
  if (!file?.stream) return { settings: defaultInvitationSettings, revision: null, publishedAt: null };
  const settings = invitationSettingsSchema.parse(await new Response(file.stream).json());
  return { settings, revision: storageRevision(file.blob.etag), publishedAt: file.blob.uploadedAt?.toISOString() ?? null };
}

export const readPublishedInvitation = unstable_cache(readInvitation, ["kingkong-invitation-v1"], {
  tags: [cacheTag], revalidate: 60,
});

export async function publishInvitation(settings: InvitationSettings, revision: string | null) {
  const saved = await put(documentPath, JSON.stringify(settings), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: Boolean(revision),
    ifMatch: revision ?? undefined,
  });
  revalidateTag(cacheTag);
  return { revision: storageRevision(saved.etag), publishedAt: new Date().toISOString() };
}

export function invitationMediaPath(name: string) {
  return `kingkong/media/${name}`;
}
