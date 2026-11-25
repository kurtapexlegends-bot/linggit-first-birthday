"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Camera, Sparkles, Heart, Crown } from "lucide-react";
import { audioController } from "@/lib/audio";

interface BabyLinggitProps {
  className?: string;
  imageSrc?: string;
}

export const BabyLinggit: React.FC<BabyLinggitProps> = ({
  className = "w-60 h-72 sm:w-72 sm:h-84",
  imageSrc = "/images/linggit.png",
}) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if parent previously uploaded a custom photo in localStorage
    const saved = localStorage.getItem("linggit_custom_photo");
    if (saved) {
      setPhotoUrl(saved);
    } else if (imageSrc) {
      const testImg = new window.Image();
      testImg.src = imageSrc;
      testImg.onload = () => setPhotoUrl(imageSrc);
      testImg.onerror = () => setPhotoUrl(null);
    }
  }, [imageSrc]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      audioController.playSparkle();
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setPhotoUrl(base64);
        try {
          localStorage.setItem("linggit_custom_photo", base64);
        } catch {
          // fallback in-memory
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Hidden file input for parents to easily personalize with baby's real photo */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Sunny Sunshine Cameo Frame */}
      <div
        className="relative w-full h-full p-3 rounded-t-[110px] rounded-b-3xl bg-gradient-to-b from-[#FEF08A] via-[#FDE047] to-[#FBBF24] border-4 border-white shadow-2xl transition-all duration-300 sunshine-glow"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Playful Floating Little Birthday Crown on Top */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 border-2 border-white shadow-md flex items-center gap-1.5 z-20">
          <Crown className="w-3.5 h-3.5 text-amber-900 fill-amber-900" />
          <span className="font-bubble text-xs font-bold text-amber-950 uppercase tracking-wider">
            Birthday Star
          </span>
          <Sparkles className="w-3.5 h-3.5 text-amber-900" />
        </div>

        {/* Inner White Frame with Subtle Cloud Trim */}
        <div className="relative w-full h-full rounded-t-[100px] rounded-b-2xl overflow-hidden border-2 border-amber-200 bg-gradient-to-b from-sky-50 to-white flex flex-col items-center justify-center">
          {photoUrl ? (
            <div className="relative w-full h-full">
              <Image
                src={photoUrl}
                alt="Baby Linggit"
                fill
                className="object-cover object-top"
                priority
              />
              {/* Soft warm sunbeam filter */}
              <div className="absolute inset-0 bg-gradient-to-t from-amber-900/30 via-transparent to-amber-200/10 pointer-events-none" />
            </div>
          ) : (
            // Cheerful Storybook Character Placeholder
            <div className="flex flex-col items-center justify-center px-4 py-8 text-center space-y-3">
              {/* Cute Smiling Baby Monogram */}
              <div className="w-22 h-22 rounded-full bg-gradient-to-tr from-amber-300 via-yellow-200 to-amber-100 border-3 border-white shadow-md flex flex-col items-center justify-center">
                <span className="font-bubble text-4xl font-extrabold text-amber-900">
                  L
                </span>
                <span className="text-[10px] font-bold text-amber-800 -mt-1">
                  Baby Linggit
                </span>
              </div>

              <div>
                <p className="font-bubble text-lg font-bold text-stone-800">
                  Linggit is Turning 1!
                </p>
                <p className="text-xs font-semibold text-amber-700 mt-0.5">
                  Our Little Sunshine ☀️
                </p>
              </div>

              {/* Upload Prompt Button */}
              <button
                type="button"
                onClick={() => {
                  audioController.playPop();
                  fileInputRef.current?.click();
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-amber-50 border-2 border-amber-300 text-xs font-bold text-amber-900 shadow-sm transition-all hover:scale-105 active:scale-95"
              >
                <Camera className="w-3.5 h-3.5 text-amber-600" />
                <span>Tap to Add Linggit&apos;s Photo</span>
              </button>
            </div>
          )}

          {/* Floating Change Photo Action when Hovered */}
          {photoUrl && (
            <button
              type="button"
              onClick={() => {
                audioController.playPop();
                fileInputRef.current?.click();
              }}
              className="absolute bottom-3 px-3.5 py-1.5 bg-stone-900/80 hover:bg-stone-900 backdrop-blur-md rounded-full text-xs font-bold text-white flex items-center gap-1.5 shadow-md transition-all hover:scale-105 active:scale-95"
            >
              <Camera className="w-3 h-3 text-yellow-300" />
              <span>Change Photo</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
