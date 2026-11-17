"use client";

import React, { useState } from "react";
import Image from "next/image";

interface MsRachelProps {
  className?: string;
  pointing?: boolean;
  actionText?: string;
  imageSrc?: string;
}

export const MsRachel: React.FC<MsRachelProps> = ({
  className = "w-64 h-64",
  pointing = false,
  actionText,
  imageSrc = "/images/ms-rachel.png",
}) => {
  const [imageError, setImageError] = useState(false);

  // If a real photo is supplied and exists without error, display the cutout photo
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
        {actionText && (
          <span className="mt-2 text-xs font-semibold px-2.5 py-1 bg-rachel-pink-light text-rachel-pink-dark rounded-full shadow-sm">
            {actionText}
          </span>
        )}
      </div>
    );
  }

  // Beautiful, high-fidelity signature Ms. Rachel vector illustration
  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      <svg
        viewBox="0 0 200 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl"
      >
        {/* Hair Back */}
        <path
          d="M60 70C60 40 80 28 100 28C120 28 140 40 140 70C140 110 135 130 130 140C125 125 75 125 70 140C65 130 60 110 60 70Z"
          fill="#5C3A21"
        />

        {/* Neck */}
        <rect x="91" y="105" width="18" height="20" rx="6" fill="#FAD4C0" />

        {/* Head */}
        <circle cx="100" cy="78" r="32" fill="#FFE2D1" />

        {/* Cheerful Blush */}
        <circle cx="81" cy="85" r="7" fill="#F472B6" fillOpacity="0.45" />
        <circle cx="119" cy="85" r="7" fill="#F472B6" fillOpacity="0.45" />

        {/* Eyes (Happy and bright) */}
        <ellipse cx="85" cy="76" rx="3.5" ry="4.5" fill="#2E1B0F" />
        <ellipse cx="115" cy="76" rx="3.5" ry="4.5" fill="#2E1B0F" />
        <circle cx="83.8" cy="74.5" r="1.5" fill="#FFFFFF" />
        <circle cx="113.8" cy="74.5" r="1.5" fill="#FFFFFF" />

        {/* Eyebrows */}
        <path
          d="M80 67C82 65 88 66 90 68"
          stroke="#4A2E1B"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M120 67C118 65 112 66 110 68"
          stroke="#4A2E1B"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Nose */}
        <path
          d="M99 80C100 82 101 82 102 80"
          stroke="#E5A686"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Warm Smiling Mouth with Teeth */}
        <path
          d="M89 89C91 98 109 98 111 89Z"
          fill="#C2410C"
        />
        <path
          d="M91 89C94 92 106 92 109 89Z"
          fill="#FFFFFF"
        />

        {/* Signature Ms. Rachel Pink Headband */}
        <path
          d="M72 65C74 46 86 42 100 42C114 42 126 46 128 65"
          stroke="#F472B6"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Headband Bow Knot */}
        <circle cx="78" cy="54" r="5" fill="#F472B6" />
        <ellipse cx="73" cy="51" rx="4" ry="2.5" fill="#F472B6" transform="rotate(-30 73 51)" />
        <ellipse cx="76" cy="60" rx="4" ry="2.5" fill="#F472B6" transform="rotate(30 76 60)" />

        {/* Hair Bangs */}
        <path
          d="M73 66C78 61 88 63 94 67C99 63 113 60 127 68C124 59 116 52 100 52C86 52 76 59 73 66Z"
          fill="#5C3A21"
        />

        {/* Pink T-Shirt */}
        <path
          d="M70 120C70 115 80 112 100 112C120 112 130 115 130 120L135 155H65L70 120Z"
          fill="#F472B6"
        />

        {/* Signature Denim Overalls */}
        <path
          d="M75 135H125V210C125 214 121 218 117 218H83C79 218 75 214 75 210V135Z"
          fill="#2563EB"
        />
        {/* Overall Straps */}
        <rect x="78" y="118" width="10" height="30" rx="2" fill="#1D4ED8" />
        <rect x="112" y="118" width="10" height="30" rx="2" fill="#1D4ED8" />

        {/* Overall Yellow Buttons */}
        <circle cx="83" cy="142" r="3.5" fill="#FBBF24" />
        <circle cx="117" cy="142" r="3.5" fill="#FBBF24" />

        {/* Overall Front Pocket */}
        <path
          d="M88 152H112V172C112 176 108 180 104 180H96C92 180 88 176 88 172V152Z"
          fill="#1D4ED8"
          stroke="#1E40AF"
          strokeWidth="1.5"
        />
        {/* Pocket Cute Heart */}
        <path
          d="M100 162C99 159 96 159 95 161C94 163 95 165 100 169C105 165 106 163 105 161C104 159 101 159 100 162Z"
          fill="#F472B6"
        />

        {/* Arms */}
        {pointing ? (
          // Pointing Right Arm towards the map pin
          <>
            {/* Left Hand resting naturally */}
            <path
              d="M66 122L52 155C50 160 55 165 60 162L70 142"
              stroke="#FFE2D1"
              strokeWidth="11"
              strokeLinecap="round"
            />
            {/* Right Arm raised pointing up-right */}
            <path
              d="M132 122L165 98L185 85"
              stroke="#FFE2D1"
              strokeWidth="11"
              strokeLinecap="round"
            />
            {/* Pointing Hand with index finger */}
            <circle cx="185" cy="85" r="6" fill="#FFE2D1" />
            <path
              d="M185 85L196 78"
              stroke="#FFE2D1"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Sparkles at finger tip */}
            <path
              d="M198 70L200 74L204 76L200 78L198 82L196 78L192 76L196 74Z"
              fill="#FBBF24"
            />
          </>
        ) : (
          // Waving Arms
          <>
            {/* Left Arm Waving */}
            <path
              d="M68 122L46 98L35 84"
              stroke="#FFE2D1"
              strokeWidth="11"
              strokeLinecap="round"
            />
            {/* Left Open Hand */}
            <circle cx="35" cy="84" r="7" fill="#FFE2D1" />
            {/* Right Arm Greeting */}
            <path
              d="M132 122L154 135L160 152"
              stroke="#FFE2D1"
              strokeWidth="11"
              strokeLinecap="round"
            />
            <circle cx="160" cy="152" r="7" fill="#FFE2D1" />
          </>
        )}
      </svg>
    </div>
  );
};
