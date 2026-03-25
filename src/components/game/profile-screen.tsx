"use client";

import { useState } from "react";
import { CareerLegacy } from "@/lib/game/types";
import { badges, RARITY_COLORS, RARITY_LABELS, CATEGORY_LABELS } from "@/data/badges";
import { formatFollowers, formatMoney } from "@/lib/game/progression";
import { playTap } from "@/lib/sounds";

type Tab = "badges" | "titles" | "records" | "history";

export function ProfileScreen({
  legacy,
  onClose,
}: {
  legacy: CareerLegacy;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<Tab>("badges");

  const unlockedSet = new Set(legacy.unlockedBadges);
  const totalBadges = badges.length;
  const unlockedCount = legacy.unlockedBadges.length;

  return (
    <div className="min-h-screen min-h-[100dvh] flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-lg animate-slide-up">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="text-3xl sm:text-4xl mb-1">🏆</div>
          <h1 className="text-xl sm:text-2xl font-black text-white">Career Legacy</h1>
          <p className="text-white/60 text-xs mt-1">
            {legacy.totalRuns} run{legacy.totalRuns !== 1 ? "s" : ""} played
            {" · "}
            {unlockedCount}/{totalBadges} badges
          </p>
        </div>

        {/* Quick stats */}
        <div className="game-card p-3 sm:p-4 mb-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            <QuickStat label="Best Followers" value={formatFollowers(legacy.bestFollowers)} />
            <QuickStat label="Lifetime Earnings" value={formatMoney(legacy.lifetimeEarnings)} />
            <QuickStat label="Best Score" value={`${legacy.bestFameScore}`} />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-3">
          {(["badges", "titles", "records", "history"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => { playTap(); setTab(t); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                tab === t
                  ? "bg-white text-[#e040fb] shadow-md"
                  : "bg-white/15 text-white/70"
              }`}
            >
              {t === "badges" ? "🏅 Badges" : t === "titles" ? "🎖️ Titles" : t === "records" ? "📊 Records" : "📜 History"}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="game-card p-4 sm:p-5 mb-4 max-h-[50vh] overflow-y-auto">
          {tab === "badges" && <BadgesTab unlockedSet={unlockedSet} />}
          {tab === "titles" && <TitlesTab titles={legacy.unlockedTitles} />}
          {tab === "records" && <RecordsTab legacy={legacy} />}
          {tab === "history" && <HistoryTab legacy={legacy} />}
        </div>

        {/* Back button */}
        <button
          onClick={() => { playTap(); onClose(); }}
          className="w-full py-3.5 bg-white/10 text-white rounded-2xl font-bold text-base hover:bg-white/20 active:scale-[0.98] transition-all"
        >
          Back
        </button>
      </div>
    </div>
  );
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[9px] sm:text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{label}</div>
      <div className="text-sm sm:text-base font-black text-gray-900">{value}</div>
    </div>
  );
}

function BadgesTab({ unlockedSet }: { unlockedSet: Set<string> }) {
  // Group badges by category
  const categories = [...new Set(badges.map(b => b.category))];

  return (
    <div className="space-y-4">
      {categories.map((cat) => {
        const catBadges = badges.filter(b => b.category === cat);
        const catUnlocked = catBadges.filter(b => unlockedSet.has(b.id)).length;
        return (
          <div key={cat}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {CATEGORY_LABELS[cat] ?? cat}
              </span>
              <span className="text-[10px] text-gray-400">{catUnlocked}/{catBadges.length}</span>
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {catBadges.map((badge) => {
                const unlocked = unlockedSet.has(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`flex items-center gap-2.5 p-2 rounded-xl transition-all ${
                      unlocked ? "bg-white" : "bg-gray-50 opacity-50"
                    }`}
                  >
                    <span className={`text-lg ${unlocked ? "" : "grayscale"}`}>{badge.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-gray-900 truncate">{badge.name}</span>
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
                      <div className="text-[10px] text-gray-400 truncate">{badge.description}</div>
                    </div>
                    {unlocked && <span className="text-green-500 text-xs shrink-0">✓</span>}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TitlesTab({ titles }: { titles: string[] }) {
  if (titles.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        No titles unlocked yet. Complete a run to earn your first title.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {titles.map((title) => (
        <div key={title} className="flex items-center gap-2 p-2.5 bg-white rounded-xl">
          <span className="text-lg">🎖️</span>
          <span className="text-sm font-bold text-gray-900">{title}</span>
        </div>
      ))}
    </div>
  );
}

function RecordsTab({ legacy }: { legacy: CareerLegacy }) {
  const records = [
    { emoji: "👥", label: "Most Followers (Single Run)", value: formatFollowers(legacy.bestFollowers) },
    { emoji: "💰", label: "Highest Money (Single Run)", value: formatMoney(legacy.bestMoney) },
    { emoji: "🏆", label: "Best Fame Score", value: `${legacy.bestFameScore} / 1,000` },
    { emoji: "⭐", label: "Highest Fame Stat", value: `${legacy.bestFame}` },
    { emoji: "📅", label: "Longest Run", value: `${legacy.longestRun} quarters (${Math.ceil(legacy.longestRun / 4)} years)` },
    { emoji: "😱", label: "Most Scandals Survived", value: `${legacy.mostScandals}` },
    { emoji: "💵", label: "Lifetime Earnings", value: formatMoney(legacy.lifetimeEarnings) },
    { emoji: "🔄", label: "Total Runs", value: `${legacy.totalRuns}` },
  ];

  if (legacy.fastestTo1M !== null) {
    records.push({
      emoji: "⚡",
      label: "Fastest to 1M Followers",
      value: `${legacy.fastestTo1M} quarters (${Math.ceil(legacy.fastestTo1M / 4)} years)`,
    });
  }

  return (
    <div className="space-y-2">
      {records.map((r) => (
        <div key={r.label} className="flex items-center gap-2.5 p-2 bg-white rounded-xl">
          <span className="text-lg shrink-0">{r.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-gray-400 font-medium">{r.label}</div>
            <div className="text-sm font-bold text-gray-900">{r.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function HistoryTab({ legacy }: { legacy: CareerLegacy }) {
  if (legacy.runHistory.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        No runs completed yet. Play your first game!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {legacy.runHistory.map((run, i) => (
        <div key={i} className="p-2.5 bg-white rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{run.avatar}</span>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-gray-900 truncate">
                {run.characterName} — {run.earnedTitleEmoji} {run.earnedTitle}
              </div>
              <div className="text-[10px] text-gray-400">
                Score {run.fameScore} · {formatFollowers(run.followers)} followers · {Math.ceil(run.quartersPlayed / 4)}y
              </div>
            </div>
          </div>
          {run.newBadges.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {run.newBadges.map((id) => {
                const badge = badges.find(b => b.id === id);
                return badge ? (
                  <span key={id} className="text-[10px] bg-purple-50 text-purple-600 font-bold px-1.5 py-0.5 rounded-full">
                    {badge.emoji} {badge.name}
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
