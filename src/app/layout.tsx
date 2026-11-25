import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { eventConfig } from "@/config/event-config";
import "./globals.css";

const display = Fredoka({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Nunito({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

const title = `${eventConfig.celebrant.nickname} Turns One!`;
const description = "Open Linggit’s Ms. Rachel storybook invitation for party details, outfit palette, directions, and RSVP.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website" },
};

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#FFFBF2",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
