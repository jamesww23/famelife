// ============================================================
// Influencer Life Simulator – Core Type Definitions (v2 – Reigns-style)
// ============================================================

// ---- Stats ----

export interface Stats {
  followers: number;
  fame: number;       // 0–100
  reputation: number; // 0–100
  money: number;
  energy: number;     // 0–100
  mentalHealth: number; // 0–100
}

export type StatKey = keyof Stats;

export type StatEffects = Partial<Record<StatKey, number>>;

// ---- Archetypes ----

export type ArchetypeId =
  | "comedy"
  | "beauty"
  | "lifestyle"
  | "drama"
  | "gaming"
  | "fitness";

export interface Archetype {
  id: ArchetypeId;
  name: string;
  emoji: string;
  description: string;
  startingModifiers: StatEffects;
  eventWeightModifiers: Partial<Record<EventCategory, number>>;
}

// ---- Career Tiers ----

export type CareerTier =
  | "new_creator"
  | "micro_influencer"
  | "rising_influencer"
  | "internet_star"
  | "celebrity"
  | "global_celebrity";

export interface CareerTierDef {
  id: CareerTier;
  name: string;
  emoji: string;
  minFollowers: number;
}

// ---- Game Mode ----

export type GameMode = "quick" | "full";

// ---- Events (Reigns-style) ----

export type EventCategory =
  | "viral"
  | "drama"
  | "brand"
  | "celebrity"
  | "platform"
  | "lifestyle"
  | "failure"
  | "recovery";

export interface EventChoice {
  id: string;
  text: string;         // short label for button
  effects: StatEffects;
  setFlags?: string[];
  removeFlags?: string[];
  followUpText?: string; // narrative result
  triggerChain?: string; // chain ID to continue after this choice
  socialReaction?: SocialReaction; // fake social media reaction
}

export interface SocialReaction {
  type: "comment" | "headline" | "tweet";
  text: string;
  author?: string;
}

export interface GameEvent {
  id: string;
  type: EventCategory;
  title: string;
  text: string;
  emoji?: string;     // displayed on card
  weight: number;
  minTier?: CareerTier;
  maxTier?: CareerTier;
  requiredFlags?: string[];
  excludedFlags?: string[];
  statConditions?: Partial<Record<StatKey, { min?: number; max?: number }>>;
  choices: EventChoice[];
  // Chain support
  chainId?: string;   // belongs to this story chain
  chainStep?: number; // position in chain (0-indexed)
  isSwipeable?: boolean; // true = binary swipe (left=choice[0], right=choice[1])
}

// ---- Story Chains ----

export interface StoryChain {
  id: string;
  name: string;
  events: string[]; // ordered event IDs
}

// ---- Rewarded Ads / Boosts ----

export type BoostMethod = "ad" | "share";

export interface RewardedBoost {
  id: string;
  name: string;
  emoji: string;
  description: string;
  effects: StatEffects;
  triggerCondition: "post_content" | "post_scandal" | "celebrity_threshold" | "brand_deal" | "low_energy" | "any";
}

// ---- Milestones ----

export interface Milestone {
  id: string;
  title: string;
  emoji: string;
  description: string;
  check: (state: GameState) => boolean;
}

// ---- Stat Change Animation ----

export interface StatDelta {
  stat: StatKey;
  delta: number;
}

// ---- Run Log ----

export interface LogEntry {
  week: number;
  text: string;
  type: "event" | "milestone" | "boost" | "system" | "social";
  emoji?: string;
}

// ---- Game State ----

export type GamePhase =
  | "start"
  | "event"
  | "outcome"
  | "boost_offer"
  | "milestone"
  | "extend_offer"
  | "game_over";

export interface GameState {
  phase: GamePhase;
  week: number;
  mode: GameMode;
  archetype: ArchetypeId;
  stats: Stats;
  flags: string[];
  careerTier: CareerTier;
  log: LogEntry[];
  milestones: string[];
  // Current turn
  currentEvent: GameEvent | null;
  currentChoiceResult: {
    choice: EventChoice;
    event: GameEvent;
    deltas: StatDelta[];
  } | null;
  pendingBoost: RewardedBoost | null;
  pendingMilestones: string[];
  // History
  recentEventIds: string[];
  activeChains: Record<string, number>; // chainId -> current step
  // Counters
  brandDeals: number;
  scandals: number;
  celebrityEvents: number;
  relationships: number;
  viralMoments: number;
  comebacks: number;
  // End
  gameOverReason: string | null;
}

// ---- Summary ----

export interface GameSummary {
  archetype: ArchetypeId;
  archetypeName: string;
  archetypeEmoji: string;
  quartersPlayed: number;
  yearsPlayed: number;
  followers: number;
  fameTier: string;
  money: number;
  brandDeals: number;
  scandals: number;
  celebrityEvents: number;
  relationships: number;
  viralMoments: number;
  comebacks: number;
  endingReason: string;
  milestones: string[];
  headline: string; // shareable one-liner
  // Rankings & scoring
  fameScore: number;        // 0-1000 composite score
  fameRank: string;         // title based on score
  fameRankEmoji: string;
  percentile: number;       // estimated percentile (0-100)
}
