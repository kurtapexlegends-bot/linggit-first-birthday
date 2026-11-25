"use client";

import { useRef, useState, type PointerEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, Sun, Volume2, ArrowUp } from "lucide-react";
import type { formatInvitation, InvitationSettings } from "@/lib/invitation-settings";

interface EnvelopeCoverProps {
  settings: InvitationSettings;
  dates: ReturnType<typeof formatInvitation>;
  coverSrc: string;
  opening: boolean;
  onOpen: () => void;
}

export function EnvelopeCover({ settings, dates, coverSrc, opening, onOpen }: EnvelopeCoverProps) {
  const prefersReducedMotion = useReducedMotion();
  const drag = useRef<{ id: number; startY: number }>();
  const moved = useRef(false);
  const [pullPx, setPullPx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    if (opening || !event.isPrimary || event.button !== 0) return;
    drag.current = { id: event.pointerId, startY: event.clientY };
    moved.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLButtonElement>) {
    const start = drag.current;
    if (!start || start.id !== event.pointerId || opening) return;
    const delta = start.startY - event.clientY;
    if (Math.abs(delta) > 8) {
      moved.current = true;
      setIsDragging(true);
    }
    if (moved.current) {
      setPullPx(Math.max(0, Math.min(delta, 88)));
    }
  }

  function handlePointerEnd(event: PointerEvent<HTMLButtonElement>, cancelled = false) {
    const start = drag.current;
    if (!start || start.id !== event.pointerId) return;
    const delta = start.startY - event.clientY;
    drag.current = undefined;
    setIsDragging(false);
    setPullPx(0);
    if (!cancelled && delta >= 48) {
      moved.current = true;
      onOpen();
    }
  }

  return (
    <section
      aria-labelledby="cover-heading"
      className="relative min-h-[100svh] w-full flex flex-col items-center justify-between overflow-hidden px-4 pt-20 pb-8 sm:pt-24 sm:pb-10"
    >
      {/* Painted Sunlit Meadow Background */}
      <picture className="absolute inset-0 -z-10 block" aria-hidden="true">
        {!coverSrc && (
          <source media="(max-width: 640px) and (orientation: portrait)" srcSet="/images/sunshine-phone.webp" />
        )}
        <img
          src={coverSrc || "/images/sunshine-storybook.webp"}
          alt=""
          className="h-full w-full object-cover object-center"
          fetchPriority="high"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,251,242,0.82) 0%, rgba(255,251,242,0.42) 38%, rgba(255,251,242,0.68) 100%)",
          }}
        />
      </picture>

      {/* Top Greeting Headline */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 text-center max-w-xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-[#e3bf75]/70 shadow-sm text-xs sm:text-sm font-bold text-[#9e3359] mb-4">
          <CalendarDays className="w-4 h-4 text-[#c94b77]" aria-hidden="true" />
          <time dateTime={settings.date}>{dates.displayDate}</time>
        </div>

        <h1
          id="cover-heading"
          className="font-storybook text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#2e221d] leading-[0.98] drop-shadow-[0_2px_10px_rgba(255,251,242,0.9)]"
        >
          {settings.nickname} turns one!
        </h1>

        <p className="mt-3 text-base sm:text-lg font-semibold text-[#544037] max-w-md mx-auto leading-snug">
          {settings.coverIntro}
        </p>
      </motion.div>

      {/* Centerpiece Tactile 3D Envelope */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 34, scale: 0.94 }}
        animate={
          opening
            ? { scale: 1.04, y: -10 }
            : prefersReducedMotion
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 1, y: [0, -7, 0], scale: 1 }
        }
        transition={
          opening
            ? { duration: 0.45, ease: [0.23, 1, 0.32, 1] }
            : {
                opacity: { duration: 0.6, delay: 0.12 },
                scale: { duration: 0.6, delay: 0.12 },
                y: { duration: 4.4, repeat: Infinity, ease: "easeInOut" },
              }
        }
        className="relative z-20 w-full max-w-[360px] sm:max-w-[400px] my-auto py-8 flex flex-col items-center"
      >
        <button
          id="open-invitation"
          type="button"
          disabled={opening}
          aria-label={`Open ${settings.nickname}'s first birthday invitation`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={(e) => handlePointerEnd(e)}
          onPointerCancel={(e) => handlePointerEnd(e, true)}
          onLostPointerCapture={(e) => handlePointerEnd(e, true)}
          onClick={() => {
            if (!moved.current) onOpen();
            moved.current = false;
          }}
          className="envelope-3d relative block w-full aspect-[1.48] rounded-xl cursor-pointer touch-none select-none group focus-visible:outline-offset-8 active:scale-[0.985] transition-transform"
          style={{
            filter: "drop-shadow(0 22px 26px rgba(105, 63, 39, 0.24))",
          }}
        >
          {/* Back cavity with Ms. Rachel blue gingham liner */}
          <span className="envelope-gingham absolute inset-0 rounded-xl border border-[#c9841a]/25 overflow-hidden" />

          {/* Sliding Storybook Letter Inside */}
          <motion.span
            aria-hidden="true"
            animate={
              opening
                ? { y: "-52%", opacity: 1 }
                : isDragging
                  ? { y: -pullPx, opacity: 1 }
                  : { y: "4%", opacity: 0.96 }
            }
            transition={
              isDragging
                ? { type: "tween", duration: 0 }
                : { type: "spring", stiffness: 260, damping: 22 }
            }
            className="absolute inset-x-[6%] top-[7%] bottom-[12%] z-[2] rounded-lg bg-[#fffbf2] border border-[#e3bf75] shadow-md flex flex-col items-center justify-start pt-5 px-4 text-center"
          >
            <span className="w-9 h-9 rounded-full bg-[#fbe07b]/60 flex items-center justify-center text-[#9e3359] mb-1.5">
              <Sun className="w-5 h-5" />
            </span>
            <span className="font-storybook text-xl sm:text-2xl font-bold text-[#9e3359] leading-tight">
              You’re invited!
            </span>
            <span className="text-xs font-bold text-[#645147] mt-1">
              With love from Ms. Rachel &amp; {settings.nickname}
            </span>
          </motion.span>

          {/* Envelope Front Side & Bottom Folds */}
          <span
            className="envelope-pocket-front absolute inset-0 z-[3] rounded-xl"
            style={{ background: "linear-gradient(155deg, #f3b8c9 0%, #f7cdd8 100%)" }}
          />
          <span
            className="envelope-pocket-bottom absolute inset-0 z-[3] rounded-xl"
            style={{ background: "linear-gradient(180deg, #fae0e8 0%, #efbdcb 100%)" }}
          />

          {/* 3D Animated Top Flap */}
          <motion.span
            aria-hidden="true"
            animate={
              opening
                ? { rotateX: 175, zIndex: 1 }
                : isDragging
                  ? { rotateX: Math.min(130, pullPx * 1.6), zIndex: pullPx > 32 ? 1 : 4 }
                  : { rotateX: 0, zIndex: 4 }
            }
            transition={{ duration: 0.42, ease: [0.23, 1, 0.32, 1] }}
            className="envelope-flap-3d absolute inset-x-0 top-0 h-[58%] rounded-t-xl shadow-sm"
            style={{
              background: "linear-gradient(180deg, #fce8ee 0%, #f4c1d0 100%)",
              backfaceVisibility: "hidden",
            }}
          />

          {/* Embossed Golden Sun Wax Seal (outer wrapper owns translate centering so Framer Motion scale never overwrites it) */}
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-[54%] -translate-x-1/2 -translate-y-1/2 z-[5]"
          >
            <motion.span
              animate={
                opening || isDragging
                  ? { opacity: 0, scale: 0.72 }
                  : { opacity: 1, scale: [1, 1.05, 1] }
              }
              transition={
                opening || isDragging
                  ? { duration: 0.18 }
                  : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
              }
              className="w-16 h-16 sm:w-[70px] sm:h-[70px] rounded-full bg-gradient-to-br from-[#fde694] via-[#f0bc4d] to-[#d69324] border-[3px] border-[#fff7dc]/90 shadow-lg flex flex-col items-center justify-center text-[#5c390c] group-hover:scale-105 transition-transform"
            >
              <Sun className="w-6 h-6 stroke-[2.2]" />
              <span className="font-storybook text-[10px] font-bold leading-none tracking-wide uppercase mt-0.5">
                Open
              </span>
            </motion.span>
          </span>
        </button>

        {/* Single Clear Tactile Cue */}
        <motion.div
          animate={opening ? { opacity: 0 } : { opacity: 1 }}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c94b77] text-[#fffbf2] text-sm font-bold shadow-md pointer-events-none"
        >
          <ArrowUp className="w-4 h-4 animate-bounce" aria-hidden="true" />
          <span>{opening ? "Opening the storybook..." : "Tap or pull up the seal to open"}</span>
        </motion.div>
      </motion.div>

      {/* Subtle Audio Readiness Note */}
      <p className="relative z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-[#2e221d]/10 text-xs font-bold text-[#645147]">
        <Volume2 className="w-3.5 h-3.5 text-[#c94b77]" aria-hidden="true" />
        <span>Plays “You Are My Sunshine” when opened</span>
      </p>
    </section>
  );
}
