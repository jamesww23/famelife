"use client";

import { useState } from "react";
import { useGame } from "@/state/game-context";
import { archetypes } from "@/data/archetypes";
import { traits } from "@/data/traits";
import { ArchetypeId, TraitId } from "@/lib/game/types";

type Step = "intro" | "name" | "avatar" | "trait" | "archetype" | "goal";

const AVATARS = [
  "😎", "🤩", "😏", "🥰", "😤", "🤓",
  "👩‍🎤", "👨‍🎤", "👩‍💻", "👨‍💻", "🧑‍🎨", "🧑‍🚀",
  "👸", "🤴", "🧛", "🧜‍♀️", "🦸‍♂️", "🦹‍♀️",
];

const STEPS: Step[] = ["intro", "name", "avatar", "trait", "archetype", "goal"];

export function StartScreen() {
  const { startGame } = useGame();
  const [step, setStep] = useState<Step>("intro");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [traitId, setTraitId] = useState<TraitId | null>(null);
  const [selectedArchetype, setSelectedArchetype] = useState<ArchetypeId | null>(null);

  const handleStart = () => {
    if (!selectedArchetype || !avatar || !traitId || !name.trim()) return;
    startGame(selectedArchetype, "full", {
      name: name.trim(),
      avatar,
      traitId,
    });
  };

  const stepIndex = STEPS.indexOf(step);

  return (
    <div className="min-h-screen min-h-[100dvh] flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-lg">
        {/* Logo — only on intro */}
        {step === "intro" && (
          <div className="text-center mb-5 sm:mb-6 animate-slide-down">
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-2 drop-shadow-lg">
              FAME LIFE
            </h1>
          </div>
        )}

        {/* Progress dots — hidden on intro */}
        {step !== "intro" && (
          <div className="flex justify-center gap-2 mb-5">
            {STEPS.slice(1).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i < stepIndex ? "bg-white w-8" : "bg-white/30 w-4"
                }`}
              />
            ))}
          </div>
        )}

        <div className="animate-slide-up" key={step}>

          {/* Intro — Story + Tutorial */}
          {step === "intro" && (
            <>
              <div className="game-card p-5 sm:p-7 mb-4">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">📱</div>
                  <p className="text-gray-900 font-bold text-base sm:text-lg leading-snug">
                    You just posted your first video. It got 12 views — 8 were from your mom.
                  </p>
                  <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                    But you have a dream: go from nobody to global icon in 10 years.
                    Every quarter, life throws something at you — drama, brand deals, viral moments, scandals.
                    Your choices shape everything.
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-4 mt-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 text-center">How It Works</p>
                  <div className="space-y-3">
                    <TutorialRow emoji="🎯" title="Make Choices" text="Each turn, you face an event with 2 options. Pick wisely — every choice has consequences." />
                    <TutorialRow emoji="📊" title="Watch Your Stats" text="Track 6 stats: Followers, Money, Fame, Reputation, Energy, and Mental Health." />
                    <TutorialRow emoji="💀" title="Don&apos;t Hit Zero" text="If your mental health, energy, or reputation bottoms out — game over." />
                    <TutorialRow emoji="👑" title="Chase Glory" text="Unlock milestones, go viral, land brand deals, and aim for the highest Fame Score." />
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep("name")}
                className="w-full py-3.5 sm:py-4 rounded-2xl font-bold text-base sm:text-lg bg-white text-[#e040fb] hover:scale-[1.02] active:scale-[0.98] shadow-lg transition-all"
              >
                Create Your Character
              </button>
            </>
          )}

          {/* Step 1: Name */}
          {step === "name" && (
            <>
              <p className="text-center text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                What&apos;s Your Name?
              </p>
              <div className="game-card p-4 sm:p-6 mb-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && name.trim()) setStep("avatar");
                  }}
                  placeholder="Enter your name..."
                  maxLength={20}
                  autoFocus
                  className="w-full text-center text-xl sm:text-2xl font-bold text-gray-900 bg-transparent outline-none placeholder-gray-300 py-2"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setStep("intro")}
                  className="py-3.5 px-6 rounded-2xl font-bold text-sm text-white/70 hover:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => name.trim() && setStep("avatar")}
                  disabled={!name.trim()}
                  className={`flex-1 py-3.5 sm:py-4 rounded-2xl font-bold text-base sm:text-lg transition-all ${
                    name.trim()
                      ? "bg-white text-[#e040fb] hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                      : "bg-white/30 text-white/50 cursor-not-allowed"
                  }`}
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* Step 2: Avatar */}
          {step === "avatar" && (
            <>
              <p className="text-center text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                Choose Your Look
              </p>
              <div className="grid grid-cols-6 gap-2 sm:gap-3 mb-5">
                {AVATARS.map((a) => (
                  <button
                    key={a}
                    onClick={() => setAvatar(a)}
                    className={`text-2xl sm:text-3xl p-2 sm:p-3 rounded-xl transition-all ${
                      avatar === a
                        ? "bg-white shadow-[0_0_0_3px_#e040fb] scale-110"
                        : "bg-white/20 active:scale-[0.95]"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setStep("name")}
                  className="py-3.5 px-6 rounded-2xl font-bold text-sm text-white/70 hover:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => avatar && setStep("trait")}
                  disabled={!avatar}
                  className={`flex-1 py-3.5 sm:py-4 rounded-2xl font-bold text-base sm:text-lg transition-all ${
                    avatar
                      ? "bg-white text-[#e040fb] hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                      : "bg-white/30 text-white/50 cursor-not-allowed"
                  }`}
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* Step 3: Background Trait */}
          {step === "trait" && (
            <>
              <p className="text-center text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                Your Background
              </p>
              <div className="space-y-2 sm:space-y-2.5 mb-5">
                {traits.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTraitId(t.id)}
                    className={`game-card w-full p-3 sm:p-4 text-left transition-all flex items-center gap-3 ${
                      traitId === t.id
                        ? "border-3 border-[#e040fb] shadow-[0_0_0_3px_#e040fb]"
                        : "border-3 border-transparent active:scale-[0.98]"
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl shrink-0">{t.emoji}</span>
                    <div>
                      <div className="font-bold text-sm text-gray-900">{t.name}</div>
                      <div className="text-[11px] sm:text-xs text-gray-500 leading-snug">{t.description}</div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setStep("avatar")}
                  className="py-3.5 px-6 rounded-2xl font-bold text-sm text-white/70 hover:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => traitId && setStep("archetype")}
                  disabled={!traitId}
                  className={`flex-1 py-3.5 sm:py-4 rounded-2xl font-bold text-base sm:text-lg transition-all ${
                    traitId
                      ? "bg-white text-[#e040fb] hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                      : "bg-white/30 text-white/50 cursor-not-allowed"
                  }`}
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* Step 4: Archetype / Profession */}
          {step === "archetype" && (
            <>
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
              <div className="flex gap-2">
                <button
                  onClick={() => setStep("trait")}
                  className="py-3.5 px-6 rounded-2xl font-bold text-sm text-white/70 hover:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => selectedArchetype && setStep("goal")}
                  disabled={!selectedArchetype}
                  className={`flex-1 py-3.5 sm:py-4 rounded-2xl font-bold text-base sm:text-lg transition-all ${
                    selectedArchetype
                      ? "bg-white text-[#e040fb] hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                      : "bg-white/30 text-white/50 cursor-not-allowed"
                  }`}
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* Step 5: Goal Briefing */}
          {step === "goal" && (
            <>
              <div className="game-card p-5 sm:p-7 mb-4 text-center">
                <div className="text-5xl mb-3">{avatar}</div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-1">{name}</h2>
                <p className="text-gray-400 text-sm mb-4">
                  {archetypes.find(a => a.id === selectedArchetype)?.emoji}{" "}
                  {archetypes.find(a => a.id === selectedArchetype)?.name}{" · "}
                  {traits.find(t => t.id === traitId)?.emoji}{" "}
                  {traits.find(t => t.id === traitId)?.name}
                </p>

                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs font-bold text-[#e040fb] uppercase tracking-wider mb-3">Your Mission</p>
                  <div className="space-y-2 text-left">
                    <GoalRow emoji="🌍" text="Reach Global Icon status (5M+ followers)" />
                    <GoalRow emoji="💰" text="Build your fortune — don&apos;t go bankrupt" />
                    <GoalRow emoji="🧠" text="Protect your mental health at all costs" />
                    <GoalRow emoji="⭐" text="Maximize your Fame Score (out of 1,000)" />
                    <GoalRow emoji="🏆" text="Survive all 10 years without burning out" />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep("archetype")}
                  className="py-3.5 px-6 rounded-2xl font-bold text-sm text-white/70 hover:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleStart}
                  className="flex-1 py-3.5 sm:py-4 rounded-2xl font-bold text-base sm:text-lg bg-white text-[#e040fb] hover:scale-[1.02] active:scale-[0.98] shadow-lg transition-all"
                >
                  Begin Your Journey
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function TutorialRow({ emoji, title, text }: { emoji: string; title: string; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-xl shrink-0">{emoji}</span>
      <div>
        <div className="font-bold text-sm text-gray-900">{title}</div>
        <div className="text-xs text-gray-500 leading-snug">{text}</div>
      </div>
    </div>
  );
}

function GoalRow({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div className="flex items-center gap-2.5 py-1">
      <span className="text-lg shrink-0">{emoji}</span>
      <span className="text-sm font-semibold text-gray-700">{text}</span>
    </div>
  );
}
