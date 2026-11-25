"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  List,
  Music2,
  Sun,
  VolumeX,
  X,
} from "lucide-react";
import type { formatInvitation, InvitationSettings } from "@/lib/invitation-settings";
import { audioController } from "@/lib/audio";
import { FloatingBubbles } from "./FloatingBubbles";
import { TheaterBackdrop } from "./TheaterBackdrop";
import { EnvelopeCover } from "./EnvelopeCover";
import { MsRachelWelcomeScene } from "./MsRachelWelcomeScene";
import { DressCodeScene } from "./DressCodeScene";
import { VenueLocationScene } from "./VenueLocationScene";
import { BabyRevealScene } from "./BabyRevealScene";
import { FavoritesCakeScene } from "./FavoritesCakeScene";
import { RsvpScene } from "./RsvpScene";

interface StorybookAppProps {
  settings: InvitationSettings;
  dates: ReturnType<typeof formatInvitation>;
  photoSrc: string;
  musicSrc: string;
  coverSrc: string;
}

const chapters = [
  { index: 1, id: "welcome", label: "Ms. Rachel", tint: "bg-[#d6eefa]/55" },
  { index: 2, id: "dress-code", label: "Palette", tint: "bg-[#fff8ea]" },
  { index: 3, id: "venue", label: "Location", tint: "bg-[#e4efdc]/60" },
  { index: 4, id: "birthday", label: "Linggit", tint: "bg-[#fbe07b]/35" },
  { index: 5, id: "party", label: "Potty Tinay", tint: "bg-[#fadce6]/45" },
  { index: 6, id: "rsvp", label: "RSVP", tint: "bg-[#d6eefa]/50" },
] as const;

export function StorybookApp({
  settings,
  dates,
  photoSrc,
  musicSrc,
  coverSrc,
}: StorybookAppProps) {
  const prefersReducedMotion = useReducedMotion();
  const [scene, setScene] = useState(0);
  const [direction, setDirection] = useState(1);
  const [opening, setOpening] = useState(false);
  const [muted, setMuted] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const openTimer = useRef<number>();
  const stageTopRef = useRef<HTMLDivElement>(null);

  const opened = scene > 0;

  // Restore mute preference & support direct hash deep-links (e.g. /#rsvp from /kingkong)
  useEffect(() => {
    try {
      const soundOff = sessionStorage.getItem("linggit_sound_muted") === "true";
      audioController.setMuted(soundOff);
      setMuted(soundOff);
    } catch {
      // Ignore storage access errors
    }

    function syncHash() {
      const hash = window.location.hash.slice(1);
      const match = chapters.find((ch) => ch.id === hash);
      if (match) {
        setScene(match.index);
      }
    }

    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => {
      window.clearTimeout(openTimer.current);
      window.removeEventListener("hashchange", syncHash);
    };
  }, []);

  const goToScene = useCallback(
    (nextIndex: number) => {
      const clamped = Math.max(1, Math.min(6, nextIndex));
      if (clamped === scene) {
        setMenuOpen(false);
        return;
      }
      audioController.playPageTurn();
      setDirection(clamped > scene ? 1 : -1);
      setScene(clamped);
      setMenuOpen(false);
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    },
    [scene, prefersReducedMotion]
  );

  // Keyboard arrow navigation when outside form fields
  useEffect(() => {
    if (!opened) return;
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.key === "ArrowRight" && scene < 6) goToScene(scene + 1);
      if (e.key === "ArrowLeft" && scene > 1) goToScene(scene - 1);
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [opened, scene, goToScene]);

  function openInvitation() {
    if (opening || opened) return;
    audioController.startLullaby(musicSrc);
    audioController.playSparkle();
    setMusicStarted(true);
    setOpening(true);

    if (!prefersReducedMotion) {
      void import("canvas-confetti")
        .then(({ default: confetti }) => {
          confetti({
            particleCount: 70,
            spread: 80,
            origin: { y: 0.62 },
            colors: ["#f49ab6", "#7bc0e3", "#fbe07b", "#fffbf2"],
            disableForReducedMotion: true,
          });
        })
        .catch(() => {});
    }

    openTimer.current = window.setTimeout(
      () => {
        setDirection(1);
        setScene(1);
        setOpening(false);
        window.scrollTo({ top: 0, behavior: "instant" });
      },
      prefersReducedMotion ? 0 : 720
    );
  }

  function toggleSound() {
    const nextMuted = opened && !musicStarted ? false : !muted;
    audioController.setMuted(nextMuted);
    if (opened && !musicStarted) {
      audioController.startLullaby(musicSrc);
      setMusicStarted(true);
    }
    setMuted(nextMuted);
    try {
      sessionStorage.setItem("linggit_sound_muted", String(nextMuted));
    } catch {
      // Keep preference in memory
    }
  }

  function replayEnvelope() {
    audioController.playPop();
    setScene(0);
    setMenuOpen(false);
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  const playingSound = !muted && (!opened || musicStarted);
  const activeChapter = chapters.find((ch) => ch.index === scene);

  return (
    <div className="min-h-[100svh] flex flex-col relative overflow-x-hidden">
      {/* Living Full-Bleed Animated Sky, Smiling Sun, Swaying Bunting, Drifting Clouds & Rolling Hills */}
      <TheaterBackdrop scene={scene} />

      {/* Sensory Poppable Floating Soap Bubbles */}
      {opened && <FloatingBubbles />}

      {/* Persistent Minimal Storybook Header */}
      <header className="fixed top-0 inset-x-0 z-40 px-3 sm:px-6 pt-3 pointer-events-none">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2 px-3 sm:px-4 py-2 rounded-full bg-[#fffbf2]/92 backdrop-blur-md border border-[#e3bf75]/55 shadow-sm pointer-events-auto">
          {/* Wordmark */}
          <button
            type="button"
            onClick={replayEnvelope}
            className="inline-flex items-center gap-2 min-h-[40px] px-1 text-left group"
          >
            <span className="w-8 h-8 rounded-full bg-[#fbe07b]/70 text-[#9e3359] flex items-center justify-center group-hover:rotate-12 transition-transform">
              <Sun className="w-4 h-4 stroke-[2.3]" aria-hidden="true" />
            </span>
            <span className="font-storybook text-lg sm:text-xl font-bold tracking-tight text-[#2e221d]">
              {settings.nickname}
              <span className="text-[#c94b77]">.</span>
            </span>
          </button>

          {/* Desktop Chapter Pills */}
          {opened && (
            <nav aria-label="Storybook chapters" className="hidden md:flex items-center gap-1">
              {chapters.map((chapter) => {
                const isActive = scene === chapter.index;
                return (
                  <button
                    key={chapter.id}
                    type="button"
                    onClick={() => goToScene(chapter.index)}
                    aria-current={isActive ? "step" : undefined}
                    className={`relative px-3.5 py-2 rounded-full text-xs font-extrabold transition-colors ${
                      isActive ? "text-[#fffbf2]" : "text-[#645147] hover:text-[#2e221d]"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="chapter-pill-bg"
                        transition={{ type: "spring", stiffness: 360, damping: 28 }}
                        className="absolute inset-0 rounded-full bg-[#c94b77] -z-10 shadow-sm"
                      />
                    )}
                    {chapter.label}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Controls: Sound Toggle + Mobile Chapters Menu */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleSound}
              aria-pressed={playingSound}
              aria-label={playingSound ? "Mute music" : "Play music"}
              className="inline-flex items-center gap-2 min-h-[40px] px-3 rounded-full bg-white border border-[#2e221d]/12 text-xs font-extrabold text-[#2e221d] hover:border-[#c94b77] transition-colors"
            >
              {playingSound ? (
                <span className="inline-flex items-end gap-[2px] h-3.5" aria-hidden="true">
                  <span className="sound-bar w-[3px] h-full rounded-full bg-[#c94b77]" />
                  <span
                    className="sound-bar w-[3px] h-full rounded-full bg-[#256f9e]"
                    style={{ animationDelay: "0.22s" }}
                  />
                  <span
                    className="sound-bar w-[3px] h-full rounded-full bg-[#c9841a]"
                    style={{ animationDelay: "0.45s" }}
                  />
                </span>
              ) : (
                <VolumeX className="w-4 h-4 text-[#645147]" aria-hidden="true" />
              )}
              <span className="hidden sm:inline">
                {playingSound ? "You Are My Sunshine" : "Sound off"}
              </span>
              {!playingSound && <Music2 className="w-3.5 h-3.5 sm:hidden text-[#c94b77]" />}
            </button>

            {opened && (
              <div className="md:hidden relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((o) => !o)}
                  aria-label="Open chapter menu"
                  aria-expanded={menuOpen}
                  className="w-10 h-10 rounded-full bg-white border border-[#2e221d]/12 flex items-center justify-center text-[#2e221d]"
                >
                  {menuOpen ? <X className="w-4 h-4" /> : <List className="w-4 h-4" />}
                </button>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.nav
                      aria-label="Mobile chapters"
                      initial={{ opacity: 0, y: -6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.96 }}
                      transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
                      className="absolute right-0 top-12 w-52 rounded-2xl bg-[#fffbf2] border border-[#e3bf75]/70 shadow-xl p-1.5 flex flex-col gap-1"
                    >
                      {chapters.map((chapter) => (
                        <button
                          key={chapter.id}
                          type="button"
                          onClick={() => goToScene(chapter.index)}
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-extrabold flex items-center justify-between ${
                            scene === chapter.index
                              ? "bg-[#fadce6] text-[#9e3359]"
                              : "text-[#2e221d] hover:bg-[#f8eed9]"
                          }`}
                        >
                          <span>{chapter.label}</span>
                          <span className="text-[11px] opacity-60">{chapter.index}/6</span>
                        </button>
                      ))}
                    </motion.nav>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Animated Stage (keyed immediate mount avoids AnimatePresence mode="wait" deadlocks and feels snappier) */}
      <main ref={stageTopRef} className="flex-1 flex flex-col justify-center relative z-20">
        {scene === 0 ? (
          <motion.div
            key="envelope-cover"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            <EnvelopeCover
              settings={settings}
              dates={dates}
              coverSrc={coverSrc}
              opening={opening}
              onOpen={openInvitation}
            />
          </motion.div>
        ) : (
          <motion.div
            key={`scene-${scene}`}
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, x: direction > 0 ? 32 : -32, scale: 0.99 }
            }
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            className="w-full px-4 sm:px-6 pt-20 sm:pt-24 pb-28"
          >
            {scene === 1 && (
              <MsRachelWelcomeScene
                settings={settings}
                dates={dates}
                onNext={() => goToScene(2)}
                onJumpTo={goToScene}
              />
            )}
            {scene === 2 && <DressCodeScene settings={settings} onNext={() => goToScene(3)} />}
            {scene === 3 && (
              <VenueLocationScene
                settings={settings}
                dates={dates}
                onNext={() => goToScene(4)}
              />
            )}
            {scene === 4 && (
              <BabyRevealScene
                settings={settings}
                photoSrc={photoSrc}
                onNext={() => goToScene(5)}
              />
            )}
            {scene === 5 && (
              <FavoritesCakeScene
                settings={settings}
                dates={dates}
                onNext={() => goToScene(6)}
              />
            )}
            {scene === 6 && (
              <RsvpScene
                settings={settings}
                dates={dates}
                onReplayEnvelope={replayEnvelope}
              />
            )}
          </motion.div>
        )}
      </main>

      {/* Floating Bottom Storybook Page-Turner Bar */}
      {opened && (
        <div className="fixed bottom-4 inset-x-0 z-30 flex justify-center px-4 pointer-events-none">
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-[#fffbf2]/95 backdrop-blur-md border border-[#e3bf75]/70 shadow-lg pointer-events-auto">
            <button
              type="button"
              onClick={() => goToScene(scene - 1)}
              disabled={scene <= 1}
              aria-label="Previous chapter"
              className="w-10 h-10 rounded-full hover:bg-[#f8eed9] flex items-center justify-center text-[#2e221d] disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1.5 px-1">
              {chapters.map((ch) => (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => goToScene(ch.index)}
                  aria-label={`Go to ${ch.label}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    scene === ch.index
                      ? "w-7 bg-[#c94b77]"
                      : "w-2 bg-[#2e221d]/20 hover:bg-[#2e221d]/40"
                  }`}
                />
              ))}
            </div>

            <span className="font-storybook text-xs sm:text-sm font-bold text-[#2e221d] min-w-[78px] text-center">
              {activeChapter?.label}
            </span>

            <button
              type="button"
              onClick={() => goToScene(scene + 1)}
              disabled={scene >= 6}
              aria-label="Next chapter"
              className="w-10 h-10 rounded-full hover:bg-[#f8eed9] flex items-center justify-center text-[#2e221d] disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
