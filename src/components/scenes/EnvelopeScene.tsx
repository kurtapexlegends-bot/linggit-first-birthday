"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { audioController } from "@/lib/audio";
import { Sparkles, Heart, MailOpen } from "lucide-react";
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

    // Audio SFX & Start "You Are My Sunshine"
    audioController.playPop();
    audioController.playSparkle();
    audioController.startLullaby();

    // Multicolored celebration confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#F472B6", "#38BDF8", "#FBBF24", "#4ADE80", "#FFFDF7"],
    });

    setTimeout(() => {
      setIsOpen(true);
      setTimeout(() => {
        onOpen();
      }, 900);
    }, 600);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] w-full max-w-md mx-auto px-4 text-center select-none">
      {/* Playful Floating Header Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md border border-rachel-pink/30 text-rachel-pink-dark font-bold text-sm tracking-wide"
      >
        <Sparkles className="w-4 h-4 text-rachel-yellow animate-spin-slow" />
        <span>A Special Invitation Just for You!</span>
        <Heart className="w-4 h-4 text-rachel-pink fill-rachel-pink animate-pulse" />
      </motion.div>

      {/* Main Interactive 3D Envelope */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleOpenEnvelope}
        className="relative w-full max-w-sm aspect-[4/3] cursor-pointer group"
      >
        {/* Soft Ambient Glow */}
        <div className="absolute -inset-2 bg-gradient-to-r from-rachel-pink/30 via-rachel-yellow/30 to-rachel-blue/30 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />

        {/* Envelope Base Container */}
        <div className="relative w-full h-full bg-amber-50/90 rounded-2xl shadow-2xl border-4 border-white overflow-hidden flex flex-col justify-between p-6">
          {/* Decorative Corner Stars */}
          <span className="absolute top-3 left-3 text-lg opacity-60">⭐</span>
          <span className="absolute top-3 right-3 text-lg opacity-60">💖</span>
          <span className="absolute bottom-3 left-3 text-lg opacity-60">🎈</span>
          <span className="absolute bottom-3 right-3 text-lg opacity-60">✨</span>

          {/* Envelope Flap Geometry */}
          <AnimatePresence>
            {!isOpen && (
              <motion.div
                className="absolute inset-x-0 top-0 h-1/2 origin-top bg-gradient-to-b from-rose-100 to-amber-50 border-b-2 border-rachel-pink/30 shadow-md flex items-end justify-center pb-2 z-10"
                animate={isOpening ? { rotateX: 180, opacity: 0 } : { rotateX: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                {/* Golden Wax Seal / Star Badge */}
                <motion.div
                  whileHover={{ rotate: 12, scale: 1.1 }}
                  className="w-14 h-14 -mb-7 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 border-2 border-white shadow-lg flex items-center justify-center text-amber-900 font-extrabold text-sm"
                >
                  <div className="flex flex-col items-center">
                    <span className="text-base leading-none">🎀</span>
                    <span className="text-[10px] uppercase tracking-wider font-black">Open</span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Envelope Letter Content Preview */}
          <div className="my-auto flex flex-col items-center justify-center space-y-2 z-0 pt-4">
            <span className="text-xs uppercase tracking-widest text-amber-700/80 font-black">
              Official Birthday Invitation
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              {eventConfig.celebrant.nickname}&apos;s 1st Birthday!
            </h1>
            <p className="text-sm font-medium text-slate-600 max-w-[240px]">
              Tap anywhere to open the envelope and join the fun!
            </p>
          </div>

          {/* Tap Prompt Footer */}
          <div className="z-10 flex items-center justify-center gap-1.5 text-xs font-bold text-rachel-pink-dark bg-rachel-pink-light/80 py-1.5 px-4 rounded-full mx-auto shadow-sm">
            <MailOpen className="w-3.5 h-3.5" />
            <span>Tap to Open with Music 🎵</span>
          </div>
        </div>
      </motion.div>

      {/* Reassurance note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 text-xs text-slate-500 font-medium"
      >
        🔊 Sound on for &ldquo;You Are My Sunshine&rdquo; lullaby
      </motion.p>
    </div>
  );
};
