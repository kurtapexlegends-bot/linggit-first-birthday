import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { eventConfig } from "@/config/event-config";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const title = `${eventConfig.celebrant.nickname} Turns One!`;
const description = "Open Linggit’s first birthday invitation for the party details, dress code, and RSVP.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website" },
};

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#fff8ea",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
