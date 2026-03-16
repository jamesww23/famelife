import { GameState, QuarterlyIncome } from "./types";

/**
 * Calculate quarterly passive income based on followers, reputation, and flags.
 * Influencers earn from ad revenue and sponsorships, minus living/business expenses.
 */
export function calculateQuarterlyIncome(state: GameState): QuarterlyIncome {
  const { followers, fame, reputation } = state.stats;
  const flags = state.flags;

  // ---- Ad Revenue: scales with followers, diminishing returns at scale ----
  let adRevenue = 0;
  if (followers >= 1_000) {
    if (followers < 10_000) adRevenue = Math.floor(followers * 0.01);
    else if (followers < 100_000) adRevenue = Math.floor(followers * 0.012);
    else if (followers < 500_000) adRevenue = Math.floor(followers * 0.008);
    else if (followers < 1_000_000) adRevenue = Math.floor(followers * 0.006);
    else adRevenue = Math.floor(followers * 0.004);
  }

  // ---- Sponsorship Income: requires followers + reputation ----
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
    if (flags.includes("hasManager")) sponsorships = Math.floor(sponsorships * 1.25);
  }

  const totalIncome = adRevenue + sponsorships;

  // ---- Expenses: scale with lifestyle and business ----
  let expenses = 0;
  if (followers >= 10_000) expenses = 200;
  if (followers >= 100_000) expenses = 500;
  if (fame > 50) expenses += 500;
  if (fame > 75) expenses += 1000;
  if (flags.includes("ownsStudio")) expenses += 2500;
  if (flags.includes("hasManager")) expenses += Math.floor(totalIncome * 0.15);

  const net = totalIncome - expenses;

  return { adRevenue, sponsorships, totalIncome, expenses, net };
}
