import { randomUUID } from "node:crypto";
import { put } from "@vercel/blob";
import { MAX_MEDIA_BYTES } from "@/lib/invitation-settings";
import { isAdmin, isSameOrigin, privateJson } from "@/lib/kingkong-auth";
import { invitationMediaPath, storageConfigured } from "@/lib/kingkong-store";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return privateJson({ error: "Invalid request origin." }, 403);
  if (!(await isAdmin())) return privateJson({ error: "Sign in again to upload." }, 401);
  if (!storageConfigured()) return privateJson({ error: "Invitation storage is unavailable." }, 503);
  const body = await request.formData().catch(() => null);
  const file = body?.get("file");
  const slot = body?.get("slot");
  if (!(file instanceof File) || !file.size || (slot !== "cover" && slot !== "portrait" && slot !== "music")) {
    return privateJson({ error: "Choose a file and a media slot." }, 400);
  }
  if (file.size > MAX_MEDIA_BYTES) return privateJson({ error: "Choose a file under 4 MB." }, 413);

  const header = Buffer.from(await file.slice(0, 12).arrayBuffer());
  const fileType = detectedType(header, slot === "music");
  if (!fileType) return privateJson({ error: slot === "music" ? "Choose an MP3 recording." : "Choose a JPEG, PNG, or WebP image." }, 415);
  const name = `${randomUUID()}.${fileType.extension}`;
  try {
    await put(invitationMediaPath(name), file, { access: "private", contentType: fileType.contentType });
    return privateJson({ name });
  } catch {
    return privateJson({ error: "The upload could not be saved. Try again." }, 503);
  }
}

function detectedType(header: Buffer, music: boolean) {
  if (music) {
    const id3 = header.toString("ascii", 0, 3) === "ID3";
    const frame = header[0] === 0xff && (header[1] & 0xe0) === 0xe0;
    return id3 || frame ? { extension: "mp3", contentType: "audio/mpeg" } : null;
  }
  if (header.subarray(0, 8).equals(Buffer.from("89504e470d0a1a0a", "hex"))) return { extension: "png", contentType: "image/png" };
  if (header.subarray(0, 3).equals(Buffer.from("ffd8ff", "hex"))) return { extension: "jpg", contentType: "image/jpeg" };
  if (header.toString("ascii", 0, 4) === "RIFF" && header.toString("ascii", 8, 12) === "WEBP") {
    return { extension: "webp", contentType: "image/webp" };
  }
  return null;
}
