import { GameState, QuarterlyIncome } from "./types";
import { computePassiveEffects, computeUpkeep } from "@/data/shop";

/**
 * Calculate quarterly passive income based on followers, reputation, flags,
 * and owned shop items. Six income streams minus expenses.
 */
export function calculateQuarterlyIncome(state: GameState): QuarterlyIncome {
  const { followers, fame, reputation } = state.stats;
  const flags = state.flags;
  const passive = computePassiveEffects(state.purchases);

  // ---- 1. Ad Revenue: scales with followers, diminishing returns ----
  let adRevenue = 0;
  if (followers >= 1_000) {
    if (followers < 10_000) adRevenue = Math.floor(followers * 0.01);
    else if (followers < 100_000) adRevenue = Math.floor(followers * 0.012);
    else if (followers < 500_000) adRevenue = Math.floor(followers * 0.008);
    else if (followers < 1_000_000) adRevenue = Math.floor(followers * 0.006);
    else adRevenue = Math.floor(followers * 0.004);
  }
  // Apply ad revenue multiplier from purchases
  if (passive.adRevenueMultiplier) {
    adRevenue = Math.floor(adRevenue * (1 + passive.adRevenueMultiplier));
  }

  // ---- 2. Sponsorships: requires followers + reputation ----
  let sponsorships = 0;
  if (followers >= 5_000 && reputation > 20) {
    const base =
      followers < 100_000
        ? Math.floor(followers * 0.006)
        : followers < 1_000_000
          ? Math.floor(followers * 0.005)
          : Math.floor(followers * 0.003);

    const repMultiplier = Math.max(0.2, reputation / 70);
    sponsorships = Math.floor(base * repMultiplier);

    if (flags.includes("brandSafe")) sponsorships = Math.floor(sponsorships * 1.2);
  }
  // Apply sponsorship multiplier from purchases (manager, agent, etc.)
  if (passive.sponsorshipMultiplier) {
    sponsorships = Math.floor(sponsorships * (1 + passive.sponsorshipMultiplier));
  }

  // ---- 3. Livestream Donations: engagement-based ----
  let donations = 0;
  if (followers >= 5_000) {
    donations = Math.floor(Math.sqrt(followers) * 0.3);
    // Reputation boosts donations (fans tip more when they trust you)
    donations = Math.floor(donations * Math.max(0.5, reputation / 60));
  }

  // ---- 4. Subscriptions: loyal fan base ----
  let subscriptions = 0;
  if (followers >= 10_000) {
    subscriptions = Math.floor(followers * 0.0015);
    // Higher reputation = higher sub retention
    subscriptions = Math.floor(subscriptions * Math.max(0.3, reputation / 50));
  }

  // ---- 5. Affiliate Income: requires brand trust ----
  let affiliates = 0;
  if (followers >= 10_000 && (flags.includes("brandSafe") || state.purchases.includes("sponsorship_agent"))) {
    affiliates = Math.floor(followers * 0.001 * Math.max(0.3, reputation / 60));
  }

  // ---- 6. Business Income: from owned businesses ----
  const businessIncome = Math.floor(passive.businessIncome || 0);

  // ---- Apply global income multiplier from purchases ----
  let totalIncome = adRevenue + sponsorships + donations + subscriptions + affiliates + businessIncome;
  if (passive.incomeMultiplier) {
    const bonus = Math.floor((totalIncome - businessIncome) * passive.incomeMultiplier);
    totalIncome += bonus;
    // Distribute the bonus proportionally to the largest stream for display
    adRevenue += Math.floor(bonus * 0.4);
    sponsorships += Math.floor(bonus * 0.4);
    donations += Math.floor(bonus * 0.2);
  }

  // ---- Expenses ----
  // Lifestyle expenses scale with fame and followers
  let lifestyleExpenses = 0;
  if (followers >= 10_000) lifestyleExpenses = 200;
  if (followers >= 100_000) lifestyleExpenses = 500;
  if (fame > 50) lifestyleExpenses += 500;
  if (fame > 75) lifestyleExpenses += 1000;

  // Item upkeep from purchases
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
