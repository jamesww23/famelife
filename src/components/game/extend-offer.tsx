"use client";

import { useGame } from "@/state/game-context";
import { formatFollowers, formatMoney, getTierName, getTierEmoji } from "@/lib/game/progression";

export function ExtendOffer() {
  const { state, extendGame, declineExtend } = useGame();
  const { stats, careerTier } = state;

  return (
    <div className="animate-scale-in">
      <div className="game-card p-5 sm:p-7 mb-4 text-center">
        <div className="text-4xl mb-3">🔥</div>
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">
          3 Years In
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          You&apos;re {getTierEmoji(careerTier)} <strong>{getTierName(careerTier)}</strong> with{" "}
          <strong>{formatFollowers(stats.followers)}</strong> followers and{" "}
          <strong>{formatMoney(stats.money)}</strong> in the bank.
        </p>
        <p className="text-gray-800 font-semibold text-base mb-1">
          Ready to keep going?
        </p>
        <p className="text-gray-500 text-xs">
          Extend your career to 10 years — or retire now.
        </p>
      </div>

      <div className="space-y-2.5">
        <button
          onClick={extendGame}
          className="w-full py-3.5 sm:py-4 bg-white rounded-2xl font-bold text-[#e040fb] text-base sm:text-lg shadow-lg active:scale-[0.98] transition-all"
        >
          👑 Keep Going
        </button>
        <button
          onClick={declineExtend}
          className="w-full py-3 rounded-2xl font-semibold text-white/70 text-sm hover:text-white transition-colors"
        >
          Retire &amp; See Results
        </button>
      </div>
    </div>
  );
}
