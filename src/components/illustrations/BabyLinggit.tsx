"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Camera, Sparkles, Heart } from "lucide-react";

interface BabyLinggitProps {
  className?: string;
  imageSrc?: string;
}

export const BabyLinggit: React.FC<BabyLinggitProps> = ({
  className = "w-64 h-80",
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
      // Check if imageSrc exists
      const testImg = new window.Image();
      testImg.src = imageSrc;
      testImg.onload = () => setPhotoUrl(imageSrc);
      testImg.onerror = () => setPhotoUrl(null);
    }
  }, [imageSrc]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setPhotoUrl(base64);
        try {
          localStorage.setItem("linggit_custom_photo", base64);
        } catch {
          // localStorage quote exceeded, fallback in-memory
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

      {/* Luxury Arch Cameo Frame with Embossed Gold Trim */}
      <div
        className="relative w-full h-full p-2.5 rounded-t-[100px] rounded-b-3xl bg-gradient-to-b from-[#FAF4EB] to-[#F5ECE0] border-2 border-[#E5C98D] shadow-2xl transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Inner Gold Inset Pinstripe */}
        <div className="relative w-full h-full rounded-t-[92px] rounded-b-2xl overflow-hidden border border-[#D4AF37]/50 bg-white flex flex-col items-center justify-center">
          {photoUrl ? (
            <div className="relative w-full h-full">
              <Image
                src={photoUrl}
                alt="Baby Linggit"
                fill
                className="object-cover object-top"
                priority
              />
              {/* Soft warm vignette filter */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent pointer-events-none" />
            </div>
          ) : (
            // Elegant Placeholder: Classical Monogram & Arch Portrait
            <div className="flex flex-col items-center justify-center px-4 py-8 text-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-[#FAF5EE] border-2 border-[#E5C98D] flex items-center justify-center shadow-inner">
                <span className="font-serif-luxury text-3xl font-bold text-[#A87B2E] tracking-tight">
                  L
                </span>
              </div>
              <div>
                <p className="font-serif-luxury text-base font-semibold text-stone-800">
                  Linggit
                </p>
                <p className="text-[11px] font-medium tracking-wide uppercase text-stone-500 mt-0.5">
                  Turning One
                </p>
              </div>

              {/* Upload Prompt Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF5EE] hover:bg-[#F2E7D7] border border-[#E5C98D] text-[11px] font-semibold text-stone-700 shadow-sm transition-colors"
              >
                <Camera className="w-3 h-3 text-[#A87B2E]" />
                <span>Tap to Add Photo</span>
              </button>
            </div>
          )}

          {/* Floating Subtle Change Photo Hover Action */}
          {photoUrl && isHovered && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-3 px-3 py-1 bg-stone-900/80 backdrop-blur-sm rounded-full text-[11px] font-medium text-white flex items-center gap-1.5 shadow-md transition-all hover:bg-stone-900"
            >
              <Camera className="w-3 h-3 text-amber-300" />
              <span>Change Photo</span>
            </button>
          )}
        </div>

        {/* Delicate Gold Crest Badge on Top */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#DFBA73] via-[#FAE8B4] to-[#C89E4B] border border-white shadow-md flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5 text-stone-900" />
          <span className="font-serif-luxury text-[10px] font-bold uppercase tracking-widest text-stone-900">
            One Year of Love
          </span>
          <Heart className="w-2.5 h-2.5 text-stone-900 fill-stone-900" />
        </div>
      </div>
    </div>
  );
};
