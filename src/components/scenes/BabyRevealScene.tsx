"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { BabyLinggit } from "../illustrations/BabyLinggit";
import { audioController } from "@/lib/audio";
import confetti from "canvas-confetti";
import { eventConfig } from "@/config/event-config";
import { Sparkles, Heart, ArrowRight } from "lucide-react";

interface BabyRevealSceneProps {
  onNext: () => void;
}

export const BabyRevealScene: React.FC<BabyRevealSceneProps> = ({ onNext }) => {
  useEffect(() => {
    // Celebration sparkle SFX & Confetti Burst
    audioController.playSparkle();

    const timer = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.5 },
        colors: ["#F472B6", "#38BDF8", "#FBBF24", "#FEF08A", "#FFFDF7"],
      });
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    audioController.playPop();
    onNext();
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[72vh] w-full max-w-lg mx-auto px-4 py-2 select-none">
      {/* Top Birthday Star Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-amber-200 via-rose-200 to-sky-200 border border-white rounded-full text-slate-800 font-black text-xs shadow-md mb-2"
      >
        <Sparkles className="w-4 h-4 text-amber-600 animate-spin-slow" />
        <span>THE BIRTHDAY CELEBRANT REVEAL</span>
        <Sparkles className="w-4 h-4 text-rose-500 animate-spin-slow" />
      </motion.div>

      {/* Baby Linggit's Signature Speech Bubble */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 240, damping: 18 }}
        className="relative bg-white rounded-3xl p-5 shadow-2xl border-4 border-rachel-pink max-w-md w-full mb-3 text-center"
      >
        {/* Floating Crown / Party Hat emoji */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-rachel-yellow px-3 py-0.5 rounded-full shadow-sm text-xs font-black text-amber-900 flex items-center gap-1">
          <span>👑</span> Special Announcement <span>🎉</span>
        </div>

        <p className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
          &ldquo;{eventConfig.celebrant.nickname} is turning{" "}
          <span className="text-rachel-pink font-black underline decoration-wavy decoration-rachel-yellow">
            1
          </span>
          !<br />
          You are <span className="text-rachel-blue-dark">INVITED</span>!&rdquo;
        </p>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-600 font-semibold">
          Come dance, play, and make sweet memories with me and our family!
        </p>

        {/* Speech Bubble Tail */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white rotate-45 border-r-4 border-b-4 border-rachel-pink" />
      </motion.div>

      {/* Baby Linggit Grand Entrance Animation */}
      <motion.div
        initial={{ scale: 0.2, opacity: 0, rotate: -8 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
        className="relative my-2 flex justify-center"
      >
        {/* Sunburst Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-yellow-300/40 via-rose-300/40 to-sky-300/40 rounded-full blur-3xl -z-10 scale-150 animate-pulse" />
        <BabyLinggit className="w-56 h-64 sm:w-64 sm:h-72" />
      </motion.div>

      {/* Sweet Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-xs sm:text-sm font-bold text-slate-600 text-center max-w-xs"
      >
        {eventConfig.celebrant.tagline}
      </motion.p>

      {/* Next Scene Button */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="w-full max-w-xs mt-3 flex flex-col items-center gap-1"
      >
        <button
          onClick={handleNext}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 bg-gradient-to-r from-rachel-yellow to-amber-400 hover:from-amber-400 hover:to-rachel-yellow text-amber-950 font-black text-base rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>See Linggit&apos;s Favorites!</span>
          <ArrowRight className="w-5 h-5 text-amber-950" />
        </button>
        <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
          <Heart className="w-3 h-3 text-rachel-pink fill-rachel-pink" />
          Featuring Potty Tinay &amp; First Milestones
        </span>
      </motion.div>
    </div>
  );
};
