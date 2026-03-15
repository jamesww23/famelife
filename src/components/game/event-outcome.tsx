"use client";

import { useGame } from "@/state/game-context";
import { STAT_EMOJI } from "@/lib/game/constants";
import { StatDelta } from "@/lib/game/types";

export function EventOutcome() {
  const { state, proceedFromOutcome } = useGame();
  const result = state.currentChoiceResult;

  if (!result) return null;

  const { choice, event, deltas } = result;

  return (
    <div className="animate-scale-in" key={`outcome-${event.id}-${state.week}`}>
      <div className="game-card p-6 mb-4">
        {/* Result text */}
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          {choice.followUpText || `You chose: "${choice.text}"`}
        </p>

        {/* Stat deltas with animation */}
        <div className="flex flex-wrap gap-2 mb-4">
          {deltas.map((d: StatDelta, i: number) => (
            <DeltaBadge key={d.stat} delta={d} delay={i * 100} />
          ))}
        </div>

        {/* Social reaction */}
        {choice.socialReaction && (
          <div className="social-bubble">
            <div className="flex items-center gap-2 mb-1">
              <span>
                {choice.socialReaction.type === "tweet" ? "🐦" :
                 choice.socialReaction.type === "headline" ? "📰" : "💬"}
              </span>
              {choice.socialReaction.author && (
                <span className="text-xs font-bold text-purple-600">{choice.socialReaction.author}</span>
              )}
            </div>
            <p className="text-gray-700 text-sm italic">
              &ldquo;{choice.socialReaction.text}&rdquo;
            </p>
          </div>
        )}
      </div>

      <button
        onClick={proceedFromOutcome}
        className="w-full py-4 bg-white rounded-2xl font-bold text-[#e040fb] text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        Continue
      </button>
    </div>
  );
}

function DeltaBadge({ delta, delay }: { delta: StatDelta; delay: number }) {
  const isPositive = delta.delta > 0;
  const emoji = STAT_EMOJI[delta.stat] || "";
  const value = delta.delta;
  const display = Math.abs(value) >= 1000
    ? `${(value / 1000).toFixed(value >= 10000 || value <= -10000 ? 0 : 1)}K`
    : `${value}`;

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold animate-pop-in ${
        isPositive
          ? "bg-emerald-50 text-emerald-600"
          : "bg-red-50 text-red-500"
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {emoji} {isPositive ? "+" : ""}{display}
    </span>
  );
}
