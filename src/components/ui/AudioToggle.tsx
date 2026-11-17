"use client";

import React, { useState } from "react";
import { audioController } from "@/lib/audio";
import { Volume2, VolumeX, Music } from "lucide-react";

export const AudioToggle: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false);

  const handleToggle = () => {
    const muted = audioController.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      audioController.playPop();
    }
  };

  return (
    <div className="fixed top-3 right-3 z-50 flex items-center gap-1.5">
      <button
        onClick={handleToggle}
        title={isMuted ? "Unmute Music" : "Mute Music"}
        className="flex items-center gap-2 py-1.5 px-3.5 bg-white/90 hover:bg-white backdrop-blur-md border border-[#E5C98D]/60 shadow-xs rounded-full text-xs font-semibold text-stone-700 transition-all hover:scale-102 active:scale-98"
      >
        <Music className={`w-3.5 h-3.5 text-[#996515] ${isMuted ? "" : "animate-pulse"}`} />
        <span className="hidden sm:inline text-[11px] font-serif-luxury text-stone-600 font-medium">
          You Are My Sunshine
        </span>
        {isMuted ? (
          <VolumeX className="w-3.5 h-3.5 text-stone-400" />
        ) : (
          <Volume2 className="w-3.5 h-3.5 text-[#A87B2E]" />
        )}
      </button>
    </div>
  );
};
