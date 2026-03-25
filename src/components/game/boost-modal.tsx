"use client";

import { useState, useEffect } from "react";
import { useGame } from "@/state/game-context";
import { playBoost, playTap } from "@/lib/sounds";

export function BoostModal() {
  const { state, onAcceptBoost, onDeclineBoost } = useGame();
  const boost = state.pendingBoost;
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<"ad" | "share" | null>(null);

  useEffect(() => {
    if (boost) playBoost();
  }, [boost]);

  if (!boost) return null;

  const handleAccept = (via: "ad" | "share") => {
    setMethod(via);
    setLoading(true);
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
      onAcceptBoost();
    }, via === "ad" ? 1500 : 800);
  };

  return (
    <div className="boost-overlay fixed inset-0 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="game-card p-5 sm:p-6 w-full max-w-[calc(100%-2rem)] sm:max-w-sm animate-scale-in">
        {loading ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3 animate-pulse">{boost.emoji}</div>
            <p className="text-gray-500 font-medium">
              {method === "ad" ? "Loading reward..." : "Sharing..."}
            </p>
            <div className="w-48 h-2 bg-gray-100 rounded-full mx-auto mt-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#e040fb] to-[#ff6b9d] rounded-full"
                style={{
                  animation: `grow ${method === "ad" ? "1.5s" : "0.8s"} ease-out forwards`,
                }}
              />
            </div>
            <style>{`@keyframes grow { from { width: 0; } to { width: 100%; } }`}</style>
          </div>
        ) : (
          <>
            <div className="text-center mb-4">
              <div className="text-4xl sm:text-5xl mb-2">{boost.emoji}</div>
              <h3 className="text-lg sm:text-xl font-black text-gray-900">{boost.name}</h3>
              <p className="text-gray-500 text-sm mt-1">{boost.description}</p>
            </div>

            {/* Effect preview */}
            <div className="flex flex-wrap justify-center gap-2 mb-5">
              {Object.entries(boost.effects).filter(([,v]) => v !== 0).map(([key, val]) => {
                const emojiMap: Record<string, string> = {
                  followers: "👥", fame: "⭐", reputation: "🛡️",
                  money: "💰", energy: "⚡", mentalHealth: "🧠",
                };
                const v = val as number;
                return (
                  <span key={key} className="text-sm font-bold text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-full">
                    {emojiMap[key]} +{Math.abs(v) >= 1000 ? `${(v/1000).toFixed(0)}K` : v}
                  </span>
                );
              })}
            </div>

            {/* Action buttons */}
            <div className="space-y-2.5">
              <button
                onClick={() => { playTap(); handleAccept("ad"); }}
                className="w-full py-3.5 bg-gradient-to-r from-[#e040fb] to-[#ff6b9d] text-white rounded-xl font-bold text-base hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
                style={{ boxShadow: "0 4px 20px rgba(224, 64, 251, 0.3)" }}
              >
                Watch Ad
              </button>
              <button
                onClick={() => { playTap(); handleAccept("share"); }}
                className="w-full py-3.5 bg-[#00e5ff] text-gray-900 rounded-xl font-bold text-base hover:scale-[1.02] active:scale-[0.98] transition-all"
                style={{ boxShadow: "0 4px 16px rgba(0, 229, 255, 0.25)" }}
              >
                Share with Friends
              </button>
              <button
                onClick={() => { playTap(); onDeclineBoost(); }}
                className="w-full py-3 text-gray-400 font-medium hover:text-gray-600 transition-colors text-sm"
              >
                Skip
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
