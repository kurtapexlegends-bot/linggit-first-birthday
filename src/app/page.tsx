"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EnvelopeScene } from "@/components/scenes/EnvelopeScene";
import { MsRachelIntroScene } from "@/components/scenes/MsRachelIntroScene";
import { DressCodeScene } from "@/components/scenes/DressCodeScene";
import { VenueScene } from "@/components/scenes/VenueScene";
import { BabyRevealScene } from "@/components/scenes/BabyRevealScene";
import { MilestonesScene } from "@/components/scenes/MilestonesScene";
import { RsvpHubScene } from "@/components/scenes/RsvpHubScene";
import { AudioToggle } from "@/components/ui/AudioToggle";
import { StoryNavigation } from "@/components/ui/StoryNavigation";

export default function Home() {
  const [currentScene, setCurrentScene] = useState(0);

  const totalScenes = 7;

  const nextScene = () => {
    setCurrentScene((prev) => Math.min(prev + 1, totalScenes - 1));
  };

  const prevScene = () => {
    setCurrentScene((prev) => Math.max(prev - 1, 1));
  };

  return (
    <main className="relative min-h-screen flex flex-col justify-between overflow-hidden">
      {/* Delicate Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-rose-100/30 blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-sky-100/30 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 w-96 h-96 rounded-full bg-amber-100/25 blur-3xl" />
      </div>

      {/* Floating Audio Control */}
      <AudioToggle />

      {/* Center Card Stage */}
      <div className="flex-1 flex items-center justify-center py-6 pb-20 px-3 w-full">
        <AnimatePresence mode="wait">
          {currentScene === 0 && (
            <motion.div
              key="scene-0"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <EnvelopeScene onOpen={() => setCurrentScene(1)} />
            </motion.div>
          )}

          {currentScene === 1 && (
            <motion.div
              key="scene-1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <MsRachelIntroScene onNext={nextScene} />
            </motion.div>
          )}

          {currentScene === 2 && (
            <motion.div
              key="scene-2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <DressCodeScene onNext={nextScene} />
            </motion.div>
          )}

          {currentScene === 3 && (
            <motion.div
              key="scene-3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <VenueScene onNext={nextScene} />
            </motion.div>
          )}

          {currentScene === 4 && (
            <motion.div
              key="scene-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <BabyRevealScene onNext={nextScene} />
            </motion.div>
          )}

          {currentScene === 5 && (
            <motion.div
              key="scene-5"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <MilestonesScene onNext={nextScene} />
            </motion.div>
          )}

          {currentScene === 6 && (
            <motion.div
              key="scene-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <RsvpHubScene onRestart={() => setCurrentScene(0)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Bottom Navigation Stepper */}
      <StoryNavigation
        currentScene={currentScene}
        totalScenes={totalScenes}
        onPrev={prevScene}
        onNext={nextScene}
        onSelectScene={(idx) => setCurrentScene(idx)}
      />
    </main>
  );
}
