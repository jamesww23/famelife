"use client";

import { useState } from "react";
import { useGame } from "@/state/game-context";
import { workActivities, lifestyleActivities } from "@/data/activities";
import { STAT_EMOJI } from "@/lib/game/constants";
import { formatQuarter, formatMoney } from "@/lib/game/progression";
import { Stats, QuarterlyActivity, ActivityTier } from "@/lib/game/types";

export function ActivityPhase() {
  const { state, selectActivity } = useGame();
  const income = state.quarterlyIncome;
  const isFirstTurn = state.week === 1;
  const [expandedActivity, setExpandedActivity] = useState<QuarterlyActivity | null>(null);

  // Filter lifestyle activities based on current money and followers
  const availableLifestyle = lifestyleActivities.filter((a) => {
    if (a.minMoney && state.stats.money < a.minMoney) return false;
    if (a.minFollowers && state.stats.followers < a.minFollowers) return false;
    return true;
  });

  // Handle selecting a tier from an expanded activity
  const handleTierSelect = (activity: QuarterlyActivity, tier: ActivityTier) => {
    selectActivity({
      ...activity,
      name: `${activity.name}: ${tier.name}`,
      emoji: tier.emoji,
      getEffects: () => tier.effects,
    });
    setExpandedActivity(null);
  };

  // Handle clicking a lifestyle activity
  const handleLifestyleClick = (activity: QuarterlyActivity) => {
    if (activity.tiers && activity.tiers.length > 0) {
      setExpandedActivity(activity);
    } else {
      selectActivity(activity);
    }
  };

  // ---- Tier Selection View ----
  if (expandedActivity && expandedActivity.tiers) {
    const affordableTiers = expandedActivity.tiers.filter((tier) => {
      const cost = Math.abs(tier.effects.money ?? 0);
      return state.stats.money >= cost;
    });
    const lockedTiers = expandedActivity.tiers.filter((tier) => {
      const cost = Math.abs(tier.effects.money ?? 0);
      return state.stats.money < cost;
    });

    return (
      <div className="animate-scale-in" key={`tier-${expandedActivity.id}`}>
        <div className="game-card p-4 sm:p-5">
          <button
            onClick={() => setExpandedActivity(null)}
            className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors mb-3"
          >
            {"\u2190"} Back
          </button>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">{expandedActivity.emoji}</span>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">{expandedActivity.name}</h3>
              <p className="text-[10px] text-gray-400">Pick your style</p>
            </div>
          </div>

          <div className="space-y-2">
            {affordableTiers.map((tier) => {
              const cost = Math.abs(tier.effects.money ?? 0);
              return (
                <button
                  key={tier.id}
                  onClick={() => handleTierSelect(expandedActivity, tier)}
                  className="tier-btn"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-2xl shrink-0">{tier.emoji}</span>
                    <div className="text-left min-w-0">
                      <div className="font-bold text-sm text-gray-800">{tier.name}</div>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {Object.entries(tier.effects)
                          .filter(([k, v]) => k !== "money" && v !== 0)
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
                    </div>
                  </div>
                  <span className="text-sm font-bold text-red-500 shrink-0">
                    {formatMoney(-cost)}
                  </span>
                </button>
              );
            })}

            {lockedTiers.map((tier) => {
              const cost = Math.abs(tier.effects.money ?? 0);
              return (
                <div key={tier.id} className="tier-btn tier-btn-locked">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-2xl shrink-0 opacity-40">{tier.emoji}</span>
                    <div className="text-left min-w-0">
                      <div className="font-bold text-sm text-gray-400">{tier.name}</div>
                      <div className="text-[10px] text-gray-300">Need {formatMoney(cost)}</div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-300 shrink-0">{"\uD83D\uDD12"}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ---- Main Activity View ----
  return (
    <div className="animate-scale-in" key={`activity-${state.week}`}>
      {/* Income Report */}
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
            <WorkActivityButton key={activity.id} activity={activity} />
          ))}
        </div>

        {/* Lifestyle Spending */}
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
                <button
                  key={activity.id}
                  onClick={() => handleLifestyleClick(activity)}
                  className="activity-btn activity-btn-lifestyle"
                >
                  <span className="text-2xl mb-1">{activity.emoji}</span>
                  <span className="font-bold text-xs text-gray-800">{activity.name}</span>
                  <span className="text-[10px] text-gray-400 leading-tight">{activity.description}</span>
                  {activity.tiers && (
                    <span className="text-[9px] font-bold text-amber-500 mt-1">Tap to choose {"\u2192"}</span>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function WorkActivityButton({ activity }: { activity: QuarterlyActivity }) {
  const { state, selectActivity } = useGame();
  const effects = activity.getEffects(state);

  return (
    <button
      onClick={() => selectActivity(activity)}
      className="activity-btn"
    >
      <span className="text-2xl mb-1">{activity.emoji}</span>
      <span className="font-bold text-xs text-gray-800">{activity.name}</span>
      <span className="text-[10px] text-gray-400 leading-tight">{activity.description}</span>
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
