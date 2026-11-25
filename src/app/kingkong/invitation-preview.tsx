"use client";

import { useState } from "react";
import { CalendarDays, Eye, MailCheck, MapPin, Navigation, Palette, Sparkles } from "lucide-react";
import { invitationMediaUrl, type InvitationSettings } from "@/lib/invitation-settings";

export const invitationSections = [
  { id: "details", label: "Cover & details", keys: ["nickname", "date", "start", "end", "timeNote", "coverIntro", "welcomeMessage"] },
  { id: "location", label: "Venue", keys: ["venueName", "hall", "address", "landmarks", "mapsUrl", "wazeUrl"] },
  { id: "outfits", label: "Dress code", keys: ["dressHeading", "dressIntro", "swatches"] },
  { id: "schedule", label: "Program", keys: ["program"] },
  { id: "contact", label: "RSVP", keys: ["deadline", "whatsapp"] },
] as const;

export type InvitationSection = (typeof invitationSections)[number]["id"];

const dateFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "full",
  timeZone: "Asia/Manila",
});

function dateLabel(date: string) {
  const value = new Date(`${date}T12:00:00+08:00`);
  return Number.isNaN(value.valueOf()) ? "Choose a date" : dateFormat.format(value);
}

function timeLabel(value: string) {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) return "—";
  const hour = Number(value.slice(0, 2));
  return `${hour % 12 || 12}:${value.slice(3)} ${hour < 12 ? "AM" : "PM"}`;
}

export function InvitationPreview({
  draft,
  section,
  dirty,
}: {
  draft: InvitationSettings;
  section: InvitationSection;
  dirty: boolean;
}) {
  const [detailsView, setDetailsView] = useState<"cover" | "welcome" | "portrait">("cover");
  const [selectedSwatchIndex, setSelectedSwatchIndex] = useState(0);

  const cover = invitationMediaUrl(draft.media.cover) || "/images/sunshine-storybook.webp";
  const portrait = invitationMediaUrl(draft.media.portrait) || "/images/cutouts/baby-linggit-cutout.png";
  const activeSwatch = draft.swatches[selectedSwatchIndex] ?? draft.swatches[0] ?? {
    name: "Soft Cream",
    hex: "#f5f2eb",
    tip: "",
  };

  return (
    <aside
      className="rounded-3xl border border-[#e7dcc8] bg-[#fffdf8] shadow-sm overflow-hidden"
      aria-label="Invitation draft preview"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-[#e7dcc8]/80 bg-[#fffbf2]">
        <div className="flex items-center gap-2 text-[#9e3359]">
          <Eye className="w-4 h-4" aria-hidden="true" />
          <h3 className="text-xs font-extrabold text-[#2e221d]">Live Pop-Up Preview</h3>
        </div>
        <span
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
            dirty
              ? "bg-[#fbe07b]/75 text-[#70451e]"
              : "bg-[#e4efdc] text-[#2a5c3d]"
          }`}
        >
          {dirty ? "Unpublished" : "Published"}
        </span>
      </div>

      {/* Pop-Up Theater Viewport */}
      <div className="p-3">
        <div className="relative rounded-2xl border border-[#e7dcc8] overflow-hidden bg-gradient-to-b from-[#cbe9fa] via-[#e8f6fd] to-[#fffbf2] min-h-[340px] flex flex-col justify-between">
          {/* Bottom Meadow Hills */}
          <svg
            viewBox="0 0 600 110"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="absolute bottom-0 inset-x-0 w-full h-16 pointer-events-none"
          >
            <path d="M0,55 C150,15 310,75 490,32 C550,20 580,35 600,45 L600,110 L0,110 Z" fill="#c7dfb6" />
            <path d="M0,76 C170,40 380,95 600,56 L600,110 L0,110 Z" fill="#a8cd92" />
          </svg>

          {/* Preview Content by Active Section */}
          <div className="relative z-10 p-4 flex-1 flex flex-col justify-between gap-3">
            {section === "details" && (
              <>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="inline-flex rounded-full bg-white/90 border border-[#e3bf75]/70 p-0.5 text-[11px] font-extrabold">
                    {(
                      [
                        { id: "cover", label: "Cover" },
                        { id: "welcome", label: "Welcome" },
                        { id: "portrait", label: "Portrait" },
                      ] as const
                    ).map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setDetailsView(tab.id)}
                        className={`px-2.5 py-1 rounded-full transition-colors ${
                          detailsView === tab.id
                            ? "bg-[#c94b77] text-white"
                            : "text-[#645147] hover:text-[#2e221d]"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/90 border border-[#e7dcc8] text-[10px] font-bold text-[#645147]">
                    <img
                      src={portrait}
                      alt=""
                      className="w-4 h-4 rounded-full object-cover bg-[#fbe07b]/40"
                    />
                    <span>{draft.media.portrait ? "Custom portrait" : "Cutout"}</span>
                  </div>
                </div>

                {detailsView === "cover" ? (
                  <div className="space-y-3 my-auto">
                    <div className="relative rounded-2xl overflow-hidden border border-[#e3bf75]/70 shadow-sm min-h-[168px] flex flex-col justify-end p-4 text-white">
                      <img
                        src={cover}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover object-center"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-[#2e221d]/85 via-[#2e221d]/35 to-transparent"
                      />
                      <div className="relative z-10 space-y-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#fffbf2]/90 text-[#9e3359] text-[10px] font-extrabold">
                          <CalendarDays className="w-3 h-3" aria-hidden="true" />
                          {dateLabel(draft.date)}
                        </span>
                        <h4 className="font-storybook text-2xl font-bold leading-tight drop-shadow-sm">
                          {draft.nickname || "Linggit"} turns one!
                        </h4>
                        <p className="text-xs font-semibold text-[#fffbf2]/95 leading-snug">
                          {draft.coverIntro}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-white/95 border border-[#e7dcc8] text-[11px] font-bold text-[#2e221d]">
                        {timeLabel(draft.start)} – {timeLabel(draft.end)}
                      </span>
                      {draft.timeNote && (
                        <span className="px-2.5 py-1 rounded-full bg-[#fbe07b]/75 text-[11px] font-bold text-[#2e221d]">
                          {draft.timeNote}
                        </span>
                      )}
                    </div>
                  </div>
                ) : detailsView === "welcome" ? (
                  <div className="space-y-3 my-auto">
                    <div className="bg-white rounded-2xl border-2 border-[#c94b77]/35 p-3.5 shadow-sm">
                      <p className="font-storybook text-sm font-bold text-[#2e221d] leading-snug">
                        “{draft.welcomeMessage || "Welcome friends!"}”
                      </p>
                    </div>
                    <div className="flex items-end justify-between gap-3">
                      <img
                        src="/images/cutouts/ms-rachel-cutout.png"
                        alt="Ms. Rachel sticker"
                        className="w-24 h-24 object-contain drop-shadow-md shrink-0"
                      />
                      <div className="bg-white/95 border border-[#e7dcc8] rounded-xl p-2.5 text-[11px] font-semibold text-[#645147] space-y-1 flex-1">
                        <p className="font-extrabold text-[#2e221d]">{dateLabel(draft.date)}</p>
                        <p>{timeLabel(draft.start)} – {timeLabel(draft.end)}</p>
                        {draft.timeNote && <p className="text-[#9e3359]">{draft.timeNote}</p>}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 my-auto flex flex-col items-center text-center">
                    <div className="relative flex items-center justify-center pt-1">
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full blur-md opacity-70"
                        style={{
                          background: "radial-gradient(circle, rgba(251,224,123,0.75) 0%, transparent 72%)",
                        }}
                      />
                      {draft.media.portrait ? (
                        <img
                          src={portrait}
                          alt={`${draft.nickname || "Linggit"} birthday portrait preview`}
                          className="relative z-10 w-28 h-28 rounded-3xl object-cover border-4 border-white shadow-md"
                        />
                      ) : (
                        <img
                          src={portrait}
                          alt={`${draft.nickname || "Linggit"} sticker preview`}
                          className="relative z-10 w-28 h-28 object-contain drop-shadow-md"
                        />
                      )}
                    </div>
                    <div className="bg-white rounded-2xl border-2 border-[#c94b77]/35 px-4 py-2.5 shadow-sm max-w-[260px]">
                      <p className="font-storybook text-sm font-bold text-[#2e221d] leading-snug">
                        “{draft.nickname || "Linggit"} is turning 1 — you are invited!”
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}

            {section === "location" && (
              <div className="space-y-3 my-auto">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1 rounded-2xl overflow-hidden border-2 border-white shadow-md -rotate-1 bg-[#e4efdc]">
                    <img
                      src="/images/neighborhood-storybook.webp"
                      alt="Venue neighborhood map"
                      className="w-full h-28 object-cover"
                    />
                    <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#c94b77] text-white text-[10px] font-extrabold shadow">
                      <MapPin className="w-3 h-3" aria-hidden="true" />
                      Party pin!
                    </span>
                  </div>
                  <img
                    src="/images/cutouts/ms-rachel-cutout.png"
                    alt="Ms. Rachel pointing to the venue"
                    className="w-20 h-20 object-contain drop-shadow-md shrink-0"
                  />
                </div>

                <div className="rounded-2xl bg-white/95 border border-[#e7dcc8] p-3.5 space-y-1.5 shadow-sm">
                  <h4 className="font-storybook text-base font-bold text-[#2e221d]">
                    {draft.venueName || "Venue name"}
                  </h4>
                  {draft.hall && (
                    <p className="text-[11px] font-extrabold text-[#9e3359]">{draft.hall}</p>
                  )}
                  {draft.address && (
                    <p className="text-xs font-semibold text-[#645147] leading-snug">{draft.address}</p>
                  )}
                  {draft.landmarks && (
                    <p className="text-[11px] font-semibold text-[#645147]/90 leading-snug">
                      {draft.landmarks}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {draft.mapsUrl && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#d6eefa] text-[#256f9e] text-[10px] font-extrabold">
                        <Navigation className="w-2.5 h-2.5" aria-hidden="true" />
                        Google Maps
                      </span>
                    )}
                    {draft.wazeUrl && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#fbe07b]/70 text-[#2e221d] text-[10px] font-extrabold">
                        <Navigation className="w-2.5 h-2.5" aria-hidden="true" />
                        Waze
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {section === "outfits" && (
              <div className="space-y-3 my-auto">
                <div className="rounded-2xl bg-white/95 border border-[#e7dcc8] p-3.5 space-y-2 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-[#9e3359]">
                        <Palette className="w-3 h-3" aria-hidden="true" />
                        Guest palette
                      </span>
                      <h4 className="font-storybook text-base font-bold text-[#2e221d]">
                        {draft.dressHeading || "Dress code"}
                      </h4>
                    </div>
                    <svg
                      viewBox="0 0 64 56"
                      aria-hidden="true"
                      className="w-11 h-10 shrink-0 drop-shadow-sm"
                    >
                      <path
                        d="M18 8 L25 5 C28 9 36 9 39 5 L46 8 L58 20 L50 28 L44 23 L44 50 L20 50 L20 23 L14 28 L6 20 Z"
                        fill={activeSwatch.hex}
                        stroke="#2e221d"
                        strokeOpacity="0.28"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="text-xs font-semibold text-[#645147] leading-snug">{draft.dressIntro}</p>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {draft.swatches.map((swatch, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedSwatchIndex(index)}
                      className={`flex items-center gap-2 rounded-xl px-2.5 py-2 text-left border transition-colors ${
                        index === selectedSwatchIndex
                          ? "bg-white border-[#c94b77] shadow-sm"
                          : "bg-white/85 border-[#e7dcc8] hover:bg-white"
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-[#2e221d]/20 shrink-0"
                        style={{ backgroundColor: swatch.hex }}
                      />
                      <span className="min-w-0">
                        <strong className="block text-[11px] font-extrabold text-[#2e221d] truncate">
                          {swatch.name || "Color"}
                        </strong>
                        <small className="block text-[10px] font-bold text-[#645147] uppercase">
                          {swatch.hex}
                        </small>
                      </span>
                    </button>
                  ))}
                </div>
                {activeSwatch.tip && (
                  <p className="text-[11px] font-semibold text-[#2e221d] bg-white/90 rounded-xl px-3 py-1.5 border border-[#e7dcc8]">
                    Tip: {activeSwatch.tip}
                  </p>
                )}
              </div>
            )}

            {section === "schedule" && (
              <div className="space-y-3 my-auto">
                <div className="flex items-center justify-between gap-2 px-1">
                  <div className="flex items-center gap-2">
                    <img
                      src="/images/cutouts/potty-tinay-cutout.png"
                      alt="Potty Tinay"
                      className="w-12 h-12 object-contain drop-shadow-sm"
                    />
                    <img
                      src="/images/cutouts/birthday-cake-cutout.png"
                      alt="First birthday cake"
                      className="w-12 h-12 object-contain drop-shadow-sm"
                    />
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 border border-[#e7dcc8] text-[10px] font-extrabold text-[#9e3359]">
                    <Sparkles className="w-3 h-3" aria-hidden="true" />
                    {draft.program.length} {draft.program.length === 1 ? "moment" : "moments"}
                  </span>
                </div>

                {draft.program.length ? (
                  <ol className="rounded-2xl bg-white/95 border border-[#e7dcc8] divide-y divide-[#e7dcc8]/70 shadow-sm max-h-[220px] overflow-y-auto">
                    {draft.program.map((entry, index) => (
                      <li key={index} className="p-2.5 flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-[#fadce6] text-[#9e3359] text-[10px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline gap-1.5">
                            <time className="text-[10px] font-extrabold text-[#256f9e]">
                              {entry.time || "Time"}
                            </time>
                            <strong className="text-xs font-extrabold text-[#2e221d]">
                              {entry.title || "Activity"}
                            </strong>
                          </div>
                          {entry.description && (
                            <p className="text-[11px] font-semibold text-[#645147] leading-snug mt-0.5">
                              {entry.description}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <div className="rounded-2xl bg-white/95 border border-[#e7dcc8] p-4 text-center text-xs font-semibold text-[#645147]">
                    No party activities added yet.
                  </div>
                )}
              </div>
            )}

            {section === "contact" && (
              <div className="space-y-3 my-auto">
                <div className="rounded-2xl bg-white/95 border border-[#e7dcc8] p-4 space-y-3 shadow-sm text-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d6eefa] text-[#256f9e] text-[11px] font-extrabold">
                    <MailCheck className="w-3.5 h-3.5" aria-hidden="true" />
                    RSVP by {dateLabel(draft.deadline)}
                  </span>
                  <h4 className="font-storybook text-xl font-bold text-[#2e221d]">
                    Save {draft.nickname || "Linggit"}’s seat!
                  </h4>
                  <p className="text-xs font-semibold text-[#645147] leading-relaxed">
                    {draft.whatsapp
                      ? `WhatsApp confirmation number: ${draft.whatsapp}`
                      : "Guests can choose their own WhatsApp recipient when sharing their RSVP confirmation."}
                  </p>
                  <div className="pt-1">
                    <span className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-[#c94b77] text-white text-xs font-extrabold shadow-sm">
                      Send RSVP
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
