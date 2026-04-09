"use client";

import { useEffect, useRef, useState } from "react";
import { useGame } from "@/state/game-context";
import { STAT_EMOJI } from "@/lib/game/constants";
import { formatFollowers, formatMoney, getTierName, getTierEmoji, getMaxTurns, formatQuarter } from "@/lib/game/progression";
import { Stats, StatKey } from "@/lib/game/types";
import { playMoney, playLevelUp } from "@/lib/sounds";

interface DeltaSnapshot {
  deltas: Partial<Record<StatKey, number>>;
  deltaKey: number;
  moneyGained: boolean;
  tierChanged: boolean;
}

const INITIAL_SNAPSHOT: DeltaSnapshot = {
  deltas: {},
  deltaKey: 0,
  moneyGained: false,
  tierChanged: false,
};

export function StatBar() {
  const { state } = useGame();
  const { stats, week, careerTier } = state;
  const maxTurns = getMaxTurns();
  const progress = Math.min((week / maxTurns) * 100, 100);

  // Track previous stats/tier via ref to compute deltas
  const prevRef = useRef<{ stats: Stats; tier: string }>({ stats, tier: careerTier });
  const [snap, setSnap] = useState<DeltaSnapshot>(INITIAL_SNAPSHOT);

  // Single setState per change — avoids multiple set-state-in-effect calls
  useEffect(() => {
    const prev = prevRef.current;
    const newDeltas: Partial<Record<StatKey, number>> = {};
    let hasChange = false;

    for (const key of Object.keys(stats) as StatKey[]) {
      const diff = stats[key] - prev.stats[key];
      if (diff !== 0) {
        newDeltas[key] = diff;
        hasChange = true;
      }
    }

    const tierDidChange = careerTier !== prev.tier;

    if (hasChange || tierDidChange) {
      setSnap(prev => ({
        deltas: hasChange ? newDeltas : {},
        deltaKey: prev.deltaKey + 1,
        moneyGained: (newDeltas.money ?? 0) > 0,
        tierChanged: tierDidChange,
      }));
    }

    prevRef.current = { stats, tier: careerTier };
  }, [stats, careerTier]);

  // Sound effects — fires when deltaKey increments
  useEffect(() => {
    if (snap.moneyGained) playMoney();
    if (snap.tierChanged) playLevelUp();
  }, [snap.deltaKey, snap.moneyGained, snap.tierChanged]);

  return (
    <div className="w-full">
      {/* Quarter progress bar */}
      <div className="h-1 bg-white/20 rounded-full mb-2 overflow-hidden">
        <div
          className="h-full bg-white/60 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Top row: character + quarter + tier */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{state.character.avatar}</span>
          <span className="text-white font-bold text-xs">{state.character.name}</span>
          <span className="text-white/50 text-xs">·</span>
          <span className="text-white/80 text-xs font-semibold">
            {formatQuarter(week)}
          </span>
        </div>
        <span className="text-white text-xs font-bold">
          {getTierEmoji(careerTier)} {getTierName(careerTier)}
        </span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-1 sm:gap-1.5">
        <StatPill label="Followers" emoji={STAT_EMOJI.followers} value={formatFollowers(stats.followers)} delta={snap.deltas.followers} deltaKey={snap.deltaKey} deltaFormat="followers" />
        <StatPill label="Money" emoji={STAT_EMOJI.money} value={formatMoney(stats.money)} delta={snap.deltas.money} deltaKey={snap.deltaKey} deltaFormat="money" />
        <StatPill label="Fame" emoji={STAT_EMOJI.fame} value={`${stats.fame}`} bar barValue={stats.fame} barColor="#a855f7" delta={snap.deltas.fame} deltaKey={snap.deltaKey} />
        <StatPill label="Rep" emoji={STAT_EMOJI.reputation} value={`${stats.reputation}`} bar barValue={stats.reputation} barColor="#10b981" delta={snap.deltas.reputation} deltaKey={snap.deltaKey} />
        <StatPill label="Energy" emoji={STAT_EMOJI.energy} value={`${stats.energy}`} bar barValue={stats.energy} barColor="#f59e0b" delta={snap.deltas.energy} deltaKey={snap.deltaKey} />
        <StatPill label="Mental" emoji={STAT_EMOJI.mentalHealth} value={`${stats.mentalHealth}`} bar barValue={stats.mentalHealth} barColor="#3b82f6"
          danger={stats.mentalHealth < 25} delta={snap.deltas.mentalHealth} deltaKey={snap.deltaKey}
        />
      </div>
    </div>
  );
}

function StatPill({
  label,
  emoji,
  value,
  bar,
  barValue,
  barColor,
  danger,
  delta,
  deltaKey,
  deltaFormat,
}: {
  label: string;
  emoji: string;
  value: string;
  bar?: boolean;
  barValue?: number;
  barColor?: string;
  danger?: boolean;
  delta?: number;
  deltaKey: number;
  deltaFormat?: "followers" | "money";
}) {
  const hasChanged = delta !== undefined && delta !== 0;
  const isPositive = delta !== undefined && delta > 0;

  // Format delta display
  let deltaDisplay = "";
  if (delta !== undefined && delta !== 0) {
    const sign = delta > 0 ? "+" : "";
    if (deltaFormat === "followers") {
      if (Math.abs(delta) >= 1_000_000) deltaDisplay = `${sign}${(delta / 1_000_000).toFixed(1)}M`;
      else if (Math.abs(delta) >= 1000) deltaDisplay = `${sign}${(delta / 1000).toFixed(0)}K`;
      else deltaDisplay = `${sign}${delta}`;
    } else if (deltaFormat === "money") {
      deltaDisplay = `${sign}$${Math.abs(delta).toLocaleString()}`;
      if (delta < 0) deltaDisplay = `-$${Math.abs(delta).toLocaleString()}`;
    } else {
      deltaDisplay = `${sign}${delta}`;
    }
  }

  return (
    <div
      className={`stat-pill flex-col items-start relative ${danger ? "animate-shake" : ""} ${hasChanged ? "stat-pill-flash" : ""}`}
      role="status"
      aria-label={`${label}: ${value}${danger ? " — critically low!" : ""}${hasChanged && delta ? ` (${delta > 0 ? "+" : ""}${delta})` : ""}`}
    >
      <div className="text-[9px] sm:text-[10px] font-semibold text-gray-400 uppercase tracking-wider leading-none mb-0.5">{label}</div>
      <div className="flex items-center gap-1 w-full">
        <span className="text-xs">{emoji}</span>
        <span className={`text-xs font-bold ${danger ? "text-red-500" : "text-gray-800"}`}>{value}</span>
      </div>
      {bar && (
        <div className="stat-bar w-full mt-1">
          <div
            className="stat-bar-fill"
            style={{
              width: `${Math.max(barValue ?? 0, 0)}%`,
              backgroundColor: danger ? "#ef4444" : barColor,
            }}
          />
        </div>
      )}
      {/* Floating delta — key forces remount so CSS animation replays; forwards fill auto-hides */}
      {hasChanged && (
        <span
          key={deltaKey}
          className={`stat-delta ${isPositive ? "stat-delta-up" : "stat-delta-down"}`}
        >
          {deltaDisplay}
        </span>
      )}
    </div>
  );
}
