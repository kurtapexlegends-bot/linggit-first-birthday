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
        className="flex items-center gap-1.5 py-1.5 px-3 bg-white/90 hover:bg-white backdrop-blur-md border border-rachel-pink/40 shadow-md rounded-full text-xs font-bold text-slate-700 transition-all hover:scale-105 active:scale-95"
      >
        <Music className={`w-3.5 h-3.5 text-rachel-pink ${isMuted ? "" : "animate-bounce"}`} />
        <span className="hidden sm:inline text-[11px] text-slate-600 font-semibold">
          You Are My Sunshine
        </span>
        {isMuted ? (
          <VolumeX className="w-3.5 h-3.5 text-rose-500" />
        ) : (
          <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
        )}
      </button>
    </div>
  );
};
