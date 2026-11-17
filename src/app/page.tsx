"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EnvelopeScene } from "@/components/scenes/EnvelopeScene";
import { PlayroomHeader } from "@/components/playroom/PlayroomHeader";
import { PlayroomStage } from "@/components/playroom/PlayroomStage";
import { FloatingBubbles } from "@/components/playroom/FloatingBubbles";

export default function Home() {
  const [hasOpenedEnvelope, setHasOpenedEnvelope] = useState(false);

  return (
    <main className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-stationery">
      {/* Interactive Soap Bubbles that guests can tap to pop anywhere on screen! */}
      <FloatingBubbles />

      {/* Playroom Bunting Banner & Top Sound Bar */}
      <PlayroomHeader />

      {/* Main Experience Container */}
      <div className="flex-1 flex items-center justify-center py-4 px-2 sm:px-4 w-full relative z-10">
        <AnimatePresence mode="wait">
          {!hasOpenedEnvelope ? (
            /* STEP 0: Tactile 3D Envelope Unsealing Hero */
            <motion.div
              key="envelope"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className="w-full flex items-center justify-center"
            >
              <EnvelopeScene onOpen={() => setHasOpenedEnvelope(true)} />
            </motion.div>
          ) : (
            /* THE INTERACTIVE POP-UP PLAYROOM */
            <motion.div
              key="playroom"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full"
            >
              <PlayroomStage onRestart={() => setHasOpenedEnvelope(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Subtle Bottom Aesthetic Bar */}
      <footer className="w-full py-3 text-center text-[10px] text-stone-400 font-medium select-none relative z-10">
        Tip: Tap any floating soap bubble to pop it! &bull; Ms. Rachel Songs for Littles Theme
      </footer>
    </main>
  );
}
