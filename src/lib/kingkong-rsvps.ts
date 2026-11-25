import { createHash, randomUUID } from "node:crypto";
import { BlobPreconditionFailedError, get, put } from "@vercel/blob";
import { storageConfigured, storageRevision } from "@/lib/kingkong-store";
import type { RsvpEntry, RsvpFields } from "@/lib/rsvp";

const path = "kingkong/rsvps.json";
type StoredEntry = RsvpEntry & { owner?: string };

export class RsvpOwnershipError extends Error {}
export class RsvpNotFoundError extends Error {}

async function readEntries() {
  if (!storageConfigured()) throw new Error("RSVP storage is unavailable.");
  const file = await get(path, { access: "private", useCache: false });
  if (!file?.stream) return { entries: [] as StoredEntry[], revision: "" };
  const entries: StoredEntry[] = await new Response(file.stream).json();
  return { entries, revision: storageRevision(file.blob.etag) };
}

function publicEntry(entry: StoredEntry): RsvpEntry {
  const { owner: _owner, ...details } = entry;
  return details;
}

export async function readRsvps() {
  const { entries } = await readEntries();
  return entries.map(publicEntry).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function saveRsvp(fields: RsvpFields, options: { id?: string; editKey?: string; allowCreate?: boolean }) {
  const id = options.id ?? randomUUID();
  const owner = options.editKey ? createHash("sha256").update(options.editKey).digest("hex") : undefined;
  for (let attempt = 0; attempt < 5; attempt++) {
    const { entries, revision } = await readEntries();
    const index = entries.findIndex((entry) => entry.id === id);
    const existing = entries[index];
    if (existing && owner && existing.owner !== owner) throw new RsvpOwnershipError();
    if (!existing && options.id && !owner && !options.allowCreate) throw new RsvpNotFoundError();
    if (existing && Object.keys(fields).every((key) => fields[key as keyof RsvpFields] === existing[key as keyof RsvpFields])) {
      return publicEntry(existing);
    }

    const now = new Date().toISOString();
    const entry: StoredEntry = {
      ...fields,
      id,
      owner: existing?.owner ?? owner,
      source: existing?.source ?? (owner ? "invitation" : "manual"),
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    const updated = existing ? entries.map((item) => item.id === id ? entry : item) : [...entries, entry];
    try {
      await put(path, JSON.stringify(updated), {
        access: "private", contentType: "application/json", addRandomSuffix: false,
        allowOverwrite: Boolean(revision), ifMatch: revision || undefined,
      });
      return publicEntry(entry);
    } catch (error) {
      const competingCreate = !revision && (await readEntries().catch(() => null))?.revision;
      if (!(error instanceof BlobPreconditionFailedError) && !competingCreate) throw error;
      await new Promise((resolve) => setTimeout(resolve, 40 * (attempt + 1) + Math.random() * 35));
    }
  }
  throw new Error("The guest list is busy. Try again.");
}
