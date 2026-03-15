"use client";

import { useGame } from "@/state/game-context";
import { milestones } from "@/data/milestones";

export function MilestonePopup() {
  const { state, proceedFromMilestone } = useGame();

  if (state.pendingMilestones.length === 0) return null;

  const milestone = milestones.find(m => m.id === state.pendingMilestones[0]);
  if (!milestone) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-fade-in"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
    >
      <div className="game-card p-8 w-full max-w-sm text-center animate-pop-in">
        <div className="text-6xl mb-3">{milestone.emoji}</div>
        <h3 className="text-2xl font-black text-gray-900 mb-1">{milestone.title}</h3>
        <p className="text-gray-500 text-sm mb-6">{milestone.description}</p>

        {/* Confetti dots */}
        <div className="relative h-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: ["#e040fb", "#00e5ff", "#ff6b9d", "#f59e0b", "#10b981", "#a855f7", "#3b82f6", "#ef4444"][i],
                left: `${10 + Math.random() * 80}%`,
                top: `${-40 - Math.random() * 40}px`,
                animation: `confettiFall ${1 + Math.random()}s ease-out ${i * 0.1}s forwards`,
              }}
            />
          ))}
        </div>

        <button
          onClick={proceedFromMilestone}
          className="w-full py-3.5 bg-gradient-to-r from-[#e040fb] to-[#ff6b9d] text-white rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          Nice!
        </button>
      </div>
    </div>
  );
}
