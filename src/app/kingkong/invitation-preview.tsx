"use client";

import { CalendarDays, Eye, MapPin } from "lucide-react";
import { invitationMediaUrl, type InvitationSettings } from "@/lib/invitation-settings";
import styles from "./editor.module.css";

export const invitationSections = [
  { id: "details", label: "Cover & details", keys: ["nickname", "date", "start", "end", "timeNote", "coverIntro", "welcomeMessage"] },
  { id: "location", label: "Venue", keys: ["venueName", "hall", "address", "landmarks", "mapsUrl", "wazeUrl"] },
  { id: "outfits", label: "Dress code", keys: ["dressHeading", "dressIntro", "swatches"] },
  { id: "schedule", label: "Program", keys: ["program"] },
  { id: "contact", label: "RSVP", keys: ["deadline", "whatsapp"] },
] as const;
export type InvitationSection = (typeof invitationSections)[number]["id"];

const dateFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "full", timeZone: "Asia/Manila",
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

export function InvitationPreview({ draft, section, dirty }: {
  draft: InvitationSettings; section: InvitationSection; dirty: boolean;
}) {
  const cover = invitationMediaUrl(draft.media.cover) || "/images/sunshine-phone.webp";
  const label = invitationSections.find((entry) => entry.id === section)?.label;

  return <aside className={styles.preview} aria-label="Invitation draft preview">
    <div className={styles.previewHeading}>
      <div><Eye size={17} aria-hidden="true" /><h3>Draft preview</h3></div>
      <span>{dirty ? "Unpublished" : "Published"}</span>
    </div>
    <div className={styles.previewSurface}>
      {section === "details" ? <>
        <div className={styles.previewCover}>
          <img src={cover} alt="" />
          <div>
            <p>A first birthday invitation</p>
            <h4>{draft.nickname || "Birthday name"}<em>turns one!</em></h4>
            <p>{draft.coverIntro}</p>
          </div>
        </div>
        <div className={styles.previewDetails}>
          <p><CalendarDays size={15} aria-hidden="true" /> {dateLabel(draft.date)}</p>
          <p>{timeLabel(draft.start)} – {timeLabel(draft.end)}</p>
          {draft.timeNote && <p>{draft.timeNote}</p>}
          {draft.welcomeMessage && <p>{draft.welcomeMessage}</p>}
        </div>
      </> : <div className={styles.previewDetails}>
        <span className={styles.previewLabel}>{label}</span>
        {section === "location" && <>
          <h4>{draft.venueName || "Venue name"}</h4>
          {draft.address && <p><MapPin size={15} aria-hidden="true" /> {draft.address}</p>}
          {draft.hall && <p>{draft.hall}</p>}
          {draft.landmarks && <p>{draft.landmarks}</p>}
          <p>{[draft.mapsUrl && "Google Maps", draft.wazeUrl && "Waze"].filter(Boolean).join(" · ")}</p>
        </>}
        {section === "outfits" && <>
          <h4>{draft.dressHeading || "Dress code"}</h4>
          <p>{draft.dressIntro}</p>
          <ul className={styles.previewSwatches}>{draft.swatches.map((swatch, index) => (
            <li key={index}><span style={{ backgroundColor: swatch.hex }} /><span>{swatch.name || "Unnamed color"}</span></li>
          ))}</ul>
        </>}
        {section === "schedule" && (draft.program.length ? <ol className={styles.previewSchedule}>
          {draft.program.map((entry, index) => <li key={index}><time>{entry.time || "Time"}</time><strong>{entry.title || "Activity"}</strong>{entry.description && <p>{entry.description}</p>}</li>)}
        </ol> : <p>No activities added.</p>)}
        {section === "contact" && <>
          <h4>RSVP by</h4>
          <p>{dateLabel(draft.deadline)}</p>
          <p>{draft.whatsapp ? `WhatsApp contact: ${draft.whatsapp}` : "Guests can choose a WhatsApp recipient when sharing a copy."}</p>
        </>}
      </div>}
    </div>
  </aside>;
}
