"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { audioController } from "@/lib/audio";
import { Sparkles, Mail, Volume2 } from "lucide-react";
import { eventConfig } from "@/config/event-config";

interface EnvelopeSceneProps {
  onOpen: () => void;
}

export const EnvelopeScene: React.FC<EnvelopeSceneProps> = ({ onOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenEnvelope = () => {
    if (isOpen || isOpening) return;
    setIsOpening(true);

    audioController.playPop();
    audioController.playSparkle();
    audioController.startLullaby();

    // Elegant champagne and pastel confetti
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.65 },
      colors: ["#D4AF37", "#F7B5CD", "#BAE0F6", "#FAF7F2"],
    });

    setTimeout(() => {
      setIsOpen(true);
      setTimeout(() => {
        onOpen();
      }, 800);
    }, 600);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[78vh] w-full max-w-md mx-auto px-4 text-center select-none">
      {/* Header Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full shadow-xs border border-[#E5C98D]/50 text-stone-700 text-xs font-semibold tracking-wider uppercase"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#A87B2E]" />
        <span>Celebration of a First Birthday</span>
      </motion.div>

      {/* Main Luxury Envelope */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleOpenEnvelope}
        className="relative w-full max-w-sm aspect-[4/3] cursor-pointer group"
      >
        {/* Soft Ambient Shadow */}
        <div className="absolute -inset-2 bg-gradient-to-tr from-[#D4AF37]/15 via-rose-100/20 to-sky-100/15 rounded-3xl blur-xl opacity-80 group-hover:opacity-100 transition-opacity" />

        {/* Outer Envelope Card Container */}
        <div className="relative w-full h-full bg-[#FAF6F0] rounded-2xl shadow-xl border border-[#E5C98D] overflow-hidden flex flex-col justify-between p-6">
          {/* Inner Envelope Liner Texture */}
          <div className="absolute inset-0 bg-envelope-liner opacity-40 pointer-events-none" />

          {/* Envelope Flap with Wax Seal */}
          <AnimatePresence>
            {!isOpen && (
              <motion.div
                className="absolute inset-x-0 top-0 h-1/2 origin-top bg-gradient-to-b from-[#F5EFE6] to-[#FAF6F0] border-b border-[#E5C98D] shadow-sm flex items-end justify-center pb-2 z-10"
                animate={isOpening ? { rotateX: 180, opacity: 0 } : { rotateX: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                {/* Metallic Gold Wax Seal */}
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  className="w-13 h-13 -mb-6.5 rounded-full bg-gradient-to-tr from-[#C89E4B] via-[#FAE8B4] to-[#DFBA73] border-2 border-white shadow-lg flex items-center justify-center text-stone-900"
                >
                  <div className="w-10 h-10 rounded-full border border-stone-800/20 flex flex-col items-center justify-center">
                    <span className="font-serif-luxury text-base font-black leading-none">
                      1
                    </span>
                    <span className="text-[8px] uppercase tracking-widest font-bold">
                      Open
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Letterpress Invitation Card Preview */}
          <div className="my-auto flex flex-col items-center justify-center space-y-2 z-0 pt-3">
            <span className="text-[10px] uppercase tracking-widest text-[#996515] font-bold">
              Official Invitation
            </span>
            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight leading-snug">
              {eventConfig.celebrant.nickname}&apos;s First Birthday
            </h1>
            <p className="text-xs text-stone-600 font-medium max-w-[220px] leading-relaxed">
              Tap to open the invitation and enjoy the celebration music
            </p>
          </div>

          {/* Call to Action Footer */}
          <div className="z-10 flex items-center justify-center gap-1.5 text-xs font-semibold text-stone-700 bg-white/80 backdrop-blur-sm py-1.5 px-4 rounded-full mx-auto border border-[#E5C98D]/40 shadow-xs">
            <Mail className="w-3.5 h-3.5 text-[#996515]" />
            <span>Unseal Invitation</span>
          </div>
        </div>
      </motion.div>

      {/* Audio Note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 text-xs text-stone-500 font-medium flex items-center gap-1.5"
      >
        <Volume2 className="w-3.5 h-3.5 text-[#A87B2E]" />
        <span>Plays &ldquo;You Are My Sunshine&rdquo; lullaby upon opening</span>
      </motion.p>
    </div>
  );
};
