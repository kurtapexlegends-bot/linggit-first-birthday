"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CalendarDays, MapPin, Hand } from "lucide-react";
import type { formatInvitation, InvitationSettings } from "@/lib/invitation-settings";
import { audioController } from "@/lib/audio";

interface MsRachelWelcomeSceneProps {
  settings: InvitationSettings;
  dates: ReturnType<typeof formatInvitation>;
  onNext: () => void;
  onJumpTo: (index: number) => void;
}

const hiLines = [
  "Hi, friends! Can you hold up one finger? Look who’s turning ONE!",
  "Yay! You did it! Put your hands in the air for Linggit’s big day!",
  "I’m so excited to show you the dress code and where the party is!",
];

export function MsRachelWelcomeScene({
  settings,
  dates,
  onNext,
  onJumpTo,
}: MsRachelWelcomeSceneProps) {
  const prefersReducedMotion = useReducedMotion();
  const [hiIndex, setHiIndex] = useState(0);
  const [jumping, setJumping] = useState(false);

  function waveBack() {
    audioController.playSparkle();
    setJumping(true);
    setHiIndex((prev) => (prev + 1) % hiLines.length);
    window.setTimeout(() => setJumping(false), 620);
  }

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-10 min-h-[70vh]">
      {/* Left: Frameless Ms. Rachel Sticker Cutout Popping Up From Behind the Meadow Hills */}
      <div className="relative flex flex-col items-center lg:w-[46%]">
        <motion.button
          type="button"
          onClick={waveBack}
          aria-label="Tap Ms. Rachel to wave hello"
          initial={prefersReducedMotion ? false : { y: 180, scale: 0.78, opacity: 0 }}
          animate={
            jumping
              ? { y: [0, -28, 0], rotate: [-4, 5, -3, 0], scale: [1, 1.06, 1], opacity: 1 }
              : prefersReducedMotion
                ? { y: 0, scale: 1, opacity: 1 }
                : {
                    y: [0, -8, 0],
                    rotate: [-2.2, 2.2, -2.2],
                    scale: 1,
                    opacity: 1,
                  }
          }
          transition={
            jumping
              ? { duration: 0.58, ease: "easeOut" }
              : {
                  y: { duration: 3.6, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 4.8, repeat: Infinity, ease: "easeInOut" },
                  opacity: { duration: 0.35 },
                  scale: { type: "spring", stiffness: 220, damping: 16 },
                }
          }
          className="relative w-[270px] sm:w-[340px] lg:w-[390px] aspect-square cursor-pointer group focus-visible:outline-offset-4"
        >
          <img
            src="/images/cutouts/ms-rachel-cutout.png"
            alt="Ms. Rachel smiling and waving"
            className="w-full h-full object-contain drop-shadow-[0_18px_24px_rgba(46,34,29,0.22)] transition-transform duration-200 group-hover:scale-[1.03]"
          />
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 border-2 border-[#f48fb1] text-xs font-extrabold text-[#9e3359] shadow-md whitespace-nowrap">
            <Hand className="w-3.5 h-3.5 text-[#c94b77]" aria-hidden="true" />
            <span>Tap Ms. Rachel!</span>
          </span>
        </motion.button>
      </div>

      {/* Right: Floating Comic Speech Bubble + Airy Ribbon Details (Zero Boxy SaaS Cards!) */}
      <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-5 max-w-lg">
        {/* Big Cartoon Speech Bubble */}
        <motion.div
          key={hiIndex}
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.86, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 20 }}
          className="relative bg-white rounded-[2rem] border-[3px] border-[#c94b77]/35 px-6 sm:px-7 py-5 shadow-[0_14px_30px_-10px_rgba(158,51,89,0.22)]"
        >
          <p className="font-storybook text-2xl sm:text-3xl font-bold text-[#2e221d] leading-snug">
            “{hiIndex === 0 ? settings.welcomeMessage : hiLines[hiIndex]}”
          </p>
          {/* Tail pointing left on desktop, up on mobile */}
          <span
            aria-hidden="true"
            className="hidden lg:block absolute top-1/2 -left-3.5 -translate-y-1/2 w-6 h-6 bg-white rotate-45 border-l-[3px] border-b-[3px] border-[#c94b77]/35"
          />
          <span
            aria-hidden="true"
            className="lg:hidden absolute -top-3.5 left-1/2 -translate-x-1/2 w-6 h-6 bg-white rotate-45 border-l-[3px] border-t-[3px] border-[#c94b77]/35"
          />
        </motion.div>

        {/* Airy Floating Info Pills (Instead of heavy card boxes) */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/92 backdrop-blur-sm border-2 border-[#fbe07b] shadow-sm text-xs sm:text-sm font-extrabold text-[#2e221d]">
            <CalendarDays className="w-4 h-4 text-[#c94b77] shrink-0" aria-hidden="true" />
            <span>{dates.displayDate}</span>
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/92 backdrop-blur-sm border-2 border-[#7bc0e3]/70 shadow-sm text-xs sm:text-sm font-extrabold text-[#2e221d]">
            <MapPin className="w-4 h-4 text-[#256f9e] shrink-0" aria-hidden="true" />
            <span>{settings.venueName}</span>
          </span>
        </div>

        {/* Big Playful Action Pills */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[#c94b77] hover:bg-[#9e3359] text-[#fffbf2] font-storybook text-base sm:text-lg font-bold shadow-[0_10px_22px_-6px_rgba(158,51,89,0.5)] active:scale-95 transition-[background-color,transform]"
          >
            <span>See the outfit palette!</span>
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => onJumpTo(6)}
            className="px-5 py-4 rounded-full bg-white/90 hover:bg-white border-2 border-[#256f9e]/30 text-[#256f9e] font-extrabold text-sm shadow-sm active:scale-95 transition-[background-color,transform]"
          >
            Jump to RSVP
          </button>
        </div>
      </div>
    </div>
  );
}
