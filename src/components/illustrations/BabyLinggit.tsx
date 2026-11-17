"use client";

import React, { useState } from "react";
import Image from "next/image";

interface BabyLinggitProps {
  className?: string;
  imageSrc?: string;
}

export const BabyLinggit: React.FC<BabyLinggitProps> = ({
  className = "w-64 h-64",
  imageSrc = "/images/linggit.png",
}) => {
  const [imageError, setImageError] = useState(false);

  // If parent supplies a real baby photo cutout, render it with floating crown
  if (imageSrc && !imageError) {
    return (
      <div className={`relative flex flex-col items-center ${className}`}>
        {/* Floating Golden 1st Birthday Crown */}
        <div className="absolute -top-7 z-20 animate-bounce-slow">
          <svg width="60" height="40" viewBox="0 0 60 40" fill="none">
            <path
              d="M10 32L5 12L20 20L30 6L40 20L55 12L50 32H10Z"
              fill="#FBBF24"
              stroke="#D97706"
              strokeWidth="2"
            />
            <circle cx="5" cy="12" r="3" fill="#F472B6" />
            <circle cx="30" cy="6" r="3.5" fill="#38BDF8" />
            <circle cx="55" cy="12" r="3" fill="#F472B6" />
            <text
              x="30"
              y="28"
              fontSize="12"
              fontWeight="bold"
              fill="#B45309"
              textAnchor="middle"
            >
              1
            </text>
          </svg>
        </div>

        <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-rachel-pink shadow-2xl bg-rachel-yellow-light">
          <Image
            src={imageSrc}
            alt="Baby Linggit"
            fill
            className="object-cover"
            onError={() => setImageError(true)}
            priority
          />
        </div>
      </div>
    );
  }

  // Cute toddler vector character
  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      <svg
        viewBox="0 0 200 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-2xl"
      >
        {/* Golden Birthday Crown */}
        <path
          d="M70 48L62 25L82 35L100 16L118 35L138 25L130 48H70Z"
          fill="#FBBF24"
          stroke="#D97706"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Crown Jewels */}
        <circle cx="62" cy="25" r="3.5" fill="#F472B6" />
        <circle cx="100" cy="16" r="4.5" fill="#38BDF8" />
        <circle cx="138" cy="25" r="3.5" fill="#F472B6" />
        {/* Crown number 1 */}
        <text
          x="100"
          y="42"
          fontSize="14"
          fontWeight="900"
          fill="#92400E"
          textAnchor="middle"
          fontFamily="sans-serif"
        >
          1
        </text>

        {/* Baby Hair Tuft */}
        <path
          d="M96 55C96 46 104 46 104 55"
          stroke="#451A03"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Baby Face */}
        <circle cx="100" cy="85" r="38" fill="#FFE4D6" />

        {/* Chubby Rosy Cheeks */}
        <ellipse cx="76" cy="94" rx="9" ry="6" fill="#FB7185" fillOpacity="0.45" />
        <ellipse cx="124" cy="94" rx="9" ry="6" fill="#FB7185" fillOpacity="0.45" />

        {/* Big Joyful Eyes */}
        <ellipse cx="82" cy="82" rx="4.5" ry="5.5" fill="#1C1917" />
        <ellipse cx="118" cy="82" rx="4.5" ry="5.5" fill="#1C1917" />
        {/* Eye Catchlights */}
        <circle cx="80" cy="80" r="2" fill="#FFFFFF" />
        <circle cx="84" cy="84" r="1" fill="#FFFFFF" />
        <circle cx="116" cy="80" r="2" fill="#FFFFFF" />
        <circle cx="120" cy="84" r="1" fill="#FFFFFF" />

        {/* Cute Baby Eyebrows */}
        <path
          d="M77 73C80 71 85 72 87 74"
          stroke="#78350F"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M123 73C120 71 115 72 113 74"
          stroke="#78350F"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Little Button Nose */}
        <ellipse cx="100" cy="88" rx="2.5" ry="1.8" fill="#F43F5E" fillOpacity="0.5" />

        {/* Happy Smiling Baby Mouth with 2 Tiny Bottom Teeth */}
        <path
          d="M87 97C89 110 111 110 113 97Z"
          fill="#BE123C"
        />
        {/* Tongue */}
        <path
          d="M93 103C96 100 104 100 107 103C104 106 96 106 93 103Z"
          fill="#FB7185"
        />
        {/* Two cute bottom baby teeth */}
        <rect x="96" y="97" width="3" height="3.5" rx="1" fill="#FFFFFF" />
        <rect x="101" y="97" width="3" height="3.5" rx="1" fill="#FFFFFF" />

        {/* Baby Outfit (Pastel Birthday Romper) */}
        <path
          d="M72 125C65 135 65 185 75 195C85 200 115 200 125 195C135 185 135 135 128 125L100 120L72 125Z"
          fill="#38BDF8"
        />

        {/* Cute Baby Birthday Bib */}
        <path
          d="M80 120C80 145 120 145 120 120C120 118 80 118 80 120Z"
          fill="#FFFDF7"
          stroke="#F472B6"
          strokeWidth="2"
        />
        {/* Bib Heart */}
        <path
          d="M100 128C98.5 126 95.5 126 94.5 128C93.5 130 95.5 132 100 136C104.5 132 106.5 130 105.5 128C104.5 126 101.5 126 100 128Z"
          fill="#F472B6"
        />

        {/* Little Toddler Arms in the Air Celebrating */}
        {/* Left Arm Up */}
        <path
          d="M72 130L48 105L40 92"
          stroke="#FFE4D6"
          strokeWidth="11"
          strokeLinecap="round"
        />
        <circle cx="40" cy="92" r="6.5" fill="#FFE4D6" />

        {/* Right Arm Up */}
        <path
          d="M128 130L152 105L160 92"
          stroke="#FFE4D6"
          strokeWidth="11"
          strokeLinecap="round"
        />
        <circle cx="160" cy="92" r="6.5" fill="#FFE4D6" />

        {/* Confetti & Sparkles around Baby Linggit */}
        <circle cx="32" cy="75" r="3" fill="#FBBF24" />
        <circle cx="168" cy="75" r="3" fill="#F472B6" />
        <circle cx="28" cy="115" r="2.5" fill="#38BDF8" />
        <circle cx="172" cy="115" r="2.5" fill="#4ADE80" />
      </svg>
    </div>
  );
};
