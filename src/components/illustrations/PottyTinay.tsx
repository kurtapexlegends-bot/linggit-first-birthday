"use client";

import React from "react";
import { Music, Sparkles } from "lucide-react";

interface PottyTinayProps {
  className?: string;
  onClick?: () => void;
}

export const PottyTinay: React.FC<PottyTinayProps> = ({
  className = "w-36 h-36",
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col items-center select-none cursor-pointer group ${className}`}
      title="Tap for a musical chime!"
    >
      <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-[#E0F2FE] via-[#FFFDF7] to-[#FCE7F3] border border-[#E5C98D] shadow-lg flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
        <div className="w-24 h-24 rounded-full border border-sky-200/60 bg-white/90 flex flex-col items-center justify-center p-2 text-center">
          <div className="w-9 h-9 rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center mb-1 text-sky-600">
            <Music className="w-4 h-4 text-[#F472B6]" />
          </div>
          <span className="font-serif-luxury text-xs font-bold text-stone-800">
            Potty Tinay
          </span>
          <span className="text-[9px] font-medium text-stone-500 mt-0.5">
            Ms. Rachel Favorite
          </span>
        </div>

        {/* Small floating charm */}
        <div className="absolute -bottom-1 px-2 py-0.5 rounded-full bg-amber-50 border border-[#E5C98D] shadow-xs flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5 text-amber-600" />
          <span className="text-[9px] font-bold text-amber-900">Tap to Play</span>
        </div>
      </div>
    </div>
  );
};
