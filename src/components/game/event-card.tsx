"use client";

import { useState, useEffect } from "react";
import { useGame } from "@/state/game-context";
import { EVENT_COLORS, RISK_TAG_LABELS, RISK_TAG_COLORS, RISK_TAG_EMOJI, HIGH_RISK_THRESHOLD } from "@/lib/game/constants";
import { EventChoice } from "@/lib/game/types";
import { playTap, playSwoosh, playDrama, playViral, playFailure } from "@/lib/sounds";

export function EventCard() {
  const { state } = useGame();
  const event = state.currentEvent;

  // Play sound when event appears
  useEffect(() => {
    if (!event) return;
    if (event.type === "drama") playDrama();
    else if (event.type === "viral") playViral();
    else if (event.type === "failure") playFailure();
    else playSwoosh();
  }, [event]);

  if (!event) return null;

  // Key remount resets confirmChoice state when event changes
  return <EventCardInner key={event.id + state.week} />;
}

/** Inner component — remounted via key to reset confirmChoice */
function EventCardInner() {
  const { state, chooseEventOption } = useGame();
  const event = state.currentEvent;
  const [confirmChoice, setConfirmChoice] = useState<EventChoice | null>(null);

  if (!event) return null;

  const color = EVENT_COLORS[event.type] || "#e040fb";
  const isDrama = event.type === "drama";

  const handleChoiceClick = (choice: EventChoice) => {
    playTap();
    if (choice.requiresConfirmation) {
      setConfirmChoice(choice);
    } else {
      chooseEventOption(choice);
    }
  };

  const handleConfirm = () => {
    if (confirmChoice) {
      playTap();
      chooseEventOption(confirmChoice);
      setConfirmChoice(null);
    }
  };

  const handleCancel = () => {
    playTap();
    setConfirmChoice(null);
  };

  return (
    <>
      <div className="animate-scale-in" key={event.id + state.week}>
        {/* Event card */}
        <div className={`game-card p-4 sm:p-6 mb-3 sm:mb-4 ${isDrama ? "drama-card" : ""}`}>
          {/* Category badge + risk indicator */}
          <div className="flex items-center gap-2 mb-2 sm:mb-3 flex-wrap">
            <span
              className="event-badge text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-white"
              style={{ backgroundColor: color }}
            >
              {event.type}
            </span>
            {event.chainId && (
              <span className="text-[10px] sm:text-xs font-bold text-purple-500 uppercase tracking-wider">
                Storyline
              </span>
            )}
            {/* Risk level indicator */}
            {state.riskLevel >= HIGH_RISK_THRESHOLD && (
              <span className="risk-level-badge text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                🔥 High Volatility
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
          {event.choices.map((choice) => (
            <ChoiceButton
              key={choice.id}
              choice={choice}
              onClick={() => handleChoiceClick(choice)}
            />
          ))}
        </div>
      </div>

      {/* Confirmation modal for high-risk choices */}
      {confirmChoice && (
        <ConfirmationModal
          choice={confirmChoice}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}

function ChoiceButton({
  choice,
  onClick,
}: {
  choice: EventChoice;
  onClick: () => void;
}) {
  const tag = choice.riskTag;
  const isRisky = tag === "high_risk" || tag === "reputation_risk";

  return (
    <button
      onClick={onClick}
      className={`choice-btn ${isRisky ? "choice-btn-risky" : ""} ${tag === "big_opportunity" ? "choice-btn-opportunity" : ""}`}
    >
      {/* Risk tag */}
      {tag && (
        <div className="flex items-center justify-center gap-1 mb-1.5">
          <span
            className="risk-tag text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{
              color: RISK_TAG_COLORS[tag],
              backgroundColor: RISK_TAG_COLORS[tag] + "15",
              border: `1px solid ${RISK_TAG_COLORS[tag]}30`,
            }}
          >
            {RISK_TAG_EMOJI[tag]} {RISK_TAG_LABELS[tag]}
          </span>
        </div>
      )}

      {/* Choice text */}
      <span className={tag ? "font-bold" : ""}>{choice.text}</span>

      {/* Stakes preview */}
      {choice.stakes && (
        <div className="flex items-center justify-center gap-3 mt-1.5 text-[11px]">
          <span className="text-emerald-500 font-semibold">↑ {choice.stakes.upside}</span>
          <span className="text-gray-300">|</span>
          <span className="text-red-400 font-semibold">↓ {choice.stakes.downside}</span>
        </div>
      )}

      {/* Confirmation indicator */}
      {choice.requiresConfirmation && (
        <div className="text-[10px] text-gray-400 mt-1">⚠️ Requires confirmation</div>
      )}
    </button>
  );
}

function ConfirmationModal({
  choice,
  onConfirm,
  onCancel,
}: {
  choice: EventChoice;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const tag = choice.riskTag;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-fade-in"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
    >
      <div className="game-card p-5 sm:p-6 w-full max-w-[calc(100%-2rem)] sm:max-w-sm animate-scale-in text-center">
        <div className="text-4xl mb-3">⚠️</div>
        <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-2">Are you sure?</h3>

        <p className="text-gray-600 text-sm mb-3">
          You&apos;re about to: <strong>{choice.text}</strong>
        </p>

        {/* Stakes display */}
        {choice.stakes && (
          <div className="bg-gray-50 rounded-xl p-3 mb-4 text-sm">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-emerald-500 text-lg">📈</span>
              <span className="text-emerald-600 font-semibold">{choice.stakes.upside}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-400 text-lg">📉</span>
              <span className="text-red-500 font-semibold">{choice.stakes.downside}</span>
            </div>
          </div>
        )}

        {tag === "high_risk" && (
          <p className="text-xs text-gray-400 mb-4 italic">
            Outcome varies — this could go very well or very badly.
          </p>
        )}

        <div className="space-y-2">
          <button
            onClick={onConfirm}
            className="w-full py-3.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-bold text-base hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
          >
            🎲 Do it anyway
          </button>
          <button
            onClick={onCancel}
            className="w-full py-3 text-gray-400 font-medium hover:text-gray-600 transition-colors text-sm"
          >
            Back out
          </button>
        </div>
      </div>
    </div>
  );
}
