"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { MsRachel } from "../illustrations/MsRachel";
import { audioController } from "@/lib/audio";
import { eventConfig } from "@/config/event-config";
import { Sparkles, ArrowRight, Music2 } from "lucide-react";

interface MsRachelIntroSceneProps {
  onNext: () => void;
}

export const MsRachelIntroScene: React.FC<MsRachelIntroSceneProps> = ({ onNext }) => {
  useEffect(() => {
    audioController.playPop();
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
        className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-rose-50 border border-rose-200 rounded-full text-rose-800 text-xs font-semibold tracking-wider uppercase mb-2 shadow-xs"
      >
        <Music2 className="w-3.5 h-3.5 text-rose-500" />
        <span>Ms. Rachel Birthday Welcome</span>
      </motion.div>

      {/* Editorial Dialogue Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="card-deckle p-6 max-w-md w-full mb-3 text-center relative"
      >
        <div className="flex items-center justify-center gap-1.5 text-amber-700 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#C89E4B]" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#996515]">
            A Special Message
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#C89E4B]" />
        </div>

        <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900 leading-snug">
          &ldquo;Hi friends! Look who is turning{" "}
          <span className="text-rose-500 italic">one</span>!&rdquo;
        </h2>

        <p className="mt-3 text-xs sm:text-sm text-stone-600 font-medium leading-relaxed">
          Welcome to {eventConfig.celebrant.nickname}&apos;s very first birthday celebration! We have an afternoon of sweet songs, play, and love planned for you.
        </p>
      </motion.div>

      {/* Ms. Rachel Cameo Medallion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="my-3 flex justify-center"
      >
        <MsRachel className="w-40 h-40 sm:w-44 sm:h-44" />
      </motion.div>

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-xs mt-2 flex flex-col items-center gap-2"
      >
        <button
          onClick={handleNext}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm rounded-full shadow-md hover:shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <span>View Guest Dress Code</span>
          <ArrowRight className="w-4 h-4 text-amber-300" />
        </button>
      </motion.div>
    </div>
  );
};
