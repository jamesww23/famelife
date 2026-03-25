"use client";

import { useEffect, useState } from "react";
import { useGame } from "@/state/game-context";
import { STAT_EMOJI } from "@/lib/game/constants";
import { formatFollowers, formatMoney, getTierName, getTierEmoji, getMaxTurns, formatQuarter } from "@/lib/game/progression";
import { Stats, StatKey } from "@/lib/game/types";
import { playMoney, playLevelUp } from "@/lib/sounds";

interface DeltaState {
  prevStats: Stats;
  prevTier: string;
  deltas: Partial<Record<StatKey, number>>;
  deltaKey: number;
  moneyGained: boolean;
  tierChanged: boolean;
}

export function StatBar() {
  const { state } = useGame();
  const { stats, week, careerTier } = state;
  const maxTurns = getMaxTurns();
  const progress = Math.min((week / maxTurns) * 100, 100);

  // Track deltas via "adjusting state during render" pattern.
  // React allows setState during render when syncing state to new props/context.
  // This avoids both refs-during-render and setState-in-effects violations.
  const [deltaState, setDeltaState] = useState<DeltaState>({
    prevStats: stats,
    prevTier: careerTier,
    deltas: {},
    deltaKey: 0,
    moneyGained: false,
    tierChanged: false,
  });

  // Compute deltas by comparing current stats to tracked previous stats
  if (stats !== deltaState.prevStats) {
    const newDeltas: Partial<Record<StatKey, number>> = {};
    let hasChange = false;
    for (const key of Object.keys(stats) as StatKey[]) {
      const diff = stats[key] - deltaState.prevStats[key];
      if (diff !== 0) {
        newDeltas[key] = diff;
        hasChange = true;
      }
    }
    if (hasChange) {
      setDeltaState({
        prevStats: stats,
        prevTier: careerTier,
        deltas: newDeltas,
        deltaKey: deltaState.deltaKey + 1,
        moneyGained: (newDeltas.money ?? 0) > 0,
        tierChanged: careerTier !== deltaState.prevTier,
      });
    } else {
      setDeltaState(prev => ({ ...prev, prevStats: stats, prevTier: careerTier }));
    }
  } else if (careerTier !== deltaState.prevTier) {
    setDeltaState(prev => ({ ...prev, prevTier: careerTier, tierChanged: true, deltaKey: prev.deltaKey + 1 }));
  }

  const { deltas, deltaKey, moneyGained, tierChanged } = deltaState;

  // Sound effects — depend on deltaKey which only increments on real changes
  useEffect(() => {
    if (moneyGained) playMoney();
    if (tierChanged) playLevelUp();
  }, [deltaKey, moneyGained, tierChanged]);

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
        <StatPill label="Followers" emoji={STAT_EMOJI.followers} value={formatFollowers(stats.followers)} delta={deltas.followers} deltaKey={deltaKey} deltaFormat="followers" />
        <StatPill label="Money" emoji={STAT_EMOJI.money} value={formatMoney(stats.money)} delta={deltas.money} deltaKey={deltaKey} deltaFormat="money" />
        <StatPill label="Fame" emoji={STAT_EMOJI.fame} value={`${stats.fame}`} bar barValue={stats.fame} barColor="#a855f7" delta={deltas.fame} deltaKey={deltaKey} />
        <StatPill label="Rep" emoji={STAT_EMOJI.reputation} value={`${stats.reputation}`} bar barValue={stats.reputation} barColor="#10b981" delta={deltas.reputation} deltaKey={deltaKey} />
        <StatPill label="Energy" emoji={STAT_EMOJI.energy} value={`${stats.energy}`} bar barValue={stats.energy} barColor="#f59e0b" delta={deltas.energy} deltaKey={deltaKey} />
        <StatPill label="Mental" emoji={STAT_EMOJI.mentalHealth} value={`${stats.mentalHealth}`} bar barValue={stats.mentalHealth} barColor="#3b82f6"
          danger={stats.mentalHealth < 25} delta={deltas.mentalHealth} deltaKey={deltaKey}
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
    <div className={`stat-pill flex-col items-start relative ${danger ? "animate-shake" : ""} ${hasChanged ? "stat-pill-flash" : ""}`}>
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
