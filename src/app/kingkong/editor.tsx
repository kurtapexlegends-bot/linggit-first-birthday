"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, ArrowUpRight, CalendarDays, Check, Clipboard, Eye, EyeOff, Image, ImagePlus, LayoutDashboard, LogOut, MapPin, Music2, Pencil, Plus, Sun, Trash2, Users } from "lucide-react";
import { invitationMediaUrl, invitationSettingsSchema, MAX_MEDIA_BYTES, type InvitationSettings, type MediaSlot } from "@/lib/invitation-settings";
import type { RsvpEntry, RsvpFields } from "@/lib/rsvp";
import { formatHeadcount, GuestBoard, guestTotals, manilaTimestamp } from "./rsvp-board";
import { InvitationPreview, invitationSections, type InvitationSection } from "./invitation-preview";
import styles from "./editor.module.css";

async function request(path: string, init: RequestInit) {
  const response = await fetch(`/api/kingkong/${path}`, init);
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "The request failed. Try again.");
  return result;
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong. Try again.";
}

export function KingkongSignIn() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const key = new FormData(event.currentTarget).get("key");
    setBusy(true);
    setError("");
    try {
      await request("session", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key }),
      });
      location.replace(location.pathname + location.search);
    } catch (cause) {
      setError(errorMessage(cause));
      setBusy(false);
    }
  }

  return <div className={styles.signInShell}>
    <main className={styles.signIn}>
      <div className={styles.signInContent}>
        <span className={styles.brandMark}><Sun size={22} aria-hidden="true" /></span>
        <h1>Party dashboard</h1>
        <p>Enter your access key to manage the invitation and guest replies.</p>
        <form method="post" onSubmit={signIn}>
          <label>Access key <input name="key" type="password" autoComplete="current-password" required maxLength={128} /></label>
          {error && <p className={styles.error} role="alert">{error}</p>}
          <button className="button button-primary" disabled={!ready || busy}>{busy ? "Signing in…" : "Sign in"}</button>
        </form>
        <a className="text-link" href="/"><ArrowLeft size={15} aria-hidden="true" /> Back to the invitation</a>
      </div>
    </main>
    <img className={styles.signInArt} src="/images/sunshine-storybook.webp" alt="" />
  </div>;
}

type TextKey = Exclude<keyof InvitationSettings, "swatches" | "program" | "media">;
const mediaSlots: { key: MediaSlot; title: string; hint: string }[] = [
  { key: "portrait", title: "Birthday portrait", hint: "Portrait photos work best." },
  { key: "cover", title: "Cover artwork", hint: "Use a wide image with the subject on the right." },
  { key: "music", title: "Background music", hint: "MP3, up to 4 MB." },
];

function Panel({ id, title, hidden, children }: { id: string; title: string; hidden?: boolean; children: ReactNode }) {
  return <section id={id} className={styles.panel} hidden={hidden}><h2>{title}</h2>{children}</section>;
}

async function prepareImage(file: File) {
  // Decode and re-encode phone images before the request hits Vercel's body limit.
  const image = await createImageBitmap(file);
  try {
    const scale = Math.min(1, 1800 / Math.max(image.width, image.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("This browser could not prepare the image.");
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", .84));
    if (!blob) throw new Error("This image could not be prepared.");
    return new File([blob], blob.type === "image/webp" ? "photo.webp" : "photo.png", { type: blob.type });
  } finally {
    image.close();
  }
}

const views = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "guests", label: "Guest replies", icon: Users },
  { id: "invitation", label: "Invitation", icon: Pencil },
  { id: "media", label: "Media", icon: Image },
] as const;
type View = (typeof views)[number]["id"];
const draftStorageKey = "kingkong-invitation-draft";
const dashboardView = (value?: string | null): View => views.find((entry) => entry.id === value)?.id ?? "overview";
const eventDate = new Intl.DateTimeFormat("en-PH", {
  weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "Asia/Manila",
});

export function KingkongEditor({ initial, initialRevision, initialPublishedAt, initialEntries, initialView }: {
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
  const [linkFeedback, setLinkFeedback] = useState("");
  const refreshSequence = useRef(0);
  const [ready, setReady] = useState(false);
  const dirty = JSON.stringify(saved) !== JSON.stringify(draft);
  const totals = guestTotals(entries ?? []);

  useEffect(() => {
    try {
      const stored = JSON.parse(sessionStorage.getItem(draftStorageKey) ?? "null");
      if (stored?.revision === initialRevision) {
        const restored = invitationSettingsSchema.safeParse(stored.settings);
        if (restored.success) setDraft(restored.data);
      }
    } catch {
      // Editing is still available with storage disabled.
    }
    setReady(true);
  }, [initialRevision]);

  useEffect(() => {
    if (!ready) return;
    try {
      if (!dirty) sessionStorage.removeItem(draftStorageKey);
      else if (invitationSettingsSchema.safeParse(draft).success) {
        sessionStorage.setItem(draftStorageKey, JSON.stringify({ revision, settings: draft }));
      }
    } catch {
      // Keep the current draft in memory.
    }
  }, [dirty, draft, ready, revision]);

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
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, create, fields }),
    });
    setEntries((current) => current ? [entry, ...current.filter((item) => item.id !== entry.id)] : current);
    await refreshReplies();
  }

  async function copyGuestLink() {
    const link = new URL("/#rsvp", window.location.origin).href;
    try {
      await navigator.clipboard.writeText(link);
      setLinkFeedback("RSVP link copied.");
    } catch {
      setLinkFeedback(link);
    }
  }

  function setText(key: TextKey, value: string) {
    setDraft((current) => ({ ...current, [key]: value }));
    setError("");
  }

  function field(key: TextKey, label: string, options: { type?: string; multiline?: boolean; limit?: number; optional?: boolean } = {}) {
    return (
      <label data-setting={key} className={options.multiline ? styles.full : undefined}>
        {label}
        {options.multiline
          ? <textarea rows={3} value={draft[key]} onChange={(event) => setText(key, event.target.value)} maxLength={options.limit} required={!options.optional} />
          : <input type={options.type ?? "text"} value={draft[key]} onChange={(event) => setText(key, event.target.value)} maxLength={options.limit} required={!options.optional} />}
      </label>
    );
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
      const key = String(first.path[0] ?? "");
      const group = invitationSections.find((item) => item.keys.some((field) => field === key));
      if (group) {
        selectView("invitation");
        setSection(group.id);
        window.requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-setting="${CSS.escape(key)}"] :is(input,textarea)`)?.focus());
      }
      const fieldLabel = document.querySelector(`[data-setting="${CSS.escape(key)}"]`)?.firstChild?.textContent?.trim();
      setError(`${fieldLabel || group?.label || "Invitation"}. ${first.message}`);
      return;
    }
    setBusy("publish");
    setError("");
    setMessage("");
    try {
      const result = await request("settings", {
        method: "PUT", headers: { "Content-Type": "application/json" },
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
      try { sessionStorage.removeItem(draftStorageKey); } catch { /* storage is optional */ }
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

  return (
    <div className={styles.editor}>
      <aside className={styles.rail}>
        <div className={styles.brand}>
          <span className={styles.brandMark}><Sun size={21} aria-hidden="true" /></span>
          <div><strong>{saved.nickname} turns one</strong><span>Party dashboard</span></div>
        </div>
        <nav className={styles.navigation} aria-label="Dashboard sections">
          {views.map(({ id, label, icon: Icon }) => (
            <button key={id} type="button" aria-current={view === id ? "page" : undefined} onClick={() => selectView(id)}>
              <Icon size={17} aria-hidden="true" /> {label}
            </button>
          ))}
        </nav>
        <button className={styles.signOut} type="button" disabled={Boolean(busy)} onClick={signOut}><LogOut size={17} aria-hidden="true" /> Sign out</button>
      </aside>
      <main className={styles.workspace}>
        <header className={styles.header}>
          <h1>Party dashboard</h1>
          <div>
            {dirty && <span className={styles.draftBadge}>Unpublished changes</span>}
            <a className={`button button-outline ${styles.liveLink}`} href="/" target="_blank" rel="noreferrer">View invitation <ArrowUpRight size={15} aria-hidden="true" /></a>
          </div>
        </header>
        <div className={styles.content}>
      {error && (view === "overview" || view === "guests") && <p role="alert" className={styles.error}>{error}</p>}

      {view === "overview" && <section className={styles.dashboardSection} aria-labelledby="overview-title">
        <div className={styles.overviewHero}>
          <div>
            <h2 id="overview-title">Party overview</h2>
          </div>
          <div className={styles.overviewActions}>
            <button type="button" className="button button-primary" onClick={() => selectView("guests")}>View guest replies</button>
            <button type="button" className="button button-outline" onClick={copyGuestLink}><Clipboard size={16} aria-hidden="true" /> Copy RSVP link</button>
            {linkFeedback && <p role="status">{linkFeedback}</p>}
          </div>
        </div>
        <div className={styles.metrics} aria-label="RSVP totals">
          <div><span>Expected guests</span><strong>{entries ? totals.adults + totals.children : "—"}</strong><small>{entries ? formatHeadcount(totals.adults, totals.children) : "Guest list unavailable"}</small></div>
          <div><span>Attending replies</span><strong>{entries ? totals.attending : "—"}</strong></div>
          <div><span>Declined replies</span><strong>{entries ? totals.declined : "—"}</strong></div>
        </div>
        {entriesError && <p role="alert" className={styles.error}>{entriesError}</p>}
        <div className={styles.overviewColumns}>
          <section className={styles.activity}>
            <div className={styles.sectionHeading}><h2>Recent replies</h2><button className="text-link" type="button" onClick={() => selectView("guests")}>See all <ArrowUpRight size={15} aria-hidden="true" /></button></div>
            {entries?.length ? <ul className={styles.recent}>
              {entries.slice(0, 4).map((entry) => <li key={entry.id}><button type="button" onClick={() => { selectView("guests"); setSelectedReply(entry); }}>
                <span><strong>{entry.name}</strong><small>{manilaTimestamp(entry.updatedAt)}</small></span>
                <span className={styles.replyStatus} data-attending={entry.attending}>{entry.attending ? "Attending" : "Declined"}</span>
              </button></li>)}
            </ul> : <div className={styles.activityEmpty}><span><Users size={21} aria-hidden="true" /></span><h3>{entries === null ? "Replies could not load" : "No RSVPs yet"}</h3><p>{entries === null ? "Open Guest replies to retry." : "Guest names and responses will appear here."}</p></div>}
          </section>
          <section className={styles.eventCard} aria-labelledby="event-summary-title">
            <img src={invitationMediaUrl(saved.media.cover) || "/images/sunshine-phone.webp"} alt="" />
            <div>
              <h2 id="event-summary-title">{saved.nickname}’s first birthday</h2>
              <p><CalendarDays size={15} aria-hidden="true" />{eventDate.format(new Date(`${saved.date}T12:00:00+08:00`))}</p>
              <p><MapPin size={15} aria-hidden="true" />{saved.venueName}</p>
              <div className={styles.eventFooter}>
                <span>{publishedAt ? `Published ${manilaTimestamp(publishedAt)}` : "Invitation live"}</span>
                <button className="text-link" type="button" onClick={() => selectView("invitation")}>Edit invitation <Pencil size={14} aria-hidden="true" /></button>
              </div>
            </div>
          </section>
        </div>
      </section>}
      {view === "guests" && <GuestBoard entries={entries} initialReply={selectedReply} loading={loadingEntries} error={entriesError} onRefresh={() => void refreshReplies()} onSave={saveReply} />}

      <form onSubmit={publish} noValidate hidden={view !== "invitation" && view !== "media"}>
        <div className={styles.viewHeading}>
          <div><h2>{view === "media" ? "Media" : "Invitation"}</h2>
          <p>{view === "media" ? "Manage the photos and music guests see and hear." : "Review your changes before publishing them to guests."}</p></div>
          {view === "invitation" && <button type="button" className={`button button-outline ${styles.previewToggle}`} aria-expanded={previewOpen} aria-controls="invitation-preview" onClick={() => setPreviewOpen(!previewOpen)}>
            {previewOpen ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />} {previewOpen ? "Hide preview" : "Preview draft"}
          </button>}
        </div>
        {view === "invitation" && <nav aria-label="Invitation sections" className={styles.formNavigation}>
          {invitationSections.map(({ id, label }) => <button key={id} type="button" aria-pressed={section === id} onClick={() => setSection(id)}>{label}</button>)}
        </nav>}
        <fieldset className={styles.fields} disabled={!ready || busy === "publish" || busy === "logout"}>
          <div className={styles.invitationWorkbench} hidden={view !== "invitation"}>
          <div className={styles.fields}>
          <Panel id="details" title="Cover & party details" hidden={section !== "details"}>
            <div className={styles.grid}>
              {field("nickname", "Birthday name", { limit: 30 })}
              {field("date", "Party date", { type: "date" })}
              {field("start", "Start time (Manila)", { type: "time" })}
              {field("end", "End time (Manila)", { type: "time" })}
              {field("timeNote", "Time note", { limit: 150, optional: true })}
              {field("coverIntro", "Cover message", { multiline: true, limit: 180 })}
              {field("welcomeMessage", "Welcome message", { multiline: true, limit: 450 })}
            </div>
          </Panel>

          <Panel id="location" title="Venue and directions" hidden={section !== "location"}>
            <div className={styles.grid}>
              {field("venueName", "Venue name", { limit: 140 })}
              {field("hall", "Room or hall", { limit: 140, optional: true })}
              {field("address", "Address", { multiline: true, limit: 240 })}
              {field("landmarks", "Landmarks and parking", { multiline: true, limit: 350, optional: true })}
              {field("mapsUrl", "Google Maps link", { type: "url", optional: true })}
              {field("wazeUrl", "Waze link", { type: "url", optional: true })}
            </div>
          </Panel>

          <Panel id="outfits" title="Dress code" hidden={section !== "outfits"}>
            <div className={styles.grid}>
              {field("dressHeading", "Heading", { limit: 62 })}
              {field("dressIntro", "Outfit instructions", { multiline: true, limit: 300 })}
            </div>
            <div className={styles.list}>
              {draft.swatches.map((swatch, index) => (
                <div key={index} className={styles.swatch}>
                  <label>Color <input type="color" value={swatch.hex} onChange={({ target }) => setDraft((current) => ({ ...current, swatches: current.swatches.map((item, i) => i === index ? { ...item, hex: target.value } : item) }))} /></label>
                  <label>Name <input required maxLength={32} value={swatch.name} onChange={({ target }) => setDraft((current) => ({ ...current, swatches: current.swatches.map((item, i) => i === index ? { ...item, name: target.value } : item) }))} /></label>
                  <label>Outfit tip <input maxLength={150} value={swatch.tip} onChange={({ target }) => setDraft((current) => ({ ...current, swatches: current.swatches.map((item, i) => i === index ? { ...item, tip: target.value } : item) }))} /></label>
                  <button type="button" className={styles.remove} aria-label={`Remove color ${index + 1}`} disabled={draft.swatches.length <= 1} onClick={() => setDraft((current) => ({ ...current, swatches: current.swatches.filter((_, i) => i !== index) }))}><Trash2 size={17} /></button>
                </div>
              ))}
            </div>
            <button type="button" className="text-link" disabled={draft.swatches.length >= 6} onClick={() => setDraft((current) => ({ ...current, swatches: [...current.swatches, { name: "", hex: "#f5f2eb", tip: "" }] }))}><Plus size={16} /> Add color</button>
          </Panel>

          <Panel id="schedule" title="Party program" hidden={section !== "schedule"}>
            <div className={styles.list}>
              {draft.program.map((item, index) => (
                <div className={styles.program} key={index}>
                  {(["time", "title", "description"] as const).map((key) => (
                    <label key={key}>{key === "time" ? "Time" : key === "title" ? "Activity" : "Description"}
                      <input value={item[key]} required={key !== "description"} maxLength={key === "time" ? 26 : key === "title" ? 100 : 250} onChange={({ target }) => setDraft((current) => ({ ...current, program: current.program.map((entry, i) => i === index ? { ...entry, [key]: target.value } : entry) }))} />
                    </label>
                  ))}
                  <button type="button" className={styles.remove} aria-label={`Remove activity ${index + 1}`} onClick={() => setDraft((current) => ({ ...current, program: current.program.filter((_, i) => i !== index) }))}><Trash2 size={17} /></button>
                </div>
              ))}
            </div>
            <button type="button" className="text-link" disabled={draft.program.length >= 14} onClick={() => setDraft((current) => ({ ...current, program: [...current.program, { time: "", title: "", description: "" }] }))}><Plus size={16} /> Add activity</button>
          </Panel>

          <Panel id="contact" title="RSVP settings" hidden={section !== "contact"}>
            <div className={styles.grid}>
              {field("deadline", "RSVP deadline", { type: "date" })}
              {field("whatsapp", "Host WhatsApp number with country code", { type: "tel", limit: 16, optional: true })}
            </div>
            <p className={styles.hint}>Leave the number blank to let guests choose the recipient in WhatsApp.</p>
          </Panel>
          </div>
          <div id="invitation-preview" data-shown={previewOpen} className={styles.previewColumn}>
            {view === "invitation" && <InvitationPreview draft={draft} section={section} dirty={dirty} />}
          </div>
          </div>
          <div hidden={view !== "media"}>
          <Panel id="media" title="Photos and music">
            <div className={styles.mediaGrid}>
              {mediaSlots.map(({ key, title, hint }) => {
                const source = invitationMediaUrl(draft.media[key]);
                return (
                  <div className={styles.media} key={key}>
                    <h3>{title}</h3>
                    <p className={styles.hint}>{draft.media[key] !== saved.media[key] ? "Ready to publish" : source ? "Published upload" : "Using default"}</p>
                    {key === "music"
                      ? source ? <audio controls preload="none" src={source} /> : <div className={styles.mediaPlaceholder}><Music2 size={29} aria-hidden="true" /></div>
                      : source || key === "cover" ? <img loading="lazy" src={source || "/images/sunshine-phone.webp"} alt={source ? title : ""} /> : <div className={styles.mediaPlaceholder}><Sun size={29} aria-hidden="true" /></div>}
                    <p className={styles.hint}>{hint}</p>
                    <label className={styles.upload}>
                      <ImagePlus size={16} aria-hidden="true" /> {busy === key ? "Uploading…" : source ? "Replace file" : "Upload file"}
                      <input type="file" aria-label={`Upload ${title.toLowerCase()}`} accept={key === "music" ? ".mp3,audio/mpeg" : "image/*"} disabled={Boolean(busy)} onChange={(event) => { void upload(key, event.currentTarget.files?.[0]); event.currentTarget.value = ""; }} />
                    </label>
                    {source && <button className="text-link" type="button" disabled={Boolean(busy)} onClick={() => setMedia(key, "")}>Restore default</button>}
                  </div>
                );
              })}
            </div>
          </Panel>
          </div>
        </fieldset>

        <div className={styles.publishBar}>
          <div>
            {error ? <p className={styles.error} role="alert">{error}</p> : <p role="status">{message || (dirty ? "Unpublished changes" : "Up to date")}</p>}
          </div>
          <div className={styles.boardActions}>
            {dirty && <button type="button" className="text-link" disabled={Boolean(busy)} onClick={discardDraft}>Discard draft</button>}
            <button type="submit" className="button button-primary" disabled={!ready || !dirty || Boolean(busy)}><Check size={17} aria-hidden="true" /> {busy === "publish" ? "Publishing…" : "Publish changes"}</button>
          </div>
        </div>
      </form>
        </div>
      </main>
    </div>
  );
}
