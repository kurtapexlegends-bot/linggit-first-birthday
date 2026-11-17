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
  "Attire",
  "Location",
  "Linggit",
  "Milestones",
  "RSVP",
];

export const StoryNavigation: React.FC<StoryNavigationProps> = ({
  currentScene,
  totalScenes,
  onPrev,
  onNext,
  onSelectScene,
}) => {
  if (currentScene === 0) return null;

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
      <div className="flex items-center gap-2 py-2 px-3.5 bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-[#E5C98D]/60 pointer-events-auto">
        <button
          onClick={handlePrev}
          disabled={currentScene <= 1}
          title="Previous Page"
          className="p-1 rounded-full hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-stone-700"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5 px-2">
          {Array.from({ length: totalScenes - 1 }).map((_, index) => {
            const sceneIndex = index + 1;
            const isActive = currentScene === sceneIndex;
            return (
              <button
                key={sceneIndex}
                onClick={() => handleSelect(sceneIndex)}
                title={sceneTitles[sceneIndex]}
                className={`transition-all duration-300 rounded-full ${
                  isActive
                    ? "w-5 h-1.5 bg-[#996515]"
                    : "w-1.5 h-1.5 bg-stone-200 hover:bg-stone-300"
                }`}
              />
            );
          })}
        </div>

        <span className="font-serif-luxury text-[11px] font-bold text-stone-700 min-w-[60px] text-center">
          {sceneTitles[currentScene]}
        </span>

        <button
          onClick={handleNext}
          disabled={currentScene >= totalScenes - 1}
          title="Next Page"
          className="p-1 rounded-full hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-stone-700"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
