"use client";

import React from "react";
import { audioController } from "@/lib/audio";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StoryNavigationProps {
  currentScene: number;
  totalScenes: number;
  onPrev: () => void;
  onNext: () => void;
  onSelectScene: (index: number) => void;
}

const sceneTitles = [
  "Envelope",
  "Welcome",
  "Dress Code",
  "Venue Map",
  "Linggit",
  "Favorites",
  "RSVP Hub",
];

export const StoryNavigation: React.FC<StoryNavigationProps> = ({
  currentScene,
  totalScenes,
  onPrev,
  onNext,
  onSelectScene,
}) => {
  if (currentScene === 0) return null; // Envelope handles its own tap-to-open

  const handlePrev = () => {
    audioController.playPop();
    onPrev();
  };

  const handleNext = () => {
    audioController.playPop();
    onNext();
  };

  const handleSelect = (idx: number) => {
    audioController.playPop();
    onSelectScene(idx);
  };

  return (
    <div className="fixed bottom-3 inset-x-0 z-40 flex items-center justify-center px-4 pointer-events-none">
      <div className="flex items-center gap-2 py-2 px-3.5 bg-white/95 backdrop-blur-md rounded-full shadow-xl border border-rachel-pink/30 pointer-events-auto">
        {/* Back Button */}
        <button
          onClick={handlePrev}
          disabled={currentScene <= 1}
          title="Previous Scene"
          className="p-1.5 rounded-full hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-700"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Step Indicator Dots */}
        <div className="flex items-center gap-1.5 px-2">
          {Array.from({ length: totalScenes - 1 }).map((_, index) => {
            const sceneIndex = index + 1; // 1 to 6
            const isActive = currentScene === sceneIndex;
            return (
              <button
                key={sceneIndex}
                onClick={() => handleSelect(sceneIndex)}
                title={sceneTitles[sceneIndex]}
                className={`transition-all duration-300 rounded-full ${
                  isActive
                    ? "w-6 h-2 bg-gradient-to-r from-rachel-pink to-rachel-blue"
                    : "w-2 h-2 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            );
          })}
        </div>

        {/* Scene Name Label */}
        <span className="text-[11px] font-black text-slate-700 min-w-[65px] text-center">
          {sceneTitles[currentScene]}
        </span>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={currentScene >= totalScenes - 1}
          title="Next Scene"
          className="p-1.5 rounded-full hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-700"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
