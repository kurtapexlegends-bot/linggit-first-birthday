"use client";

import React from "react";
import { motion } from "framer-motion";
import { PottyTinay } from "../illustrations/PottyTinay";
import { audioController } from "@/lib/audio";
import { eventConfig } from "@/config/event-config";
import { Sparkles, ArrowRight, Heart, Music, Award } from "lucide-react";

interface MilestonesSceneProps {
  onNext: () => void;
}

export const MilestonesScene: React.FC<MilestonesSceneProps> = ({ onNext }) => {
  const handlePottyTap = () => {
    audioController.playPop();
    audioController.playSparkle();
  };

  const handleNext = () => {
    audioController.playPop();
    onNext();
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[72vh] w-full max-w-lg mx-auto px-4 py-2 select-none">
      {/* Top Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-sky-100 border border-sky-300 rounded-full text-sky-900 font-extrabold text-xs shadow-sm mb-2"
      >
        <Award className="w-3.5 h-3.5 text-sky-600" />
        <span>1 Year of Milestones &amp; Favorites</span>
      </motion.div>

      {/* Main Feature: Potty Tinay Spotlight Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-gradient-to-br from-sky-50 via-white to-pink-50 rounded-3xl p-4 shadow-xl border-2 border-sky-200 text-center relative overflow-hidden mb-3"
      >
        <div className="flex items-center justify-center gap-1 text-xs font-black text-rachel-blue-dark uppercase tracking-wider mb-1">
          <Music className="w-3.5 h-3.5 text-rachel-pink animate-bounce" />
          <span>#1 All-Time Favorite Song &amp; Show</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
          {eventConfig.milestones.favorites.songAndShow}
        </h3>

        {/* Interactive Potty Tinay Centerpiece */}
        <div className="my-2 flex justify-center">
          <PottyTinay onClick={handlePottyTap} className="w-32 h-32 sm:w-36 sm:h-36" />
        </div>

        <p className="text-xs text-slate-600 font-medium max-w-xs mx-auto">
          &ldquo;Whenever Ms. Rachel plays this, Linggit stops, giggles, claps, and dances to the beat!&rdquo;
        </p>
        <p className="text-[10px] text-rachel-pink-dark font-bold mt-1">
          💡 Tap Potty Tinay for a magical chime!
        </p>
      </motion.div>

      {/* Milestone Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full grid grid-cols-2 gap-2 mb-3"
      >
        {eventConfig.milestones.stats.map((stat) => (
          <div
            key={stat.label}
            className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-2.5 text-left"
          >
            <span className="text-2xl shrink-0">{stat.icon}</span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                {stat.label}
              </p>
              <p className="text-xs font-black text-slate-800 leading-tight">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Ms. Rachel Educational Quote Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full bg-rachel-pink-light/60 rounded-2xl p-2.5 border border-rachel-pink/30 flex items-center justify-center text-center"
      >
        <p className="text-xs text-slate-700 font-bold italic">
          &ldquo;{eventConfig.milestones.quote}&rdquo;
        </p>
      </motion.div>

      {/* Next Step Button */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-xs mt-3 flex flex-col items-center gap-1"
      >
        <button
          onClick={handleNext}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 bg-gradient-to-r from-rachel-pink to-rose-400 hover:from-rose-500 hover:to-rachel-pink text-white font-extrabold text-base rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>RSVP &amp; Event Program</span>
          <ArrowRight className="w-5 h-5" />
        </button>
        <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
          <Heart className="w-3 h-3 text-rachel-pink fill-rachel-pink" />
          Reserve your seats and message Linggit
        </span>
      </motion.div>
    </div>
  );
};
