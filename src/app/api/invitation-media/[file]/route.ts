import { get } from "@vercel/blob";
import { mediaFilePattern } from "@/lib/invitation-settings";
import { isAdmin, privateJson } from "@/lib/kingkong-auth";
import { invitationMediaPath, readPublishedInvitation, storageConfigured } from "@/lib/kingkong-store";

export async function GET(request: Request, context: { params: Promise<{ file: string }> }) {
  const { file } = await context.params;
  if (!mediaFilePattern.test(file) || !storageConfigured()) return privateJson({ error: "Media not found." }, 404);
  try {
    const { settings } = await readPublishedInvitation();
    const published = Object.values(settings.media).includes(file);
    if (!published && !(await isAdmin())) return privateJson({ error: "Media not found." }, 404);
    const media = await get(invitationMediaPath(file), { access: "private" });
    if (!media?.stream) return privateJson({ error: "Media not found." }, 404);
    const headers = new Headers({
      "Content-Type": media.blob.contentType ?? "application/octet-stream",
      "Cache-Control": published ? "public, max-age=300, s-maxage=300" : "private, no-store",
      "X-Content-Type-Options": "nosniff",
    });
    const length = media.headers.has("content-encoding") ? null : media.blob.size;
    if (length !== null && length > 0) headers.set("Content-Length", String(length));
    if (file.endsWith(".mp3") && length !== null && length > 0) {
      headers.set("Accept-Ranges", "bytes");
      const range = request.headers.get("range");
      if (range) {
        const match = /^bytes=(\d*)-(\d*)$/.exec(range);
        const start = match?.[1] ? Number(match[1]) : Math.max(0, length - Number(match?.[2]));
        const end = match?.[1] && match[2] ? Math.min(length - 1, Number(match[2])) : length - 1;
        if (!match || !Number.isSafeInteger(start) || start >= length || start > end) {
          await media.stream.cancel();
          return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${length}`, "Cache-Control": "private, no-store" } });
        }
        const contents = await new Response(media.stream).arrayBuffer();
        headers.set("Content-Length", String(end - start + 1));
        headers.set("Content-Range", `bytes ${start}-${end}/${length}`);
        return new Response(contents.slice(start, end + 1), { status: 206, headers });
      }
    }
    return new Response(media.stream, { headers });
  } catch {
    return privateJson({ error: "Media is temporarily unavailable." }, 503);
  }
}
