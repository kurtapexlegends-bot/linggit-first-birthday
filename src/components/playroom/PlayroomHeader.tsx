"use client";

import React, { useState } from "react";
import { audioController } from "@/lib/audio";
import { Volume2, VolumeX, Music } from "lucide-react";
import { eventConfig } from "@/config/event-config";

export const PlayroomHeader: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false);

  const handleToggleMute = () => {
    const muted = audioController.toggleMute();
    setIsMuted(muted);
    if (!muted) audioController.playPop();
  };

  return (
    <header className="relative w-full z-40 select-none">
      {/* Decorative Pastel Bunting Garland */}
      <div className="w-full flex items-center justify-center overflow-hidden h-7 sm:h-9 -mt-1 opacity-90">
        <svg
          viewBox="0 0 600 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full max-w-2xl h-full"
          preserveAspectRatio="none"
        >
          {/* Swag string */}
          <path
            d="M0 5C100 20 200 20 300 5C400 20 500 20 600 5"
            stroke="#D7C4B7"
            strokeWidth="1.2"
            strokeDasharray="4 3"
          />
          {/* Pennant Flags */}
          <polygon points="30,8 45,28 60,8" fill="#F7B5CD" />
          <polygon points="80,12 95,32 110,12" fill="#BAE0F6" />
          <polygon points="130,14 145,34 160,14" fill="#FEF08A" />
          <polygon points="180,13 195,33 210,13" fill="#B4C5B0" />
          <polygon points="230,10 245,30 260,10" fill="#F7B5CD" />
          <polygon points="280,6 295,26 310,6" fill="#BAE0F6" />
          <polygon points="330,10 345,30 360,10" fill="#FEF08A" />
          <polygon points="380,13 395,33 410,13" fill="#B4C5B0" />
          <polygon points="430,14 445,34 460,14" fill="#F7B5CD" />
          <polygon points="480,12 495,32 510,12" fill="#BAE0F6" />
          <polygon points="530,8 545,28 560,8" fill="#FEF08A" />
        </svg>
      </div>

      {/* Top Floating Utility Bar */}
      <div className="max-w-4xl mx-auto px-4 pt-1 flex items-center justify-between">
        {/* Playroom Celebrant Badge */}
        <div className="flex items-center gap-2 py-1 px-3 bg-white/80 backdrop-blur-md rounded-full border border-[#E5C98D]/50 shadow-2xs">
          <div className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
          <span className="font-serif-luxury text-xs font-bold text-stone-800 tracking-tight">
            {eventConfig.celebrant.nickname}&apos;s First Birthday Playroom
          </span>
        </div>

        {/* Music Soundwave & Toggle */}
        <button
          onClick={handleToggleMute}
          title={isMuted ? "Unmute Music" : "Mute Music"}
          className="flex items-center gap-2 py-1.5 px-3 bg-white/90 hover:bg-white backdrop-blur-md rounded-full border border-[#E5C98D]/60 shadow-xs transition-all hover:scale-102 active:scale-98"
        >
          {/* Animated Equalizer Sound Bars */}
          {!isMuted ? (
            <div className="flex items-end gap-0.5 h-3.5">
              <span className="w-0.5 bg-rose-400 rounded-full animate-[bounce_0.8s_ease-in-out_infinite] h-3" />
              <span className="w-0.5 bg-amber-400 rounded-full animate-[bounce_0.6s_ease-in-out_infinite_0.2s] h-2" />
              <span className="w-0.5 bg-sky-400 rounded-full animate-[bounce_0.9s_ease-in-out_infinite_0.4s] h-3.5" />
              <span className="w-0.5 bg-emerald-400 rounded-full animate-[bounce_0.7s_ease-in-out_infinite_0.1s] h-2.5" />
            </div>
          ) : (
            <Music className="w-3.5 h-3.5 text-stone-400" />
          )}

          <span className="hidden sm:inline font-serif-luxury text-[11px] font-semibold text-stone-700">
            You Are My Sunshine
          </span>

          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 text-stone-400" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-[#996515]" />
          )}
        </button>
      </div>
    </header>
  );
};
