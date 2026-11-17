"use client";

import React from "react";
import { motion } from "framer-motion";
import { PottyTinay } from "../illustrations/PottyTinay";
import { audioController } from "@/lib/audio";
import { eventConfig } from "@/config/event-config";
import { Sparkles, ArrowRight, Heart, Music, Award, Smile } from "lucide-react";

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
    <div className="flex flex-col items-center justify-between min-h-[74vh] w-full max-w-lg mx-auto px-4 py-2 select-none">
      {/* Category Tag */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-sky-50 border border-sky-200 rounded-full text-sky-900 text-xs font-semibold tracking-wider uppercase mb-2 shadow-xs"
      >
        <Award className="w-3.5 h-3.5 text-sky-600" />
        <span>First Year Highlights</span>
      </motion.div>

      {/* Potty Tinay Feature Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-deckle p-5 w-full text-center relative overflow-hidden mb-3"
      >
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-700 mb-1">
          <Music className="w-3.5 h-3.5 text-rose-500" />
          <span>Linggit&apos;s Favorite Song</span>
        </div>

        <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-stone-900">
          {eventConfig.milestones.favorites.songAndShow}
        </h3>

        {/* Potty Tinay Medallion */}
        <div className="my-2.5 flex justify-center">
          <PottyTinay onClick={handlePottyTap} className="w-32 h-32" />
        </div>

        <p className="text-xs text-stone-600 font-medium max-w-xs mx-auto leading-relaxed">
          &ldquo;Whenever Ms. Rachel sings this, Linggit claps, giggles, and bounces to the rhythm!&rdquo;
        </p>
      </motion.div>

      {/* Milestone Stats */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full grid grid-cols-2 gap-2 mb-3"
      >
        <div className="p-3 bg-white rounded-2xl border border-stone-200/80 shadow-xs flex items-center gap-3 text-left">
          <div className="p-2 rounded-xl bg-amber-50 text-[#996515] border border-[#E5C98D]/40 shrink-0">
            <Heart className="w-4 h-4 fill-amber-600 text-amber-600" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              Age Today
            </p>
            <p className="font-serif-luxury text-xs font-bold text-stone-800 leading-tight">
              365 Days of Joy
            </p>
          </div>
        </div>

        <div className="p-3 bg-white rounded-2xl border border-stone-200/80 shadow-xs flex items-center gap-3 text-left">
          <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-200/60 shrink-0">
            <Smile className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              Milestone
            </p>
            <p className="font-serif-luxury text-xs font-bold text-stone-800 leading-tight">
              6 Pearly Teeth
            </p>
          </div>
        </div>

        <div className="p-3 bg-white rounded-2xl border border-stone-200/80 shadow-xs flex items-center gap-3 text-left">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              Movement
            </p>
            <p className="font-serif-luxury text-xs font-bold text-stone-800 leading-tight">
              Cruising &amp; Walking
            </p>
          </div>
        </div>

        <div className="p-3 bg-white rounded-2xl border border-stone-200/80 shadow-xs flex items-center gap-3 text-left">
          <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200/60 shrink-0">
            <Music className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              Top Song
            </p>
            <p className="font-serif-luxury text-xs font-bold text-stone-800 leading-tight">
              Potty Tinay
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quote Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full bg-[#FAF5EE] rounded-xl p-2.5 border border-[#E5C98D]/40 text-center"
      >
        <p className="font-serif-luxury text-xs text-stone-700 italic font-medium">
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
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm rounded-full shadow-md hover:shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <span>RSVP &amp; Program Schedule</span>
          <ArrowRight className="w-4 h-4 text-amber-300" />
        </button>
      </motion.div>
    </div>
  );
};
