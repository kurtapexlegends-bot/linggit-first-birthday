import { z } from "zod";
import { eventConfig } from "@/config/event-config";

const text = (limit: number) => z.string().trim().min(1).max(limit);
const optional = (limit: number) => z.string().trim().max(limit);
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use a valid time.");
const httpsLink = z.url({ protocol: /^https$/ }).max(1500).or(z.literal(""));
const photo = z.string().regex(/^[0-9a-f-]{36}\.(webp|jpg|png)$/).or(z.literal(""));
const recording = z.string().regex(/^[0-9a-f-]{36}\.mp3$/).or(z.literal(""));

export const invitationSettingsSchema = z.object({
  nickname: text(30),
  coverIntro: text(180),
  welcomeMessage: text(450),
  date: z.iso.date(),
  start: time,
  end: time,
  timeNote: optional(150),
  venueName: text(140),
  hall: optional(140),
  address: text(240),
  landmarks: optional(350),
  mapsUrl: httpsLink,
  wazeUrl: httpsLink,
  dressHeading: text(62),
  dressIntro: text(300),
  swatches: z.array(z.object({
    name: text(32),
    hex: z.string().regex(/^#[\da-f]{6}$/i, "Use a six-digit hex color."),
    tip: optional(150),
  })).min(1).max(6),
  program: z.array(z.object({
    time: text(26),
    title: text(100),
    description: optional(250),
  })).max(14),
  deadline: z.iso.date(),
  whatsapp: z.string().trim().regex(/^(?:\+?[1-9]\d{7,14})?$/, "Enter a number with its country code."),
  media: z.object({ portrait: photo, cover: photo, music: recording }),
}).refine((settings) => settings.end > settings.start, {
  path: ["end"], message: "The end time must be after the start time.",
}).refine((settings) => settings.deadline <= settings.date, {
  path: ["deadline"], message: "The RSVP deadline must be on or before the event date.",
});

export type InvitationSettings = z.infer<typeof invitationSettingsSchema>;
export type MediaSlot = keyof InvitationSettings["media"];
export const mediaFilePattern = /^[0-9a-f-]{36}\.(webp|jpg|png|mp3)$/;
export const MAX_MEDIA_BYTES = 4 * 1024 * 1024;

export const defaultInvitationSettings: InvitationSettings = {
  nickname: eventConfig.celebrant.nickname,
  coverIntro: "Come celebrate one happy year of our little sunshine.",
  welcomeMessage: "Can you hold up one finger? That’s how old Linggit is turning! Here’s what to wear and where to find us.",
  date: eventConfig.event.date,
  start: "14:00",
  end: "18:00",
  timeNote: "Party starts promptly at 2:30 PM",
  venueName: eventConfig.venue.name,
  hall: eventConfig.venue.hallOrArea,
  address: eventConfig.venue.address,
  landmarks: eventConfig.venue.landmarks,
  mapsUrl: eventConfig.venue.googleMapsUrl,
  wazeUrl: eventConfig.venue.wazeUrl,
  dressHeading: "Come in cozy neutrals.",
  dressIntro: "Think linen shirts, cotton polos, and airy sundresses in soft earth tones.",
  swatches: eventConfig.dressCode.colors.map(({ name, hex, recommendedFor }) => ({ name, hex, tip: recommendedFor })),
  program: eventConfig.program.map(({ time, title, description }) => ({ time, title, description: description ?? "" })),
  deadline: "2026-11-30",
  whatsapp: "",
  media: { portrait: "", cover: "", music: "" },
};

const timeZone = "Asia/Manila";
const dateWithWeekday = new Intl.DateTimeFormat("en-US", {
  timeZone, weekday: "long", year: "numeric", month: "long", day: "numeric",
});
const dateWithoutWeekday = new Intl.DateTimeFormat("en-US", {
  timeZone, year: "numeric", month: "long", day: "numeric",
});
const timeFormat = new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", minute: "2-digit" });
const localDate = (date: string, time = "12:00") => new Date(`${date}T${time}:00+08:00`);
const calendarTime = (date: Date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");

export function formatInvitation(settings: InvitationSettings) {
  const start = localDate(settings.date, settings.start);
  const end = localDate(settings.date, settings.end);
  const note = settings.timeNote ? ` (${settings.timeNote})` : "";
  return {
    displayDate: dateWithWeekday.format(start),
    displayTime: `${timeFormat.format(start)} - ${timeFormat.format(end)}${note}`,
    displayDeadline: dateWithoutWeekday.format(localDate(settings.deadline)),
    calendarStart: calendarTime(start),
    calendarEnd: calendarTime(end),
  };
}

export function invitationMediaUrl(file: string) {
  return file ? `/api/invitation-media/${file}` : "";
}
