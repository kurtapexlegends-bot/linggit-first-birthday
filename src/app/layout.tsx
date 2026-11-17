import type { Metadata, Viewport } from "next";
import { Fredoka, Quicksand } from "next/font/google";
import "./globals.css";
import { eventConfig } from "@/config/event-config";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-quicksand",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${eventConfig.celebrant.nickname} is Turning 1! 🎈 | Ms. Rachel Birthday Invitation`,
  description: `You're invited to ${eventConfig.celebrant.fullName}'s 1st Birthday Celebration! Featuring Ms. Rachel theme, music, venue map, and dress code.`,
  openGraph: {
    title: `${eventConfig.celebrant.nickname} is Turning 1! 🎉`,
    description: `Official 1st Birthday Invitation & RSVP for ${eventConfig.celebrant.fullName}`,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#F472B6",
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
    <html lang="en" className={`${fredoka.variable} ${quicksand.variable}`}>
      <body className="bg-rachel-pattern antialiased selection:bg-rachel-pink-light selection:text-rachel-pink-dark">
        {children}
      </body>
    </html>
  );
}
