"use client";

import { CalendarDays, Check, Clipboard, Image as ImageIcon, MapPin, Pencil, Users } from "lucide-react";
import { invitationMediaUrl, type InvitationSettings } from "@/lib/invitation-settings";
import type { RsvpEntry } from "@/lib/rsvp";
import { formatHeadcount, guestTotals, manilaTimestamp } from "./rsvp-board";

type OverviewView = "overview" | "guests" | "invitation" | "media";

const eventDateFormat = new Intl.DateTimeFormat("en-PH", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "Asia/Manila",
});

function guestInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export type CopyLinkState = { kind: "idle" | "copied" | "fallback"; text: string };

export function OverviewPanel({
  saved,
  publishedAt,
  entries,
  entriesError,
  linkState,
  onSelectView,
  onSelectReply,
  onCopyGuestLink,
  onDismissLinkFallback,
}: {
  saved: InvitationSettings;
  publishedAt: string | null;
  entries: RsvpEntry[] | null;
  entriesError: string;
  linkState: CopyLinkState;
  onSelectView: (view: OverviewView) => void;
  onSelectReply: (entry: RsvpEntry) => void;
  onCopyGuestLink: () => void;
  onDismissLinkFallback: () => void;
}) {
  const totals = guestTotals(entries ?? []);
  const totalReplies = totals.attending + totals.declined;
  const attendancePct = totalReplies > 0 ? Math.round((totals.attending / totalReplies) * 100) : 0;
  const coverSrc = invitationMediaUrl(saved.media.cover) || "/images/sunshine-storybook.webp";

  return (
    <section className="space-y-6" aria-labelledby="overview-title">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#9e3359]">
            Celebration hub
          </span>
          <h2 id="overview-title" className="font-storybook text-2xl sm:text-3xl font-bold text-[#2e221d] mt-0.5">
            Party overview
          </h2>
          <p className="text-sm font-semibold text-[#645147] mt-1">
            Live attendance headcount and quick access to the Pop-Up Theater invitation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => onSelectView("guests")}
            className="inline-flex items-center justify-center gap-2 min-h-[42px] px-5 rounded-full bg-[#c94b77] hover:bg-[#9e3359] text-[#fffbf2] text-xs font-extrabold shadow-sm transition-colors"
          >
            <Users className="w-4 h-4" aria-hidden="true" />
            View guest replies
          </button>
          <button
            type="button"
            onClick={onCopyGuestLink}
            className="inline-flex items-center justify-center gap-2 min-h-[42px] px-4 rounded-full bg-white hover:bg-[#f8eed9] border border-[#dfd2be] text-[#2e221d] text-xs font-extrabold transition-colors"
          >
            {linkState.kind === "copied" ? (
              <Check className="w-4 h-4 text-[#2a5c3d]" aria-hidden="true" />
            ) : (
              <Clipboard className="w-4 h-4 text-[#9e3359]" aria-hidden="true" />
            )}
            {linkState.kind === "copied" ? "RSVP link copied" : "Copy RSVP link"}
          </button>
        </div>
      </div>

      {linkState.kind === "copied" && (
        <p role="status" className="sr-only">
          {linkState.text}
        </p>
      )}

      {linkState.kind === "fallback" && (
        <div
          role="status"
          className="rounded-2xl border border-[#e3bf75] bg-[#fff8ea] px-4 py-3 flex flex-wrap items-center justify-between gap-3"
        >
          <div className="min-w-0 space-y-0.5">
            <span className="block text-[11px] font-extrabold text-[#70451e]">
              Copy RSVP link manually
            </span>
            <code className="block text-xs font-bold text-[#2e221d] select-all break-all">
              {linkState.text}
            </code>
          </div>
          <button
            type="button"
            onClick={onDismissLinkFallback}
            className="text-xs font-extrabold text-[#9e3359] hover:underline shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 3 Warm Tactile KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" aria-label="RSVP totals">
        <div className="rounded-3xl border border-[#e7dcc8] bg-[#fffdf8] p-5 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-extrabold text-[#645147]">Expected guests</span>
          <strong className="font-storybook text-4xl font-bold text-[#c94b77] mt-2 leading-none">
            {entries ? totals.adults + totals.children : "—"}
          </strong>
          <small className="text-xs font-semibold text-[#645147] mt-2">
            {entries ? formatHeadcount(totals.adults, totals.children) : "Guest list unavailable"}
          </small>
        </div>

        <div className="rounded-3xl border border-[#e7dcc8] bg-[#fffdf8] p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-extrabold text-[#645147]">Attending replies</span>
            {totalReplies > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#e4efdc] text-[#2a5c3d] text-[11px] font-extrabold">
                {attendancePct}% yes
              </span>
            )}
          </div>
          <strong className="font-storybook text-4xl font-bold text-[#2a5c3d] mt-2 leading-none">
            {entries ? totals.attending : "—"}
          </strong>
          <div className="mt-3 h-1.5 w-full rounded-full bg-[#e7dcc8]/70 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#64965b] transition-all duration-300"
              style={{ width: `${attendancePct}%` }}
            />
          </div>
        </div>

        <div className="rounded-3xl border border-[#e7dcc8] bg-[#fffdf8] p-5 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-extrabold text-[#645147]">Declined replies</span>
          <strong className="font-storybook text-4xl font-bold text-[#645147] mt-2 leading-none">
            {entries ? totals.declined : "—"}
          </strong>
          <small className="text-xs font-semibold text-[#645147] mt-2">
            {entries ? `${totalReplies} total ${totalReplies === 1 ? "reply" : "replies"}` : "Waiting for sync"}
          </small>
        </div>
      </div>

      {entriesError && (
        <p
          role="alert"
          className="rounded-2xl bg-[#fadce6]/65 border border-[#c94b77]/35 px-4 py-3 text-xs font-bold text-[#9e3359]"
        >
          {entriesError}
        </p>
      )}

      {/* Main Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.45fr)_minmax(290px,1fr)] gap-5 items-start">
        {/* Recent Replies Card */}
        <section className="rounded-3xl border border-[#e7dcc8] bg-[#fffdf8] shadow-sm overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-[#e7dcc8]/80">
            <h3 className="font-storybook text-lg font-bold text-[#2e221d]">Recent replies</h3>
            <button
              type="button"
              onClick={() => onSelectView("guests")}
              className="text-xs font-extrabold text-[#9e3359] hover:underline"
            >
              See all replies
            </button>
          </div>

          {entries?.length ? (
            <ul className="divide-y divide-[#e7dcc8]/75">
              {entries.slice(0, 4).map((entry) => (
                <li key={entry.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectView("guests");
                      onSelectReply(entry);
                    }}
                    className="w-full px-5 py-3.5 flex items-center justify-between gap-3 text-left hover:bg-[#fff6e2]/70 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-9 h-9 rounded-full bg-[#d6eefa] text-[#256f9e] text-xs font-extrabold flex items-center justify-center shrink-0">
                        {guestInitials(entry.name)}
                      </span>
                      <div className="min-w-0">
                        <strong className="block text-sm font-extrabold text-[#2e221d] truncate">
                          {entry.name}
                        </strong>
                        <small className="block text-xs font-semibold text-[#645147]">
                          {manilaTimestamp(entry.updatedAt)}
                        </small>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                        entry.attending
                          ? "bg-[#e4efdc] text-[#2a5c3d]"
                          : "bg-[#fadce6] text-[#9e3359]"
                      }`}
                    >
                      {entry.attending ? "Attending" : "Declined"}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-12 px-6 text-center space-y-2">
              <span className="inline-flex w-11 h-11 rounded-2xl bg-[#fadce6]/70 text-[#9e3359] items-center justify-center mx-auto">
                <Users className="w-5 h-5" aria-hidden="true" />
              </span>
              <h4 className="text-sm font-extrabold text-[#2e221d]">
                {entries === null ? "Replies could not load" : "No RSVPs yet"}
              </h4>
              <p className="text-xs font-semibold text-[#645147]">
                {entries === null
                  ? "Open Guest replies to retry."
                  : "Guest names and responses will appear here as replies arrive."}
              </p>
            </div>
          )}
        </section>

        {/* Live Invitation Snapshot Card */}
        <section
          aria-labelledby="event-summary-title"
          className="rounded-3xl border border-[#e7dcc8] bg-[#fffdf8] shadow-sm overflow-hidden"
        >
          <div className="relative h-32 bg-gradient-to-b from-[#cdeafa] to-[#e4efdc] overflow-hidden">
            <img
              src={coverSrc}
              alt=""
              className="w-full h-full object-cover object-center opacity-85"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#2e221d]/45 via-transparent to-transparent"
            />
            <img
              src="/images/cutouts/ms-rachel-cutout.png"
              alt=""
              aria-hidden="true"
              className="absolute -bottom-3 right-3 w-20 h-20 object-contain drop-shadow-md"
            />
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#fffbf2]/95 text-[11px] font-extrabold text-[#2a5c3d] border border-[#a8cd92]">
              {publishedAt ? `Published ${manilaTimestamp(publishedAt)}` : "Invitation live"}
            </span>
          </div>

          <div className="p-5 space-y-3">
            <h3 id="event-summary-title" className="font-storybook text-xl font-bold text-[#2e221d]">
              {saved.nickname}’s first birthday
            </h3>
            <div className="space-y-2 text-xs font-semibold text-[#645147]">
              <p className="flex items-start gap-2">
                <CalendarDays className="w-4 h-4 text-[#c94b77] shrink-0 mt-0.5" aria-hidden="true" />
                <span>{eventDateFormat.format(new Date(`${saved.date}T12:00:00+08:00`))}</span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#256f9e] shrink-0 mt-0.5" aria-hidden="true" />
                <span>{saved.venueName}</span>
              </p>
            </div>

            <div className="pt-3 border-t border-[#e7dcc8]/80 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onSelectView("invitation")}
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#9e3359] hover:underline"
              >
                <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                Edit invitation
              </button>
              <button
                type="button"
                onClick={() => onSelectView("media")}
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#256f9e] hover:underline"
              >
                <ImageIcon className="w-3.5 h-3.5" aria-hidden="true" />
                Manage media
              </button>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
