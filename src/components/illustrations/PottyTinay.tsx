"use client";

import React from "react";

interface PottyTinayProps {
  className?: string;
  onClick?: () => void;
}

export const PottyTinay: React.FC<PottyTinayProps> = ({
  className = "w-44 h-44",
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col items-center select-none cursor-pointer group ${className}`}
      title="Linggit's Favorite: Potty Tinay!"
    >
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-lg transition-transform group-hover:scale-110 duration-300"
      >
        {/* Floating Musical Notes */}
        <path
          d="M30 40L45 35V45L30 50V40Z"
          fill="#F472B6"
          className="animate-bounce"
        />
        <circle cx="30" cy="52" r="5" fill="#F472B6" />
        <circle cx="45" cy="47" r="5" fill="#F472B6" />

        <path
          d="M125 35L140 30V40L125 45V35Z"
          fill="#38BDF8"
          className="animate-bounce-slow"
        />
        <circle cx="125" cy="47" r="5" fill="#38BDF8" />
        <circle cx="140" cy="42" r="5" fill="#38BDF8" />

        {/* Potty Chair Base */}
        <path
          d="M40 90C40 70 50 65 80 65C110 65 120 70 120 90L125 130C125 138 120 142 110 142H50C40 142 35 138 35 130L40 90Z"
          fill="#38BDF8"
        />
        {/* Base Rim */}
        <ellipse cx="80" cy="138" rx="42" ry="6" fill="#0284C7" />

        {/* Potty Seat (Friendly Pink Rim) */}
        <ellipse cx="80" cy="80" rx="38" ry="18" fill="#F472B6" />
        <ellipse cx="80" cy="80" rx="28" ry="12" fill="#FFFDF7" />

        {/* Backrest with cute crown handle */}
        <path
          d="M55 70C55 50 65 42 80 42C95 42 105 50 105 70H55Z"
          fill="#0284C7"
        />
        <path
          d="M70 48L75 42L80 46L85 42L90 48H70Z"
          fill="#FBBF24"
        />

        {/* Cheerful Kawaii Face on Potty Chair */}
        {/* Happy Winking / Open Eyes */}
        <circle cx="68" cy="104" r="4.5" fill="#1E293B" />
        <circle cx="67" cy="102" r="1.5" fill="#FFFFFF" />

        <path
          d="M89 104C91 101 95 101 97 104"
          stroke="#1E293B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Rosy Cheeks */}
        <circle cx="60" cy="110" r="5" fill="#F472B6" fillOpacity="0.6" />
        <circle cx="100" cy="110" r="5" fill="#F472B6" fillOpacity="0.6" />

        {/* Sweet Smile */}
        <path
          d="M76 112C78 117 84 117 86 112"
          stroke="#1E293B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Decorative Stars and Soap Bubbles */}
        <circle cx="35" cy="95" r="4" fill="#FEF08A" />
        <circle cx="128" cy="95" r="3.5" fill="#FEF08A" />
        <circle cx="132" cy="75" r="6" fill="#BAE6FD" fillOpacity="0.7" stroke="#38BDF8" strokeWidth="1" />
        <circle cx="28" cy="72" r="5" fill="#BAE6FD" fillOpacity="0.7" stroke="#38BDF8" strokeWidth="1" />
      </svg>
      <span className="text-xs font-bold text-rachel-blue-dark bg-white/90 px-3 py-1 rounded-full border border-rachel-blue/30 shadow-sm mt-1">
        Potty Tinay 🎵
      </span>
    </div>
  );
};
