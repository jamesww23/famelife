"use client";

import { useState } from "react";
import { useGame } from "@/state/game-context";
import { workActivities, lifestyleActivities, flexActivities } from "@/data/activities";
import { STAT_EMOJI } from "@/lib/game/constants";
import { formatQuarter, formatMoney } from "@/lib/game/progression";
import { Stats, QuarterlyActivity, ActivityTier } from "@/lib/game/types";
import { playTap, playSwoosh, playMoney } from "@/lib/sounds";
import { ShopPanel } from "./shop-panel";

const TUTORIAL_SEEN_KEY = "fame-life-tutorial-seen";

function readTutorialSeen(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(TUTORIAL_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

export function ActivityPhase() {
  const { state, selectActivity } = useGame();
  const income = state.quarterlyIncome;
  const isFirstTurn = state.week === 1;
  const [expandedActivity, setExpandedActivity] = useState<QuarterlyActivity | null>(null);
  const [showShop, setShowShop] = useState(false);

  // First-run tutorial card: shows on turn 1 only, once per device (localStorage flag).
  // Derived state: `tutorialDismissed` is the only persisted bit; whether to show
  // is a function of (isFirstTurn && !dismissed). No effect needed.
  const [tutorialDismissed, setTutorialDismissed] = useState<boolean>(() => readTutorialSeen());
  const showTutorial = isFirstTurn && !tutorialDismissed;
  const dismissTutorial = () => {
    playTap();
    setTutorialDismissed(true);
    try { window.localStorage.setItem(TUTORIAL_SEEN_KEY, "1"); } catch { /* ok */ }
  };

  // Filter all lifestyle activities (including flex) based on current money, followers, and purchases
  const allLifestyle = [...lifestyleActivities, ...flexActivities];
  const availableLifestyle = allLifestyle.filter((a) => {
    if (a.minMoney && state.stats.money < a.minMoney) return false;
    if (a.minFollowers && state.stats.followers < a.minFollowers) return false;
    if (a.requiresPurchases) {
      for (const req of a.requiresPurchases) {
        if (!state.purchases.includes(req)) return false;
      }
    }
    return true;
  });

  // Handle selecting a tier from an expanded activity
  const handleTierSelect = (activity: QuarterlyActivity, tier: ActivityTier) => {
    playMoney();
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
    playTap();
    if (activity.tiers && activity.tiers.length > 0) {
      setExpandedActivity(activity);
    } else {
      selectActivity(activity);
    }
  };

  // ---- Shop View ----
  if (showShop) {
    return <ShopPanel onClose={() => setShowShop(false)} />;
  }

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
            ← Back
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
                  <span className="text-sm text-gray-300 shrink-0">🔒</span>
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
        <div className="game-card income-card p-4 sm:p-5 mb-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">💰</span>
              <h3 className="font-bold text-gray-900 text-sm">Quarterly Income</h3>
            </div>
            <span className="text-xs text-gray-400 font-semibold">{formatQuarter(state.week)}</span>
          </div>
          <div className="space-y-1.5 text-sm">
            {income.adRevenue > 0 && (
              <IncomeRow label="Ad Revenue" amount={income.adRevenue} />
            )}
            {income.sponsorships > 0 && (
              <IncomeRow label="Sponsorships" amount={income.sponsorships} />
            )}
            {income.donations > 0 && (
              <IncomeRow label="Donations" amount={income.donations} />
            )}
            {income.subscriptions > 0 && (
              <IncomeRow label="Subscriptions" amount={income.subscriptions} />
            )}
            {income.affiliates > 0 && (
              <IncomeRow label="Affiliates" amount={income.affiliates} />
            )}
            {income.businessIncome > 0 && (
              <IncomeRow label="Business" amount={income.businessIncome} />
            )}
            {income.lifestyleExpenses > 0 && (
              <IncomeRow label="Lifestyle" amount={-income.lifestyleExpenses} negative />
            )}
            {income.itemUpkeep > 0 && (
              <IncomeRow label="Upkeep" amount={-income.itemUpkeep} negative />
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

      {/* First-run tutorial — turn 1 only, dismissible, remembered per-device */}
      {showTutorial && (
        <div
          className="game-card p-4 sm:p-5 mb-3 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white animate-scale-in"
          role="region"
          aria-label="How to play"
        >
          <div className="flex items-start gap-2.5 mb-2">
            <span className="text-2xl shrink-0" aria-hidden="true">👋</span>
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-sm sm:text-base text-gray-900 leading-tight">How it works</h3>
              <p className="text-xs text-gray-600 leading-snug mt-0.5">
                You&apos;ve got <strong>40 quarters</strong> (10 years). Each quarter: pick one action, then respond to whatever happens.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-[10px] mb-3">
            <TutorialStatHint emoji={STAT_EMOJI.followers} label="Followers" hint="grows your reach" />
            <TutorialStatHint emoji={STAT_EMOJI.money} label="Money" hint="buy upgrades" />
            <TutorialStatHint emoji={STAT_EMOJI.fame} label="Fame" hint="opens opportunities" />
            <TutorialStatHint emoji={STAT_EMOJI.reputation} label="Rep" hint="protects you from scandals" />
            <TutorialStatHint emoji={STAT_EMOJI.energy} label="Energy" hint="don't burn out" />
            <TutorialStatHint emoji={STAT_EMOJI.mentalHealth} label="Mental" hint="stay grounded" />
          </div>

          <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-3">
            <span aria-hidden="true">⚠️</span>
            <span>
              Stats below 20 trigger burnout events. Hit 0 money and it&apos;s over.
            </span>
          </div>

          <button
            type="button"
            onClick={dismissTutorial}
            className="w-full py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-bold text-sm active:scale-[0.98] transition-all min-h-[44px]"
          >
            Got it
          </button>
        </div>
      )}

      {/* Work Activities */}
      <div className="game-card p-4 sm:p-5">
        <div className="flex items-center justify-between mb-0.5">
          <h3 className="font-bold text-gray-900 text-sm">
            {isFirstTurn ? "🎬 Your career begins!" : "What\u2019s your focus this quarter?"}
          </h3>
          {/* Shop button */}
          <button
            onClick={() => { playTap(); setShowShop(true); }}
            className="flex items-center gap-1 px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg text-[10px] font-bold transition-colors"
          >
            🛒 Shop
            {state.purchases.length > 0 && (
              <span className="bg-purple-500 text-white text-[8px] px-1 py-0.5 rounded-full ml-0.5">
                {state.purchases.length}
              </span>
            )}
          </button>
        </div>
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
                ✨ Lifestyle
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
                    <span className="text-[9px] font-bold text-amber-500 mt-1">Tap to choose →</span>
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

function TutorialStatHint({ emoji, label, hint }: { emoji: string; label: string; hint: string }) {
  return (
    <div className="bg-white/70 border border-purple-100 rounded-lg p-1.5 text-center">
      <div className="flex items-center justify-center gap-0.5">
        <span aria-hidden="true">{emoji}</span>
        <span className="font-bold text-gray-800 text-[10px]">{label}</span>
      </div>
      <div className="text-gray-500 leading-tight mt-0.5">{hint}</div>
    </div>
  );
}

function IncomeRow({ label, amount, negative }: { label: string; amount: number; negative?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className={`font-semibold ${negative ? "text-red-500" : "text-gray-700"}`}>
        {negative ? "-" : ""}${Math.abs(amount).toLocaleString()}
      </span>
    </div>
  );
}

function WorkActivityButton({ activity }: { activity: QuarterlyActivity }) {
  const { state, selectActivity } = useGame();
  const effects = activity.getEffects(state);

  return (
    <button
      onClick={() => { playSwoosh(); selectActivity(activity); }}
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
