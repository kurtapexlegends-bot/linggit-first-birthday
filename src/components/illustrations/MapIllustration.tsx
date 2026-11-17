"use client";

import React from "react";

interface MapIllustrationProps {
  venueName: string;
  className?: string;
}

export const MapIllustration: React.FC<MapIllustrationProps> = ({
  venueName,
  className = "w-full h-56",
}) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl border-2 border-rachel-blue/30 shadow-inner bg-emerald-50/60 ${className}`}>
      <svg
        viewBox="0 0 400 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
      >
        {/* Park Greenery Ground */}
        <rect width="400" height="240" fill="#E8F5E9" />

        {/* Diagonal Soft Water Stream / Lake */}
        <path
          d="M0 190C100 170 180 220 280 200C340 185 370 210 400 200V240H0V190Z"
          fill="#BAE6FD"
          fillOpacity="0.8"
        />

        {/* Road Grid */}
        {/* Main Boulevard */}
        <path
          d="M-10 110C90 105 180 115 280 95C330 85 370 90 410 80"
          stroke="#FFFFFF"
          strokeWidth="32"
          strokeLinecap="round"
        />
        <path
          d="M-10 110C90 105 180 115 280 95C330 85 370 90 410 80"
          stroke="#E2E8F0"
          strokeWidth="26"
          strokeLinecap="round"
        />
        {/* Road Dash lines */}
        <path
          d="M-10 110C90 105 180 115 280 95C330 85 370 90 410 80"
          stroke="#FBBF24"
          strokeWidth="2.5"
          strokeDasharray="8 8"
          strokeLinecap="round"
        />

        {/* Avenue Crossroad */}
        <path
          d="M230 -10L205 250"
          stroke="#FFFFFF"
          strokeWidth="24"
        />
        <path
          d="M230 -10L205 250"
          stroke="#E2E8F0"
          strokeWidth="18"
        />

        {/* Park Trees & Foliage */}
        <circle cx="60" cy="50" r="18" fill="#A7F3D0" />
        <circle cx="50" cy="45" r="14" fill="#34D399" />
        <circle cx="70" cy="55" r="12" fill="#059669" />

        <circle cx="340" cy="50" r="16" fill="#A7F3D0" />
        <circle cx="350" cy="42" r="13" fill="#34D399" />

        <circle cx="80" cy="170" r="15" fill="#A7F3D0" />
        <circle cx="70" cy="165" r="12" fill="#34D399" />

        {/* Little Clubhouse / Pavilion Roof */}
        <rect x="180" y="70" width="48" height="34" rx="4" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
        <polygon points="175,70 204,45 233,70" fill="#F43F5E" />
      </svg>

      {/* Pulsing Radar Rings at Pin Target */}
      <div className="absolute left-[51%] top-[38%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <span className="absolute -inset-4 rounded-full bg-rose-400 opacity-40 animate-ping" />
        <span className="absolute -inset-8 rounded-full bg-rose-300 opacity-20 animate-pulse" />
      </div>

      {/* Prominent Bouncing Location Pin */}
      <div className="absolute left-[51%] top-[34%] -translate-x-1/2 -translate-y-full flex flex-col items-center animate-bounce">
        <div className="relative">
          <svg width="46" height="54" viewBox="0 0 46 54" fill="none">
            {/* Drop Shadow */}
            <ellipse cx="23" cy="50" rx="9" ry="3.5" fill="#0F172A" fillOpacity="0.25" />
            {/* Pin Body */}
            <path
              d="M23 0C10.3 0 0 10.3 0 23C0 37.5 23 50 23 50C23 50 46 37.5 46 23C46 10.3 35.7 0 23 0Z"
              fill="#E11D48"
              stroke="#FFFFFF"
              strokeWidth="2.5"
            />
            {/* Pin Inner Center */}
            <circle cx="23" cy="20" r="10" fill="#FFFFFF" />
            <circle cx="23" cy="20" r="5" fill="#E11D48" />
          </svg>
        </div>
        {/* Floating Tooltip Label */}
        <div className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg border border-rose-200 -mt-2">
          <p className="text-[11px] font-black tracking-wide text-rose-600 whitespace-nowrap flex items-center gap-1">
            <span>📍</span> {venueName}
          </p>
        </div>
      </div>
    </div>
  );
};
