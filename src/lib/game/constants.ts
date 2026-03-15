import { CareerTier, CareerTierDef, Stats } from "./types";

export const CAREER_TIERS: CareerTierDef[] = [
  { id: "new_creator", name: "New Creator", emoji: "📱", minFollowers: 0 },
  { id: "micro_influencer", name: "Micro Influencer", emoji: "📈", minFollowers: 10_000 },
  { id: "rising_influencer", name: "Rising Influencer", emoji: "🚀", minFollowers: 100_000 },
  { id: "internet_star", name: "Internet Star", emoji: "⭐", minFollowers: 500_000 },
  { id: "celebrity", name: "Celebrity", emoji: "👑", minFollowers: 1_000_000 },
  { id: "global_celebrity", name: "Global Icon", emoji: "🌍", minFollowers: 5_000_000 },
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
  followers: 500,
  fame: 5,
  reputation: 50,
  money: 1500,
  energy: 80,
  mentalHealth: 75,
};

export const STAT_LABELS: Record<keyof Stats, string> = {
  followers: "Followers",
  fame: "Fame",
  reputation: "Rep",
  money: "Money",
  energy: "Energy",
  mentalHealth: "Mental",
};

export const STAT_EMOJI: Record<keyof Stats, string> = {
  followers: "👥",
  fame: "⭐",
  reputation: "🛡️",
  money: "💰",
  energy: "⚡",
  mentalHealth: "🧠",
};

export const MAX_RECENT_EVENTS = 12;
export const STORAGE_KEY = "influencer-life-save-v3";

// Game length in quarters (each turn = 1 quarter = 3 months)
export const QUICK_GAME_TURNS = 12;  // 3 years
export const FULL_GAME_TURNS = 40;   // 10 years

// Boost chance per turn
export const BOOST_CHANCE = 0.35;

// Recovery per quarter (higher since each turn = 3 months)
export const ENERGY_RECOVERY = 18;
export const MENTAL_HEALTH_RECOVERY = 8;

// Event category colors for UI
export const EVENT_COLORS: Record<string, string> = {
  viral: "#10b981",    // emerald
  drama: "#ef4444",    // red
  brand: "#f59e0b",    // amber
  celebrity: "#a855f7", // purple
  platform: "#3b82f6",  // blue
  lifestyle: "#ec4899", // pink
  failure: "#6b7280",   // gray
  recovery: "#14b8a6",  // teal
};

export const EVENT_EMOJI: Record<string, string> = {
  viral: "🔥",
  drama: "😱",
  brand: "🤝",
  celebrity: "🌟",
  platform: "📱",
  lifestyle: "🏖️",
  failure: "💔",
  recovery: "💪",
};
