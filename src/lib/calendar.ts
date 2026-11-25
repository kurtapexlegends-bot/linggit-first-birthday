import type { formatInvitation, InvitationSettings } from "@/lib/invitation-settings";

function foldCalendarLine(line: string) {
  const encoder = new TextEncoder();
  let bytes = 0;
  let folded = "";
  for (const character of line) {
    const size = encoder.encode(character).length;
    if (bytes + size > 75) {
      folded += "\r\n ";
      bytes = 1;
    }
    folded += character;
    bytes += size;
  }
  return folded;
}

export function downloadBirthdayCalendar(
  settings: InvitationSettings,
  dates: ReturnType<typeof formatInvitation>
) {
  const escape = (value: string) =>
    value
      .replace(/\\/g, "\\\\")
      .replace(/\r?\n/g, "\\n")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Linggit//First Birthday Storybook//EN",
    "BEGIN:VEVENT",
    "UID:linggit-first-birthday@storybook-invitation",
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z")}`,
    `DTSTART:${dates.calendarStart}`,
    `DTEND:${dates.calendarEnd}`,
    `SUMMARY:${escape(`${settings.nickname}’s 1st Birthday Celebration`)}`,
    `LOCATION:${escape(`${settings.venueName}, ${settings.address}`)}`,
    `DESCRIPTION:${escape(`Dress code: ${settings.dressHeading} — ${settings.dressIntro}`)}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ];

  const blob = new Blob([lines.map(foldCalendarLine).join("\r\n")], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${settings.nickname.toLowerCase().replace(/\s+/g, "-")}-first-birthday.ics`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
