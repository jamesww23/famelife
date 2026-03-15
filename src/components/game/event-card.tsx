"use client";

import { useGame } from "@/state/game-context";
import { EVENT_COLORS } from "@/lib/game/constants";

export function EventCard() {
  const { state, chooseEventOption } = useGame();
  const event = state.currentEvent;

  if (!event) return null;

  const color = EVENT_COLORS[event.type] || "#e040fb";

  return (
    <div className="animate-scale-in" key={event.id + state.week}>
      {/* Event card */}
      <div className="game-card p-4 sm:p-6 mb-3 sm:mb-4">
        {/* Category badge */}
        <div className="flex items-center gap-2 mb-2 sm:mb-3">
          <span
            className="text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-white"
            style={{ backgroundColor: color }}
          >
            {event.type}
          </span>
          {event.chainId && (
            <span className="text-[10px] sm:text-xs font-bold text-purple-500 uppercase tracking-wider">
              Storyline
            </span>
          )}
        </div>

        {/* Emoji + Title */}
        <div className="flex items-start gap-2 mb-2">
          {event.emoji && <span className="text-2xl sm:text-3xl shrink-0">{event.emoji}</span>}
          <h2 className="text-lg sm:text-xl font-black text-gray-900 leading-tight">{event.title}</h2>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-1">{event.text}</p>
      </div>

      {/* Choice buttons */}
      <div className="space-y-2 sm:space-y-2.5">
        {event.choices.map((choice, i) => (
          <button
            key={choice.id}
            onClick={() => chooseEventOption(choice)}
            className="choice-btn"
          >
            <span>{choice.text}</span>
            <EffectPreview effects={choice.effects} />
          </button>
        ))}
      </div>
    </div>
  );
}

function EffectPreview({ effects }: { effects: Record<string, number> }) {
  const items = Object.entries(effects).filter(([, v]) => v !== 0);
  if (items.length === 0) return null;

  const emojiMap: Record<string, string> = {
    followers: "👥",
    fame: "⭐",
    reputation: "🛡️",
    money: "💰",
    energy: "⚡",
    mentalHealth: "🧠",
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-1.5 flex-wrap">
      {items.map(([key, val]) => (
        <span
          key={key}
          className="text-xs font-bold text-gray-400"
        >
          {emojiMap[key] || ""} {val > 0 ? "+" : ""}{typeof val === "number" && Math.abs(val) >= 1000 ? `${(val / 1000).toFixed(0)}K` : val}
        </span>
      ))}
    </div>
  );
}
