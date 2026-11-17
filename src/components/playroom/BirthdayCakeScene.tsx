"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { audioController } from "@/lib/audio";
import { BabyLinggit } from "../illustrations/BabyLinggit";
import { eventConfig } from "@/config/event-config";
import { Sparkles, Heart, RotateCcw } from "lucide-react";

export const BirthdayCakeScene: React.FC = () => {
  const [blownOut, setBlownOut] = useState(false);

  const handleBlowCandle = () => {
    if (blownOut) return;
    setBlownOut(true);

    // Audio SFX
    audioController.playCandleBlow();

    setTimeout(() => {
      audioController.playSparkle();
      audioController.playClap();

      // Spectacular celebration confetti
      confetti({
        particleCount: 110,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#D4AF37", "#F7B5CD", "#BAE0F6", "#FEF08A", "#FFFFFF", "#4ADE80"],
      });
    }, 250);
  };

  const handleRelight = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioController.playPop();
    setBlownOut(false);
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center select-none text-center">
      {/* Category Tag */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-200 rounded-full text-rose-800 text-[11px] font-semibold tracking-wider uppercase mb-2 shadow-2xs">
        <Sparkles className="w-3 h-3 text-rose-500" />
        <span>Linggit&apos;s Grand 1st Birthday Reveal</span>
        <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
      </div>

      <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
        Make a Birthday Wish
      </h2>
      <p className="text-xs text-stone-600 font-medium max-w-xs mx-auto mt-1 mb-4">
        {blownOut
          ? "Wish granted! Linggit is officially turning one!"
          : "Tap the candle flame to blow it out and reveal the birthday star!"}
      </p>

      {/* Main Interactive Stage: Cake & Cameo */}
      <div className="relative w-full flex flex-col items-center justify-center min-h-[320px]">
        <AnimatePresence mode="wait">
          {!blownOut ? (
            /* Interactive Birthday Cake with Glowing Candle */
            <motion.div
              key="cake"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={handleBlowCandle}
              className="relative cursor-pointer group flex flex-col items-center"
              title="Tap to blow out the candle!"
            >
              {/* Floating Tap Prompt */}
              <div className="mb-2 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full border border-amber-300 shadow-sm animate-bounce text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <span>💨</span> Tap to Blow Candle!
              </div>

              {/* Glowing Candle Flame */}
              <div className="relative flex flex-col items-center -mb-1">
                {/* Candle Flame */}
                <motion.div
                  animate={{
                    scale: [1, 1.15, 0.95, 1],
                    y: [0, -2, 1, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.8,
                    ease: "easeInOut",
                  }}
                  className="w-5 h-8 rounded-t-full rounded-b-2xl bg-gradient-to-t from-amber-500 via-yellow-300 to-white shadow-[0_0_20px_#F59E0B] flex items-center justify-center"
                >
                  <div className="w-2 h-4 rounded-full bg-white opacity-80" />
                </motion.div>

                {/* Candle Wick & Body */}
                <div className="w-1 h-2 bg-stone-700" />
                <div className="w-4 h-12 bg-gradient-to-r from-amber-100 via-white to-amber-100 rounded-t-sm border border-amber-200 shadow-xs flex items-center justify-center">
                  <span className="font-serif-luxury text-[10px] font-black text-amber-800">
                    1
                  </span>
                </div>
              </div>

              {/* Tier 1 (Top Tier Cake) */}
              <div className="w-28 h-12 rounded-t-2xl bg-gradient-to-b from-[#FCE7F3] to-[#F7B5CD] border-2 border-white shadow-md relative overflow-hidden flex items-center justify-center">
                {/* Cake Frosting Drips */}
                <div className="absolute top-0 inset-x-0 h-3 flex justify-between px-1">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-3.5 h-3.5 bg-white rounded-b-full shadow-2xs"
                    />
                  ))}
                </div>
                <span className="font-serif-luxury text-[11px] font-bold text-stone-800 z-10 pt-2">
                  Linggit
                </span>
              </div>

              {/* Tier 2 (Bottom Tier Cake) */}
              <div className="w-44 h-16 rounded-t-2xl bg-gradient-to-b from-[#BAE0F6] to-[#7DD3FC] border-2 border-white shadow-lg relative overflow-hidden flex items-center justify-center">
                {/* Frosting Drips */}
                <div className="absolute top-0 inset-x-0 h-4 flex justify-between px-1">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 bg-white rounded-b-full shadow-2xs"
                    />
                  ))}
                </div>
                {/* Delicate Pearl Sugar Beads */}
                <div className="flex gap-3 z-10 pt-2">
                  <span className="w-2 h-2 rounded-full bg-white shadow-xs" />
                  <span className="w-2 h-2 rounded-full bg-[#FEF08A] shadow-xs" />
                  <span className="w-2 h-2 rounded-full bg-white shadow-xs" />
                  <span className="w-2 h-2 rounded-full bg-[#FEF08A] shadow-xs" />
                  <span className="w-2 h-2 rounded-full bg-white shadow-xs" />
                </div>
              </div>

              {/* Cake Stand Base */}
              <div className="w-52 h-4 rounded-full bg-gradient-to-r from-stone-200 via-white to-stone-200 border border-stone-300 shadow-md" />
              <div className="w-20 h-4 bg-stone-200 border-x border-stone-300 shadow-inner" />
              <div className="w-32 h-3 rounded-full bg-stone-300 border border-stone-400 shadow-sm" />
            </motion.div>
          ) : (
            /* Grand Reveal: Baby Linggit's Gilded Arch Cameo */
            <motion.div
              key="reveal"
              initial={{ scale: 0.6, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              className="flex flex-col items-center"
            >
              <div className="relative">
                <BabyLinggit className="w-60 h-76 sm:w-64 sm:h-80" />
              </div>

              {/* Celebratory Banner */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card-deckle p-4 mt-3 max-w-sm w-full"
              >
                <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-stone-900 leading-tight">
                  &ldquo;{eventConfig.celebrant.nickname} is turning{" "}
                  <span className="text-rose-600 italic">one</span>!<br />
                  You are warmly invited.&rdquo;
                </h3>
                <p className="text-xs text-stone-600 font-medium mt-1">
                  {eventConfig.celebrant.tagline}
                </p>

                {/* Re-light Candle Button */}
                <button
                  type="button"
                  onClick={handleRelight}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 hover:bg-stone-200 rounded-full text-[11px] font-semibold text-stone-600 transition-colors"
                >
                  <RotateCcw className="w-3 h-3 text-[#996515]" />
                  <span>Blow Candle Again</span>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
