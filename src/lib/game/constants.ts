import { CareerTier, CareerTierDef, CareerPhase, Stats, RiskTag } from "./types";

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
  followers: 1000,
  fame: 5,
  reputation: 50,
  money: 5000,
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

/**
 * 3D-rendered stat icon PNGs (extracted from the art direction reference set).
 * Used in prominent displays (stat header, event outcomes). Inline uses keep
 * STAT_EMOJI as the fallback — system emoji read better at small sizes.
 * Paths are relative to `public/` so Next.js serves them directly.
 */
export const STAT_ICON_URL: Record<keyof Stats, string> = {
  followers: "/ui/stat-icons/followers.png",
  fame: "/ui/stat-icons/fame.png",
  reputation: "/ui/stat-icons/reputation.png",
  money: "/ui/stat-icons/money.png",
  energy: "/ui/stat-icons/energy.png",
  mentalHealth: "/ui/stat-icons/mental.png",
};

export const MAX_RECENT_EVENTS = 12;
/**
 * Save key for the active run. Bump the version suffix when the GameState
 * shape changes incompatibly (the load path will reject mismatched versions
 * and start a fresh run rather than corrupt the player's save).
 */
export const STORAGE_KEY = "fame-life-save-v1";
export const SAVE_VERSION = 1;

// Game length in quarters (each turn = 1 quarter = 3 months)
export const GAME_TURNS = 40; // 10 years

// Boost chance per turn. Was 0.22 but combined with the triggerCondition
// filter bug (boost.triggerCondition rarely matched event.type), this
// effectively produced ~1 boost offer in 40 turns for real playtests.
// Filter bug is now fixed (engine.ts falls back to any boost) so the
// effective rate is roughly this number per turn. Pick a rate that pairs
// well with Apple's 3.2.1 guidance that rewarded ads must be clearly
// optional — ~1 offer every 2-3 turns feels engaging without being pushy.
export const BOOST_CHANCE = 0.4;

// Recovery per quarter (tuned down so burnout/fatigue arcs have real teeth)
export const ENERGY_RECOVERY = 14;
export const MENTAL_HEALTH_RECOVERY = 5;

// Event category colors for UI
// Career phase order (for comparison)
export const PHASE_ORDER: CareerPhase[] = [
  "early_creator",
  "emerging",
  "breakout",
  "famous",
  "celebrity",
  "empire",
];

export const PHASE_LABELS: Record<CareerPhase, string> = {
  early_creator: "Early Creator",
  emerging: "Emerging",
  breakout: "Breakout",
  famous: "Famous",
  celebrity: "Celebrity",
  empire: "Empire",
};

export const EVENT_COLORS: Record<string, string> = {
  viral: "#10b981",    // emerald
  drama: "#ef4444",    // red
  brand: "#f59e0b",    // amber
  celebrity: "#a855f7", // purple
  platform: "#3b82f6",  // blue
  lifestyle: "#ec4899", // pink
  failure: "#6b7280",   // gray
  recovery: "#14b8a6",  // teal
  empire: "#d97706",    // gold
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
  empire: "🏰",
};

// Risk system constants
export const RISK_TAG_LABELS: Record<RiskTag, string> = {
  high_risk: "High Risk / High Reward",
  reputation_risk: "Reputation Risk",
  big_opportunity: "Big Opportunity",
};

export const RISK_TAG_COLORS: Record<RiskTag, string> = {
  high_risk: "#ef4444",
  reputation_risk: "#f59e0b",
  big_opportunity: "#10b981",
};

export const RISK_TAG_EMOJI: Record<RiskTag, string> = {
  high_risk: "🎲",
  reputation_risk: "⚠️",
  big_opportunity: "🌟",
};

/** How much risk level increases per risky choice */
export const RISK_INCREASE_PER_CHOICE = 8;
/** Risk level decay per turn */
export const RISK_DECAY_PER_TURN = 5;
/** Risk level threshold for "high volatility" */
export const HIGH_RISK_THRESHOLD = 40;
