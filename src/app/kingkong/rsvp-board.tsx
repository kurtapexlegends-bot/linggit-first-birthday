"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowDownToLine, Check, MessageSquareQuote, Plus, RefreshCw, Search, Trash2, Users, X } from "lucide-react";
import type { RsvpEntry, RsvpFields } from "@/lib/rsvp";
import styles from "./editor.module.css";

const timestamp = new Intl.DateTimeFormat("en-PH", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Manila",
});

export function manilaTimestamp(value: string) {
  return timestamp.format(new Date(value));
}

export function guestTotals(entries: RsvpEntry[]) {
  return entries.reduce(
    (totals, entry) => ({
      attending: totals.attending + Number(entry.attending),
      declined: totals.declined + Number(!entry.attending),
      adults: totals.adults + (entry.attending ? entry.adults : 0),
      children: totals.children + (entry.attending ? entry.children : 0),
    }),
    { attending: 0, declined: 0, adults: 0, children: 0 },
  );
}

export function formatHeadcount(adults: number, children: number) {
  return `${adults} ${adults === 1 ? "adult" : "adults"} · ${children} ${children === 1 ? "child" : "children"}`;
}

function guestInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
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
      entry.name,
      entry.attending ? "Attending" : "Declined",
      entry.adults,
      entry.children,
      entry.message,
      entry.source === "invitation" ? "Invitation" : "Recorded by host",
      manilaTimestamp(entry.createdAt),
      manilaTimestamp(entry.updatedAt),
    ]),
  ];
  const url = URL.createObjectURL(
    new Blob(["\uFEFF", rows.map((row) => row.map(cell).join(",")).join("\r\n")], {
      type: "text/csv;charset=utf-8",
    }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "linggit-rsvps.csv";
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function ReplyEditor({
  entry,
  onSave,
  onDelete,
  onCancel,
}: {
  entry?: RsvpEntry;
  onSave: (fields: RsvpFields, id: string, create: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
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
      name: String(input.get("guest") ?? ""),
      attending,
      adults: attending ? Number(input.get("adults")) : 0,
      children: attending ? Number(input.get("children")) : 0,
      message: String(input.get("note") ?? ""),
    };
    if (
      attending &&
      (Number.isNaN(fields.adults) || Number.isNaN(fields.children) || fields.adults + fields.children < 1)
    ) {
      setError("Please include at least one adult or child who will attend.");
      return;
    }
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

  async function handleDelete() {
    if (!entry || pending) return;
    if (!window.confirm("Remove this guest reply? This cannot be undone.")) return;
    setPending(true);
    setError("");
    try {
      await onDelete(entry.id);
      onCancel();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The reply could not be removed.");
      setPending(false);
    }
  }

  return (
    <dialog
      ref={dialog}
      className={styles.replyDrawer}
      aria-labelledby="reply-editor-title"
      onCancel={(event) => {
        event.preventDefault();
        if (!pending) onCancel();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && !pending) onCancel();
      }}
    >
      <form className="flex flex-col min-h-full" method="post" onSubmit={submit}>
        <header className="flex items-start justify-between gap-4 px-6 py-5 border-b border-[#e7dcc8] bg-[#fffbf2]">
          <div>
            <span className="block text-[11px] font-extrabold uppercase tracking-wider text-[#9e3359]">
              Guest response
            </span>
            <h3
              id="reply-editor-title"
              tabIndex={-1}
              className="font-storybook text-2xl font-bold text-[#2e221d] mt-0.5 focus:outline-none"
            >
              {entry ? "Edit reply" : "Record a reply"}
            </h3>
            <p className="text-xs font-semibold text-[#645147] mt-1">
              {entry ? entry.name : "Add a response received outside the invitation."}
            </p>
          </div>
          <button
            type="button"
            className="w-10 h-10 rounded-full bg-white border border-[#dfd2be] text-[#2e221d] hover:bg-[#fadce6] hover:border-[#c94b77]/40 flex items-center justify-center shrink-0 transition-colors"
            aria-label="Close reply editor"
            disabled={pending}
            onClick={onCancel}
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </header>

        <fieldset className="flex-1 p-6 space-y-5 border-0 m-0" disabled={pending}>
          <label className="block space-y-1.5 text-xs font-extrabold text-[#2e221d]">
            <span>Guest name</span>
            <input
              name="guest"
              maxLength={100}
              required
              defaultValue={entry?.name}
              placeholder="e.g. Tita Maya Santos"
              className="w-full min-h-[44px] rounded-xl border border-[#dfd2be] bg-white px-3.5 py-2 text-base font-semibold text-[#2e221d] focus:border-[#c94b77] focus:outline-none"
            />
          </label>

          <div className="space-y-1.5">
            <span className="block text-xs font-extrabold text-[#2e221d]">Response</span>
            <div className="grid grid-cols-2 gap-2" role="group" aria-label="Response">
              <button
                type="button"
                aria-pressed={attending}
                onClick={() => setAttending(true)}
                className={`min-h-[44px] rounded-xl border px-3 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors ${
                  attending
                    ? "bg-[#e4efdc] border-[#64965b] text-[#2a5c3d]"
                    : "bg-white border-[#dfd2be] text-[#645147] hover:bg-[#f8eed9]/50"
                }`}
              >
                {attending && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
                Attending
              </button>
              <button
                type="button"
                aria-pressed={!attending}
                onClick={() => setAttending(false)}
                className={`min-h-[44px] rounded-xl border px-3 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors ${
                  !attending
                    ? "bg-[#fadce6] border-[#c94b77] text-[#9e3359]"
                    : "bg-white border-[#dfd2be] text-[#645147] hover:bg-[#f8eed9]/50"
                }`}
              >
                {!attending && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
                Declined
              </button>
            </div>
          </div>

          {attending && (
            <div className="grid grid-cols-2 gap-3">
              <label className="block space-y-1.5 text-xs font-extrabold text-[#2e221d]">
                <span>Adults</span>
                <input
                  name="adults"
                  type="number"
                  min="0"
                  max="100"
                  defaultValue={entry?.attending ? entry.adults : 1}
                  required
                  className="w-full min-h-[44px] rounded-xl border border-[#dfd2be] bg-white px-3.5 py-2 text-base font-semibold text-[#2e221d] focus:border-[#c94b77] focus:outline-none"
                />
              </label>
              <label className="block space-y-1.5 text-xs font-extrabold text-[#2e221d]">
                <span>Children</span>
                <input
                  name="children"
                  type="number"
                  min="0"
                  max="100"
                  defaultValue={entry?.children ?? 0}
                  required
                  className="w-full min-h-[44px] rounded-xl border border-[#dfd2be] bg-white px-3.5 py-2 text-base font-semibold text-[#2e221d] focus:border-[#c94b77] focus:outline-none"
                />
              </label>
            </div>
          )}

          <label className="block space-y-1.5 text-xs font-extrabold text-[#2e221d]">
            <span>Message or note</span>
            <textarea
              name="note"
              maxLength={500}
              defaultValue={entry?.message}
              rows={3}
              placeholder="Birthday wish, dietary note, or arrival note..."
              className="w-full rounded-xl border border-[#dfd2be] bg-white px-3.5 py-2.5 text-base font-semibold text-[#2e221d] focus:border-[#c94b77] focus:outline-none resize-y"
            />
          </label>

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-[#fadce6]/70 border border-[#c94b77]/35 px-3.5 py-2.5 text-xs font-bold text-[#9e3359]"
            >
              {error}
            </p>
          )}
        </fieldset>

        <footer className="sticky bottom-0 px-6 py-4 border-t border-[#e7dcc8] bg-[#fffbf2] flex flex-wrap items-center justify-between gap-2.5">
          <div>
            {entry && (
              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={pending}
                className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 rounded-full hover:bg-[#fadce6]/70 text-xs font-extrabold text-[#9e3359] transition-colors disabled:opacity-45"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                Delete reply
              </button>
            )}
          </div>
          <div className="flex items-center gap-2.5 ml-auto">
            <button
              type="button"
              onClick={onCancel}
              disabled={pending}
              className="min-h-[42px] px-4 rounded-full bg-white hover:bg-[#f8eed9] border border-[#dfd2be] text-xs font-extrabold text-[#2e221d] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="min-h-[42px] px-5 rounded-full bg-[#c94b77] hover:bg-[#9e3359] text-xs font-extrabold text-[#fffbf2] shadow-sm transition-colors disabled:opacity-50"
            >
              {pending ? "Saving…" : "Save reply"}
            </button>
          </div>
        </footer>
      </form>
    </dialog>
  );
}

export function GuestBoard({
  entries,
  initialReply,
  loading,
  error,
  onRefresh,
  onSave,
  onDelete,
}: {
  entries: RsvpEntry[] | null;
  initialReply?: RsvpEntry;
  loading: boolean;
  error: string;
  onRefresh: () => void;
  onSave: (fields: RsvpFields, id: string, create: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "yes" | "no">("all");
  const [order, setOrder] = useState("latest");
  const [editor, setEditor] = useState<"new" | RsvpEntry | null>(initialReply ?? null);

  useEffect(() => {
    if (initialReply) setEditor(initialReply);
  }, [initialReply]);

  const items = entries ?? [];
  const totals = guestTotals(items);
  const visible = items.filter(
    (entry) =>
      `${entry.name} ${entry.message}`.toLowerCase().includes(search.trim().toLowerCase()) &&
      (filter === "all" || (filter === "yes" ? entry.attending : !entry.attending)),
  );
  if (order === "name") visible.sort((a, b) => a.name.localeCompare(b.name));
  if (order === "headcount") visible.sort((a, b) => b.adults + b.children - a.adults - a.children);

  return (
    <section className="space-y-5" aria-labelledby="guest-replies-title">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#9e3359]">
            Attendance roster
          </span>
          <h2 id="guest-replies-title" className="font-storybook text-2xl sm:text-3xl font-bold text-[#2e221d] mt-0.5">
            Guest replies
          </h2>
          <p className="text-sm font-semibold text-[#645147] mt-1">
            Review RSVPs submitted from the invitation and record replies received in person or by message.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setEditor("new")}
          className="inline-flex items-center justify-center gap-2 min-h-[42px] px-5 rounded-full bg-[#c94b77] hover:bg-[#9e3359] text-[#fffbf2] text-xs font-extrabold shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Record a reply
        </button>
      </div>

      {editor && (
        <ReplyEditor
          key={editor === "new" ? editor : editor.id}
          entry={editor === "new" ? undefined : editor}
          onSave={onSave}
          onDelete={onDelete}
          onCancel={() => setEditor(null)}
        />
      )}

      {/* Search, Segmented Filter Pills, Sort, & Actions */}
      <div className="rounded-2xl border border-[#e7dcc8] bg-[#fffdf8] p-3.5 shadow-sm flex flex-col lg:flex-row lg:items-center gap-3">
        <label className="relative flex-1 min-w-[200px]">
          <Search
            className="w-4 h-4 text-[#645147] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <span className="sr-only">Search replies</span>
          <input
            type="search"
            placeholder="Search guest names or messages..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full min-h-[42px] rounded-xl border border-[#dfd2be] bg-white pl-10 pr-3.5 py-2 text-sm font-semibold text-[#2e221d] placeholder:text-[#645147]/60 focus:border-[#c94b77] focus:outline-none"
          />
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <div
            role="group"
            aria-label="Filter replies"
            className="inline-flex rounded-xl bg-[#f8eed9]/75 p-1 border border-[#e7dcc8]"
          >
            {(
              [
                { id: "all", label: `All (${items.length})` },
                { id: "yes", label: `Attending (${totals.attending})` },
                { id: "no", label: `Declined (${totals.declined})` },
              ] as const
            ).map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={filter === option.id}
                onClick={() => setFilter(option.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-colors ${
                  filter === option.id
                    ? "bg-white text-[#9e3359] shadow-sm"
                    : "text-[#645147] hover:text-[#2e221d]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <label>
            <span className="sr-only">Sort replies</span>
            <select
              aria-label="Sort replies"
              value={order}
              onChange={(event) => setOrder(event.target.value)}
              className="min-h-[40px] rounded-xl border border-[#dfd2be] bg-white px-3 py-1.5 text-xs font-extrabold text-[#2e221d] focus:border-[#c94b77] focus:outline-none"
            >
              <option value="latest">Newest first</option>
              <option value="name">Name A–Z</option>
              <option value="headcount">Group size</option>
            </select>
          </label>

          <button
            type="button"
            disabled={loading}
            onClick={onRefresh}
            className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 rounded-full bg-white hover:bg-[#f8eed9] border border-[#dfd2be] text-xs font-extrabold text-[#2e221d] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} aria-hidden="true" />
            {loading ? "Refreshing…" : "Refresh"}
          </button>

          <button
            type="button"
            disabled={!visible.length}
            onClick={() => downloadCsv(visible)}
            className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 rounded-full bg-white hover:bg-[#f8eed9] border border-[#dfd2be] text-xs font-extrabold text-[#2e221d] transition-colors disabled:opacity-45"
          >
            <ArrowDownToLine className="w-3.5 h-3.5 text-[#9e3359]" aria-hidden="true" />
            Export CSV
          </button>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-2xl bg-[#fadce6]/65 border border-[#c94b77]/35 px-4 py-3 text-xs font-bold text-[#9e3359]"
        >
          {error}
        </p>
      )}

      {entries && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs font-bold text-[#645147]">
          <span role="status">
            {visible.length === items.length
              ? `Showing ${items.length} ${items.length === 1 ? "reply" : "replies"}`
              : `Showing ${visible.length} of ${items.length} replies`}
          </span>
          {(search || filter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilter("all");
              }}
              className="text-xs font-extrabold text-[#9e3359] hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Guest Roster Card */}
      <div className="rounded-3xl border border-[#e7dcc8] bg-[#fffdf8] shadow-sm overflow-hidden">
        <div
          aria-hidden="true"
          className="hidden md:grid grid-cols-[minmax(0,1.4fr)_120px_minmax(150px,0.7fr)_72px] gap-4 px-5 py-3 bg-[#fff6e2]/80 border-b border-[#e7dcc8] text-[11px] font-extrabold uppercase tracking-wider text-[#645147]"
        >
          <span>Guest</span>
          <span>Response</span>
          <span>Headcount</span>
          <span className="text-right">Action</span>
        </div>

        {!visible.length ? (
          <div className="py-14 px-6 text-center space-y-2.5">
            <span className="inline-flex w-12 h-12 rounded-2xl bg-[#d6eefa]/70 text-[#256f9e] items-center justify-center mx-auto">
              <Users className="w-6 h-6" aria-hidden="true" />
            </span>
            <h3 className="font-storybook text-lg font-bold text-[#2e221d]">
              {entries === null ? "Guest list unavailable" : items.length ? "No matching replies" : "No replies yet"}
            </h3>
            <p className="text-xs font-semibold text-[#645147]">
              {entries === null
                ? "Use Refresh to try again."
                : items.length
                  ? "Try a different name or response filter."
                  : "Guest replies will appear here as soon as someone submits an RSVP."}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-[#e7dcc8]/80" aria-label="RSVP responses">
            {visible.map((entry) => (
              <li key={entry.id} className="px-5 py-4 hover:bg-[#fffbf2]/75 transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.4fr)_120px_minmax(150px,0.7fr)_72px] gap-3 md:gap-4 items-center">
                  {/* Guest Name + Source */}
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-9 h-9 rounded-full bg-[#d6eefa] text-[#256f9e] text-xs font-extrabold flex items-center justify-center shrink-0">
                      {guestInitials(entry.name)}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-sm font-extrabold text-[#2e221d] truncate">{entry.name}</h3>
                      <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-[11px] font-semibold text-[#645147]">
                        <span className="px-2 py-0.5 rounded-full bg-[#f8eed9] text-[#645147] font-bold">
                          {entry.source === "invitation" ? "Website" : "Recorded by host"}
                        </span>
                        <span>{manilaTimestamp(entry.updatedAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Response + Headcount */}
                  <div className="flex items-center justify-between md:contents gap-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-extrabold justify-self-start ${
                        entry.attending
                          ? "bg-[#e4efdc] text-[#2a5c3d]"
                          : "bg-[#fadce6] text-[#9e3359]"
                      }`}
                    >
                      {entry.attending ? "Attending" : "Declined"}
                    </span>

                    <span className="text-xs font-bold text-[#645147]">
                      {entry.attending ? formatHeadcount(entry.adults, entry.children) : "0 guests"}
                    </span>
                  </div>

                  {/* Edit Action */}
                  <div className="md:text-right">
                    <button
                      type="button"
                      aria-label={`Edit reply from ${entry.name}`}
                      onClick={() => setEditor(entry)}
                      className="inline-flex items-center justify-center min-h-[34px] px-3.5 rounded-full bg-white hover:bg-[#fadce6]/60 border border-[#dfd2be] text-xs font-extrabold text-[#9e3359] transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                {entry.message && (
                  <p className="mt-3 md:ml-12 rounded-2xl bg-[#fff8ea] border border-[#e7dcc8]/80 px-3.5 py-2.5 text-xs font-semibold text-[#544037] leading-relaxed flex items-start gap-2 whitespace-pre-wrap">
                    <MessageSquareQuote className="w-3.5 h-3.5 text-[#c9841a] shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{entry.message}</span>
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
