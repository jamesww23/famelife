"use client";

import { useGame, generateSummary } from "@/state/game-context";
import { formatFollowers, formatMoney } from "@/lib/game/progression";

export function SummaryScreen() {
  const { state, restartGame } = useGame();
  const summary = generateSummary(state);

  return (
    <div className="min-h-screen min-h-[100dvh] flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-lg animate-slide-up">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="text-4xl sm:text-5xl mb-2">{summary.archetypeEmoji}</div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-1">Game Over</h1>
          <p className="text-white/70 text-sm">{summary.endingReason}</p>
        </div>

        {/* Headline card */}
        <div className="game-card p-4 sm:p-6 mb-3 sm:mb-4">
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
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: "Fame Life",
                  text: summary.headline,
                }).catch(() => {});
              } else {
                navigator.clipboard.writeText(summary.headline).catch(() => {});
              }
            }}
            className="w-full py-3.5 bg-white text-[#e040fb] rounded-2xl font-bold text-base active:scale-[0.98] transition-all shadow-lg"
          >
            Share Your Story
          </button>
          <button
            onClick={restartGame}
            className="w-full py-3.5 bg-white/20 text-white rounded-2xl font-bold text-base hover:bg-white/30 active:scale-[0.98] transition-all"
          >
            Play Again
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
