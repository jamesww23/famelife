"use client";

import { useState, useEffect } from "react";
import { useGame, generateSummary } from "@/state/game-context";
import { formatFollowers, formatMoney } from "@/lib/game/progression";
import { processRunEnd, getNextGoals, RunUnlocks } from "@/lib/game/legacy";
import { UnlockSummary } from "./unlock-summary";
import { playGameOver, playTap } from "@/lib/sounds";

/** Process run end once and cache the result across renders. */
function useRunUnlocks(state: Parameters<typeof processRunEnd>[0]): RunUnlocks {
  const [unlocks] = useState<RunUnlocks>(() => processRunEnd(state));
  return unlocks;
}

type View = "summary" | "unlocks";

export function SummaryScreen() {
  const { state, restartGame } = useGame();
  const summary = generateSummary(state);
  const [shared, setShared] = useState(false);
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<View>("summary");

  const unlocks = useRunUnlocks(state);

  useEffect(() => {
    playGameOver();
  }, []);

  const shareText = `${state.character.avatar} ${state.character.name} — ${summary.earnedTitleEmoji} ${summary.earnedTitle}\n${summary.fameRankEmoji} ${summary.fameRank} | Fame Score: ${summary.fameScore}/1000\n\n"${summary.headline}"\n\n${summary.storyRecap}\n\n👥 ${formatFollowers(summary.followers)} followers\n💰 ${formatMoney(summary.money)}\n🏆 Top ${100 - summary.percentile}% of players\n🔥 ${summary.viralMoments} viral moments\n😱 ${summary.scandals} scandals\n\nPlay Fame Life: `;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Fame Life — ${summary.fameRank}`,
          text: shareText,
        });
        setShared(true);
      } catch {
        // User cancelled
      }
    } else {
      await handleCopy();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available
    }
  };

  // Score bar fill percentage
  const scorePct = Math.min(100, (summary.fameScore / 1000) * 100);

  if (view === "unlocks") {
    const nextGoals = getNextGoals(unlocks.updatedLegacy);
    return (
      <div className="min-h-screen min-h-[100dvh] flex items-center justify-center p-3 sm:p-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-4">
            <h2 className="text-xl sm:text-2xl font-black text-white">Career Legacy</h2>
            <p className="text-white/60 text-xs mt-1">Run #{unlocks.updatedLegacy.totalRuns} complete</p>
          </div>
          <UnlockSummary
            newBadges={unlocks.newBadges}
            newTitles={unlocks.newTitles}
            nextGoals={nextGoals}
            onContinue={() => setView("summary")}
          />
        </div>
      </div>
    );
  }

  const hasUnlocks = unlocks.newBadges.length > 0 || unlocks.newTitles.length > 0;

  return (
    <div className="min-h-screen min-h-[100dvh] flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-lg animate-slide-up">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="text-4xl sm:text-5xl mb-2">{state.character.avatar}</div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-1">{state.character.name}&apos;s Story</h1>
          <p className="text-white/70 text-sm">{summary.endingReason}</p>
        </div>

        {/* Earned Title */}
        <div className="game-card p-3 sm:p-4 mb-3 sm:mb-4 text-center">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">You Earned</div>
          <div className="text-xl sm:text-2xl font-black text-gray-900">
            {summary.earnedTitleEmoji} {summary.earnedTitle}
          </div>
        </div>

        {/* Fame Rank Card */}
        <div className="game-card p-4 sm:p-6 mb-3 sm:mb-4">
          <div className="text-center mb-3">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Fame Rank</div>
            <div className="text-2xl sm:text-3xl font-black text-gray-900">
              {summary.fameRankEmoji} {summary.fameRank}
            </div>
          </div>

          {/* Score Bar */}
          <div className="mb-3">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-xs font-bold text-gray-500">Fame Score</span>
              <span className="text-sm font-black text-gray-900">{summary.fameScore} / 1,000</span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full score-bar-fill transition-all duration-1000"
                style={{ width: `${scorePct}%` }}
              />
            </div>
          </div>

          {/* Percentile */}
          <div className="text-center py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
            <span className="text-xs text-gray-500 font-medium">You outperformed </span>
            <span className="text-lg font-black text-[#e040fb]">{summary.percentile}%</span>
            <span className="text-xs text-gray-500 font-medium"> of players</span>
          </div>
        </div>

        {/* Story recap */}
        <div className="game-card p-4 sm:p-5 mb-3 sm:mb-4">
          <p className="text-sm text-gray-500 italic text-center mb-2">{summary.storyRecap}</p>
          <p className="text-base sm:text-lg font-black text-gray-900 leading-snug text-center">
            &ldquo;{summary.headline}&rdquo;
          </p>
        </div>

        {/* Stats grid */}
        <div className="game-card p-4 sm:p-5 mb-3 sm:mb-4">
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <StatRow emoji="👥" label="Followers" value={formatFollowers(summary.followers)} />
            <StatRow emoji="👑" label="Final Tier" value={summary.fameTier} />
            <StatRow emoji="💰" label="Money" value={formatMoney(summary.money)} />
            <StatRow emoji="📅" label="Years" value={`${summary.yearsPlayed}`} />
            <StatRow emoji="🤝" label="Brand Deals" value={`${summary.brandDeals}`} />
            <StatRow emoji="😱" label="Scandals" value={`${summary.scandals}`} />
            <StatRow emoji="🌟" label="Celeb Moments" value={`${summary.celebrityEvents}`} />
            <StatRow emoji="❤️" label="Relationships" value={`${summary.relationships}`} />
            <StatRow emoji="🔥" label="Viral Moments" value={`${summary.viralMoments}`} />
            <StatRow emoji="💪" label="Comebacks" value={`${summary.comebacks}`} />
          </div>
        </div>

        {/* Milestones */}
        {summary.milestones.length > 0 && (
          <div className="game-card p-4 sm:p-5 mb-3 sm:mb-4">
            <h3 className="font-bold text-gray-900 text-sm mb-2">Milestones Unlocked</h3>
            <div className="flex flex-wrap gap-2">
              {summary.milestones.map((id) => (
                <span key={id} className="text-xs bg-purple-50 text-purple-600 font-bold px-2.5 py-1 rounded-full">
                  {id.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2.5">
          {/* View Unlocks button */}
          {hasUnlocks && (
            <button
              onClick={() => { playTap(); setView("unlocks"); }}
              className="w-full py-3.5 bg-gradient-to-r from-[#e040fb] to-[#ab47bc] text-white rounded-2xl font-bold text-base active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2 animate-pulse-glow"
            >
              🏆 View {unlocks.newBadges.length + unlocks.newTitles.length} New Unlock{(unlocks.newBadges.length + unlocks.newTitles.length) !== 1 ? "s" : ""}
            </button>
          )}
          <button
            onClick={() => { playTap(); handleShare(); }}
            className="w-full py-3.5 bg-white text-[#e040fb] rounded-2xl font-bold text-base active:scale-[0.98] transition-all btn-glow flex items-center justify-center gap-2"
          >
            {shared ? "Shared!" : "📤 Share Your Fame Story"}
          </button>
          <button
            onClick={() => { playTap(); handleCopy(); }}
            className="w-full py-3 bg-white/20 text-white rounded-2xl font-semibold text-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {copied ? "✅ Copied!" : "📋 Copy Results"}
          </button>
          <button
            onClick={() => { playTap(); restartGame(); }}
            className="w-full py-3.5 bg-white/10 text-white rounded-2xl font-bold text-base hover:bg-white/20 active:scale-[0.98] transition-all"
          >
            🔄 Play Again
          </button>
        </div>
      </div>
    </div>
  );
}

function StatRow({ emoji, label, value }: { emoji: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg">{emoji}</span>
      <div>
        <div className="text-xs text-gray-400 font-medium">{label}</div>
        <div className="text-sm font-bold text-gray-900">{value}</div>
      </div>
    </div>
  );
}
