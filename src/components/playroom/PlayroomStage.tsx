"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { audioController } from "@/lib/audio";
import { InteractiveSun } from "./InteractiveSun";
import { WardrobeRack } from "./WardrobeRack";
import { BirthdayCakeScene } from "./BirthdayCakeScene";
import { PlayroomSoundboard } from "./PlayroomSoundboard";
import { VenueScene } from "../scenes/VenueScene";
import { RsvpHubScene } from "../scenes/RsvpHubScene";
import { MilestonesScene } from "../scenes/MilestonesScene";
import { MsRachel } from "../illustrations/MsRachel";
import { eventConfig } from "@/config/event-config";
import { Sparkles, ArrowRight, Heart } from "lucide-react";

interface PlayroomStageProps {
  onRestart: () => void;
}

export const PlayroomStage: React.FC<PlayroomStageProps> = ({ onRestart }) => {
  const [activeTab, setActiveTab] = useState<
    "welcome" | "wardrobe" | "cake" | "venue" | "milestones" | "rsvp"
  >("welcome");

  const tabs = [
    { id: "welcome", label: "Playroom", icon: "☀️" },
    { id: "cake", label: "Birthday Cake", icon: "🎂" },
    { id: "wardrobe", label: "Dress Code", icon: "👗" },
    { id: "venue", label: "Venue Map", icon: "📍" },
    { id: "milestones", label: "Milestones", icon: "⭐" },
    { id: "rsvp", label: "RSVP", icon: "💌" },
  ] as const;

  const handleTabChange = (id: typeof activeTab) => {
    audioController.playPop();
    setActiveTab(id);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center select-none pb-12">
      {/* Station Selector Bar */}
      <div className="w-full px-2 mb-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-center gap-1.5 p-1.5 bg-white/85 backdrop-blur-md rounded-full border border-[#E5C98D]/60 shadow-xs mx-auto w-max">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-stone-900 text-white shadow-xs scale-102"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/70"
                }`}
              >
                <span>{tab.icon}</span>
                <span className="font-serif-luxury text-[11px] font-bold">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Stage Canvas */}
      <div className="w-full px-3">
        <AnimatePresence mode="wait">
          {/* TAB 1: WELCOME & SENSORY PLAYROOM */}
          {activeTab === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-center"
            >
              {/* Interactive Sunshine Hero */}
              <div className="mb-2">
                <InteractiveSun />
              </div>

              {/* Ms. Rachel Welcome Card */}
              <div className="card-deckle p-5 max-w-md w-full mb-3 text-center relative">
                <div className="flex items-center justify-center gap-1 text-[#996515] mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#C89E4B]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    Ms. Rachel Welcomes You
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-[#C89E4B]" />
                </div>

                <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900 leading-snug">
                  &ldquo;Hi friends! Look who is turning{" "}
                  <span className="text-rose-500 italic">one</span>!&rdquo;
                </h2>

                <p className="mt-2 text-xs sm:text-sm text-stone-600 font-medium leading-relaxed">
                  Welcome to {eventConfig.celebrant.nickname}&apos;s very first birthday celebration! Explore our interactive playroom to see what to wear, blow out the birthday candle, and view the venue map!
                </p>

                {/* Ms. Rachel Cameo Medallion */}
                <div className="my-3 flex justify-center">
                  <MsRachel className="w-36 h-36" />
                </div>
              </div>

              {/* Sensory Soundboard */}
              <PlayroomSoundboard />

              {/* Action: Jump to Birthday Cake */}
              <button
                onClick={() => handleTabChange("cake")}
                className="mt-3 flex items-center justify-center gap-2 py-3 px-6 bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs rounded-full shadow-md transition-all hover:scale-102 active:scale-98"
              >
                <span>Blow Linggit&apos;s Birthday Candle</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
              </button>
            </motion.div>
          )}

          {/* TAB 2: BIRTHDAY CAKE & GRAND REVEAL */}
          {activeTab === "cake" && (
            <motion.div
              key="cake"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center"
            >
              <BirthdayCakeScene />

              <button
                onClick={() => handleTabChange("wardrobe")}
                className="mt-4 flex items-center justify-center gap-2 py-3 px-6 bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs rounded-full shadow-md transition-all hover:scale-102 active:scale-98"
              >
                <span>Check Guest Dress Code</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
              </button>
            </motion.div>
          )}

          {/* TAB 3: WARDROBE RACK (DRESS CODE) */}
          {activeTab === "wardrobe" && (
            <motion.div
              key="wardrobe"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center"
            >
              <WardrobeRack />

              <button
                onClick={() => handleTabChange("venue")}
                className="mt-4 flex items-center justify-center gap-2 py-3 px-6 bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs rounded-full shadow-md transition-all hover:scale-102 active:scale-98"
              >
                <span>View Venue &amp; Map Pin</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
              </button>
            </motion.div>
          )}

          {/* TAB 4: VENUE MAP */}
          {activeTab === "venue" && (
            <motion.div
              key="venue"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center"
            >
              <VenueScene onNext={() => handleTabChange("milestones")} />
            </motion.div>
          )}

          {/* TAB 5: MILESTONES & POTTY TINAY */}
          {activeTab === "milestones" && (
            <motion.div
              key="milestones"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center"
            >
              <MilestonesScene onNext={() => handleTabChange("rsvp")} />
            </motion.div>
          )}

          {/* TAB 6: RSVP & PROGRAM HUB */}
          {activeTab === "rsvp" && (
            <motion.div
              key="rsvp"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center"
            >
              <RsvpHubScene onRestart={onRestart} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
