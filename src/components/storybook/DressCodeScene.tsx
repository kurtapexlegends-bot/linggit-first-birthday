"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Copy } from "lucide-react";
import type { InvitationSettings } from "@/lib/invitation-settings";
import { audioController } from "@/lib/audio";

interface DressCodeSceneProps {
  settings: InvitationSettings;
  onNext: () => void;
}

export function DressCodeScene({ settings, onNext }: DressCodeSceneProps) {
  const prefersReducedMotion = useReducedMotion();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedHex, setCopiedHex] = useState("");
  const [swingKey, setSwingKey] = useState(0);

  const active = settings.swatches[selectedIndex] ?? settings.swatches[0];

  function selectSwatch(index: number) {
    audioController.playPop();
    setSelectedIndex(index);
    setCopiedHex("");
    setSwingKey((k) => k + 1);
  }

  async function copyHex() {
    audioController.playPop();
    try {
      await navigator.clipboard.writeText(active.hex);
      setCopiedHex(active.hex);
      window.setTimeout(() => setCopiedHex(""), 1800);
    } catch {
      setCopiedHex("");
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10 min-h-[70vh]">
      {/* Left: Ms. Rachel Sticker Explaining the Palettes */}
      <div className="flex flex-col items-center lg:w-[40%]">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.88, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative bg-white rounded-[1.75rem] border-[3px] border-[#c94b77]/35 px-5 py-3.5 shadow-md text-center mb-3 max-w-xs"
        >
          <p className="font-storybook text-lg sm:text-xl font-bold text-[#2e221d] leading-snug">
            “Wear cozy neutrals, friends! {settings.nickname} &amp; I will wear pink &amp; blue!”
          </p>
          <span
            aria-hidden="true"
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-5 h-5 bg-white rotate-45 border-r-[3px] border-b-[3px] border-[#c94b77]/35"
          />
        </motion.div>

        <motion.img
          src="/images/cutouts/ms-rachel-cutout.png"
          alt="Ms. Rachel explaining the neutral dress code"
          initial={prefersReducedMotion ? false : { y: 120, opacity: 0 }}
          animate={
            prefersReducedMotion
              ? { y: 0, opacity: 1 }
              : { y: [0, -6, 0], rotate: [-1.8, 1.8, -1.8], opacity: 1 }
          }
          transition={{
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 0.35 },
          }}
          className="w-[210px] sm:w-[250px] lg:w-[285px] aspect-square object-contain drop-shadow-[0_16px_22px_rgba(46,34,29,0.2)]"
        />

        {/* Ms. Rachel Party Palette Pill */}
        <div className="mt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border-2 border-[#f48fb1]/50 shadow-sm">
          <span className="w-4 h-4 rounded-full bg-[#f48fb1] border border-white" />
          <span className="w-4 h-4 -ml-2.5 rounded-full bg-[#7bc0e3] border border-white" />
          <span className="text-xs font-extrabold text-[#2e221d]">
            Party Theme: Light Pink &amp; Light Blue
          </span>
        </div>
      </div>

      {/* Right: Floating Swinging Hanger & Neutral Cloud Swatches (No Boxy Card!) */}
      <div className="flex-1 flex flex-col items-center text-center gap-4 max-w-xl">
        <h2 className="font-storybook text-2xl sm:text-3xl font-bold text-[#2e221d] leading-tight">
          {settings.dressHeading}
        </h2>

        {/* Swinging Outfit Prop Floating Directly in the Sky */}
        <div className="relative flex flex-col items-center">
          {/* Wooden Rod */}
          <div className="w-56 h-3 rounded-full bg-gradient-to-b from-[#dfb882] to-[#ad7d43] shadow-md" />
          <motion.div
            key={swingKey}
            initial={prefersReducedMotion ? false : { rotate: -10, scale: 0.94 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 170, damping: 8 }}
            style={{ transformOrigin: "top center" }}
          >
            <svg
              viewBox="0 0 180 185"
              className="w-40 h-40 sm:w-48 sm:h-48 drop-shadow-[0_14px_18px_rgba(46,34,29,0.2)]"
              role="img"
              aria-label={`Outfit preview in ${active.name}`}
            >
              <path
                d="M90 12 C90 4, 102 4, 102 12 C102 18, 90 21, 90 28 L42 54 C38 56, 40 62, 45 62 L135 62 C140 62, 142 56, 138 54 L90 28"
                fill="none"
                stroke="#8f6333"
                strokeWidth="5.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Thick white sticker outline around the shirt */}
              <motion.path
                d="M54 56 L30 78 L46 96 L56 86 L54 166 C54 171, 58 174, 64 174 L116 174 C122 174, 126 171, 126 166 L124 86 L134 96 L150 78 L126 56 Q90 66 54 56 Z"
                animate={{ fill: active.hex }}
                transition={{ duration: 0.25 }}
                stroke="#FFFFFF"
                strokeWidth="9"
                strokeLinejoin="round"
              />
              <motion.path
                d="M54 56 L30 78 L46 96 L56 86 L54 166 C54 171, 58 174, 64 174 L116 174 C122 174, 126 171, 126 166 L124 86 L134 96 L150 78 L126 56 Q90 66 54 56 Z"
                animate={{ fill: active.hex }}
                transition={{ duration: 0.25 }}
                stroke="#4a382c"
                strokeOpacity="0.3"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <path
                d="M72 58 L90 74 L108 58"
                fill="none"
                stroke="#4a382c"
                strokeOpacity="0.3"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <circle cx="90" cy="94" r="3.2" fill="#8c6844" fillOpacity="0.65" />
              <circle cx="90" cy="114" r="3.2" fill="#8c6844" fillOpacity="0.65" />
              <circle cx="90" cy="134" r="3.2" fill="#8c6844" fillOpacity="0.65" />
            </svg>
          </motion.div>

          {/* Active Swatch Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/95 border-2 border-[#e3bf75] shadow-sm">
            <span className="font-storybook text-base sm:text-lg font-bold text-[#2e221d]">
              {active.name}
            </span>
            <button
              type="button"
              onClick={copyHex}
              className="inline-flex items-center gap-1 text-xs font-extrabold text-[#9e3359] hover:underline"
            >
              {copiedHex === active.hex ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedHex === active.hex ? "Copied!" : active.hex}</span>
            </button>
          </div>
          <p className="mt-1.5 text-xs sm:text-sm font-bold text-[#544037]">
            {active.tip || settings.dressIntro}
          </p>
        </div>

        {/* Floating Neutral Swatch Bubbles */}
        <div
          className="flex flex-wrap items-center justify-center gap-3 pt-1"
          role="group"
          aria-label="Guest neutral outfit colors"
        >
          {settings.swatches.map((swatch, index) => {
            const isSelected = index === selectedIndex;
            return (
              <motion.button
                key={`${swatch.hex}-${index}`}
                type="button"
                aria-pressed={isSelected}
                onClick={() => selectSwatch(index)}
                whileHover={prefersReducedMotion ? undefined : { y: -5, scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-colors ${
                  isSelected ? "bg-white/95 shadow-md ring-2 ring-[#c94b77]" : "bg-white/70 hover:bg-white/90"
                }`}
              >
                <span
                  className="w-12 h-12 rounded-full border-[3px] border-white shadow-md flex items-center justify-center"
                  style={{ backgroundColor: swatch.hex }}
                >
                  {isSelected && (
                    <span className="w-6 h-6 rounded-full bg-white/95 text-[#9e3359] flex items-center justify-center shadow-sm">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}
                </span>
                <span className="text-[11px] font-extrabold text-[#2e221d] max-w-[74px] leading-tight">
                  {swatch.name}
                </span>
              </motion.button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onNext}
          className="mt-2 inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[#256f9e] hover:bg-[#1e5c84] text-[#fffbf2] font-storybook text-base sm:text-lg font-bold shadow-[0_10px_22px_-6px_rgba(37,111,158,0.45)] active:scale-95 transition-[background-color,transform]"
        >
          <span>See where Ms. Rachel is pointing!</span>
          <ArrowRight className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
