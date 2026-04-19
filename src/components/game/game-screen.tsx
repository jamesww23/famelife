"use client";

import { useState } from "react";
import { useGame } from "@/state/game-context";
import { StatBar } from "./stat-bar";
import { ActivityPhase } from "./activity-phase";
import { EventCard } from "./event-card";
import { EventOutcome } from "./event-outcome";
import { BoostModal } from "./boost-modal";
import { MilestonePopup } from "./milestone-popup";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { playTap } from "@/lib/sounds";

export function GameScreen() {
  const { state, restartGame } = useGame();
  const [confirmingQuit, setConfirmingQuit] = useState(false);

  return (
    <div
      className="min-h-screen min-h-[100dvh] flex flex-col items-center p-3 sm:p-4"
      style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
    >
      {/* Top stat bar */}
      <div className="w-full max-w-lg mb-4 animate-slide-down">
        <StatBar />
      </div>

      {/* Content area — anchored under the stat bar, not vertically centered */}
      <div className="w-full max-w-lg flex flex-col">
        {state.phase === "activity" && <ActivityPhase />}
        {state.phase === "event" && state.currentEvent && <EventCard />}
        {state.phase === "outcome" && <EventOutcome />}
      </div>

      {/* Quit button — pushed to bottom, clears home indicator via safe-area pb above */}
      <button
        onClick={() => { playTap(); setConfirmingQuit(true); }}
        className="mt-auto pt-6 text-white/50 text-sm font-medium hover:text-white/80 transition-colors py-2 px-4 min-h-[44px]"
      >
        Quit Run
      </button>

      {/* Modals */}
      {state.phase === "boost_offer" && <BoostModal />}
      {state.phase === "milestone" && <MilestonePopup />}
      {confirmingQuit && (
        <QuitConfirm
          onConfirm={() => {
            setConfirmingQuit(false);
            restartGame();
          }}
          onCancel={() => setConfirmingQuit(false)}
        />
      )}
    </div>
  );
}

function QuitConfirm({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  const ref = useFocusTrap<HTMLDivElement>(true);
  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="quit-confirm-title"
      ref={ref}
      onKeyDown={(e) => {
        if (e.key === "Escape") onCancel();
      }}
      className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-fade-in"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
    >
      <div className="game-card p-5 sm:p-6 w-full max-w-[calc(100%-2rem)] sm:max-w-sm animate-scale-in text-center">
        <div className="text-4xl mb-3">⚠️</div>
        <h3 id="quit-confirm-title" className="text-lg sm:text-xl font-black text-gray-900 mb-2">
          Quit this run?
        </h3>
        <p className="text-gray-600 text-sm mb-5">
          Your progress in this run will be lost. Career Legacy and unlocked badges are kept.
        </p>
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => { playTap(); onConfirm(); }}
            className="w-full py-3.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-bold text-base active:scale-[0.98] transition-all shadow-lg min-h-[48px]"
          >
            Quit Run
          </button>
          <button
            type="button"
            onClick={() => { playTap(); onCancel(); }}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-base active:scale-[0.98] transition-colors min-h-[48px]"
          >
            Keep Playing
          </button>
        </div>
      </div>
    </div>
  );
}
