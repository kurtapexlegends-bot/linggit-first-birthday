"use client";

import React from "react";
import { MapPin } from "lucide-react";

interface MapIllustrationProps {
  venueName: string;
  className?: string;
}

export const MapIllustration: React.FC<MapIllustrationProps> = ({
  venueName,
  className = "w-full h-52",
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-[#E5C98D]/60 shadow-inner bg-[#FBF8F3] ${className}`}
    >
      <svg
        viewBox="0 0 400 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover opacity-90"
      >
        {/* Soft Parchment Background */}
        <rect width="400" height="220" fill="#FAF6F0" />

        {/* Delicate Topographical Grid */}
        <path
          d="M0 60H400M0 120H400M0 180H400M80 0V220M180 0V220M280 0V220M380 0V220"
          stroke="#EFE8DD"
          strokeWidth="1"
        />

        {/* Soft Water Feature */}
        <path
          d="M-20 180C80 160 160 200 260 180C340 165 370 190 420 175V230H-20V180Z"
          fill="#E6F2F8"
        />

        {/* Clean Roadways */}
        <path
          d="M-10 100C110 95 190 110 290 85C340 75 370 80 420 70"
          stroke="#FFFFFF"
          strokeWidth="24"
          strokeLinecap="round"
        />
        <path
          d="M-10 100C110 95 190 110 290 85C340 75 370 80 420 70"
          stroke="#EDE4D6"
          strokeWidth="18"
          strokeLinecap="round"
        />
        <path
          d="M-10 100C110 95 190 110 290 85C340 75 370 80 420 70"
          stroke="#D4AF37"
          strokeWidth="1.5"
          strokeDasharray="6 6"
          strokeLinecap="round"
        />

        {/* Cross Avenue */}
        <path d="M220 -10L195 230" stroke="#FFFFFF" strokeWidth="20" />
        <path d="M220 -10L195 230" stroke="#EDE4D6" strokeWidth="14" />

        {/* Park Foliage Accents */}
        <ellipse cx="70" cy="50" rx="22" ry="16" fill="#E8EFE5" />
        <ellipse cx="330" cy="50" rx="20" ry="14" fill="#E8EFE5" />
        <ellipse cx="90" cy="150" rx="18" ry="12" fill="#E8EFE5" />
      </svg>

      {/* Gentle Radar Glow */}
      <div className="absolute left-[51%] top-[38%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <span className="absolute -inset-3 rounded-full bg-rose-400 opacity-30 animate-ping" />
        <span className="absolute -inset-6 rounded-full bg-amber-300 opacity-20 animate-pulse" />
      </div>

      {/* Elegant Metallic Location Pin */}
      <div className="absolute left-[51%] top-[34%] -translate-x-1/2 -translate-y-full flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#E11D48] to-[#F43F5E] p-1.5 shadow-xl border-2 border-white flex items-center justify-center text-white">
          <MapPin className="w-5 h-5 fill-white stroke-rose-600" />
        </div>
        <div className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-md border border-[#E5C98D] -mt-1 text-center">
          <p className="font-serif-luxury text-[11px] font-bold text-stone-900 tracking-tight whitespace-nowrap">
            {venueName}
          </p>
        </div>
      </div>
    </div>
  );
};
