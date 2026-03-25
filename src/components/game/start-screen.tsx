"use client";

import { useState } from "react";
import { useGame } from "@/state/game-context";
import { archetypes } from "@/data/archetypes";
import { traits } from "@/data/traits";
import { ArchetypeId, TraitId } from "@/lib/game/types";
import { loadLegacy } from "@/lib/game/legacy";
import { Logo } from "./logo";
import { ProfileScreen } from "./profile-screen";
import { playTap, playGameStart, playSwoosh } from "@/lib/sounds";

type Step = "intro" | "gender" | "avatar" | "trait" | "archetype" | "goal" | "profile";
type Gender = "male" | "female" | "random";

const MALE_NAMES = ["Jake", "Marcus", "Tyler", "Ethan", "Kai", "Liam", "Noah", "Jayden", "Adrian", "Caleb", "Dex", "Remi", "Leo", "Zane", "Miles"];
const FEMALE_NAMES = ["Mia", "Zara", "Luna", "Aria", "Chloe", "Jade", "Nia", "Ivy", "Kira", "Sasha", "Raven", "Skye", "Nova", "Blair", "Elle"];

const MALE_AVATARS = ["😎", "🤩", "😏", "😤", "🤓", "👨‍🎤", "👨‍💻", "🤴", "🦸‍♂️", "🧑‍🚀", "🧑‍🎨", "🧛"];
const FEMALE_AVATARS = ["🥰", "🤩", "😏", "😎", "🤓", "👩‍🎤", "👩‍💻", "👸", "🦹‍♀️", "🧜‍♀️", "🧑‍🎨", "🧑‍🚀"];
const ALL_AVATARS = ["😎", "🤩", "😏", "🥰", "😤", "🤓", "👩‍🎤", "👨‍🎤", "👩‍💻", "👨‍💻", "🧑‍🎨", "🧑‍🚀", "👸", "🤴", "🧛", "🧜‍♀️", "🦸‍♂️", "🦹‍♀️"];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const STEPS: Step[] = ["intro", "gender", "avatar", "trait", "archetype", "goal"];

export function StartScreen() {
  const { startGame } = useGame();
  const [step, setStep] = useState<Step>("intro");
  const [gender, setGender] = useState<Gender | null>(null);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [traitId, setTraitId] = useState<TraitId | null>(null);
  const [selectedArchetype, setSelectedArchetype] = useState<ArchetypeId | null>(null);
  const handleGender = (g: Gender) => {
    playTap();
    setGender(g);
    if (g === "male") {
      setName(pickRandom(MALE_NAMES));
    } else if (g === "female") {
      setName(pickRandom(FEMALE_NAMES));
    } else {
      // Surprise me — random from both
      setName(pickRandom([...MALE_NAMES, ...FEMALE_NAMES]));
    }
    setAvatar(null); // reset avatar when gender changes
    setStep("avatar");
  };

  const avatarList = gender === "male" ? MALE_AVATARS : gender === "female" ? FEMALE_AVATARS : ALL_AVATARS;

  const handleStart = () => {
    if (!selectedArchetype || !avatar || !traitId || !name.trim()) return;
    playGameStart();
    startGame(selectedArchetype, {
      name: name.trim(),
      avatar,
      traitId,
    });
  };

  const stepIndex = STEPS.indexOf(step);

  // Profile screen
  if (step === "profile") {
    const legacy = loadLegacy();
    return <ProfileScreen legacy={legacy} onClose={() => setStep("intro")} />;
  }

  return (
    <div className="min-h-screen min-h-[100dvh] flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-lg">
        {/* Logo — only on intro */}
        {step === "intro" && (
          <div className="mb-3 sm:mb-4 animate-slide-down">
            <Logo />
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

          {/* Intro — Story + Mission */}
          {step === "intro" && (
            <>
              <div className="game-card p-5 sm:p-7 mb-4">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">📱</div>
                  <p className="text-gray-900 font-bold text-base sm:text-lg leading-snug">
                    You just posted your first video.<br />
                    12 views. 8 from your mom.
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    But something inside you says this is just the beginning.
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-4 mt-2">
                  <div className="space-y-2.5 text-left">
                    <StoryStep emoji="🔥" text="Go viral. Get noticed." />
                    <StoryStep emoji="💰" text="Land brand deals. Stack millions." />
                    <StoryStep emoji="👑" text="Build an empire. Become a legend." />
                    <StoryStep emoji="💀" text="But one wrong move and it all falls apart." />
                  </div>
                </div>

                <p className="text-center text-gray-400 text-xs mt-4">
                  10 years. 40 choices. Your story.
                </p>
              </div>

              <button
                onClick={() => { playTap(); setStep("gender"); }}
                className="w-full py-3.5 sm:py-4 rounded-2xl font-bold text-base sm:text-lg bg-white text-[#e040fb] hover:scale-[1.02] active:scale-[0.98] shadow-lg btn-glow transition-all"
              >
                Start Your Fame Story
              </button>
              <button
                onClick={() => { playTap(); setStep("profile"); }}
                className="w-full py-3 mt-2.5 rounded-2xl font-bold text-sm text-white/70 hover:text-white transition-colors"
              >
                🏆 Career Legacy
              </button>
            </>
          )}

          {/* Step 1: Gender */}
          {step === "gender" && (
            <>
              <p className="text-center text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                Who Are You?
              </p>
              <div className="space-y-2.5 sm:space-y-3 mb-5">
                <button
                  onClick={() => handleGender("male")}
                  className="game-card w-full p-4 sm:p-5 text-center transition-all active:scale-[0.98] border-3 border-transparent hover:border-[#e040fb]"
                >
                  <div className="text-4xl mb-1.5">👦</div>
                  <div className="font-bold text-base text-gray-900">Male</div>
                </button>
                <button
                  onClick={() => handleGender("female")}
                  className="game-card w-full p-4 sm:p-5 text-center transition-all active:scale-[0.98] border-3 border-transparent hover:border-[#e040fb]"
                >
                  <div className="text-4xl mb-1.5">👧</div>
                  <div className="font-bold text-base text-gray-900">Female</div>
                </button>
                <button
                  onClick={() => handleGender("random")}
                  className="game-card w-full p-4 sm:p-5 text-center transition-all active:scale-[0.98] border-3 border-transparent hover:border-[#e040fb]"
                >
                  <div className="text-4xl mb-1.5">🎲</div>
                  <div className="font-bold text-base text-gray-900">Surprise Me</div>
                </button>
              </div>
              <button
                onClick={() => setStep("intro")}
                className="w-full py-3 rounded-2xl font-bold text-sm text-white/70 hover:text-white transition-colors"
              >
                Back
              </button>
            </>
          )}

          {/* Step 2: Avatar */}
          {step === "avatar" && (
            <>
              <p className="text-center text-white font-semibold mb-1 text-sm uppercase tracking-wider">
                Choose Your Look
              </p>
              <p className="text-center text-white/60 text-sm mb-4">
                Playing as <span className="font-bold text-white">{name}</span>
              </p>
              <div className="grid grid-cols-6 gap-2 sm:gap-3 mb-5">
                {avatarList.map((a) => (
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
                  onClick={() => setStep("gender")}
                  className="py-3.5 px-6 rounded-2xl font-bold text-sm text-white/70 hover:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => { if (avatar) { playSwoosh(); setStep("trait"); } }}
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
                  onClick={() => { if (traitId) { playSwoosh(); setStep("archetype"); } }}
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
                  onClick={() => { if (selectedArchetype) { playSwoosh(); setStep("goal"); } }}
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

          {/* Step 5: Ready */}
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

                <div className="border-t border-gray-100 pt-3">
                  <p className="text-sm text-gray-500 leading-relaxed">
                    The algorithm doesn&apos;t care who you are yet.
                    <br />
                    <span className="font-bold text-gray-900">Time to change that.</span>
                  </p>
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

function StoryStep({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div className="flex items-center gap-2.5 py-0.5">
      <span className="text-lg shrink-0">{emoji}</span>
      <span className="text-sm font-semibold text-gray-700">{text}</span>
    </div>
  );
}

