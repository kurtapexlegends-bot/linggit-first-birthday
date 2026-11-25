import { existsSync } from "node:fs";
import { join } from "node:path";
import { cache } from "react";
import type { Metadata } from "next";
import { StorybookApp } from "@/components/storybook/StorybookApp";
import { eventConfig } from "@/config/event-config";
import { defaultInvitationSettings, formatInvitation, invitationMediaUrl } from "@/lib/invitation-settings";
import { readPublishedInvitation } from "@/lib/kingkong-store";

export const dynamic = "force-dynamic";

const getSettings = cache(async () => {
  try {
    return (await readPublishedInvitation()).settings;
  } catch {
    return defaultInvitationSettings;
  }
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = `${settings.nickname} Turns One!`;
  return {
    title,
    description: settings.coverIntro,
    openGraph: { title, description: settings.coverIntro, type: "website" },
  };
}

export default async function Home() {
  const settings = await getSettings();
  const photo = eventConfig.celebrant.photoPlaceholder;
  const publicDir = join(process.cwd(), "public");
  const fallbackPhoto = !photo.startsWith("/") || existsSync(join(publicDir, photo)) ? photo : "";
  const fallbackMusic = existsSync(join(publicDir, "audio", "you-are-my-sunshine.mp3"))
    ? "/audio/you-are-my-sunshine.mp3"
    : "";

  return (
    <StorybookApp
      settings={settings}
      dates={formatInvitation(settings)}
      photoSrc={invitationMediaUrl(settings.media.portrait) || fallbackPhoto}
      musicSrc={invitationMediaUrl(settings.media.music) || fallbackMusic}
      coverSrc={invitationMediaUrl(settings.media.cover)}
    />
  );
}
