"use client";

import { useEffect, useRef, useState } from "react";
import { useGame } from "@/state/game-context";
import { STAT_EMOJI, STAT_ICON_URL } from "@/lib/game/constants";
import { formatFollowers, formatMoney, getTierName, getTierEmoji, getMaxTurns, formatQuarter } from "@/lib/game/progression";
import { Stats, StatKey } from "@/lib/game/types";
import { playMoney, playLevelUp, isMuted, toggleMute, subscribeMute } from "@/lib/sounds";

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
    <div className="stat-header w-full">
      {/* Top row: character + quarter + tier + mute */}
      <div className="flex items-center justify-between mb-2 gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-sm">{state.character.avatar}</span>
          <span className="text-white font-bold text-xs truncate">{state.character.name}</span>
          <span className="text-white/30 text-xs">·</span>
          <span className="text-white/70 text-xs font-semibold whitespace-nowrap">
            {formatQuarter(week)}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-white/90 text-xs font-bold whitespace-nowrap">
            {getTierEmoji(careerTier)} {getTierName(careerTier)}
          </span>
          <MuteToggle />
        </div>
      </div>

      {/* Quarter progress bar */}
      <div className="h-1 bg-white/10 rounded-full mb-2.5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, #e040fb, #ff6b9d, #ffd700)",
          }}
        />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-1.5">
        <StatPill label="Followers" iconUrl={STAT_ICON_URL.followers} emoji={STAT_EMOJI.followers} value={formatFollowers(stats.followers)} delta={snap.deltas.followers} deltaKey={snap.deltaKey} deltaFormat="followers" />
        <StatPill label="Money" iconUrl={STAT_ICON_URL.money} emoji={STAT_EMOJI.money} value={formatMoney(stats.money)} delta={snap.deltas.money} deltaKey={snap.deltaKey} deltaFormat="money" />
        <StatPill label="Fame" iconUrl={STAT_ICON_URL.fame} emoji={STAT_EMOJI.fame} value={`${stats.fame}`} bar barValue={stats.fame} barColor="#a855f7" delta={snap.deltas.fame} deltaKey={snap.deltaKey} />
        <StatPill label="Rep" iconUrl={STAT_ICON_URL.reputation} emoji={STAT_EMOJI.reputation} value={`${stats.reputation}`} bar barValue={stats.reputation} barColor="#10b981" delta={snap.deltas.reputation} deltaKey={snap.deltaKey} />
        <StatPill label="Energy" iconUrl={STAT_ICON_URL.energy} emoji={STAT_EMOJI.energy} value={`${stats.energy}`} bar barValue={stats.energy} barColor="#f59e0b" delta={snap.deltas.energy} deltaKey={snap.deltaKey} />
        <StatPill label="Mental" iconUrl={STAT_ICON_URL.mentalHealth} emoji={STAT_EMOJI.mentalHealth} value={`${stats.mentalHealth}`} bar barValue={stats.mentalHealth} barColor="#3b82f6"
          danger={stats.mentalHealth < 25} delta={snap.deltas.mentalHealth} deltaKey={snap.deltaKey}
        />
      </div>
    </div>
  );
}

function MuteToggle() {
  const [m, setM] = useState(() => isMuted());
  useEffect(() => subscribeMute(setM), []);
  return (
    <button
      type="button"
      onClick={() => toggleMute()}
      aria-label={m ? "Unmute sound" : "Mute sound"}
      aria-pressed={m}
      className="flex items-center justify-center w-11 h-11 -my-1 -mr-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
    >
      <span aria-hidden="true" className="text-base leading-none">{m ? "🔇" : "🔊"}</span>
    </button>
  );
}

function StatPill({
  label,
  emoji,
  iconUrl,
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
  iconUrl?: string;
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
      <div className="text-[10px] sm:text-[11px] font-semibold text-white/40 uppercase tracking-wider leading-none mb-0.5">{label}</div>
      <div className="flex items-center gap-1.5 w-full">
        {iconUrl ? (
          <img
            src={iconUrl}
            alt=""
            aria-hidden="true"
            width={22}
            height={22}
            className="w-[22px] h-[22px] object-contain shrink-0 drop-shadow-[0_0_6px_rgba(255,255,255,0.15)]"
          />
        ) : (
          <span className="text-xs">{emoji}</span>
        )}
        <span className={`text-xs font-bold ${danger ? "text-red-400" : "text-white/90"}`}>{value}</span>
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
