"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown, Flame, Music2, RotateCcw, Sparkles } from "lucide-react";
import { eventConfig } from "@/config/event-config";
import type { formatInvitation, InvitationSettings } from "@/lib/invitation-settings";
import { audioController } from "@/lib/audio";

interface FavoritesCakeSceneProps {
  settings: InvitationSettings;
  dates: ReturnType<typeof formatInvitation>;
  onNext: () => void;
}

const pottyReactions = [
  "Yay! Potty Tinay is Linggit’s favorite Ms. Rachel song!",
  "Clap, clap, clap! Good job dancing along!",
  "Put your hands up! Songs for Littles time!",
];

export function FavoritesCakeScene({ settings, dates, onNext }: FavoritesCakeSceneProps) {
  const prefersReducedMotion = useReducedMotion();
  const [pottyTapCount, setPottyTapCount] = useState(0);
  const [candleLit, setCandleLit] = useState(true);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  function tapPotty() {
    audioController.playPottyCheer();
    setPottyTapCount((c) => c + 1);
  }

  function blowCandle() {
    setCandleLit(false);
    audioController.playCandleBlow();
    if (prefersReducedMotion) return;
    void import("canvas-confetti")
      .then(({ default: confetti }) => {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#c94b77", "#fbe07b", "#7bc0e3", "#ffffff"],
          disableForReducedMotion: true,
        });
      })
      .catch(() => {});
  }

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center gap-6 min-h-[70vh] justify-center">
      {/* Dual Frameless Pop-Up Stage: Dancing Potty Tinay (left) + Interactive Birthday Cake (right) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
        {/* Left: Dancing Potty Tinay Sticker Cutout */}
        <div className="flex flex-col items-center text-center">
          <div className="bg-white/95 rounded-2xl border-2 border-[#7bc0e3] px-4 py-2.5 shadow-sm mb-3 max-w-xs">
            <span className="text-[11px] font-extrabold text-[#256f9e] block">
              Linggit’s Ms. Rachel Favorite
            </span>
            <p className="font-storybook text-base sm:text-lg font-bold text-[#2e221d] leading-snug">
              {pottyTapCount === 0
                ? "Tap Potty Tinay to dance & play a chime!"
                : pottyReactions[(pottyTapCount - 1) % pottyReactions.length]}
            </p>
          </div>

          <div className="relative">
            <motion.button
              type="button"
              onClick={tapPotty}
              key={pottyTapCount}
              initial={pottyTapCount > 0 ? { scale: 0.86, rotate: -10 } : false}
              animate={
                prefersReducedMotion
                  ? { scale: 1, rotate: 0 }
                  : { y: [0, -10, 0], rotate: [-4, 4, -4], scale: 1 }
              }
              whileHover={prefersReducedMotion ? undefined : { scale: 1.07 }}
              whileTap={{ scale: 0.92 }}
              transition={{
                y: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
                scale: { type: "spring", stiffness: 320, damping: 14 },
              }}
              aria-label="Tap Potty Tinay to make it dance and play music"
              className="w-48 h-48 sm:w-56 sm:h-56 cursor-pointer focus-visible:outline-offset-4"
            >
              <img
                src="/images/cutouts/potty-tinay-cutout.png"
                alt="Dancing cartoon Potty Tinay sticker cutout"
                className="w-full h-full object-contain drop-shadow-[0_16px_22px_rgba(46,34,29,0.22)]"
              />
            </motion.button>

            <AnimatePresence>
              {pottyTapCount > 0 && !prefersReducedMotion && (
                <motion.span
                  key={`note-${pottyTapCount}`}
                  initial={{ opacity: 0, y: 0, scale: 0.6 }}
                  animate={{ opacity: [0, 1, 0], y: -64, scale: 1.25 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.85, ease: "easeOut" }}
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-2 right-0 w-11 h-11 rounded-full bg-[#c94b77] text-white flex items-center justify-center shadow-lg"
                >
                  <Music2 className="w-5 h-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Floating Milestone Pills */}
          <div className="mt-3 flex flex-wrap justify-center gap-1.5 max-w-sm">
            {eventConfig.milestones.stats.slice(0, 3).map((stat) => (
              <span
                key={stat.label}
                className="px-3 py-1 rounded-full bg-white/90 border border-[#e3bf75]/70 text-[11px] font-extrabold text-[#2e221d] shadow-xs"
              >
                {stat.value}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Frameless Interactive Birthday Cake Cutout */}
        <div className="flex flex-col items-center text-center">
          <div className="bg-white/95 rounded-2xl border-2 border-[#f48fb1] px-4 py-2.5 shadow-sm mb-3 max-w-xs">
            <span className="text-[11px] font-extrabold text-[#9e3359] block">
              Make a birthday wish
            </span>
            <p className="font-storybook text-base sm:text-lg font-bold text-[#2e221d] leading-snug">
              {candleLit ? "Help blow out Linggit’s first candle!" : "Yay! Happy 1st Birthday!"}
            </p>
          </div>

          <motion.div
            animate={prefersReducedMotion ? undefined : { y: [0, -6, 0] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center"
          >
            <img
              src="/images/cutouts/birthday-cake-cutout.png"
              alt="First birthday cake sticker cutout with one pink candle"
              className="w-full h-full object-contain drop-shadow-[0_16px_22px_rgba(46,34,29,0.22)]"
            />
            {candleLit && (
              <span
                className="candle-flame"
                style={{ left: "51.5%", bottom: "96%", width: "6.5%", height: "11%" }}
                aria-hidden="true"
              />
            )}
          </motion.div>

          <button
            type="button"
            onClick={
              candleLit
                ? blowCandle
                : () => {
                    audioController.playPop();
                    setCandleLit(true);
                  }
            }
            className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#c94b77] hover:bg-[#9e3359] text-[#fffbf2] text-sm font-extrabold shadow-md active:scale-95 transition-[background-color,transform]"
          >
            {candleLit ? (
              <>
                <Flame className="w-4 h-4" aria-hidden="true" />
                <span>Blow out the candle</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>Relight candle</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expandable Floating Party Program Pill + Next CTA */}
      <div className="w-full max-w-2xl flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => {
            audioController.playPop();
            setScheduleOpen((o) => !o);
          }}
          aria-expanded={scheduleOpen}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/95 border-2 border-[#e3bf75] text-xs sm:text-sm font-extrabold text-[#2e221d] shadow-sm"
        >
          <span>{scheduleOpen ? "Hide party schedule" : `View party schedule (${dates.displayDate})`}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${scheduleOpen ? "rotate-180" : ""}`}
          />
        </button>

        {scheduleOpen && (
          <div className="w-full bg-white/95 backdrop-blur-md rounded-3xl border-2 border-[#e3bf75]/70 shadow-lg p-4 divide-y divide-[#2e221d]/10 text-left">
            {settings.program.map((item, idx) => (
              <div key={`${item.time}-${idx}`} className="py-2 flex items-start gap-3">
                <span className="text-xs font-extrabold text-[#9e3359] bg-[#fadce6]/75 px-2.5 py-0.5 rounded-full shrink-0 tabular-nums">
                  {item.time}
                </span>
                <div>
                  <p className="text-xs sm:text-sm font-extrabold text-[#2e221d]">{item.title}</p>
                  {item.description && (
                    <p className="text-xs font-semibold text-[#645147]">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[#256f9e] hover:bg-[#1e5c84] text-[#fffbf2] font-storybook text-base sm:text-lg font-bold shadow-[0_10px_22px_-6px_rgba(37,111,158,0.45)] active:scale-95 transition-[background-color,transform]"
        >
          <Sparkles className="w-5 h-5" aria-hidden="true" />
          <span>Save your seat (RSVP)</span>
          <ArrowRight className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
