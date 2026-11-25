"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowDownToLine, Plus, RefreshCw, Search, Users, X } from "lucide-react";
import type { RsvpEntry, RsvpFields } from "@/lib/rsvp";
import styles from "./editor.module.css";

const timestamp = new Intl.DateTimeFormat("en-PH", {
  dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Manila",
});

export function manilaTimestamp(value: string) {
  return timestamp.format(new Date(value));
}

export function guestTotals(entries: RsvpEntry[]) {
  return entries.reduce((totals, entry) => ({
    attending: totals.attending + Number(entry.attending),
    declined: totals.declined + Number(!entry.attending),
    adults: totals.adults + (entry.attending ? entry.adults : 0),
    children: totals.children + (entry.attending ? entry.children : 0),
  }), { attending: 0, declined: 0, adults: 0, children: 0 });
}

export function formatHeadcount(adults: number, children: number) {
  return `${adults} ${adults === 1 ? "adult" : "adults"} · ${children} ${children === 1 ? "child" : "children"}`;
}

function downloadCsv(entries: RsvpEntry[]) {
  const cell = (value: string | number) => {
    const string = String(value);
    const safe = /^[\s\uFEFF]*[=+\-@]|^[\t\r\n]/.test(string) ? "'" + string : string;
    return '"' + safe.replace(/"/g, '""') + '"';
  };
  const rows = [
    ["Guest", "RSVP", "Adults", "Children", "Message", "Source", "First received (Manila)", "Last updated (Manila)"],
    ...entries.map((entry) => [
      entry.name, entry.attending ? "Attending" : "Declined", entry.adults, entry.children,
      entry.message, entry.source === "invitation" ? "Invitation" : "Recorded by host",
      manilaTimestamp(entry.createdAt), manilaTimestamp(entry.updatedAt),
    ]),
  ];
  const url = URL.createObjectURL(new Blob(["\uFEFF", rows.map((row) => row.map(cell).join(",")).join("\r\n")], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "linggit-rsvps.csv";
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function ReplyEditor({ entry, onSave, onCancel }: {
  entry?: RsvpEntry;
  onSave: (fields: RsvpFields, id: string, create: boolean) => Promise<void>;
  onCancel: () => void;
}) {
  const [attending, setAttending] = useState(entry?.attending ?? true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const requestId = useRef(entry?.id);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const current = dialog.current;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    current?.showModal();
    current?.querySelector<HTMLElement>("h3")?.focus();
    return () => {
      current?.close();
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = new FormData(event.currentTarget);
    const fields = {
      name: String(input.get("guest") ?? ""), attending,
      adults: attending ? Number(input.get("adults")) : 0,
      children: attending ? Number(input.get("children")) : 0,
      message: String(input.get("note") ?? ""),
    };
    setPending(true);
    setError("");
    try {
      requestId.current ??= crypto.randomUUID();
      await onSave(fields, requestId.current, !entry);
      onCancel();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The reply could not be saved.");
      setPending(false);
    }
  }

  return <dialog ref={dialog} className={styles.replyDrawer} aria-labelledby="reply-editor-title" onCancel={(event) => {
    event.preventDefault();
    if (!pending) onCancel();
  }} onClick={(event) => {
    if (event.target === event.currentTarget && !pending) onCancel();
  }}>
  <form className={styles.replyEditor} method="post" onSubmit={submit}>
    <header className={styles.drawerHeading}>
      <div>
        <h3 id="reply-editor-title" tabIndex={-1}>{entry ? "Edit reply" : "Record a reply"}</h3>
        <p>{entry ? entry.name : "Add a response received outside the invitation."}</p>
      </div>
      <button type="button" className={styles.drawerClose} aria-label="Close reply editor" disabled={pending} onClick={onCancel}><X size={19} aria-hidden="true" /></button>
    </header>
    <fieldset className={styles.editorFields} disabled={pending}>
      <div className={styles.grid}>
        <label>Guest name<input name="guest" maxLength={100} required defaultValue={entry?.name} /></label>
        <label>Response<select aria-label="Response" value={attending ? "yes" : "no"} onChange={(event) => setAttending(event.target.value === "yes")}><option value="yes">Attending</option><option value="no">Declined</option></select></label>
        {attending && <>
          <label>Adults<input name="adults" type="number" min="0" max="100" defaultValue={entry?.attending ? entry.adults : 1} required /></label>
          <label>Children<input name="children" type="number" min="0" max="100" defaultValue={entry?.children ?? 0} required /></label>
        </>}
        <label className={styles.full}>Message or note<textarea name="note" maxLength={500} defaultValue={entry?.message} rows={2} /></label>
      </div>
      {error && <p role="alert" className={styles.error}>{error}</p>}
      <div className={styles.boardActions}>
        <button className="button button-primary">{pending ? "Saving…" : "Save reply"}</button>
        <button type="button" className="text-link" onClick={onCancel}>Cancel</button>
      </div>
    </fieldset>
  </form>
  </dialog>;
}

export function GuestBoard({ entries, initialReply, loading, error, onRefresh, onSave }: {
  entries: RsvpEntry[] | null;
  initialReply?: RsvpEntry;
  loading: boolean;
  error: string;
  onRefresh: () => void;
  onSave: (fields: RsvpFields, id: string, create: boolean) => Promise<void>;
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [order, setOrder] = useState("latest");
  const [editor, setEditor] = useState<"new" | RsvpEntry | null>(initialReply ?? null);
  const items = entries ?? [];
  const visible = items.filter((entry) => `${entry.name} ${entry.message}`.toLowerCase().includes(search.trim().toLowerCase()) &&
    (filter === "all" || (filter === "yes" ? entry.attending : !entry.attending)));
  if (order === "name") visible.sort((a, b) => a.name.localeCompare(b.name));
  if (order === "headcount") visible.sort((a, b) => b.adults + b.children - a.adults - a.children);

  return <section className={styles.dashboardSection} aria-labelledby="guest-replies-title">
    <div className={styles.sectionHeading}>
      <div><h2 id="guest-replies-title">Guest replies</h2><p>See RSVPs from the site and record replies from WhatsApp or in person.</p></div>
      <button className="button button-primary" type="button" onClick={() => setEditor("new")}><Plus size={16} aria-hidden="true" /> Record a reply</button>
    </div>
    {editor && <ReplyEditor key={editor === "new" ? editor : editor.id} entry={editor === "new" ? undefined : editor} onSave={onSave} onCancel={() => setEditor(null)} />}
    <div className={styles.guestTools}>
      <label className={styles.search}><Search size={18} aria-hidden="true" /><span className="sr-only">Search replies</span><input type="search" placeholder="Search names or notes" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
      <label><select aria-label="Filter replies" value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">All replies</option><option value="yes">Attending</option><option value="no">Declined</option></select></label>
      <label><select aria-label="Sort replies" value={order} onChange={(event) => setOrder(event.target.value)}><option value="latest">Newest</option><option value="name">Name A–Z</option><option value="headcount">Group size</option></select></label>
      <div className={styles.boardActions}>
        <button type="button" className="button button-outline" disabled={loading} onClick={onRefresh}><RefreshCw size={16} aria-hidden="true" /> {loading ? "Refreshing…" : "Refresh"}</button>
        <button type="button" className="button button-outline" disabled={!visible.length} onClick={() => downloadCsv(visible)}><ArrowDownToLine size={16} aria-hidden="true" /> Export CSV</button>
      </div>
    </div>
    {error && <p className={styles.error} role="alert">{error}</p>}
    {entries && <div className={styles.rosterSummary}>
      <span role="status">{visible.length === items.length ? `${items.length} ${items.length === 1 ? "reply" : "replies"}` : `${visible.length} of ${items.length} replies`}</span>
      {(search || filter !== "all") && <button className="text-link" type="button" onClick={() => { setSearch(""); setFilter("all"); }}>Clear filters</button>}
    </div>}
    <div className={styles.roster}>
    <div className={styles.rosterHeader} aria-hidden="true"><span>Guest</span><span>Response</span><span>Headcount</span><span /></div>
    {!visible.length && <div className={styles.empty}>
      <Users size={25} aria-hidden="true" />
      <h3>{entries === null ? "Guest list unavailable" : items.length ? "No matching replies" : "No replies yet"}</h3>
      <p>{entries === null ? "Use Refresh to try again." : items.length ? "Try a different name or response filter." : "The list will update as guests send their RSVPs."}</p>
    </div>}
    {!!visible.length && <ul className={styles.replyList} aria-label="RSVP responses">
      {visible.map((entry) => <li key={entry.id}>
          <div className={styles.replyRow}>
            <div><h3>{entry.name}</h3><p>{entry.source === "invitation" ? "Website" : "Recorded by host"} · {manilaTimestamp(entry.updatedAt)}</p></div>
            <span className={styles.replyStatus} data-attending={entry.attending}>{entry.attending ? "Attending" : "Declined"}</span>
            <span className={styles.headcount}>{entry.attending ? formatHeadcount(entry.adults, entry.children) : "0 guests"}</span>
            <button type="button" className="text-link" aria-label={`Edit reply from ${entry.name}`} onClick={() => setEditor(entry)}>Edit</button>
          </div>
          {entry.message && <p className={styles.guestNote}>{entry.message}</p>}
      </li>)}
    </ul>}
    </div>
  </section>;
}
