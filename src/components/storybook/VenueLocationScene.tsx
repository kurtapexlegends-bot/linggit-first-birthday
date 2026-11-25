"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Copy,
  ExternalLink,
  MapPin,
  Navigation,
} from "lucide-react";
import { eventConfig } from "@/config/event-config";
import type { formatInvitation, InvitationSettings } from "@/lib/invitation-settings";
import { audioController } from "@/lib/audio";
import { downloadBirthdayCalendar } from "@/lib/calendar";

interface VenueLocationSceneProps {
  settings: InvitationSettings;
  dates: ReturnType<typeof formatInvitation>;
  onNext: () => void;
}

export function VenueLocationScene({ settings, dates, onNext }: VenueLocationSceneProps) {
  const prefersReducedMotion = useReducedMotion();
  const [pinBurst, setPinBurst] = useState(0);
  const [addressCopied, setAddressCopied] = useState(false);

  const addressQuery = encodeURIComponent(settings.address);
  const mapsUrl =
    settings.mapsUrl === eventConfig.venue.googleMapsUrl
      ? `https://www.google.com/maps/search/?api=1&query=${addressQuery}`
      : settings.mapsUrl;
  const wazeUrl =
    settings.wazeUrl === eventConfig.venue.wazeUrl
      ? `https://waze.com/ul?q=${addressQuery}`
      : settings.wazeUrl;

  function tapPin() {
    audioController.playSparkle();
    setPinBurst((c) => c + 1);
  }

  async function copyAddress() {
    audioController.playPop();
    try {
      await navigator.clipboard.writeText(settings.address);
      setAddressCopied(true);
      window.setTimeout(() => setAddressCopied(false), 2000);
    } catch {
      setAddressCopied(false);
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center gap-5 min-h-[70vh] justify-center">
      {/* Top Playful Speech Bubble */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: -12, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="bg-white rounded-full border-[3px] border-[#c94b77]/35 px-6 py-2.5 shadow-md text-center"
      >
        <p className="font-storybook text-lg sm:text-2xl font-bold text-[#2e221d]">
          “Look right here! Follow my finger to the party pin!”
        </p>
      </motion.div>

      {/* Center Pop-Up Stage: Floating Treasure Map on Left + Frameless Pointing Ms. Rachel on Right */}
      <div className="relative w-full max-w-4xl flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-2">
        {/* Left: Tilted Floating Painted Neighborhood Map with Giant Bouncing Pin */}
        <motion.button
          type="button"
          onClick={tapPin}
          aria-label={`Bounce map pin for ${settings.venueName}`}
          initial={prefersReducedMotion ? false : { scale: 0.82, rotate: -6, opacity: 0 }}
          animate={{ scale: 1, rotate: -2.5, opacity: 1 }}
          whileHover={prefersReducedMotion ? undefined : { scale: 1.03, rotate: 0 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 230, damping: 18 }}
          className="relative w-[290px] sm:w-[340px] md:w-[380px] aspect-[4/3] rounded-[2rem] overflow-hidden border-[8px] border-white shadow-[0_20px_36px_-10px_rgba(46,34,29,0.28)] cursor-pointer shrink-0"
        >
          <img
            src="/images/neighborhood-storybook.webp"
            alt="Painted storybook neighborhood map"
            className="w-full h-full object-cover"
          />

          {/* Pulsing Radar + Giant Bouncing Pin */}
          <span className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="relative flex items-center justify-center">
              <motion.span
                key={pinBurst}
                initial={{ scale: 0.7, opacity: 0.8 }}
                animate={{ scale: 2.4, opacity: 0 }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                className="absolute w-14 h-14 rounded-full bg-[#c94b77]/50"
              />
              <motion.span
                animate={prefersReducedMotion ? undefined : { y: [0, -12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#c94b77] border-[4px] border-white shadow-xl flex items-center justify-center text-white"
              >
                <MapPin className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.3]" />
              </motion.span>
            </span>

            <span className="mt-2 px-3.5 py-1 rounded-full bg-[#fffbf2]/95 border-2 border-[#e3bf75] shadow-md font-storybook text-xs sm:text-sm font-bold text-[#2e221d]">
              Party pin!
            </span>
          </span>
        </motion.button>

        {/* Right: Frameless Cutout Ms. Rachel Physically Pointing Left Directly At The Map! */}
        <motion.div
          initial={prefersReducedMotion ? false : { x: 80, opacity: 0, scale: 0.85 }}
          animate={
            prefersReducedMotion
              ? { x: 0, opacity: 1, scale: 1 }
              : { x: 0, y: [0, -6, 0], rotate: [-1.5, 1.5, -1.5], opacity: 1, scale: 1 }
          }
          transition={{
            x: { type: "spring", stiffness: 200, damping: 18 },
            y: { duration: 3.4, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
          }}
          className="relative sm:-ml-8 z-10 w-[230px] sm:w-[290px] md:w-[330px] aspect-square shrink-0 pointer-events-none"
        >
          <img
            src="/images/cutouts/ms-rachel-cutout.png"
            alt="Ms. Rachel pointing directly at the birthday party location pin"
            className="w-full h-full object-contain drop-shadow-[0_18px_24px_rgba(46,34,29,0.22)]"
          />
        </motion.div>
      </div>

      {/* Bottom Airy Floating Venue Info & Navigation Pills */}
      <div className="w-full max-w-3xl bg-white/90 backdrop-blur-md rounded-[2rem] border-2 border-[#fffbf2] shadow-lg px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <h2 className="font-storybook text-xl sm:text-2xl font-bold text-[#2e221d] leading-tight">
            {settings.venueName}
          </h2>
          <p className="text-xs sm:text-sm font-bold text-[#645147] mt-0.5">{settings.address}</p>
          <div className="mt-1.5 flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs font-extrabold text-[#256f9e]">
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5 text-[#c94b77]" /> {dates.displayDate}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock3 className="w-3.5 h-3.5 text-[#256f9e]" /> {dates.displayTime}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 shrink-0">
          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => audioController.playPop()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#d6eefa] hover:bg-[#bfe4f7] text-[#1f5d87] text-xs font-extrabold active:scale-95 transition-transform"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
          {wazeUrl && (
            <a
              href={wazeUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => audioController.playPop()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#e4efdc] hover:bg-[#d3e6c6] text-[#2f5a35] text-xs font-extrabold active:scale-95 transition-transform"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Waze</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
          <button
            type="button"
            onClick={copyAddress}
            className="inline-flex items-center gap-1 px-3.5 py-2.5 rounded-full bg-[#fff8ea] border border-[#e3bf75] text-xs font-extrabold text-[#7d4e0d]"
          >
            {addressCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{addressCopied ? "Copied" : "Copy"}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              audioController.playPop();
              downloadBirthdayCalendar(settings, dates);
            }}
            className="inline-flex items-center gap-1 px-3.5 py-2.5 rounded-full bg-[#fff8ea] border border-[#e3bf75] text-xs font-extrabold text-[#7d4e0d]"
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Calendar</span>
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[#c94b77] hover:bg-[#9e3359] text-[#fffbf2] font-storybook text-base sm:text-lg font-bold shadow-[0_10px_22px_-6px_rgba(158,51,89,0.5)] active:scale-95 transition-[background-color,transform]"
      >
        <span>Here comes {settings.nickname}!</span>
        <ArrowRight className="w-5 h-5" aria-hidden="true" />
      </button>
    </div>
  );
}
