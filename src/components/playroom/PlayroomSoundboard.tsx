"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { audioController } from "@/lib/audio";
import { Sparkles, Music, Heart } from "lucide-react";

export const PlayroomSoundboard: React.FC = () => {
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const handleClap = () => {
    audioController.playClap();
    setActiveAction("clap");
    setTimeout(() => setActiveAction(null), 1500);
  };

  const handleSing = () => {
    audioController.playSparkle();
    audioController.startLullaby();
    setActiveAction("sing");
    setTimeout(() => setActiveAction(null), 1500);
  };

  const handlePotty = () => {
    audioController.playPop();
    audioController.playSparkle();
    setActiveAction("potty");
    setTimeout(() => setActiveAction(null), 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto my-3 select-none">
      <div className="p-3 bg-white/80 backdrop-blur-md rounded-2xl border border-[#E5C98D]/60 shadow-sm flex items-center justify-between gap-2">
        {/* Sensory Button 1: Clap */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.94 }}
          onClick={handleClap}
          className="flex-1 flex flex-col items-center py-2 px-1 bg-[#FAF5EE] hover:bg-[#F2E7D7] rounded-xl border border-[#E5C98D]/40 transition-colors shadow-2xs relative"
        >
          <span className="text-base">👏</span>
          <span className="font-serif-luxury text-[10px] font-bold text-stone-800 mt-0.5">
            Clap Hands
          </span>
          <AnimatePresence>
            {activeAction === "clap" && (
              <motion.div
                initial={{ y: 0, opacity: 1, scale: 0.8 }}
                animate={{ y: -20, opacity: 0, scale: 1.2 }}
                exit={{ opacity: 0 }}
                className="absolute -top-3 text-rose-500"
              >
                <Heart className="w-4 h-4 fill-rose-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Sensory Button 2: Sing Sunshine */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.94 }}
          onClick={handleSing}
          className="flex-1 flex flex-col items-center py-2 px-1 bg-[#FAF5EE] hover:bg-[#F2E7D7] rounded-xl border border-[#E5C98D]/40 transition-colors shadow-2xs relative"
        >
          <span className="text-base">☀️</span>
          <span className="font-serif-luxury text-[10px] font-bold text-stone-800 mt-0.5">
            Sing Along
          </span>
          <AnimatePresence>
            {activeAction === "sing" && (
              <motion.div
                initial={{ y: 0, opacity: 1, scale: 0.8 }}
                animate={{ y: -20, opacity: 0, scale: 1.2 }}
                exit={{ opacity: 0 }}
                className="absolute -top-3 text-amber-500"
              >
                <Sparkles className="w-4 h-4 fill-amber-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Sensory Button 3: Potty Song */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.94 }}
          onClick={handlePotty}
          className="flex-1 flex flex-col items-center py-2 px-1 bg-[#FAF5EE] hover:bg-[#F2E7D7] rounded-xl border border-[#E5C98D]/40 transition-colors shadow-2xs relative"
        >
          <span className="text-base">🎶</span>
          <span className="font-serif-luxury text-[10px] font-bold text-stone-800 mt-0.5">
            Potty Tinay
          </span>
          <AnimatePresence>
            {activeAction === "potty" && (
              <motion.div
                initial={{ y: 0, opacity: 1, scale: 0.8 }}
                animate={{ y: -20, opacity: 0, scale: 1.2 }}
                exit={{ opacity: 0 }}
                className="absolute -top-3 text-sky-500"
              >
                <Music className="w-4 h-4 text-sky-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
};
