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

  const totalScenes = 7; // 0: Envelope, 1: Welcome, 2: Dress Code, 3: Venue, 4: Baby Reveal, 5: Milestones, 6: RSVP Hub

  const nextScene = () => {
    setCurrentScene((prev) => Math.min(prev + 1, totalScenes - 1));
  };

  const prevScene = () => {
    setCurrentScene((prev) => Math.max(prev - 1, 1));
  };

  return (
    <main className="relative min-h-screen flex flex-col justify-between overflow-hidden">
      {/* Background Decorative Ambient Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Soft pastel corner gradient blobs */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-rachel-pink/20 blur-3xl" />
        <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-rachel-blue/20 blur-3xl" />
        <div className="absolute -bottom-24 left-1/4 w-96 h-96 rounded-full bg-rachel-yellow/20 blur-3xl" />
      </div>

      {/* Floating Audio Playback & Mute Control */}
      <AudioToggle />

      {/* Center Scene Stage Container */}
      <div className="flex-1 flex items-center justify-center py-8 pb-20 px-3 w-full">
        <AnimatePresence mode="wait">
          {currentScene === 0 && (
            <motion.div
              key="scene-0"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <EnvelopeScene onOpen={() => setCurrentScene(1)} />
            </motion.div>
          )}

          {currentScene === 1 && (
            <motion.div
              key="scene-1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <MsRachelIntroScene onNext={nextScene} />
            </motion.div>
          )}

          {currentScene === 2 && (
            <motion.div
              key="scene-2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <DressCodeScene onNext={nextScene} />
            </motion.div>
          )}

          {currentScene === 3 && (
            <motion.div
              key="scene-3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <VenueScene onNext={nextScene} />
            </motion.div>
          )}

          {currentScene === 4 && (
            <motion.div
              key="scene-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <BabyRevealScene onNext={nextScene} />
            </motion.div>
          )}

          {currentScene === 5 && (
            <motion.div
              key="scene-5"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <MilestonesScene onNext={nextScene} />
            </motion.div>
          )}

          {currentScene === 6 && (
            <motion.div
              key="scene-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.35 }}
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
