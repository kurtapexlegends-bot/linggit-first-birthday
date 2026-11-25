"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Camera, Sparkles } from "lucide-react";
import type { InvitationSettings } from "@/lib/invitation-settings";
import { audioController } from "@/lib/audio";

interface BabyRevealSceneProps {
  settings: InvitationSettings;
  photoSrc: string;
  onNext: () => void;
}

const photoStorageKey = "linggit_custom_photo";

export function BabyRevealScene({ settings, photoSrc, onNext }: BabyRevealSceneProps) {
  const prefersReducedMotion = useReducedMotion();
  const shared = photoSrc.startsWith("/api/invitation-media/");
  const [customPhoto, setCustomPhoto] = useState(photoSrc || "");
  const [feedback, setFeedback] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    audioController.playSparkle();
    if (!prefersReducedMotion) {
      const timer = window.setTimeout(() => {
        void import("canvas-confetti")
          .then(({ default: confetti }) => {
            confetti({
              particleCount: 85,
              spread: 95,
              origin: { y: 0.6 },
              colors: ["#f48fb1", "#7bc0e3", "#fbe07b", "#ffffff"],
              disableForReducedMotion: true,
            });
          })
          .catch(() => {});
      }, 240);
      return () => window.clearTimeout(timer);
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (shared) return;
    try {
      const saved = localStorage.getItem(photoStorageKey);
      if (saved) setCustomPhoto(saved);
    } catch {
      // Keep default cutout
    }
  }, [shared]);

  function handleLocalPhoto(file?: File) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    setFeedback("Preparing photo...");
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setFeedback("Try a JPEG, PNG, or WebP photo.");
    };
    img.onload = () => {
      URL.revokeObjectURL(url);
      try {
        const scale = Math.min(1, 900 / Math.max(img.naturalWidth, img.naturalHeight));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas unavailable");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/webp", 0.86);
        setCustomPhoto(dataUrl);
        audioController.playSparkle();
        try {
          localStorage.setItem(photoStorageKey, dataUrl);
          setFeedback("Photo saved on this device.");
        } catch {
          setFeedback("Photo ready for this visit.");
        }
      } catch {
        setFeedback("Could not load that image.");
      }
    };
    img.src = url;
  }

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10 min-h-[70vh]">
      {/* Left: Frameless Baby Linggit Sticker Popping Up With Spinning Sunbeams */}
      <div className="relative flex flex-col items-center justify-center lg:w-[46%]">
        {!prefersReducedMotion && (
          <motion.div
            aria-hidden="true"
            animate={{ rotate: 360 }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-8 sm:-inset-12 rounded-full opacity-65 pointer-events-none"
            style={{
              background:
                "repeating-conic-gradient(from 0deg, rgba(251,224,123,0.6) 0deg 14deg, rgba(255,255,255,0.22) 14deg 28deg)",
              maskImage: "radial-gradient(circle, black 38%, transparent 72%)",
              WebkitMaskImage: "radial-gradient(circle, black 38%, transparent 72%)",
            }}
          />
        )}

        <motion.div
          initial={prefersReducedMotion ? false : { y: 200, scale: 0.65, rotate: -6, opacity: 0 }}
          animate={
            prefersReducedMotion
              ? { y: 0, scale: 1, opacity: 1 }
              : { y: [0, -10, 0], scale: 1, rotate: [-2, 2, -2], opacity: 1 }
          }
          transition={{
            y: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 4.4, repeat: Infinity, ease: "easeInOut" },
            scale: { type: "spring", stiffness: 200, damping: 14 },
            opacity: { duration: 0.35 },
          }}
          className="relative z-10 flex items-center justify-center"
        >
          {customPhoto ? (
            <div className="relative w-[250px] sm:w-[290px] aspect-square rounded-full overflow-hidden border-[10px] border-white shadow-[0_20px_36px_rgba(46,34,29,0.25)] bg-[#fbe8a6]">
              <img
                src={customPhoto}
                alt={`Birthday star ${settings.nickname}`}
                className="w-full h-full object-cover object-top"
                onError={() => setCustomPhoto("")}
              />
            </div>
          ) : (
            <img
              src="/images/cutouts/baby-linggit-cutout.png"
              alt={`Birthday star ${settings.nickname} cheering with a golden 1st birthday crown`}
              className="w-[260px] sm:w-[320px] lg:w-[350px] aspect-[3/4] object-contain drop-shadow-[0_20px_28px_rgba(46,34,29,0.24)]"
            />
          )}
        </motion.div>

        {!shared && (
          <div className="relative z-10 mt-2 flex flex-col items-center">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                handleLocalPhoto(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 hover:bg-white border-2 border-[#e3bf75] text-xs font-extrabold text-[#645147] shadow-sm active:scale-95 transition-transform"
            >
              <Camera className="w-3.5 h-3.5 text-[#c94b77]" aria-hidden="true" />
              <span>{customPhoto ? "Change baby photo" : "Try with Linggit’s real photo"}</span>
            </button>
            {feedback && (
              <span className="mt-1 text-xs font-bold text-[#645147]" role="status">
                {feedback}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Right: Bouncy Kinetic Speech Bubble ("Linggit is turning 1, you are invited!") */}
      <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-5 max-w-xl">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.78, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 17, delay: 0.14 }}
          className="relative bg-white rounded-[2.2rem] border-[4px] border-[#f48fb1] px-6 sm:px-8 py-6 shadow-[0_18px_36px_-10px_rgba(158,51,89,0.25)] w-full"
        >
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#fbe07b]/80 text-[#7d4e0d] text-xs font-extrabold mb-3">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            Birthday star entrance!
          </span>

          <h2 className="font-storybook text-3xl sm:text-5xl font-bold text-[#2e221d] leading-[1.06]">
            “{settings.nickname} is turning 1 — you are invited!”
          </h2>

          <p className="mt-3 text-sm sm:text-base font-bold text-[#645147]">
            {settings.coverIntro}
          </p>

          <span
            aria-hidden="true"
            className="hidden lg:block absolute top-1/2 -left-3.5 -translate-y-1/2 w-6 h-6 bg-white rotate-45 border-l-[4px] border-b-[4px] border-[#f48fb1]"
          />
          <span
            aria-hidden="true"
            className="lg:hidden absolute -top-3.5 left-1/2 -translate-x-1/2 w-6 h-6 bg-white rotate-45 border-l-[4px] border-t-[4px] border-[#f48fb1]"
          />
        </motion.div>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[#c94b77] hover:bg-[#9e3359] text-[#fffbf2] font-storybook text-base sm:text-lg font-bold shadow-[0_10px_22px_-6px_rgba(158,51,89,0.5)] active:scale-95 transition-[background-color,transform]"
        >
          <span>Dance with Potty Tinay &amp; blow the candle!</span>
          <ArrowRight className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
