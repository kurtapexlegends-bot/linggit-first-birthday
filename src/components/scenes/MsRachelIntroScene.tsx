"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { MsRachel } from "../illustrations/MsRachel";
import { audioController } from "@/lib/audio";
import { eventConfig } from "@/config/event-config";
import { Sparkles, ArrowRight, Heart } from "lucide-react";

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
    <div className="flex flex-col items-center justify-between min-h-[72vh] w-full max-w-lg mx-auto px-4 py-2 select-none">
      {/* Top Friendly Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-rachel-pink-light/90 border border-rachel-pink/40 rounded-full text-rachel-pink-dark font-extrabold text-xs shadow-sm mb-2"
      >
        <Sparkles className="w-3.5 h-3.5 text-rachel-yellow animate-spin-slow" />
        <span>Songs for Littles &bull; Birthday Special</span>
      </motion.div>

      {/* Comic Speech Bubble from Ms. Rachel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
        className="relative bg-white rounded-3xl p-5 shadow-xl border-3 border-rachel-pink/40 max-w-md w-full mb-4 text-center"
      >
        <p className="text-xl sm:text-2xl font-black text-slate-800 leading-snug">
          &ldquo;Hi friends! Look who is turning{" "}
          <span className="text-rachel-pink underline decoration-wavy decoration-rachel-yellow">
            ONE
          </span>
          !&rdquo;
        </p>
        <p className="mt-2 text-sm text-slate-600 font-medium">
          Welcome to {eventConfig.celebrant.nickname}&apos;s very first birthday celebration! We have so much dancing, singing, and joy waiting for you.
        </p>

        {/* Speech Bubble Tail pointing down towards Ms. Rachel */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white rotate-45 border-r-3 border-b-3 border-rachel-pink/40" />
      </motion.div>

      {/* Ms. Rachel Animated Illustration */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="relative my-2 flex justify-center"
      >
        {/* Soft Background Radial Sun */}
        <div className="absolute inset-0 bg-gradient-to-tr from-rachel-yellow-light/60 to-rachel-pink-light/40 rounded-full blur-2xl -z-10 scale-125" />
        <MsRachel className="w-56 h-64 sm:w-64 sm:h-72" />
      </motion.div>

      {/* Action Navigation Button */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-xs mt-3 flex flex-col items-center gap-2"
      >
        <button
          onClick={handleNext}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 bg-gradient-to-r from-rachel-pink to-rose-400 hover:from-rose-500 hover:to-rachel-pink text-white font-extrabold text-base rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>See What to Wear!</span>
          <ArrowRight className="w-5 h-5" />
        </button>
        <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
          <Heart className="w-3 h-3 text-rachel-pink fill-rachel-pink" />
          Ms. Rachel is explaining the dress code next
        </span>
      </motion.div>
    </div>
  );
};
