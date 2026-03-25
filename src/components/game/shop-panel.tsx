"use client";

import { useState } from "react";
import { useGame } from "@/state/game-context";
import { shopItems, SHOP_CATEGORIES, canPurchase, computeUpkeep } from "@/data/shop";
import { ShopItem, ShopCategory, PassiveEffects } from "@/lib/game/types";
import { STAT_EMOJI } from "@/lib/game/constants";
import { formatMoney } from "@/lib/game/progression";
import { playTap, playMoney } from "@/lib/sounds";
import { Stats } from "@/lib/game/types";

export function ShopPanel({ onClose }: { onClose: () => void }) {
  const { state, buyItem } = useGame();
  const [activeCategory, setActiveCategory] = useState<ShopCategory>("growth");
  const [justBought, setJustBought] = useState<string | null>(null);

  const categoryItems = shopItems.filter((i) => i.category === activeCategory);
  const totalUpkeep = computeUpkeep(state.purchases);

  const handleBuy = (item: ShopItem) => {
    playMoney();
    buyItem(item);
    setJustBought(item.id);
    setTimeout(() => setJustBought(null), 1200);
  };

  return (
    <div className="animate-scale-in">
      <div className="game-card p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🛒</span>
            <h3 className="font-bold text-gray-900 text-sm">Shop</h3>
          </div>
          <div className="flex items-center gap-3">
            {totalUpkeep > 0 && (
              <span className="text-[10px] font-semibold text-red-400">
                Upkeep: {formatMoney(totalUpkeep)}/q
              </span>
            )}
            <button
              onClick={() => { playTap(); onClose(); }}
              className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-1 mb-3 overflow-x-auto pb-1 -mx-1 px-1">
          {SHOP_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const ownedCount = shopItems.filter(
              (i) => i.category === cat.id && state.purchases.includes(i.id)
            ).length;
            const totalCount = shopItems.filter((i) => i.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => { playTap(); setActiveCategory(cat.id as ShopCategory); }}
                className={`shrink-0 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                  isActive
                    ? "bg-purple-500 text-white shadow-sm"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {cat.emoji} {cat.name}
                {ownedCount > 0 && (
                  <span className="ml-1 opacity-70">
                    {ownedCount}/{totalCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Items */}
        <div className="space-y-2">
          {categoryItems.map((item) => {
            const owned = state.purchases.includes(item.id);
            const affordable = canPurchase(
              item,
              state.stats.money,
              state.stats.followers,
              state.stats.fame,
              state.purchases,
            );
            const meetsReqs = !item.requires?.purchases ||
              item.requires.purchases.every((r) => state.purchases.includes(r));
            const meetsFollowers = !item.requires?.minFollowers || state.stats.followers >= item.requires.minFollowers;
            const meetsFame = !item.requires?.minFame || state.stats.fame >= item.requires.minFame;
            const locked = !meetsReqs || !meetsFollowers || !meetsFame;
            const wasBought = justBought === item.id;

            return (
              <div
                key={item.id}
                className={`rounded-xl border p-3 transition-all ${
                  owned
                    ? "bg-emerald-50 border-emerald-200"
                    : wasBought
                      ? "bg-emerald-50 border-emerald-300 scale-[0.98]"
                      : locked
                        ? "bg-gray-50 border-gray-100 opacity-60"
                        : affordable
                          ? "bg-white border-gray-200 hover:border-purple-300"
                          : "bg-white border-gray-100 opacity-75"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-800">{item.name}</span>
                      {owned && (
                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                          OWNED
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 leading-tight mt-0.5">
                      {item.description}
                    </p>

                    {/* Effects preview */}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {item.onPurchaseEffects &&
                        Object.entries(item.onPurchaseEffects)
                          .filter(([k, v]) => k !== "money" && v !== 0)
                          .map(([key, val]) => {
                            const v = val as number;
                            const emoji = STAT_EMOJI[key as keyof Stats] || "";
                            const display = formatStatVal(v);
                            return (
                              <span
                                key={key}
                                className={`text-[9px] font-bold ${v > 0 ? "text-emerald-500" : "text-red-400"}`}
                              >
                                {emoji}{display}
                              </span>
                            );
                          })}
                      {item.passiveEffects && (
                        <PassiveTag effects={item.passiveEffects} />
                      )}
                    </div>

                    {/* Locked reason */}
                    {locked && !owned && (
                      <div className="text-[9px] text-gray-400 mt-1">
                        {!meetsReqs && "🔒 Requires: " + item.requires!.purchases!.map(r => shopItems.find(i => i.id === r)?.name || r).join(", ")}
                        {meetsReqs && !meetsFollowers && `🔒 Need ${formatFollowers(item.requires!.minFollowers!)} followers`}
                        {meetsReqs && meetsFollowers && !meetsFame && `🔒 Need ${item.requires!.minFame} fame`}
                      </div>
                    )}
                  </div>

                  {/* Price + Buy */}
                  {!owned && (
                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold text-gray-800">
                        {formatMoney(item.cost)}
                      </div>
                      {item.upkeep > 0 && (
                        <div className="text-[9px] text-red-400 font-semibold">
                          +{formatMoney(item.upkeep)}/q
                        </div>
                      )}
                      {affordable && !locked && (
                        <button
                          onClick={() => handleBuy(item)}
                          className="mt-1.5 px-3 py-1 bg-purple-500 text-white text-[10px] font-bold rounded-lg hover:bg-purple-600 active:scale-95 transition-all"
                        >
                          Buy
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PassiveTag({ effects }: { effects: PassiveEffects }) {
  const labels: string[] = [];
  if (effects.followerGainMultiplier) labels.push(`+${Math.round((effects.followerGainMultiplier as number) * 100)}% growth`);
  if (effects.incomeMultiplier) labels.push(`+${Math.round((effects.incomeMultiplier as number) * 100)}% income`);
  if (effects.adRevenueMultiplier) labels.push(`+${Math.round((effects.adRevenueMultiplier as number) * 100)}% ad rev`);
  if (effects.sponsorshipMultiplier) labels.push(`+${Math.round((effects.sponsorshipMultiplier as number) * 100)}% sponsors`);
  if (effects.businessIncome) labels.push(`+${formatMoney(effects.businessIncome as number)}/q`);
  if (effects.scandalReduction) labels.push(`-${Math.round((effects.scandalReduction as number) * 100)}% scandal dmg`);
  if (effects.energyRecoveryBonus) labels.push(`+${effects.energyRecoveryBonus} ⚡/q`);
  if (effects.mentalHealthRecoveryBonus) labels.push(`+${effects.mentalHealthRecoveryBonus} 🧠/q`);

  if (labels.length === 0) return null;
  return (
    <span className="text-[9px] font-bold text-purple-500">
      {labels.join(" · ")}
    </span>
  );
}

function formatStatVal(v: number): string {
  if (Math.abs(v) >= 1000) {
    return `${v > 0 ? "+" : ""}${(v / 1000).toFixed(Math.abs(v) >= 10000 ? 0 : 1)}K`;
  }
  return `${v > 0 ? "+" : ""}${v}`;
}

function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.floor(n / 1_000)}K`;
  return `${n}`;
}
