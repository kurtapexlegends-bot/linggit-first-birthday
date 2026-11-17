"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { audioController } from "@/lib/audio";

interface Bubble {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  popped?: boolean;
}

export const FloatingBubbles: React.FC = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    // Generate initial set of interactive bubbles
    const initial: Bubble[] = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      x: Math.random() * 85 + 5, // 5% to 90% horizontal position
      size: Math.random() * 28 + 36, // 36px to 64px
      duration: Math.random() * 6 + 10, // 10s to 16s float speed
      delay: Math.random() * 5,
    }));
    setBubbles(initial);
  }, []);

  const handlePop = (id: number) => {
    audioController.playBubblePop();

    // Mark as popped and respawn after short delay
    setBubbles((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
    );

    setTimeout(() => {
      setBubbles((prev) =>
        prev.map((b) =>
          b.id === id
            ? {
                ...b,
                popped: false,
                x: Math.random() * 85 + 5,
                size: Math.random() * 28 + 36,
                delay: 0,
              }
            : b
        )
      );
    }, 1800);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden select-none">
      <AnimatePresence>
        {bubbles.map((bubble) => {
          if (bubble.popped) return null;
          return (
            <motion.div
              key={bubble.id}
              initial={{ y: "110vh", opacity: 0, scale: 0.8 }}
              animate={{
                y: "-15vh",
                opacity: [0, 0.75, 0.85, 0.7, 0],
                x: [`${bubble.x}vw`, `${bubble.x + (bubble.id % 2 === 0 ? 4 : -4)}vw`],
              }}
              transition={{
                duration: bubble.duration,
                delay: bubble.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 1.3, opacity: 0 }}
              onClick={() => handlePop(bubble.id)}
              className="absolute pointer-events-auto cursor-pointer group"
              style={{
                width: bubble.size,
                height: bubble.size,
                left: `${bubble.x}vw`,
              }}
              title="Pop the bubble!"
            >
              {/* Shimmering Soap Bubble */}
              <div className="w-full h-full rounded-full border border-white/60 bg-gradient-to-tr from-sky-200/30 via-pink-200/25 to-amber-100/30 shadow-[inset_0_0_12px_rgba(255,255,255,0.7),0_4px_12px_rgba(56,189,248,0.15)] backdrop-blur-[1px] relative flex items-center justify-center">
                {/* Iridescent Highlight Catchlights */}
                <div className="absolute top-1.5 left-2 w-2.5 h-1.5 rounded-full bg-white/80 rotate-[-40deg]" />
                <div className="absolute bottom-2 right-2 w-1.5 h-1 rounded-full bg-pink-300/40" />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
