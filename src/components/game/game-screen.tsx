"use client";

import { useGame } from "@/state/game-context";
import { StatBar } from "./stat-bar";
import { ActivityPhase } from "./activity-phase";
import { EventCard } from "./event-card";
import { EventOutcome } from "./event-outcome";
import { BoostModal } from "./boost-modal";
import { MilestonePopup } from "./milestone-popup";
export function GameScreen() {
  const { state, restartGame } = useGame();

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col items-center p-3 sm:p-4 pb-6 sm:pb-8">
      {/* Top stat bar */}
      <div className="w-full max-w-lg mb-4 animate-slide-down">
        <StatBar />
      </div>

      {/* Center content area */}
      <div className="w-full max-w-lg flex-1 flex flex-col justify-center">
        {state.phase === "activity" && <ActivityPhase />}
        {state.phase === "event" && state.currentEvent && <EventCard />}
        {state.phase === "outcome" && <EventOutcome />}
      </div>

      {/* Quit button — small and unobtrusive but readable */}
      <button
        onClick={() => {
          if (window.confirm("Quit this run? Progress will be lost.")) {
            restartGame();
          }
        }}
        className="mt-4 text-white/50 text-sm font-medium hover:text-white/80 transition-colors py-2 px-4"
      >
        Quit Run
      </button>

      {/* Modals */}
      {state.phase === "boost_offer" && <BoostModal />}
      {state.phase === "milestone" && <MilestonePopup />}
    </div>
  );
}
