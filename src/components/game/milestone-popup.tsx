"use client";

import { useEffect } from "react";
import { useGame } from "@/state/game-context";
import { milestones } from "@/data/milestones";
import { playMilestone, playTap } from "@/lib/sounds";

const CONFETTI_COLORS = ["#e040fb", "#00e5ff", "#ff6b9d", "#f59e0b", "#10b981", "#a855f7", "#3b82f6", "#ef4444", "#ffd700", "#ff4081"];

export function MilestonePopup() {
  const { state, proceedFromMilestone } = useGame();

  useEffect(() => {
    if (state.pendingMilestones.length > 0) {
      playMilestone();
    }
  }, [state.pendingMilestones]);

  if (state.pendingMilestones.length === 0) return null;

  const milestone = milestones.find(m => m.id === state.pendingMilestones[0]);
  if (!milestone) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-fade-in"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
    >
      <div className="game-card p-6 sm:p-8 w-full max-w-[calc(100%-2rem)] sm:max-w-sm text-center animate-pop-in">
        <div className="text-5xl sm:text-6xl mb-3 animate-sparkle">{milestone.emoji}</div>
        <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-1">{milestone.title}</h3>
        <p className="text-gray-500 text-sm mb-5 sm:mb-6">{milestone.description}</p>

        {/* Enhanced confetti */}
        <div className="relative h-0">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className="milestone-particle"
              style={{
                backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                width: `${3 + Math.random() * 5}px`,
                height: `${3 + Math.random() * 5}px`,
                left: `${5 + Math.random() * 90}%`,
                top: `${-50 - Math.random() * 50}px`,
                "--duration": `${1 + Math.random() * 1.5}s`,
                "--delay": `${i * 0.08}s`,
                boxShadow: `0 0 4px ${CONFETTI_COLORS[i % CONFETTI_COLORS.length]}`,
              } as React.CSSProperties}
            />
          ))}
        </div>

        <button
          onClick={() => { playTap(); proceedFromMilestone(); }}
          className="w-full py-3.5 bg-gradient-to-r from-[#e040fb] to-[#ff6b9d] text-white rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
          style={{ boxShadow: "0 4px 20px rgba(224, 64, 251, 0.4)" }}
        >
          Nice!
        </button>
      </div>
    </div>
  );
}
