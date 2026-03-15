"use client";

import { useGame } from "@/state/game-context";
import { StatBar } from "./stat-bar";
import { EventCard } from "./event-card";
import { EventOutcome } from "./event-outcome";
import { BoostModal } from "./boost-modal";
import { MilestonePopup } from "./milestone-popup";
import { ExtendOffer } from "./extend-offer";

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
        {state.phase === "event" && state.currentEvent && <EventCard />}
        {state.phase === "outcome" && <EventOutcome />}
        {state.phase === "extend_offer" && <ExtendOffer />}
      </div>

      {/* Quit button */}
      <button
        onClick={restartGame}
        className="mt-4 text-white/40 text-xs font-medium hover:text-white/70 transition-colors"
      >
        Quit Run
      </button>

      {/* Modals */}
      {state.phase === "boost_offer" && <BoostModal />}
      {state.phase === "milestone" && <MilestonePopup />}
    </div>
  );
}
