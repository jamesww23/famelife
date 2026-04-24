"use client";

import { useEffect, useState } from "react";
import { useGame } from "@/state/game-context";
import { archetypes } from "@/data/archetypes";
import { traits } from "@/data/traits";
import { ArchetypeId, Archetype, CareerLegacy, StatKey, TraitId } from "@/lib/game/types";
import { loadLegacy, loadLegacyAsync } from "@/lib/game/legacy";
import { STAT_EMOJI } from "@/lib/game/constants";
import { Logo } from "./logo";
import { ProfileScreen } from "./profile-screen";
import { playTap, playGameStart, playSwoosh } from "@/lib/sounds";
import { requestTrackingAndInitAds } from "@/lib/native";

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
  const [legacy, setLegacy] = useState<CareerLegacy>(() => loadLegacy());

  // Warm legacy from native storage on mount — populates the in-memory cache
  // so that even if localStorage was purged by iOS, the data is available.
  useEffect(() => {
    let active = true;
    loadLegacyAsync().then((loaded) => {
      if (active) setLegacy(loaded);
    }).catch(() => {
      // Keep the best available cached/local legacy state
    });

    return () => {
      active = false;
    };
  }, []);

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
            {STEPS.slice(1).map((_, i) => {
              // STEPS index 0 is "intro"; onboarding dot i corresponds to step (i+1).
              const dotStep = i + 1;
              const cls =
                dotStep < stepIndex ? "bg-white w-8"
                : dotStep === stepIndex ? "bg-white w-4"
                : "bg-white/30 w-4";
              return (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${cls}`}
                />
              );
            })}
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
                onClick={async () => {
                  playTap();
                  // Triggers the App Tracking Transparency prompt on iOS from
                  // a guaranteed-active user gesture (see src/lib/native/index.ts
                  // comment). Awaits the user's decision, then chains ad SDK
                  // init. Safe no-op on web and on subsequent launches (iOS
                  // caches the ATT decision after first response).
                  await requestTrackingAndInitAds();
                  setStep("gender");
                }}
                className="w-full py-3.5 sm:py-4 rounded-2xl text-base sm:text-lg btn-primary-gradient active:scale-[0.98] transition-all"
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
                    type="button"
                    onClick={() => setAvatar(a)}
                    aria-label={`Choose avatar ${a}`}
                    aria-pressed={avatar === a}
                    className={`text-2xl sm:text-3xl rounded-xl transition-all flex items-center justify-center min-h-[44px] min-w-[44px] aspect-square ${
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
                    className={`game-card p-3 sm:p-4 text-left transition-all relative overflow-hidden ${
                      selectedArchetype === arch.id
                        ? "border-3 border-[#e040fb] scale-[1.02] shadow-[0_0_0_3px_#e040fb]"
                        : "border-3 border-transparent active:scale-[0.97]"
                    }`}
                  >
                    {arch.portraitUrl ? (
                      <div className="mb-2 -mx-3 -mt-3 sm:-mx-4 sm:-mt-4 h-28 sm:h-32 overflow-hidden relative">
                        <img
                          src={arch.portraitUrl}
                          alt=""
                          aria-hidden="true"
                          // Portraits are 512×970 tall with the face in the upper-middle.
                          // Adjust objectPosition Y to frame the face cleanly in the square card.
                          className="w-full h-full object-cover"
                          style={{ objectPosition: "50% 30%" }}
                        />
                        <span className="absolute top-1 left-1 text-lg drop-shadow-md" aria-hidden="true">{arch.emoji}</span>
                      </div>
                    ) : (
                      <div className="text-2xl sm:text-3xl mb-1.5 sm:mb-2">{arch.emoji}</div>
                    )}
                    <div className="font-bold text-xs sm:text-sm text-gray-900">{arch.name}</div>
                    <div className="text-[11px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 leading-snug">{arch.description}</div>
                    <ArchetypeStartingStats arch={arch} />
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
    <div className="flex items-center gap-2.5 py-1">
      <span
        className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-lg"
        style={{
          background: "linear-gradient(135deg, #6b21a8, #8b5cf6)",
          boxShadow: "0 2px 6px rgba(107, 33, 168, 0.3), inset 0 1px 0 rgba(255,255,255,0.12)",
        }}
        aria-hidden="true"
      >
        {emoji}
      </span>
      <span className="text-sm font-semibold text-gray-800">{text}</span>
    </div>
  );
}

/** Summarize an archetype's starting modifiers as a compact pill row so
 *  players can compare archetypes at a glance. Keeps up to 3 most-impactful
 *  stats to avoid crowding the card. */
function ArchetypeStartingStats({ arch }: { arch: Archetype }) {
  const entries = Object.entries(arch.startingModifiers) as Array<[StatKey, number]>;
  // Sort by magnitude so the most-impactful stats are shown first.
  const sorted = entries
    .filter(([, v]) => v !== 0)
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
    .slice(0, 3);
  if (sorted.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 mt-1.5" aria-label="Starting stat modifiers">
      {sorted.map(([key, val]) => {
        const sign = val > 0 ? "+" : "";
        const display = Math.abs(val) >= 100
          ? `${sign}${val}`
          : `${sign}${val}`;
        const positive = val > 0;
        return (
          <span
            key={key}
            className={`inline-flex items-center gap-0.5 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              positive
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-500"
            }`}
          >
            <span aria-hidden="true">{STAT_EMOJI[key]}</span>
            {display}
          </span>
        );
      })}
    </div>
  );
}
