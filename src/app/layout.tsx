import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { eventConfig } from "@/config/event-config";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fraunces",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${eventConfig.celebrant.nickname} is Turning 1 | Birthday Invitation`,
  description: `You are cordially invited to celebrate ${eventConfig.celebrant.fullName}'s 1st Birthday celebration.`,
  openGraph: {
    title: `${eventConfig.celebrant.nickname}'s 1st Birthday Celebration`,
    description: `Official digital invitation & RSVP for ${eventConfig.celebrant.fullName}`,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF7F2",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${plusJakartaSans.variable}`}>
      <body className="bg-stationery font-sans text-stone-800 antialiased selection:bg-rose-100 selection:text-rose-900">
        {children}
      </body>
    </html>
  );
}
