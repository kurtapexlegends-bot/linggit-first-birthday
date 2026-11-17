"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { MapIllustration } from "../illustrations/MapIllustration";
import { audioController } from "@/lib/audio";
import { eventConfig } from "@/config/event-config";
import { MapPin, Navigation, ExternalLink, ArrowRight, Calendar, Clock } from "lucide-react";

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
    <div className="flex flex-col items-center justify-between min-h-[74vh] w-full max-w-lg mx-auto px-4 py-2 select-none">
      {/* Category Tag */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-amber-50 border border-[#E5C98D] rounded-full text-stone-800 text-xs font-semibold tracking-wider uppercase mb-2 shadow-xs"
      >
        <MapPin className="w-3.5 h-3.5 text-[#996515]" />
        <span>Celebration Location</span>
      </motion.div>

      {/* Map Display & Pointing Guidance */}
      <div className="w-full relative flex flex-col items-center mb-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="bg-white/90 backdrop-blur-md rounded-2xl px-4 py-2 border border-[#E5C98D]/60 mb-2.5 text-center shadow-xs"
        >
          <p className="font-serif-luxury text-xs sm:text-sm font-semibold text-stone-800">
            &ldquo;Can you find where the party is? Follow the map pin right here!&rdquo;
          </p>
        </motion.div>

        {/* Map Canvas */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="w-full relative"
        >
          <MapIllustration venueName={eventConfig.venue.name} />
        </motion.div>
      </div>

      {/* Venue Address Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="card-deckle p-4 w-full space-y-2 mt-1 text-left"
      >
        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-xl bg-amber-50 text-[#996515] border border-[#E5C98D]/50 shrink-0 mt-0.5">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif-luxury text-base font-bold text-stone-900 leading-tight">
              {eventConfig.venue.name}
            </h3>
            <p className="text-xs font-semibold text-rose-700 mt-0.5">
              {eventConfig.venue.hallOrArea}
            </p>
            <p className="text-xs text-stone-600 mt-1 leading-snug">
              {eventConfig.venue.address}
            </p>
          </div>
        </div>

        {/* Date and Time Bar */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600 font-medium">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#996515]" />
            {eventConfig.event.displayDate}
          </span>
          <span className="flex items-center gap-1.5 font-semibold text-stone-800">
            <Clock className="w-3.5 h-3.5 text-[#996515]" />
            {eventConfig.event.time}
          </span>
        </div>

        {/* Map Links */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <a
            href={eventConfig.venue.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => audioController.playPop()}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-semibold rounded-xl border border-stone-200 transition-colors shadow-2xs"
          >
            <Navigation className="w-3.5 h-3.5 text-blue-600" />
            <span>Google Maps</span>
            <ExternalLink className="w-3 h-3 text-stone-400" />
          </a>

          <a
            href={eventConfig.venue.wazeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => audioController.playPop()}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-sky-50 hover:bg-sky-100 text-sky-900 text-xs font-semibold rounded-xl border border-sky-200 transition-colors shadow-2xs"
          >
            <Navigation className="w-3.5 h-3.5 text-sky-600" />
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
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm rounded-full shadow-md hover:shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <span>Meet Birthday Star Linggit</span>
          <ArrowRight className="w-4 h-4 text-amber-300" />
        </button>
      </motion.div>
    </div>
  );
};
