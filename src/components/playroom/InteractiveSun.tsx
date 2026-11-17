"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { audioController } from "@/lib/audio";
import { Sparkles } from "lucide-react";

export const InteractiveSun: React.FC = () => {
  const [clicked, setClicked] = useState(false);
  const [speech, setSpeech] = useState<string | null>(null);

  const quotes = [
    "You are my sunshine!",
    "Can you clap your hands?",
    "Good job, friend!",
    "Let's sing together!",
  ];

  const handleSunTap = () => {
    audioController.playSparkle();
    setClicked(true);
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setSpeech(randomQuote);

    setTimeout(() => setClicked(false), 800);
    setTimeout(() => setSpeech(null), 3000);
  };

  return (
    <div className="relative inline-flex flex-col items-center select-none z-20">
      {/* Speech Pop Bubble */}
      <AnimatePresence>
        {speech && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -8, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-12 z-30 px-3 py-1 bg-white/95 backdrop-blur-md rounded-full border border-amber-300 shadow-md whitespace-nowrap"
          >
            <p className="font-serif-luxury text-xs font-bold text-amber-900 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>{speech}</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sun Circle & Ray Wings */}
      <motion.div
        animate={clicked ? { scale: [1, 1.25, 1], rotate: [0, 15, -15, 0] } : {}}
        transition={{ duration: 0.5, ease: "easeOut" }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSunTap}
        className="relative w-20 h-20 sm:w-24 sm:h-24 cursor-pointer group flex items-center justify-center"
        title="Tap the Sunshine!"
      >
        {/* Soft Ambient Radiance */}
        <div className="absolute inset-0 rounded-full bg-amber-300/30 blur-xl group-hover:bg-amber-400/50 transition-all" />

        {/* Rotating Sun Rays */}
        <div className="absolute inset-0 animate-spin-slow">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-amber-300/60">
            {Array.from({ length: 12 }).map((_, i) => (
              <polygon
                key={i}
                points="48,2 52,2 50,14"
                transform={`rotate(${i * 30} 50 50)`}
              />
            ))}
          </svg>
        </div>

        {/* Sun Center Face */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200 border-2 border-white shadow-lg flex flex-col items-center justify-center relative">
          {/* Cute Rosy Cheeks */}
          <div className="absolute left-2.5 top-7 w-2.5 h-1.5 rounded-full bg-rose-400/50" />
          <div className="absolute right-2.5 top-7 w-2.5 h-1.5 rounded-full bg-rose-400/50" />

          {/* Happy Eyes */}
          <div className="flex items-center gap-3.5 mt-1">
            <div className="w-1.5 h-2 rounded-full bg-stone-800" />
            <div className="w-1.5 h-2 rounded-full bg-stone-800" />
          </div>

          {/* Gentle Smile */}
          <div className="w-3.5 h-2 border-b-2 border-stone-800 rounded-full mt-0.5" />
        </div>
      </motion.div>
    </div>
  );
};
