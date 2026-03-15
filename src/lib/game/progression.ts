import { CAREER_TIERS, TIER_ORDER } from "./constants";
import { CareerTier, GameState } from "./types";

export function getTierForFollowers(followers: number): CareerTier {
  let tier: CareerTier = "new_creator";
  for (const t of CAREER_TIERS) {
    if (followers >= t.minFollowers) tier = t.id;
  }
  return tier;
}

export function getTierName(tier: CareerTier): string {
  return CAREER_TIERS.find((t) => t.id === tier)?.name ?? "Unknown";
}

export function getTierIndex(tier: CareerTier): number {
  return TIER_ORDER.indexOf(tier);
}

export function isTierAtLeast(current: CareerTier, required: CareerTier): boolean {
  return getTierIndex(current) >= getTierIndex(required);
}

export function isTierAtMost(current: CareerTier, max: CareerTier): boolean {
  return getTierIndex(current) <= getTierIndex(max);
}

export function checkGameOver(state: GameState): string | null {
  if (state.stats.mentalHealth <= 0) return "Mental health collapse. You burned out completely.";
  if (state.stats.reputation <= 0 && state.stats.fame > 30) return "Permanently cancelled. Your reputation hit zero.";
  if (state.stats.money < -5000) return "Bankruptcy. You couldn't pay your debts.";
  if (state.stats.energy <= 0 && state.stats.mentalHealth < 20) return "Complete exhaustion. You had to leave the internet.";
  if (state.week > 260) return "Retirement. After 5 years, you stepped away from the spotlight.";
  return null;
}

export function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function formatMoney(n: number): string {
  if (n < 0) return `-$${Math.abs(n).toLocaleString()}`;
  return `$${n.toLocaleString()}`;
}
