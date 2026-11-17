"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { audioController } from "@/lib/audio";
import { eventConfig } from "@/config/event-config";
import { Palette, Check, Sparkles, ArrowRight } from "lucide-react";

interface DressCodeSceneProps {
  onNext: () => void;
}

export const DressCodeScene: React.FC<DressCodeSceneProps> = ({ onNext }) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopyColor = (hex: string) => {
    audioController.playPop();
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleNext = () => {
    audioController.playPop();
    onNext();
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[72vh] w-full max-w-lg mx-auto px-4 py-2 select-none">
      {/* Top Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-amber-100/90 border border-amber-300 rounded-full text-amber-900 font-extrabold text-xs shadow-sm mb-2"
      >
        <Palette className="w-3.5 h-3.5 text-amber-600" />
        <span>Guest Attire Guide &bull; {eventConfig.dressCode.themeName}</span>
      </motion.div>

      {/* Ms. Rachel's Dialogue Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-5 shadow-xl border-3 border-amber-200/80 w-full mb-3 text-center relative"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-xl">👗</span>
          <h2 className="text-lg sm:text-xl font-black text-slate-800">
            Ms. Rachel Explains the Palettes!
          </h2>
          <span className="text-xl">👕</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
          &ldquo;Can you wear cozy, picture-perfect <strong className="text-amber-900 font-bold">neutral &amp; earth tones</strong>?
          Think cream, warm taupe, light khaki, and soft sage! Linggit and I will bring the bright pops of pink &amp; sky blue!&rdquo;
        </p>
      </motion.div>

      {/* Neutral Color Swatches Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full space-y-2 mb-3"
      >
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-rachel-yellow" />
            Recommended Guest Swatches
          </span>
          <span className="text-[10px] text-slate-500 font-semibold">Tap color to copy HEX</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {eventConfig.dressCode.colors.map((color, index) => {
            const isCopied = copiedHex === color.hex;
            return (
              <motion.div
                key={color.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCopyColor(color.hex)}
                className="flex items-center gap-3 p-2.5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md cursor-pointer transition-all"
              >
                {/* Color Swatch Circle */}
                <div
                  className="w-10 h-10 rounded-full border-2 border-slate-300 shadow-inner flex items-center justify-center shrink-0"
                  style={{ backgroundColor: color.hex }}
                >
                  {isCopied && <Check className="w-4 h-4 text-emerald-700 stroke-[3]" />}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-800 truncate">{color.name}</p>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {isCopied ? "Copied!" : color.hex}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate">{color.recommendedFor}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Contrast Showcase: Theme Accents (Pink & Blue) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full bg-gradient-to-r from-rachel-pink-light/70 via-white to-rachel-blue-light/70 rounded-2xl p-3 border border-rachel-pink/20 flex items-center justify-between text-xs font-semibold text-slate-700"
      >
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rachel-pink" />
          <span className="w-3 h-3 rounded-full bg-rachel-blue" />
          <span>Party Accents:</span>
        </span>
        <span className="text-[11px] text-slate-600">
          Reserved for Party Decor &amp; Baby Linggit! 🎈
        </span>
      </motion.div>

      {/* Next Step Button */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-xs mt-3 flex flex-col items-center gap-2"
      >
        <button
          onClick={handleNext}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 bg-gradient-to-r from-rachel-blue-dark to-sky-500 hover:from-sky-600 hover:to-rachel-blue-dark text-white font-extrabold text-base rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Find the Party Location!</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
};
