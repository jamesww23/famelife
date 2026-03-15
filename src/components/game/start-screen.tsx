"use client";

import { useState } from "react";
import { useGame } from "@/state/game-context";
import { archetypes } from "@/data/archetypes";
import { ArchetypeId, GameMode } from "@/lib/game/types";

export function StartScreen() {
  const { startGame } = useGame();
  const [selectedArchetype, setSelectedArchetype] = useState<ArchetypeId | null>(null);
  const [step, setStep] = useState<"archetype" | "mode">("archetype");

  const handleStart = (mode: GameMode) => {
    if (!selectedArchetype) return;
    startGame(selectedArchetype, mode);
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

        {step === "archetype" ? (
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
              onClick={() => selectedArchetype && setStep("mode")}
              disabled={!selectedArchetype}
              className={`w-full py-3.5 sm:py-4 rounded-2xl font-bold text-base sm:text-lg transition-all ${
                selectedArchetype
                  ? "bg-white text-[#e040fb] hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                  : "bg-white/30 text-white/50 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          </div>
        ) : (
          <div className="animate-scale-in">
            <p className="text-center text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Choose Game Length
            </p>
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleStart("quick")}
                className="game-card w-full p-4 sm:p-5 text-left active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl sm:text-3xl">⚡</span>
                  <div>
                    <div className="font-bold text-gray-900">Quick Fame</div>
                    <div className="text-sm text-gray-500">3 years / ~5 min. Fast rise, fast fall.</div>
                  </div>
                </div>
              </button>
              <button
                onClick={() => handleStart("full")}
                className="game-card w-full p-4 sm:p-5 text-left active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl sm:text-3xl">👑</span>
                  <div>
                    <div className="font-bold text-gray-900">Full Career</div>
                    <div className="text-sm text-gray-500">10 years / ~15 min. The whole story.</div>
                  </div>
                </div>
              </button>
            </div>
            <button
              onClick={() => setStep("archetype")}
              className="w-full py-3 text-white/70 font-medium hover:text-white transition-colors"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
