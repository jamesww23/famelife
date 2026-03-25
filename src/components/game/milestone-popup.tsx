"use client";

import { useEffect, useMemo } from "react";
import { useGame } from "@/state/game-context";
import { milestones } from "@/data/milestones";
import { badges, RARITY_COLORS, RARITY_LABELS } from "@/data/badges";
import { loadLegacy } from "@/lib/game/legacy";
import { playMilestone, playTap } from "@/lib/sounds";

const CONFETTI_COLORS = ["#e040fb", "#00e5ff", "#ff6b9d", "#f59e0b", "#10b981", "#a855f7", "#3b82f6", "#ef4444", "#ffd700", "#ff4081"];

// Map milestone IDs to badge IDs where they correspond
const MILESTONE_BADGE_MAP: Record<string, string> = {
  first_10k: "first_spark",
  first_100k: "rising_name",
  first_1m: "internet_giant",
  rich: "first_bag",
  millionaire_money: "millionaire",
  first_brand_deal: "brand_ready",
  first_scandal: "first_scandal",
  first_celebrity_event: "red_carpet_rookie",
  empire_builder: "studio_owner",
  managed_talent: "managed",
  viral_king: "hit_machine",
  feud_starter: "feud_starter",
  comeback_kid: "rebrand_season",
};

interface ConfettiParticle {
  width: number;
  height: number;
  left: number;
  top: number;
  duration: number;
}

function generateConfetti(): ConfettiParticle[] {
  return Array.from({ length: 16 }, () => ({
    width: 3 + Math.random() * 5,
    height: 3 + Math.random() * 5,
    left: 5 + Math.random() * 90,
    top: -50 - Math.random() * 50,
    duration: 1 + Math.random() * 1.5,
  }));
}

export function MilestonePopup() {
  const { state, proceedFromMilestone } = useGame();
  const currentMilestoneId = state.pendingMilestones[0] ?? null;

  useEffect(() => {
    if (currentMilestoneId) {
      playMilestone();
    }
  }, [currentMilestoneId]);

  // eslint-disable-next-line react-hooks/exhaustive-deps -- regenerate when milestone changes
  const confetti = useMemo(() => generateConfetti(), [currentMilestoneId]);

  if (!currentMilestoneId) return null;

  const milestone = milestones.find(m => m.id === currentMilestoneId);
  if (!milestone) return null;

  // Check if this milestone corresponds to a badge the player hasn't unlocked yet
  const badgeId = MILESTONE_BADGE_MAP[currentMilestoneId];
  const badge = badgeId ? badges.find(b => b.id === badgeId) : null;
  const legacy = badge ? loadLegacy() : null;
  const isNewBadge = badge && legacy && !legacy.unlockedBadges.includes(badge.id);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-fade-in"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
    >
      <div className="game-card p-6 sm:p-8 w-full max-w-[calc(100%-2rem)] sm:max-w-sm text-center animate-pop-in">
        <div className="text-5xl sm:text-6xl mb-3 animate-sparkle">{milestone.emoji}</div>
        <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-1">{milestone.title}</h3>
        <p className="text-gray-500 text-sm mb-4">{milestone.description}</p>

        {/* Badge preview */}
        {isNewBadge && badge && (
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-4 animate-scale-in"
            style={{
              backgroundColor: RARITY_COLORS[badge.rarity] + "15",
              border: `1px solid ${RARITY_COLORS[badge.rarity]}40`,
            }}
          >
            <span className="text-sm">{badge.emoji}</span>
            <span className="text-xs font-bold" style={{ color: RARITY_COLORS[badge.rarity] }}>
              {RARITY_LABELS[badge.rarity]} Badge
            </span>
          </div>
        )}

        {/* Enhanced confetti */}
        <div className="relative h-0">
          {confetti.map((p, i) => (
            <div
              key={i}
              className="milestone-particle"
              style={{
                backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                width: `${p.width}px`,
                height: `${p.height}px`,
                left: `${p.left}%`,
                top: `${p.top}px`,
                "--duration": `${p.duration}s`,
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
