import { CareerTier, CareerTierDef, Stats } from "./types";

export const CAREER_TIERS: CareerTierDef[] = [
  { id: "new_creator", name: "New Creator", minFollowers: 0 },
  { id: "micro_influencer", name: "Micro Influencer", minFollowers: 10_000 },
  { id: "rising_influencer", name: "Rising Influencer", minFollowers: 100_000 },
  { id: "internet_star", name: "Internet Star", minFollowers: 500_000 },
  { id: "celebrity", name: "Celebrity", minFollowers: 1_000_000 },
  { id: "global_celebrity", name: "Global Celebrity", minFollowers: 5_000_000 },
];

export const TIER_ORDER: CareerTier[] = [
  "new_creator",
  "micro_influencer",
  "rising_influencer",
  "internet_star",
  "celebrity",
  "global_celebrity",
];

export const DEFAULT_STATS: Stats = {
  followers: 100,
  fame: 5,
  reputation: 50,
  money: 500,
  energy: 80,
  mentalHealth: 75,
};

export const STAT_LABELS: Record<keyof Stats, string> = {
  followers: "Followers",
  fame: "Fame",
  reputation: "Reputation",
  money: "Money",
  energy: "Energy",
  mentalHealth: "Mental Health",
};

export const STAT_ICONS: Record<keyof Stats, string> = {
  followers: "👥",
  fame: "⭐",
  reputation: "🛡️",
  money: "💰",
  energy: "⚡",
  mentalHealth: "🧠",
};

export const MAX_RECENT_EVENTS = 10;
export const STORAGE_KEY = "influencer-life-save";
export const BEST_RUN_KEY = "influencer-life-best";
