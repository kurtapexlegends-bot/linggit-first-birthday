"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Music, Sparkles } from "lucide-react";

interface MsRachelProps {
  className?: string;
  pointing?: boolean;
  imageSrc?: string;
}

export const MsRachel: React.FC<MsRachelProps> = ({
  className = "w-48 h-48",
  pointing = false,
  imageSrc = "/images/ms-rachel.png",
}) => {
  const [imageError, setImageError] = useState(false);

  // If a real cutout photo is present and loads, render cleanly
  if (imageSrc && !imageError) {
    return (
      <div className={`relative flex flex-col items-center ${className}`}>
        <div className="relative w-full h-full drop-shadow-xl transition-transform hover:scale-105 duration-300">
          <Image
            src={imageSrc}
            alt="Ms. Rachel"
            fill
            className="object-contain"
            onError={() => setImageError(true)}
            priority
          />
        </div>
      </div>
    );
  }

  // Boutique Storybook Medallion (Elegantly representing Ms. Rachel without awkward clipart)
  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      <div className="relative w-36 h-36 rounded-full bg-gradient-to-tr from-[#FCE7F3] via-white to-[#E0F2FE] border-2 border-[#E5C98D] shadow-xl flex flex-col items-center justify-center p-3">
        {/* Soft Inner Circle */}
        <div className="w-full h-full rounded-full border border-[#D4AF37]/40 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm relative overflow-hidden">
          {/* Subtle signature pink headband bow insignia */}
          <div className="w-12 h-4 rounded-full bg-[#F472B6]/25 border border-[#F472B6]/60 mb-2 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-[#F472B6]" />
          </div>

          <div className="flex items-center gap-1 text-[#2563EB]">
            <Music className="w-3.5 h-3.5 text-[#F472B6] animate-bounce" />
            <span className="font-serif-luxury text-sm font-bold text-stone-800">
              Ms. Rachel
            </span>
          </div>

          <span className="text-[9px] font-semibold uppercase tracking-widest text-stone-500 mt-0.5">
            Songs for Littles
          </span>

          {pointing && (
            <div className="absolute bottom-1 right-2 flex items-center gap-0.5 text-[9px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-full">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Right Here</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
