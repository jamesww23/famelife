import { CAREER_TIERS, TIER_ORDER, FULL_GAME_TURNS } from "./constants";
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

export function getTierEmoji(tier: CareerTier): string {
  return CAREER_TIERS.find((t) => t.id === tier)?.emoji ?? "📱";
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

export function getMaxTurns(_state: GameState): number {
  return FULL_GAME_TURNS;
}

/** Convert a 1-based turn number to "Q1 Year 1" format. */
export function formatQuarter(turn: number): string {
  const year = Math.ceil(turn / 4);
  const quarter = ((turn - 1) % 4) + 1;
  return `Q${quarter} Year ${year}`;
}

export function checkGameOver(state: GameState): string | null {
  if (state.stats.mentalHealth <= 0)
    return "You burned out completely. Mental health hit zero.";
  if (state.stats.reputation <= 0 && state.stats.fame > 30)
    return "Permanently cancelled. Your reputation never recovered.";
  if (state.stats.money < -30000)
    return "Bankruptcy. The debts caught up with you.";
  if (state.stats.energy <= 0 && state.stats.mentalHealth < 20)
    return "Complete exhaustion. You had to quit the internet.";
  if (state.week >= getMaxTurns(state)) {
    const years = Math.ceil(state.week / 4);
    return `After ${years} years, you retired from content creation.`;
  }
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
