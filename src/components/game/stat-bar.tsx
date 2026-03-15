"use client";

import { useGame } from "@/state/game-context";
import { STAT_EMOJI } from "@/lib/game/constants";
import { formatFollowers, formatMoney, getTierName, getTierEmoji, getMaxTurns, formatQuarter } from "@/lib/game/progression";

export function StatBar() {
  const { state } = useGame();
  const { stats, week, careerTier } = state;
  const maxTurns = getMaxTurns(state);
  const progress = Math.min((week / maxTurns) * 100, 100);

  return (
    <div className="w-full">
      {/* Quarter progress bar */}
      <div className="h-1 bg-white/20 rounded-full mb-2 overflow-hidden">
        <div
          className="h-full bg-white/60 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Top row: quarter + tier */}
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-white/80 text-xs font-semibold">
          {formatQuarter(week)}
        </span>
        <span className="text-white text-xs font-bold">
          {getTierEmoji(careerTier)} {getTierName(careerTier)}
        </span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-1.5">
        <StatPill emoji={STAT_EMOJI.followers} value={formatFollowers(stats.followers)} />
        <StatPill emoji={STAT_EMOJI.money} value={formatMoney(stats.money)} />
        <StatPill emoji={STAT_EMOJI.fame} value={`${stats.fame}`} bar barValue={stats.fame} barColor="#a855f7" />
        <StatPill emoji={STAT_EMOJI.reputation} value={`${stats.reputation}`} bar barValue={stats.reputation} barColor="#10b981" />
        <StatPill emoji={STAT_EMOJI.energy} value={`${stats.energy}`} bar barValue={stats.energy} barColor="#f59e0b" />
        <StatPill emoji={STAT_EMOJI.mentalHealth} value={`${stats.mentalHealth}`} bar barValue={stats.mentalHealth} barColor="#3b82f6"
          danger={stats.mentalHealth < 25}
        />
      </div>
    </div>
  );
}

function StatPill({
  emoji,
  value,
  bar,
  barValue,
  barColor,
  danger,
}: {
  emoji: string;
  value: string;
  bar?: boolean;
  barValue?: number;
  barColor?: string;
  danger?: boolean;
}) {
  return (
    <div className={`stat-pill flex-col items-start ${danger ? "animate-shake" : ""}`}>
      <div className="flex items-center gap-1 w-full">
        <span>{emoji}</span>
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
    </div>
  );
}
