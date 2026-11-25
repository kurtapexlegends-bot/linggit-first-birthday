"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { audioController } from "@/lib/audio";

interface Bubble {
  id: number;
  left: string;
  size: number;
  duration: number;
  delay: number;
  tint: string;
}

const initialBubbles: Bubble[] = [
  { id: 1, left: "8%", size: 36, duration: 15, delay: 0.5, tint: "rgba(123, 192, 227, 0.28)" },
  { id: 2, left: "22%", size: 26, duration: 18, delay: 4.2, tint: "rgba(247, 197, 216, 0.34)" },
  { id: 3, left: "78%", size: 40, duration: 16, delay: 1.8, tint: "rgba(251, 224, 123, 0.30)" },
  { id: 4, left: "90%", size: 28, duration: 19, delay: 6.5, tint: "rgba(123, 192, 227, 0.26)" },
  { id: 5, left: "48%", size: 24, duration: 21, delay: 9.0, tint: "rgba(247, 197, 216, 0.30)" },
];

export function FloatingBubbles() {
  const prefersReducedMotion = useReducedMotion();
  const [poppedIds, setPoppedIds] = useState<number[]>([]);

  if (prefersReducedMotion) return null;

  function popBubble(id: number) {
    audioController.playBubblePop();
    setPoppedIds((prev) => [...prev, id]);
    window.setTimeout(() => {
      setPoppedIds((prev) => prev.filter((item) => item !== id));
    }, 5500);
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10" aria-hidden="true">
      <AnimatePresence>
        {initialBubbles.map((bubble) => {
          if (poppedIds.includes(bubble.id)) return null;
          return (
            <motion.button
              key={bubble.id}
              type="button"
              tabIndex={-1}
              aria-label="Pop floating bubble"
              onClick={() => popBubble(bubble.id)}
              initial={{ y: "105vh", opacity: 0, scale: 0.85 }}
              animate={{
                y: "-15vh",
                opacity: [0, 0.72, 0.72, 0],
                x: [0, 14, -12, 8, 0],
                scale: 1,
              }}
              exit={{ scale: 1.55, opacity: 0, transition: { duration: 0.16, ease: "easeOut" } }}
              transition={{
                y: { duration: bubble.duration, repeat: Infinity, delay: bubble.delay, ease: "linear" },
                opacity: { duration: bubble.duration, repeat: Infinity, delay: bubble.delay, times: [0, 0.12, 0.88, 1] },
                x: { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
              }}
              style={{
                left: bubble.left,
                width: bubble.size,
                height: bubble.size,
                background: `radial-gradient(circle at 30% 28%, rgba(255,255,255,0.92) 0%, ${bubble.tint} 55%, rgba(255,255,255,0.18) 100%)`,
              }}
              className="pointer-events-auto absolute bottom-0 rounded-full border border-white/75 shadow-sm cursor-pointer hover:scale-110 active:scale-90 transition-transform"
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}
