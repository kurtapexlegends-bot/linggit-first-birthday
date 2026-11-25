"use client";

import type { ReactNode } from "react";
import { Clock, ImagePlus, MailCheck, MapPin, Music2, Palette, Plus, Sparkles, Trash2 } from "lucide-react";
import { invitationMediaUrl, type InvitationSettings, type MediaSlot } from "@/lib/invitation-settings";
import { invitationSections, type InvitationSection } from "./invitation-preview";

export type TextKey = Exclude<keyof InvitationSettings, "swatches" | "program" | "media">;

const sectionIcons: Record<InvitationSection, typeof Sparkles> = {
  details: Sparkles,
  location: MapPin,
  outfits: Palette,
  schedule: Clock,
  contact: MailCheck,
};

const mediaSlots: { key: MediaSlot; title: string; subtitle: string; hint: string }[] = [
  {
    key: "portrait",
    title: "Birthday portrait",
    subtitle: "Shown in Baby Linggit’s reveal scene.",
    hint: "Portrait photos work best. Falls back to the Linggit sticker cutout.",
  },
  {
    key: "cover",
    title: "Cover artwork",
    subtitle: "Shown behind the opening envelope cover.",
    hint: "Wide horizontal artwork works best.",
  },
  {
    key: "music",
    title: "Background music",
    subtitle: "Plays after guests open the invitation.",
    hint: "MP3, up to 4 MB. Defaults to the built-in You Are My Sunshine music box.",
  },
];

function SectionPanel({
  id,
  title,
  description,
  hidden,
  children,
}: {
  id: string;
  title: string;
  description: string;
  hidden?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      hidden={hidden}
      className={hidden ? "hidden" : "rounded-3xl border border-[#e7dcc8] bg-[#fffdf8] p-5 sm:p-6 shadow-sm space-y-5"}
    >
      <div className="border-b border-[#e7dcc8]/80 pb-3.5">
        <h3 className="font-storybook text-xl font-bold text-[#2e221d]">{title}</h3>
        <p className="text-xs font-semibold text-[#645147] mt-0.5">{description}</p>
      </div>
      {children}
    </section>
  );
}

const inputBase =
  "w-full min-h-[44px] rounded-xl border border-[#dfd2be] bg-white px-3.5 py-2 text-base font-semibold text-[#2e221d] placeholder:text-[#645147]/50 focus:border-[#c94b77] focus:outline-none";

export function InvitationSectionTabs({
  section,
  onSelectSection,
}: {
  section: InvitationSection;
  onSelectSection: (next: InvitationSection) => void;
}) {
  return (
    <nav aria-label="Invitation sections" className="flex flex-wrap gap-2">
      {invitationSections.map(({ id, label }) => {
        const Icon = sectionIcons[id];
        const active = section === id;
        return (
          <button
            key={id}
            type="button"
            aria-pressed={active}
            onClick={() => onSelectSection(id)}
            className={`inline-flex items-center gap-2 min-h-[40px] px-4 rounded-full text-xs font-extrabold border transition-colors ${
              active
                ? "bg-[#c94b77] border-[#c94b77] text-[#fffbf2] shadow-sm"
                : "bg-white border-[#dfd2be] text-[#645147] hover:bg-[#f8eed9]/70 hover:text-[#2e221d]"
            }`}
          >
            <Icon className="w-3.5 h-3.5" aria-hidden="true" />
            {label}
          </button>
        );
      })}
    </nav>
  );
}

export function InvitationFormSections({
  draft,
  section,
  setDraft,
  onTextChange,
}: {
  draft: InvitationSettings;
  section: InvitationSection;
  setDraft: React.Dispatch<React.SetStateAction<InvitationSettings>>;
  onTextChange: (key: TextKey, value: string) => void;
}) {
  function field(
    key: TextKey,
    label: string,
    options: { type?: string; multiline?: boolean; limit?: number; optional?: boolean } = {},
  ) {
    return (
      <label
        data-setting={key}
        className={`block space-y-1.5 text-xs font-extrabold text-[#2e221d] ${options.multiline ? "sm:col-span-2" : ""}`}
      >
        <span>{label}</span>
        {options.multiline ? (
          <textarea
            rows={3}
            value={draft[key]}
            onChange={(event) => onTextChange(key, event.target.value)}
            maxLength={options.limit}
            required={!options.optional}
            className={`${inputBase} min-h-[88px] py-2.5 resize-y`}
          />
        ) : (
          <input
            type={options.type ?? "text"}
            value={draft[key]}
            onChange={(event) => onTextChange(key, event.target.value)}
            maxLength={options.limit}
            required={!options.optional}
            className={inputBase}
          />
        )}
      </label>
    );
  }

  return (
    <div className="space-y-4">
      <SectionPanel
        id="details"
        title="Cover & party details"
        description="Customize the opening envelope greeting, celebration date, and Ms. Rachel’s welcome message."
        hidden={section !== "details"}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {field("nickname", "Birthday name", { limit: 30 })}
          {field("date", "Party date", { type: "date" })}
          {field("start", "Start time (Manila)", { type: "time" })}
          {field("end", "End time (Manila)", { type: "time" })}
          {field("timeNote", "Time note", { limit: 150, optional: true })}
          {field("coverIntro", "Cover message", { multiline: true, limit: 180 })}
          {field("welcomeMessage", "Welcome message", { multiline: true, limit: 450 })}
        </div>
      </SectionPanel>

      <SectionPanel
        id="location"
        title="Venue and directions"
        description="Update the party address, landmarks, and map navigation links."
        hidden={section !== "location"}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {field("venueName", "Venue name", { limit: 140 })}
          {field("hall", "Room or hall", { limit: 140, optional: true })}
          {field("address", "Address", { multiline: true, limit: 240 })}
          {field("landmarks", "Landmarks and parking", { multiline: true, limit: 350, optional: true })}
          {field("mapsUrl", "Google Maps link", { type: "url", optional: true })}
          {field("wazeUrl", "Waze link", { type: "url", optional: true })}
        </div>
      </SectionPanel>

      <SectionPanel
        id="outfits"
        title="Dress code"
        description="Set the guest palette swatches displayed in Ms. Rachel’s wardrobe hanger scene."
        hidden={section !== "outfits"}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {field("dressHeading", "Heading", { limit: 62 })}
          {field("dressIntro", "Outfit instructions", { multiline: true, limit: 300 })}
        </div>

        <div className="space-y-2.5 pt-2" data-setting="swatches">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#2e221d]">
              Color swatches ({draft.swatches.length}/6)
            </span>
          </div>
          {draft.swatches.map((swatch, index) => (
            <div
              key={index}
              className="rounded-2xl border border-[#e7dcc8] bg-[#fffbf2] p-3 grid grid-cols-[54px_minmax(0,1fr)_38px] sm:grid-cols-[54px_minmax(0,0.8fr)_minmax(0,1.2fr)_38px] gap-2.5 items-end"
            >
              <label data-setting={`swatches.${index}.hex`} className="block space-y-1 text-[11px] font-extrabold text-[#645147]">
                <span>Color</span>
                <input
                  type="color"
                  value={swatch.hex}
                  onChange={({ target }) =>
                    setDraft((current) => ({
                      ...current,
                      swatches: current.swatches.map((item, i) =>
                        i === index ? { ...item, hex: target.value } : item,
                      ),
                    }))
                  }
                  className="w-full h-[42px] rounded-xl border border-[#dfd2be] bg-white p-1 cursor-pointer"
                />
              </label>

              <label data-setting={`swatches.${index}.name`} className="block space-y-1 text-[11px] font-extrabold text-[#645147]">
                <span>Name</span>
                <input
                  required
                  maxLength={32}
                  value={swatch.name}
                  placeholder="Warm Cream"
                  onChange={({ target }) =>
                    setDraft((current) => ({
                      ...current,
                      swatches: current.swatches.map((item, i) =>
                        i === index ? { ...item, name: target.value } : item,
                      ),
                    }))
                  }
                  className="w-full min-h-[42px] rounded-xl border border-[#dfd2be] bg-white px-3 py-1.5 text-sm font-semibold text-[#2e221d] focus:border-[#c94b77] focus:outline-none"
                />
              </label>

              <label data-setting={`swatches.${index}.tip`} className="block space-y-1 text-[11px] font-extrabold text-[#645147] col-span-3 sm:col-span-1">
                <span>Outfit tip</span>
                <input
                  maxLength={150}
                  value={swatch.tip}
                  placeholder="Airy linen or soft cotton"
                  onChange={({ target }) =>
                    setDraft((current) => ({
                      ...current,
                      swatches: current.swatches.map((item, i) =>
                        i === index ? { ...item, tip: target.value } : item,
                      ),
                    }))
                  }
                  className="w-full min-h-[42px] rounded-xl border border-[#dfd2be] bg-white px-3 py-1.5 text-sm font-semibold text-[#2e221d] focus:border-[#c94b77] focus:outline-none"
                />
              </label>

              <button
                type="button"
                aria-label={`Remove color ${index + 1}`}
                disabled={draft.swatches.length <= 1}
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    swatches: current.swatches.filter((_, i) => i !== index),
                  }))
                }
                className="col-start-3 row-start-1 sm:col-auto sm:row-auto w-[38px] h-[42px] rounded-xl border border-transparent hover:border-[#c94b77]/30 hover:bg-[#fadce6]/60 text-[#9e3359] flex items-center justify-center transition-colors disabled:opacity-35"
              >
                <Trash2 className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          disabled={draft.swatches.length >= 6}
          onClick={() =>
            setDraft((current) => ({
              ...current,
              swatches: [...current.swatches, { name: "", hex: "#f5f2eb", tip: "" }],
            }))
          }
          className="inline-flex items-center gap-1.5 min-h-[38px] px-4 rounded-full bg-[#fff8ea] hover:bg-[#fbe07b]/40 border border-[#e3bf75] text-xs font-extrabold text-[#2e221d] transition-colors disabled:opacity-45"
        >
          <Plus className="w-3.5 h-3.5 text-[#9e3359]" aria-hidden="true" />
          Add color
        </button>
      </SectionPanel>

      <SectionPanel
        id="schedule"
        title="Party program"
        description="Build the celebration timeline shown beside Potty Tinay and the birthday cake."
        hidden={section !== "schedule"}
      >
        <div className="space-y-2.5" data-setting="program">
          {draft.program.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl border border-[#e7dcc8] bg-[#fffbf2] p-3 grid grid-cols-[minmax(84px,0.5fr)_minmax(0,1fr)_38px] sm:grid-cols-[minmax(96px,0.45fr)_minmax(0,0.9fr)_minmax(0,1.25fr)_38px] gap-2.5 items-end"
            >
              {(["time", "title", "description"] as const).map((key) => (
                <label
                  key={key}
                  data-setting={`program.${index}.${key}`}
                  className={`block space-y-1 text-[11px] font-extrabold text-[#645147] ${
                    key === "description" ? "col-span-3 sm:col-span-1" : ""
                  }`}
                >
                  <span>{key === "time" ? "Time" : key === "title" ? "Activity" : "Description"}</span>
                  <input
                    value={item[key]}
                    required={key !== "description"}
                    maxLength={key === "time" ? 26 : key === "title" ? 100 : 250}
                    placeholder={key === "time" ? "2:30 PM" : key === "title" ? "Sing-along" : "Optional detail"}
                    onChange={({ target }) =>
                      setDraft((current) => ({
                        ...current,
                        program: current.program.map((entry, i) =>
                          i === index ? { ...entry, [key]: target.value } : entry,
                        ),
                      }))
                    }
                    className="w-full min-h-[42px] rounded-xl border border-[#dfd2be] bg-white px-3 py-1.5 text-sm font-semibold text-[#2e221d] focus:border-[#c94b77] focus:outline-none"
                  />
                </label>
              ))}

              <button
                type="button"
                aria-label={`Remove activity ${index + 1}`}
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    program: current.program.filter((_, i) => i !== index),
                  }))
                }
                className="col-start-3 row-start-1 sm:col-auto sm:row-auto w-[38px] h-[42px] rounded-xl border border-transparent hover:border-[#c94b77]/30 hover:bg-[#fadce6]/60 text-[#9e3359] flex items-center justify-center transition-colors"
              >
                <Trash2 className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          disabled={draft.program.length >= 14}
          onClick={() =>
            setDraft((current) => ({
              ...current,
              program: [...current.program, { time: "", title: "", description: "" }],
            }))
          }
          className="inline-flex items-center gap-1.5 min-h-[38px] px-4 rounded-full bg-[#fff8ea] hover:bg-[#fbe07b]/40 border border-[#e3bf75] text-xs font-extrabold text-[#2e221d] transition-colors disabled:opacity-45"
        >
          <Plus className="w-3.5 h-3.5 text-[#9e3359]" aria-hidden="true" />
          Add activity
        </button>
      </SectionPanel>

      <SectionPanel
        id="contact"
        title="RSVP settings"
        description="Set the RSVP cutoff date and optional WhatsApp host number."
        hidden={section !== "contact"}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {field("deadline", "RSVP deadline", { type: "date" })}
          {field("whatsapp", "Host WhatsApp number with country code", {
            type: "tel",
            limit: 16,
            optional: true,
          })}
        </div>
        <p className="text-xs font-semibold text-[#645147] rounded-xl bg-[#fff8ea] border border-[#e7dcc8] px-3.5 py-2.5">
          Leave the WhatsApp number blank to let guests choose their recipient inside WhatsApp.
        </p>
      </SectionPanel>
    </div>
  );
}

export function MediaPanel({
  draft,
  saved,
  busy,
  onUpload,
  onRestoreDefault,
}: {
  draft: InvitationSettings;
  saved: InvitationSettings;
  busy: string;
  onUpload: (slot: MediaSlot, file?: File) => void;
  onRestoreDefault: (slot: MediaSlot) => void;
}) {
  return (
    <section
      id="media"
      className="rounded-3xl border border-[#e7dcc8] bg-[#fffdf8] p-5 sm:p-6 shadow-sm space-y-5"
    >
      <div className="border-b border-[#e7dcc8]/80 pb-3.5">
        <h3 className="font-storybook text-xl font-bold text-[#2e221d]">Photos and music</h3>
        <p className="text-xs font-semibold text-[#645147] mt-0.5">
          Upload custom visuals or a background track, then publish changes to show them to guests.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mediaSlots.map(({ key, title, subtitle, hint }) => {
          const source = invitationMediaUrl(draft.media[key]);
          const isStaged = draft.media[key] !== saved.media[key];
          const statusLabel = isStaged ? "Ready to publish" : source ? "Published upload" : "Using default";

          return (
            <article
              key={key}
              className="rounded-2xl border border-[#e7dcc8] bg-[#fffbf2] p-4 flex flex-col justify-between gap-3"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-storybook text-base font-bold text-[#2e221d]">{title}</h4>
                    <p className="text-[11px] font-semibold text-[#645147] mt-0.5">{subtitle}</p>
                  </div>
                  <span
                    className={`shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isStaged
                        ? "bg-[#fbe07b]/80 text-[#70451e]"
                        : source
                          ? "bg-[#e4efdc] text-[#2a5c3d]"
                          : "bg-[#d6eefa] text-[#256f9e]"
                    }`}
                  >
                    {statusLabel}
                  </span>
                </div>

                {key === "music" ? (
                  source ? (
                    <div className="rounded-xl bg-white border border-[#e7dcc8] p-2.5">
                      <audio controls preload="none" src={source} className="w-full h-10" />
                    </div>
                  ) : (
                    <div className="h-32 rounded-xl bg-gradient-to-br from-[#fadce6]/60 via-[#fffbf2] to-[#d6eefa]/70 border border-[#e7dcc8] flex flex-col items-center justify-center gap-1.5 text-[#9e3359]">
                      <Music2 className="w-7 h-7" aria-hidden="true" />
                      <span className="text-[11px] font-extrabold text-[#2e221d]">
                        Built-in You Are My Sunshine
                      </span>
                    </div>
                  )
                ) : (
                  <div className="h-32 rounded-xl overflow-hidden border border-[#e7dcc8] bg-gradient-to-b from-[#d6eefa] to-[#e4efdc] flex items-center justify-center">
                    {key === "portrait" ? (
                      <img
                        loading="lazy"
                        src={source || "/images/cutouts/baby-linggit-cutout.png"}
                        alt={title}
                        className={source ? "w-full h-full object-cover" : "h-28 w-auto object-contain drop-shadow-sm"}
                      />
                    ) : (
                      <img
                        loading="lazy"
                        src={source || "/images/sunshine-storybook.webp"}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                )}

                <p className="text-[11px] font-semibold text-[#645147] leading-relaxed">{hint}</p>
              </div>

              <div className="space-y-2 pt-1">
                <label className="relative flex items-center justify-center gap-2 min-h-[40px] rounded-full bg-white hover:bg-[#f8eed9] border border-[#dfd2be] px-4 text-xs font-extrabold text-[#2e221d] cursor-pointer transition-colors">
                  <ImagePlus className="w-4 h-4 text-[#9e3359]" aria-hidden="true" />
                  <span>{busy === key ? "Uploading…" : source ? "Replace file" : "Upload file"}</span>
                  <input
                    type="file"
                    aria-label={`Upload ${title.toLowerCase()}`}
                    accept={key === "music" ? ".mp3,audio/mpeg" : "image/*"}
                    disabled={Boolean(busy)}
                    onChange={(event) => {
                      onUpload(key, event.currentTarget.files?.[0]);
                      event.currentTarget.value = "";
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </label>

                {source && (
                  <button
                    type="button"
                    disabled={Boolean(busy)}
                    onClick={() => onRestoreDefault(key)}
                    className="w-full text-center text-xs font-extrabold text-[#9e3359] hover:underline py-1 disabled:opacity-45"
                  >
                    Restore default
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
