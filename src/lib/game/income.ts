import { GameState, QuarterlyIncome } from "./types";
import { computePassiveEffects, computeUpkeep } from "@/data/shop";

/**
 * Calculate quarterly passive income based on followers, reputation, flags,
 * and owned shop items. Six income streams minus expenses.
 *
 * Tuned for fast, rewarding progression:
 *   Early (1K-10K followers): $1K-$10K/quarter
 *   Mid (10K-500K):           $10K-$100K/quarter
 *   Late (500K+):             $100K-$1M+/quarter
 */
export function calculateQuarterlyIncome(state: GameState): QuarterlyIncome {
  const { followers, fame, reputation } = state.stats;
  const flags = state.flags;
  const passive = computePassiveEffects(state.purchases);

  // ---- 1. Ad Revenue: scales with followers ----
  let adRevenue = 0;
  if (followers >= 500) {
    if (followers < 10_000) adRevenue = Math.floor(followers * 0.08);
    else if (followers < 100_000) adRevenue = Math.floor(followers * 0.07);
    else if (followers < 500_000) adRevenue = Math.floor(followers * 0.05);
    else if (followers < 1_000_000) adRevenue = Math.floor(followers * 0.04);
    else adRevenue = Math.floor(followers * 0.03);
  }
  if (passive.adRevenueMultiplier) {
    adRevenue = Math.floor(adRevenue * (1 + passive.adRevenueMultiplier));
  }

  // ---- 2. Sponsorships: requires followers + reputation ----
  let sponsorships = 0;
  if (followers >= 2_000 && reputation > 15) {
    const base =
      followers < 100_000
        ? Math.floor(followers * 0.04)
        : followers < 1_000_000
          ? Math.floor(followers * 0.03)
          : Math.floor(followers * 0.02);

    const repMultiplier = Math.max(0.3, reputation / 50);
    sponsorships = Math.floor(base * repMultiplier);

    if (flags.includes("brandSafe")) sponsorships = Math.floor(sponsorships * 1.3);
  }
  if (passive.sponsorshipMultiplier) {
    sponsorships = Math.floor(sponsorships * (1 + passive.sponsorshipMultiplier));
  }

  // ---- 3. Livestream Donations: engagement-based ----
  let donations = 0;
  if (followers >= 2_000) {
    donations = Math.floor(Math.sqrt(followers) * 2);
    donations = Math.floor(donations * Math.max(0.5, reputation / 50));
  }

  // ---- 4. Subscriptions: loyal fan base ----
  let subscriptions = 0;
  if (followers >= 5_000) {
    subscriptions = Math.floor(followers * 0.01);
    subscriptions = Math.floor(subscriptions * Math.max(0.4, reputation / 50));
  }

  // ---- 5. Affiliate Income: requires brand trust ----
  let affiliates = 0;
  if (followers >= 5_000 && (flags.includes("brandSafe") || state.purchases.includes("sponsorship_agent"))) {
    affiliates = Math.floor(followers * 0.006 * Math.max(0.4, reputation / 50));
  }

  // ---- 6. Business Income: from owned businesses ----
  const businessIncome = Math.floor(passive.businessIncome || 0);

  // ---- Apply global income multiplier from purchases ----
  let totalIncome = adRevenue + sponsorships + donations + subscriptions + affiliates + businessIncome;
  if (passive.incomeMultiplier) {
    const bonus = Math.floor((totalIncome - businessIncome) * passive.incomeMultiplier);
    totalIncome += bonus;
    adRevenue += Math.floor(bonus * 0.4);
    sponsorships += Math.floor(bonus * 0.4);
    donations += Math.floor(bonus * 0.2);
  }

  // ---- Expenses (minimal — upkeep removed from most items) ----
  let lifestyleExpenses = 0;
  if (followers >= 100_000) lifestyleExpenses = 200;
  if (fame > 60) lifestyleExpenses += 300;
  if (fame > 80) lifestyleExpenses += 500;

  const itemUpkeep = computeUpkeep(state.purchases);
  const expenses = lifestyleExpenses + itemUpkeep;
  const net = totalIncome - expenses;

  return {
    adRevenue,
    sponsorships,
    donations,
    subscriptions,
    affiliates,
    businessIncome,
    totalIncome,
    itemUpkeep,
    lifestyleExpenses,
    expenses,
    net,
  };
}
