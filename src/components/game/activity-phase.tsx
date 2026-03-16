"use client";

import { useGame } from "@/state/game-context";
import { workActivities, lifestyleActivities } from "@/data/activities";
import { STAT_EMOJI } from "@/lib/game/constants";
import { formatQuarter } from "@/lib/game/progression";
import { Stats, QuarterlyActivity } from "@/lib/game/types";

export function ActivityPhase() {
  const { state, selectActivity } = useGame();
  const income = state.quarterlyIncome;
  const isFirstTurn = state.week === 1;

  // Filter lifestyle activities based on current money and followers
  const availableLifestyle = lifestyleActivities.filter((a) => {
    if (a.minMoney && state.stats.money < a.minMoney) return false;
    if (a.minFollowers && state.stats.followers < a.minFollowers) return false;
    return true;
  });

  return (
    <div className="animate-scale-in" key={`activity-${state.week}`}>
      {/* Income Report (not shown on first turn) */}
      {!isFirstTurn && income && (income.totalIncome > 0 || income.expenses > 0) && (
        <div className="game-card p-4 sm:p-5 mb-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{"\uD83D\uDCB0"}</span>
              <h3 className="font-bold text-gray-900 text-sm">Quarterly Income</h3>
            </div>
            <span className="text-xs text-gray-400 font-semibold">{formatQuarter(state.week)}</span>
          </div>
          <div className="space-y-1.5 text-sm">
            {income.adRevenue > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">Ad Revenue</span>
                <span className="font-semibold text-gray-700">${income.adRevenue.toLocaleString()}</span>
              </div>
            )}
            {income.sponsorships > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">Sponsorships</span>
                <span className="font-semibold text-gray-700">${income.sponsorships.toLocaleString()}</span>
              </div>
            )}
            {income.expenses > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">Expenses</span>
                <span className="font-semibold text-red-500">-${income.expenses.toLocaleString()}</span>
              </div>
            )}
            <div className="border-t border-gray-100 pt-1.5 flex justify-between">
              <span className="font-bold text-gray-700">Net</span>
              <span className={`font-bold ${income.net >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                {income.net >= 0 ? "+" : "-"}${Math.abs(income.net).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Work Activities */}
      <div className="game-card p-4 sm:p-5">
        <h3 className="font-bold text-gray-900 text-sm mb-0.5">
          {isFirstTurn ? "\uD83C\uDFAC Your career begins!" : "What\u2019s your focus this quarter?"}
        </h3>
        {isFirstTurn && (
          <p className="text-gray-400 text-xs mb-2">Pick how to spend your first quarter</p>
        )}

        <div className="grid grid-cols-2 gap-2 mt-3">
          {workActivities.map((activity) => (
            <ActivityButton key={activity.id} activity={activity} />
          ))}
        </div>

        {/* Lifestyle Spending (unlocks with money) */}
        {availableLifestyle.length > 0 && (
          <>
            <div className="flex items-center gap-2 mt-4 mb-2">
              <div className="h-px flex-1 bg-gray-100" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {"\u2728"} Lifestyle
              </span>
              <div className="h-px flex-1 bg-gray-100" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {availableLifestyle.map((activity) => (
                <ActivityButton key={activity.id} activity={activity} isLifestyle />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ActivityButton({ activity, isLifestyle }: { activity: QuarterlyActivity; isLifestyle?: boolean }) {
  const { state, selectActivity } = useGame();
  const effects = activity.getEffects(state);

  return (
    <button
      onClick={() => selectActivity(activity)}
      className={`activity-btn ${isLifestyle ? "activity-btn-lifestyle" : ""}`}
    >
      <span className="text-2xl mb-1">{activity.emoji}</span>
      <span className="font-bold text-xs text-gray-800">{activity.name}</span>
      <span className="text-[10px] text-gray-400 leading-tight">{activity.description}</span>
      {/* Mini stat preview */}
      <div className="flex flex-wrap justify-center gap-1 mt-1.5">
        {Object.entries(effects)
          .filter(([, v]) => v !== 0)
          .map(([key, val]) => {
            const v = val as number;
            const emoji = STAT_EMOJI[key as keyof Stats] || "";
            const display =
              Math.abs(v) >= 1000
                ? `${v > 0 ? "+" : ""}${(v / 1000).toFixed(Math.abs(v) >= 10000 ? 0 : 1)}K`
                : `${v > 0 ? "+" : ""}${v}`;
            return (
              <span
                key={key}
                className={`text-[9px] font-bold ${v > 0 ? "text-emerald-500" : "text-red-400"}`}
              >
                {emoji}{display}
              </span>
            );
          })}
      </div>
    </button>
  );
}
