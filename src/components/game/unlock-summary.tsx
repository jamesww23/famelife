"use client";

import { badges, RARITY_COLORS, RARITY_LABELS } from "@/data/badges";
import { NextGoal } from "@/lib/game/legacy";
import { playMilestone } from "@/lib/sounds";
import { useEffect } from "react";

export function UnlockSummary({
  newBadges,
  newTitles,
  nextGoals,
  onContinue,
}: {
  newBadges: string[];
  newTitles: string[];
  nextGoals: NextGoal[];
  onContinue: () => void;
}) {
  const hasUnlocks = newBadges.length > 0 || newTitles.length > 0;

  useEffect(() => {
    if (hasUnlocks) playMilestone();
  }, [hasUnlocks]);

  return (
    <div className="animate-slide-up">
      {/* New badges */}
      {newBadges.length > 0 && (
        <div className="game-card p-4 sm:p-5 mb-3">
          <div className="text-center mb-3">
            <div className="text-xs font-bold text-[#e040fb] uppercase tracking-wider">New Badges Unlocked</div>
          </div>
          <div className="space-y-2">
            {newBadges.map((id) => {
              const badge = badges.find(b => b.id === id);
              if (!badge) return null;
              return (
                <div key={id} className="flex items-center gap-3 p-2.5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl animate-scale-in">
                  <span className="text-2xl">{badge.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-gray-900">{badge.name}</span>
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{
                          color: RARITY_COLORS[badge.rarity],
                          backgroundColor: RARITY_COLORS[badge.rarity] + "18",
                        }}
                      >
                        {RARITY_LABELS[badge.rarity]}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-500">{badge.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* New titles */}
      {newTitles.length > 0 && (
        <div className="game-card p-4 sm:p-5 mb-3">
          <div className="text-center mb-3">
            <div className="text-xs font-bold text-[#e040fb] uppercase tracking-wider">New Title Unlocked</div>
          </div>
          {newTitles.map((title) => (
            <div key={title} className="text-center animate-scale-in">
              <div className="text-2xl mb-1">🎖️</div>
              <div className="text-lg font-black text-gray-900">{title}</div>
              <div className="text-[11px] text-gray-400">Added to your Career Legacy</div>
            </div>
          ))}
        </div>
      )}

      {/* No new unlocks message */}
      {!hasUnlocks && (
        <div className="game-card p-4 sm:p-5 mb-3 text-center">
          <div className="text-gray-400 text-sm">No new unlocks this run. Keep pushing!</div>
        </div>
      )}

      {/* Next goals */}
      {nextGoals.length > 0 && (
        <div className="game-card p-4 sm:p-5 mb-3">
          <div className="text-center mb-3">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Next Goals</div>
          </div>
          <div className="space-y-1.5">
            {nextGoals.map((goal, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span>{goal.emoji}</span>
                <span className="text-gray-600">{goal.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onContinue}
        className="w-full py-3.5 bg-white text-[#e040fb] rounded-2xl font-bold text-base active:scale-[0.98] transition-all btn-glow"
      >
        Continue
      </button>
    </div>
  );
}
