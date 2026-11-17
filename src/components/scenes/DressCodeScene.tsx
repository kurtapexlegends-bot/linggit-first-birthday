"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { audioController } from "@/lib/audio";
import { eventConfig } from "@/config/event-config";
import { Palette, Check, ArrowRight, Shirt } from "lucide-react";

interface DressCodeSceneProps {
  onNext: () => void;
}

export const DressCodeScene: React.FC<DressCodeSceneProps> = ({ onNext }) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopyColor = (hex: string) => {
    audioController.playPop();
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const handleNext = () => {
    audioController.playPop();
    onNext();
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[74vh] w-full max-w-lg mx-auto px-4 py-2 select-none">
      {/* Category Tag */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#F5ECE0] border border-[#E5C98D] rounded-full text-stone-800 text-xs font-semibold tracking-wider uppercase mb-2 shadow-xs"
      >
        <Palette className="w-3.5 h-3.5 text-[#996515]" />
        <span>Guest Attire Palette</span>
      </motion.div>

      {/* Editorial Card Description */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-deckle p-5 w-full mb-3 text-center"
      >
        <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-stone-900">
          {eventConfig.dressCode.themeName}
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-stone-600 font-medium leading-relaxed">
          &ldquo;Can you wear warm neutral and earth tones? Think linen creams, warm taupes, sand, and soft sage. Ms. Rachel and Linggit will bring the bright pops of soft pink and blue!&rdquo;
        </p>
      </motion.div>

      {/* Swatches Grid */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full space-y-2 mb-3"
      >
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1">
            <Shirt className="w-3 h-3 text-[#996515]" />
            Recommended Fabric Shades
          </span>
          <span className="text-[10px] text-stone-500 font-medium">Tap swatch to copy code</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {eventConfig.dressCode.colors.map((color) => {
            const isCopied = copiedHex === color.hex;
            return (
              <motion.div
                key={color.name}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleCopyColor(color.hex)}
                className="flex items-center gap-3 p-2.5 bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-sm cursor-pointer transition-all"
              >
                {/* Fabric Swatch Circle */}
                <div
                  className="w-9 h-9 rounded-full border border-stone-300 shadow-inner flex items-center justify-center shrink-0"
                  style={{ backgroundColor: color.hex }}
                >
                  {isCopied && <Check className="w-4 h-4 text-stone-800 stroke-[2.5]" />}
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-stone-800 truncate">{color.name}</p>
                    <span className="text-[10px] font-mono text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                      {isCopied ? "Copied" : color.hex}
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-500 truncate">{color.recommendedFor}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Subtle Palette Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full bg-[#FAF5EE] rounded-xl p-2.5 border border-[#E5C98D]/40 flex items-center justify-between text-xs font-medium text-stone-700"
      >
        <span className="flex items-center gap-1.5 text-[11px]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F7B5CD]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#B8E0F6]" />
          <strong className="font-semibold">Event Accents:</strong>
        </span>
        <span className="text-[11px] text-stone-600">
          Soft Pink &amp; Denim Blue reserved for Baby Linggit
        </span>
      </motion.div>

      {/* Next Scene Button */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-xs mt-3 flex flex-col items-center gap-1"
      >
        <button
          onClick={handleNext}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm rounded-full shadow-md hover:shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <span>View Venue &amp; Map Pin</span>
          <ArrowRight className="w-4 h-4 text-amber-300" />
        </button>
      </motion.div>
    </div>
  );
};
