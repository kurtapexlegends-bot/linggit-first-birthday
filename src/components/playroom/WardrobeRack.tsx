"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { audioController } from "@/lib/audio";
import { eventConfig } from "@/config/event-config";
import { Palette, Check, Sparkles, Shirt } from "lucide-react";

export const WardrobeRack: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const colors = eventConfig.dressCode.colors;
  const activeColor = colors[selectedIdx];

  const handleSelect = (idx: number) => {
    audioController.playPop();
    setSelectedIdx(idx);
    setCopied(false);
  };

  const handleCopyHex = (hex: string) => {
    audioController.playPop();
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-lg mx-auto select-none">
      {/* Header Eyebrow */}
      <div className="text-center mb-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F5ECE0] border border-[#E5C98D] rounded-full text-stone-800 text-[11px] font-semibold tracking-wider uppercase mb-1 shadow-2xs">
          <Palette className="w-3 h-3 text-[#996515]" />
          <span>Interactive Guest Dress Code</span>
        </div>
        <h2 className="font-serif-luxury text-2xl font-bold text-stone-900">
          The Neutral Wardrobe
        </h2>
        <p className="text-xs text-stone-600 font-medium max-w-xs mx-auto mt-1">
          Tap the hangers on the rack to explore recommended fabric tones for our family photos!
        </p>
      </div>

      {/* Wooden Wardrobe Rod & Hangers */}
      <div className="relative pt-6 pb-2 px-4 bg-white/70 backdrop-blur-md rounded-3xl border border-[#E5C98D]/60 shadow-lg mb-4">
        {/* Natural Wooden Closet Rod */}
        <div className="absolute top-7 inset-x-6 h-3 bg-gradient-to-b from-[#D4A373] to-[#BC6C25] rounded-full shadow-inner z-0" />

        {/* Hanging Clothes Hangers */}
        <div className="relative z-10 flex items-start justify-between px-2 pt-1">
          {colors.map((c, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <motion.div
                key={c.name}
                onClick={() => handleSelect(idx)}
                whileHover={{ y: -3 }}
                animate={
                  isSelected
                    ? { rotate: [0, -6, 5, -2, 0], y: 0 }
                    : { rotate: 0 }
                }
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col items-center cursor-pointer group"
              >
                {/* Hanger Hook over Rod */}
                <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
                  <path
                    d="M11 16V9C11 5 15 5 15 3C15 1.5 13.5 1 12 1C10 1 9.5 2.5 9.5 3"
                    stroke="#8C501E"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Hanger Triangle */}
                <div className="w-10 sm:w-12 h-3.5 border-t-2 border-r-2 border-l-2 border-[#8C501E] rounded-t-sm" />

                {/* Fabric Swatch Tag */}
                <div
                  className={`w-9 h-11 sm:w-11 sm:h-13 rounded-b-xl border-2 shadow-sm transition-all flex items-end justify-center pb-1 ${
                    isSelected
                      ? "ring-2 ring-[#996515] ring-offset-2 scale-105 shadow-md"
                      : "opacity-85 hover:opacity-100"
                  }`}
                  style={{
                    backgroundColor: c.hex,
                    borderColor: isSelected ? "#996515" : "#D7C4B7",
                  }}
                >
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#996515] mb-0.5" />
                  )}
                </div>

                {/* Swatch Label */}
                <span
                  className={`text-[9px] sm:text-[10px] mt-1.5 text-center font-bold tracking-tight max-w-[50px] leading-tight truncate ${
                    isSelected ? "text-[#996515]" : "text-stone-500"
                  }`}
                >
                  {c.name.split("/")[0]}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Active Color Details Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeColor.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="card-deckle p-4 text-left relative"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl border border-stone-300 shadow-inner flex items-center justify-center shrink-0"
                style={{ backgroundColor: activeColor.hex }}
              >
                <Shirt className="w-4 h-4 text-stone-800 opacity-60" />
              </div>
              <div>
                <h4 className="font-serif-luxury text-base font-bold text-stone-900 leading-tight">
                  {activeColor.name}
                </h4>
                <p className="text-xs text-stone-500 font-medium">
                  {activeColor.description}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleCopyHex(activeColor.hex)}
              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-lg text-[10px] font-mono font-bold text-stone-700 flex items-center gap-1 transition-colors"
              title="Copy HEX Code"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>Copied</span>
                </>
              ) : (
                <span>{activeColor.hex}</span>
              )}
            </button>
          </div>

          <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs">
            <span className="font-semibold text-stone-700 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#C89E4B]" />
              Recommended:
            </span>
            <span className="text-stone-600 text-[11px] font-medium truncate max-w-[240px]">
              {activeColor.recommendedFor}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Ms. Rachel Dress Tip */}
      <div className="mt-3 p-3 bg-gradient-to-r from-rose-50 via-white to-sky-50 rounded-2xl border border-[#E5C98D]/40 text-center text-xs text-stone-600 font-medium leading-relaxed">
        <strong className="text-stone-800 font-bold">Ms. Rachel&apos;s Note: </strong>
        &ldquo;Linggit and I will be in pink and denim overalls, so you wear the cozy neutrals!&rdquo;
      </div>
    </div>
  );
};
