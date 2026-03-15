"use client";

import { useGame } from "@/state/game-context";
import { STAT_LABELS, STAT_ICONS } from "@/lib/game/constants";
import { formatFollowers, formatMoney, getTierName } from "@/lib/game/progression";
import { Badge } from "@/components/ui/badge";
import { StatKey } from "@/lib/game/types";

function StatProgress({ value, color }: { value: number; color: string }) {
  return (
    <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
      <div
        className={`h-full rounded-full transition-all duration-300 ${color}`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function StatBar() {
  const { state } = useGame();
  const { stats, week, careerTier } = state;

  const boundedStats: { key: StatKey; color: string }[] = [
    { key: "fame", color: "bg-yellow-500" },
    { key: "reputation", color: "bg-blue-500" },
    { key: "energy", color: "bg-green-500" },
    { key: "mentalHealth", color: "bg-purple-500" },
  ];

  return (
    <div className="bg-card border-b px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm font-semibold">
            Week {week}
          </Badge>
          <Badge className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
            {getTierName(careerTier)}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="font-medium">
            {STAT_ICONS.followers} {formatFollowers(stats.followers)}
          </span>
          <span className="font-medium">
            {STAT_ICONS.money} {formatMoney(stats.money)}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {boundedStats.map(({ key, color }) => (
          <div key={key} className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {STAT_ICONS[key]} {STAT_LABELS[key]}
              </span>
              <span className="font-medium text-foreground">{stats[key]}</span>
            </div>
            <StatProgress value={stats[key]} color={color} />
          </div>
        ))}
      </div>
    </div>
  );
}
