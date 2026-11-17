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
    audioController.playSparkle();

    const timer = setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.55 },
        colors: ["#D4AF37", "#F7B5CD", "#BAE0F6", "#FFFFFF"],
      });
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    audioController.playPop();
    onNext();
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[74vh] w-full max-w-lg mx-auto px-4 py-2 select-none">
      {/* Category Tag */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-amber-50 via-rose-50 to-sky-50 border border-[#E5C98D] rounded-full text-stone-800 text-xs font-semibold tracking-wider uppercase mb-2 shadow-xs"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#C89E4B]" />
        <span>The Birthday Celebrant</span>
        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
      </motion.div>

      {/* Elegant Cameo Portrait Frame */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 220, damping: 20 }}
        className="relative my-2 flex justify-center"
      >
        <BabyLinggit className="w-60 h-76 sm:w-64 sm:h-80" />
      </motion.div>

      {/* Editorial Announcement Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="card-deckle p-5 max-w-md w-full mb-3 text-center"
      >
        <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900 leading-snug">
          &ldquo;{eventConfig.celebrant.nickname} is turning{" "}
          <span className="italic text-rose-600">one</span>!
          <br />
          You are invited.&rdquo;
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-stone-600 font-medium">
          {eventConfig.celebrant.tagline}
        </p>
      </motion.div>

      {/* Next Scene Button */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="w-full max-w-xs mt-2 flex flex-col items-center gap-1"
      >
        <button
          onClick={handleNext}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm rounded-full shadow-md hover:shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <span>View First-Year Milestones</span>
          <ArrowRight className="w-4 h-4 text-amber-300" />
        </button>
      </motion.div>
    </div>
  );
};
