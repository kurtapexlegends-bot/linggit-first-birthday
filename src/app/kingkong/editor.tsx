"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, Check, Eye, EyeOff, Image, LayoutDashboard, LogOut, Pencil, RotateCcw, Sun, Users } from "lucide-react";
import { invitationSettingsSchema, MAX_MEDIA_BYTES, type InvitationSettings, type MediaSlot } from "@/lib/invitation-settings";
import type { RsvpEntry, RsvpFields } from "@/lib/rsvp";
import { GuestBoard } from "./rsvp-board";
import { InvitationPreview, invitationSections, type InvitationSection } from "./invitation-preview";
import { InvitationFormSections, InvitationSectionTabs, MediaPanel, type TextKey } from "./invitation-form";
import { OverviewPanel, type CopyLinkState } from "./overview-panel";

export { KingkongSignIn } from "./sign-in";

async function request(path: string, init: RequestInit) {
  const response = await fetch(`/api/kingkong/${path}`, init);
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "The request failed. Try again.");
  return result;
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong. Try again.";
}

async function prepareImage(file: File) {
  const image = await createImageBitmap(file);
  try {
    const scale = Math.min(1, 1800 / Math.max(image.width, image.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("This browser could not prepare the image.");
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.84));
    if (!blob) throw new Error("This image could not be prepared.");
    return new File([blob], blob.type === "image/webp" ? "photo.webp" : "photo.png", { type: blob.type });
  } finally {
    image.close();
  }
}

const fieldLabels: Record<string, string> = {
  nickname: "Birthday name",
  date: "Party date",
  start: "Start time (Manila)",
  end: "End time (Manila)",
  timeNote: "Time note",
  coverIntro: "Cover message",
  welcomeMessage: "Welcome message",
  venueName: "Venue name",
  hall: "Room or hall",
  address: "Address",
  landmarks: "Landmarks and parking",
  mapsUrl: "Google Maps link",
  wazeUrl: "Waze link",
  dressHeading: "Dress code heading",
  dressIntro: "Outfit instructions",
  swatches: "Color swatches",
  program: "Party program",
  deadline: "RSVP deadline",
  whatsapp: "Host WhatsApp number",
};

const nestedFieldLabels: Record<string, string> = {
  hex: "Color",
  name: "Name",
  tip: "Outfit tip",
  time: "Time",
  title: "Activity",
  description: "Description",
};

function formatValidationPath(path: PropertyKey[], fallbackLabel?: string) {
  const top = String(path[0] ?? "");
  if ((top === "swatches" || top === "program") && typeof path[1] === "number") {
    const rowLabel = top === "swatches" ? `Swatch ${path[1] + 1}` : `Activity ${path[1] + 1}`;
    const nested = typeof path[2] === "string" ? nestedFieldLabels[path[2]] : undefined;
    return nested ? `${rowLabel} · ${nested}` : rowLabel;
  }
  return fieldLabels[top] ?? fallbackLabel ?? "Invitation";
}

function mergeDraftSettings(raw: unknown, fallback: InvitationSettings): InvitationSettings {
  if (!raw || typeof raw !== "object") return fallback;
  const candidate = raw as Partial<InvitationSettings>;
  const merged: InvitationSettings = { ...fallback };
  const stringKeys: TextKey[] = [
    "nickname",
    "coverIntro",
    "welcomeMessage",
    "date",
    "start",
    "end",
    "timeNote",
    "venueName",
    "hall",
    "address",
    "landmarks",
    "mapsUrl",
    "wazeUrl",
    "dressHeading",
    "dressIntro",
    "deadline",
    "whatsapp",
  ];
  for (const key of stringKeys) {
    if (typeof candidate[key] === "string") merged[key] = candidate[key];
  }
  if (Array.isArray(candidate.swatches) && candidate.swatches.length) {
    merged.swatches = candidate.swatches.map((item, idx) => ({
      name: typeof item?.name === "string" ? item.name : fallback.swatches[idx]?.name ?? "",
      hex: typeof item?.hex === "string" ? item.hex : fallback.swatches[idx]?.hex ?? "#f5f2eb",
      tip: typeof item?.tip === "string" ? item.tip : "",
    }));
  }
  if (Array.isArray(candidate.program)) {
    merged.program = candidate.program.map((item) => ({
      time: typeof item?.time === "string" ? item.time : "",
      title: typeof item?.title === "string" ? item.title : "",
      description: typeof item?.description === "string" ? item.description : "",
    }));
  }
  if (candidate.media && typeof candidate.media === "object") {
    merged.media = {
      portrait: typeof candidate.media.portrait === "string" ? candidate.media.portrait : fallback.media.portrait,
      cover: typeof candidate.media.cover === "string" ? candidate.media.cover : fallback.media.cover,
      music: typeof candidate.media.music === "string" ? candidate.media.music : fallback.media.music,
    };
  }
  return merged;
}

const views = [
  { id: "overview", label: "Overview", mobileLabel: "Overview", icon: LayoutDashboard },
  { id: "guests", label: "Guest replies", mobileLabel: "Replies", icon: Users },
  { id: "invitation", label: "Invitation", mobileLabel: "Edit", icon: Pencil },
  { id: "media", label: "Media", mobileLabel: "Media", icon: Image },
] as const;

type View = (typeof views)[number]["id"];
const draftStorageKey = "kingkong-invitation-draft";
const dashboardView = (value?: string | null): View => views.find((entry) => entry.id === value)?.id ?? "overview";

export function KingkongEditor({
  initial,
  initialRevision,
  initialPublishedAt,
  initialEntries,
  initialView,
}: {
  initial: InvitationSettings;
  initialRevision: string | null;
  initialPublishedAt: string | null;
  initialEntries: RsvpEntry[] | null;
  initialView?: string;
}) {
  const [view, setView] = useState<View>(() => dashboardView(initialView));
  const [section, setSection] = useState<InvitationSection>("details");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedReply, setSelectedReply] = useState<RsvpEntry>();
  const [draft, setDraft] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [revision, setRevision] = useState(initialRevision);
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [publishedAt, setPublishedAt] = useState(initialPublishedAt);
  const [entries, setEntries] = useState(initialEntries);
  const [loadingEntries, setLoadingEntries] = useState(false);
  const [entriesError, setEntriesError] = useState("");
  const [linkState, setLinkState] = useState<CopyLinkState>({ kind: "idle", text: "" });
  const copyTimerRef = useRef<number>();
  const refreshSequence = useRef(0);
  const [ready, setReady] = useState(false);
  const dirty = JSON.stringify(saved) !== JSON.stringify(draft);

  useEffect(() => {
    try {
      const stored = JSON.parse(sessionStorage.getItem(draftStorageKey) ?? "null");
      if (stored?.revision === initialRevision && stored?.settings) {
        setDraft(mergeDraftSettings(stored.settings, initial));
      }
    } catch {
      // Editing is still available with storage disabled.
    }
    setReady(true);
    return () => window.clearTimeout(copyTimerRef.current);
  }, [initial, initialRevision]);

  useEffect(() => {
    if (!ready) return;
    try {
      if (!dirty) sessionStorage.removeItem(draftStorageKey);
      else sessionStorage.setItem(draftStorageKey, JSON.stringify({ revision, settings: draft }));
    } catch {
      // Keep the current draft in memory.
    }
  }, [dirty, draft, ready, revision]);

  useEffect(() => {
    if (!dirty) return;
    const warnUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warnUnload);
    return () => window.removeEventListener("beforeunload", warnUnload);
  }, [dirty]);

  const refreshReplies = useCallback(async () => {
    const sequence = ++refreshSequence.current;
    setLoadingEntries(true);
    setEntriesError("");
    try {
      const result = await request("rsvps", { cache: "no-store" });
      if (sequence === refreshSequence.current) setEntries(result.entries);
    } catch (cause) {
      if (sequence === refreshSequence.current) setEntriesError(errorMessage(cause));
    } finally {
      if (sequence === refreshSequence.current) setLoadingEntries(false);
    }
  }, []);

  useEffect(() => {
    if (view !== "overview" && view !== "guests") return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") void refreshReplies();
    }, 60_000);
    return () => window.clearInterval(timer);
  }, [view, refreshReplies]);

  useEffect(() => {
    const followHistory = () => {
      const next = dashboardView(new URL(window.location.href).searchParams.get("view"));
      setView(next);
      setSelectedReply(undefined);
      if (next === "guests" || next === "overview") void refreshReplies();
    };
    window.addEventListener("popstate", followHistory);
    return () => window.removeEventListener("popstate", followHistory);
  }, [refreshReplies]);

  function selectView(next: View) {
    if (next !== view) {
      const url = new URL(window.location.href);
      if (next === "overview") url.searchParams.delete("view");
      else url.searchParams.set("view", next);
      url.hash = "";
      window.history.pushState(null, "", url);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    setView(next);
    setSelectedReply(undefined);
    if (next === "guests" || next === "overview") void refreshReplies();
  }

  async function saveReply(fields: RsvpFields, id: string, create: boolean) {
    const { entry }: { entry: RsvpEntry } = await request("rsvps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, create, fields }),
    });
    setEntries((current) => (current ? [entry, ...current.filter((item) => item.id !== entry.id)] : current));
    await refreshReplies();
  }

  async function deleteReply(id: string) {
    await request("rsvps", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setEntries((current) => (current ? current.filter((item) => item.id !== id) : current));
    await refreshReplies();
  }

  async function copyGuestLink() {
    const link = new URL("/#rsvp", window.location.origin).href;
    window.clearTimeout(copyTimerRef.current);
    try {
      await navigator.clipboard.writeText(link);
      setLinkState({ kind: "copied", text: "RSVP link copied." });
      copyTimerRef.current = window.setTimeout(() => {
        setLinkState({ kind: "idle", text: "" });
      }, 2500);
    } catch {
      setLinkState({ kind: "fallback", text: link });
    }
  }

  function handleTextChange(key: TextKey, value: string) {
    setDraft((current) => ({ ...current, [key]: value }));
    setError("");
  }

  function setMedia(slot: MediaSlot, name: string) {
    setDraft((current) => ({ ...current, media: { ...current.media, [slot]: name } }));
  }

  async function upload(slot: MediaSlot, file?: File) {
    if (!file) return;
    setError("");
    setMessage("");
    setBusy(slot);
    try {
      const media = slot === "music" ? file : await prepareImage(file);
      if (media.size > MAX_MEDIA_BYTES) throw new Error("Choose a file under 4 MB.");
      const data = new FormData();
      data.set("slot", slot);
      data.set("file", media);
      const result = await request("upload", { method: "POST", body: data });
      setMedia(slot, result.name);
      setMessage("Upload ready. Publish to show it to guests.");
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setBusy("");
    }
  }

  async function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !dirty) return;
    const validated = invitationSettingsSchema.safeParse(draft);
    if (!validated.success) {
      const first = validated.error.issues[0];
      const topKey = String(first.path[0] ?? "");
      const fullPath = first.path.map(String).join(".");
      const group = invitationSections.find((item) => item.keys.some((field) => field === topKey));
      if (group) {
        if (view !== "invitation") selectView("invitation");
        setSection(group.id);
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            const target =
              document.querySelector<HTMLElement>(`[data-setting="${CSS.escape(fullPath)}"] :is(input,textarea)`) ??
              document.querySelector<HTMLElement>(`[data-setting="${CSS.escape(topKey)}"] :is(input,textarea)`);
            target?.focus();
          });
        });
      }
      const label = formatValidationPath(first.path, group?.label);
      setError(`${label}. ${first.message}`);
      return;
    }
    setBusy("publish");
    setError("");
    setMessage("");
    try {
      const result = await request("settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: validated.data, revision }),
      });
      setRevision(result.revision);
      setPublishedAt(result.publishedAt);
      setSaved(result.settings);
      setDraft(result.settings);
      setMessage("Published. Guests will see these changes on their next visit.");
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setBusy("");
    }
  }

  async function signOut() {
    setBusy("logout");
    try {
      await request("session", { method: "DELETE" });
      try {
        sessionStorage.removeItem(draftStorageKey);
      } catch {
        // Storage is optional
      }
      location.replace("/kingkong");
    } catch (cause) {
      setError(errorMessage(cause));
      setBusy("");
    }
  }

  function discardDraft() {
    if (!window.confirm("Discard your unpublished invitation changes?")) return;
    setDraft(saved);
    setError("");
    setMessage("Draft discarded.");
  }

  const activeViewLabel = views.find((item) => item.id === view)?.label ?? "Party dashboard";

  return (
    <div className="min-h-[100svh] bg-[#fffbf2] text-[#2e221d] grid grid-cols-1 md:grid-cols-[248px_minmax(0,1fr)]">
      {/* Desktop Sticky Left Sidebar / Mobile Compact Top Nav */}
      <aside className="bg-[#fffdf8] border-b md:border-b-0 md:border-r border-[#e7dcc8] md:sticky md:top-0 md:h-[100svh] flex flex-col justify-between p-3.5 sm:p-4 gap-3 z-30">
        <div className="space-y-3.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-10 h-10 rounded-2xl bg-[#fbe07b]/75 border border-[#e3bf75]/60 text-[#9e3359] flex items-center justify-center shrink-0">
                <Sun className="w-5 h-5 stroke-[2.3]" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <strong className="block font-storybook text-base font-bold text-[#2e221d] truncate">
                  {saved.nickname} turns one
                </strong>
                <span className="block text-[11px] font-bold text-[#645147] truncate">Party dashboard</span>
              </div>
            </div>

            <button
              type="button"
              disabled={Boolean(busy)}
              onClick={signOut}
              className="md:hidden inline-flex items-center gap-1.5 min-h-[38px] px-3 rounded-full bg-white border border-[#dfd2be] text-xs font-extrabold text-[#645147] hover:text-[#2e221d] shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
              Sign out
            </button>
          </div>

          <nav aria-label="Dashboard sections" className="grid grid-cols-4 md:grid-cols-1 gap-1.5">
            {views.map(({ id, label, mobileLabel, icon: Icon }) => {
              const active = view === id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-current={active ? "page" : undefined}
                  onClick={() => selectView(id)}
                  className={`relative flex flex-col sm:flex-row md:flex-row items-center justify-center md:justify-between gap-1 sm:gap-2 min-h-[48px] md:min-h-[42px] px-1.5 sm:px-2.5 md:px-3.5 py-1.5 md:py-0 rounded-xl text-[11px] sm:text-xs font-extrabold transition-colors ${
                    active
                      ? "bg-[#fadce6] text-[#9e3359]"
                      : "text-[#645147] hover:bg-[#fff6e2] hover:text-[#2e221d]"
                  }`}
                >
                  <span className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-2 min-w-0">
                    <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span className="md:hidden truncate">{mobileLabel}</span>
                    <span className="hidden md:inline truncate">{label}</span>
                  </span>
                  {id === "guests" && entries && (
                    <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-white/90 border border-[#e7dcc8] text-[10px] font-extrabold text-[#2e221d]">
                      {entries.length}
                    </span>
                  )}
                  {id === "guests" && entries && (
                    <span className="sm:hidden absolute top-1.5 right-1.5 px-1.5 py-0.2 rounded-full bg-white/95 border border-[#e7dcc8] text-[9px] font-extrabold text-[#2e221d]">
                      {entries.length}
                    </span>
                  )}
                  {id === "invitation" && dirty && (
                    <span
                      className="absolute top-2 right-2 md:static inline-block w-2 h-2 rounded-full bg-[#c9841a]"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="hidden md:flex flex-col gap-2 pt-4 border-t border-[#e7dcc8]/80">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between gap-2 min-h-[40px] px-3.5 rounded-xl bg-[#fff8ea] hover:bg-[#fbe07b]/40 border border-[#e7dcc8] text-xs font-extrabold text-[#2e221d] transition-colors"
          >
            <span>View live site</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#9e3359]" aria-hidden="true" />
          </a>
          <button
            type="button"
            disabled={Boolean(busy)}
            onClick={signOut}
            className="flex items-center gap-2 min-h-[40px] px-3.5 rounded-xl text-xs font-extrabold text-[#645147] hover:bg-[#fadce6]/50 hover:text-[#9e3359] transition-colors disabled:opacity-45"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 bg-[#fffbf2]/90 backdrop-blur-md border-b border-[#e7dcc8] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="font-storybook text-lg sm:text-xl font-bold text-[#2e221d] truncate">
              {activeViewLabel}
            </h1>
            {dirty && (
              <span className="px-2.5 py-1 rounded-full bg-[#fbe07b]/80 border border-[#e3bf75] text-[11px] font-extrabold text-[#70451e] shrink-0">
                Unpublished changes
              </span>
            )}
          </div>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 min-h-[38px] px-4 rounded-full bg-white hover:bg-[#f8eed9] border border-[#dfd2be] text-xs font-extrabold text-[#2e221d] transition-colors shrink-0"
          >
            View invitation
            <ArrowUpRight className="w-3.5 h-3.5 text-[#9e3359]" aria-hidden="true" />
          </a>
        </header>

        <main className="flex-1 w-full max-w-[1320px] mx-auto px-4 sm:px-8 py-6 sm:py-8">
          {error && (view === "overview" || view === "guests") && (
            <p
              role="alert"
              className="mb-5 rounded-2xl bg-[#fadce6]/65 border border-[#c94b77]/35 px-4 py-3 text-xs font-bold text-[#9e3359]"
            >
              {error}
            </p>
          )}

          {view === "overview" && (
            <OverviewPanel
              saved={saved}
              publishedAt={publishedAt}
              entries={entries}
              entriesError={entriesError}
              linkState={linkState}
              onSelectView={selectView}
              onSelectReply={setSelectedReply}
              onCopyGuestLink={() => void copyGuestLink()}
              onDismissLinkFallback={() => setLinkState({ kind: "idle", text: "" })}
            />
          )}

          {view === "guests" && (
            <GuestBoard
              entries={entries}
              initialReply={selectedReply}
              loading={loadingEntries}
              error={entriesError}
              onRefresh={() => void refreshReplies()}
              onSave={saveReply}
              onDelete={deleteReply}
            />
          )}

          <form onSubmit={publish} noValidate hidden={view !== "invitation" && view !== "media"} className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#9e3359]">
                  {view === "media" ? "Storybook assets" : "Storybook copy & details"}
                </span>
                <h2 className="font-storybook text-2xl sm:text-3xl font-bold text-[#2e221d] mt-0.5">
                  {view === "media" ? "Media" : "Invitation"}
                </h2>
                <p className="text-sm font-semibold text-[#645147] mt-1">
                  {view === "media"
                    ? "Manage the portrait, opening cover, and background track guests see and hear."
                    : "Edit sections and review the live Pop-Up Theater preview before publishing."}
                </p>
              </div>

              {view === "invitation" && (
                <button
                  type="button"
                  aria-expanded={previewOpen}
                  aria-controls="invitation-preview"
                  onClick={() => setPreviewOpen((open) => !open)}
                  className="xl:hidden inline-flex items-center gap-2 min-h-[40px] px-4 rounded-full bg-white hover:bg-[#f8eed9] border border-[#dfd2be] text-xs font-extrabold text-[#2e221d] self-start transition-colors"
                >
                  {previewOpen ? <EyeOff className="w-4 h-4 text-[#9e3359]" aria-hidden="true" /> : <Eye className="w-4 h-4 text-[#9e3359]" aria-hidden="true" />}
                  {previewOpen ? "Hide preview" : "Preview draft"}
                </button>
              )}
            </div>

            {view === "invitation" && <InvitationSectionTabs section={section} onSelectSection={setSection} />}

            <fieldset disabled={!ready || busy === "publish" || busy === "logout"} className="border-0 p-0 m-0 min-w-0">
              {view === "invitation" && (
                <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px] gap-6 items-start">
                  <InvitationFormSections
                    draft={draft}
                    section={section}
                    setDraft={setDraft}
                    onTextChange={handleTextChange}
                  />
                  <div
                    id="invitation-preview"
                    data-shown={previewOpen}
                    className={`${previewOpen ? "block" : "hidden"} xl:block xl:sticky xl:top-20`}
                  >
                    <InvitationPreview draft={draft} section={section} dirty={dirty} />
                  </div>
                </div>
              )}

              {view === "media" && (
                <MediaPanel
                  draft={draft}
                  saved={saved}
                  busy={busy}
                  onUpload={(slot, file) => void upload(slot, file)}
                  onRestoreDefault={(slot) => setMedia(slot, "")}
                />
              )}
            </fieldset>

            {/* Sticky Bottom Publish Bar */}
            <div className="sticky bottom-3 z-20 rounded-2xl border border-[#e7dcc8] bg-[#fffdf8]/95 backdrop-blur-md px-4 sm:px-5 py-3 shadow-md flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                {error ? (
                  <p role="alert" className="text-xs font-extrabold text-[#9e3359]">
                    {error}
                  </p>
                ) : (
                  <p role="status" className="text-xs font-bold text-[#645147]">
                    {message || (dirty ? "You have unpublished changes ready to go live." : "All published changes are live.")}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                {dirty && (
                  <button
                    type="button"
                    disabled={Boolean(busy)}
                    onClick={discardDraft}
                    className="inline-flex items-center gap-1.5 min-h-[40px] px-4 rounded-full bg-white hover:bg-[#fadce6]/60 border border-[#dfd2be] text-xs font-extrabold text-[#9e3359] transition-colors disabled:opacity-45"
                  >
                    <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                    Discard draft
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!ready || !dirty || Boolean(busy)}
                  className="inline-flex items-center gap-1.5 min-h-[42px] px-5 rounded-full bg-[#c94b77] hover:bg-[#9e3359] text-xs font-extrabold text-[#fffbf2] shadow-sm transition-colors disabled:opacity-45"
                >
                  <Check className="w-4 h-4" aria-hidden="true" />
                  {busy === "publish" ? "Publishing…" : "Publish changes"}
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
