"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { MsRachel } from "../illustrations/MsRachel";
import { MapIllustration } from "../illustrations/MapIllustration";
import { audioController } from "@/lib/audio";
import { eventConfig } from "@/config/event-config";
import { MapPin, Navigation, ExternalLink, ArrowRight, Calendar } from "lucide-react";

interface VenueSceneProps {
  onNext: () => void;
}

export const VenueScene: React.FC<VenueSceneProps> = ({ onNext }) => {
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
        className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-rose-100 border border-rose-300 rounded-full text-rose-800 font-extrabold text-xs shadow-sm mb-2"
      >
        <MapPin className="w-3.5 h-3.5 text-rose-600 animate-bounce" />
        <span>Venue &amp; Location Pin</span>
      </motion.div>

      {/* Pointing Ms. Rachel & Interactive Map Area */}
      <div className="w-full relative flex flex-col items-center mb-2">
        {/* Comic Speech Bubble */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl px-4 py-2.5 shadow-md border-2 border-rachel-pink/40 mb-3 text-center max-w-sm"
        >
          <p className="text-xs sm:text-sm font-bold text-slate-800">
            &ldquo;Can you find where the party is?{" "}
            <span className="text-rose-600 font-extrabold">Look right here</span> where I&apos;m pointing!&rdquo;
          </p>
        </motion.div>

        {/* Map Canvas with Pin */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="w-full relative"
        >
          <MapIllustration venueName={eventConfig.venue.name} />

          {/* Ms. Rachel Pointing at the Map Pin (Anchored on the left) */}
          <div className="absolute -left-6 -bottom-6 z-20 pointer-events-none transform scale-90 sm:scale-100">
            <MsRachel pointing={true} className="w-36 h-44 sm:w-44 sm:h-52" />
          </div>
        </motion.div>
      </div>

      {/* Venue Address & Landmark Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="w-full bg-white rounded-2xl p-4 shadow-lg border border-slate-200 space-y-2 mt-2 text-left"
      >
        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-xl bg-rose-100 text-rose-600 shrink-0 mt-0.5">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
              {eventConfig.venue.name}
            </h3>
            <p className="text-xs font-semibold text-rachel-blue-dark">
              {eventConfig.venue.hallOrArea}
            </p>
            <p className="text-xs text-slate-600 mt-1 leading-snug">
              {eventConfig.venue.address}
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-rachel-pink-dark" />
            {eventConfig.event.displayDate}
          </span>
          <span className="font-bold text-slate-700">{eventConfig.event.time}</span>
        </div>

        {/* One-Tap Maps & Waze Launchers */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <a
            href={eventConfig.venue.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => audioController.playPop()}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition-colors shadow-sm"
          >
            <Navigation className="w-3.5 h-3.5 text-blue-600" />
            <span>Google Maps</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          <a
            href={eventConfig.venue.wazeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => audioController.playPop()}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-sky-50 hover:bg-sky-100 text-sky-900 text-xs font-bold rounded-xl border border-sky-200 transition-colors shadow-sm"
          >
            <span className="text-xs">🚗</span>
            <span>Open in Waze</span>
            <ExternalLink className="w-3 h-3 text-sky-400" />
          </a>
        </div>
      </motion.div>

      {/* Next Scene Button */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="w-full max-w-xs mt-3 flex flex-col items-center gap-1"
      >
        <button
          onClick={handleNext}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 bg-gradient-to-r from-rachel-pink to-rose-400 hover:from-rose-500 hover:to-rachel-pink text-white font-extrabold text-base rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Meet the Birthday Star!</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
};
