"use client";

import { useState } from "react";
import { useGame } from "@/state/game-context";
import { archetypes } from "@/data/archetypes";
import { ArchetypeId } from "@/lib/game/types";

export function StartScreen() {
  const { startGame } = useGame();
  const [selectedArchetype, setSelectedArchetype] = useState<ArchetypeId | null>(null);

  const handleStart = () => {
    if (!selectedArchetype) return;
    // Always start as "quick" — player gets offered to extend at year 3
    startGame(selectedArchetype, "quick");
  };

  return (
    <div className="min-h-screen min-h-[100dvh] flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8 animate-slide-down">
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-2 drop-shadow-lg">
            FAME LIFE
          </h1>
          <p className="text-white/80 text-base sm:text-lg font-medium px-2">
            From nobody to icon. Every tap shapes your story.
          </p>
        </div>

        <div className="animate-slide-up">
          <p className="text-center text-white font-semibold mb-4 text-sm uppercase tracking-wider">
            Choose Your Path
          </p>
          <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-5 sm:mb-6">
            {archetypes.map((arch) => (
              <button
                key={arch.id}
                onClick={() => setSelectedArchetype(arch.id)}
                className={`game-card p-3 sm:p-4 text-left transition-all ${
                  selectedArchetype === arch.id
                    ? "border-3 border-[#e040fb] scale-[1.02] shadow-[0_0_0_3px_#e040fb]"
                    : "border-3 border-transparent active:scale-[0.97]"
                }`}
              >
                <div className="text-2xl sm:text-3xl mb-1.5 sm:mb-2">{arch.emoji}</div>
                <div className="font-bold text-xs sm:text-sm text-gray-900">{arch.name}</div>
                <div className="text-[11px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 leading-snug">{arch.description}</div>
              </button>
            ))}
          </div>
          <button
            onClick={handleStart}
            disabled={!selectedArchetype}
            className={`w-full py-3.5 sm:py-4 rounded-2xl font-bold text-base sm:text-lg transition-all ${
              selectedArchetype
                ? "bg-white text-[#e040fb] hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                : "bg-white/30 text-white/50 cursor-not-allowed"
            }`}
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
}
