// ============================================================
// Influencer Life Simulator – Core Type Definitions
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
  minFollowers: number;
}

// ---- Actions ----

export type ActionCategory = "content" | "career" | "social" | "recovery";

export interface GameAction {
  id: string;
  category: ActionCategory;
  name: string;
  description: string;
  effects: StatEffects;
  energyCost: number;
  minTier?: CareerTier;
  eventBias?: Partial<Record<EventCategory, number>>;
}

// ---- Events ----

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
  text: string;
  effects: StatEffects;
  setFlags?: string[];
  removeFlags?: string[];
  followUpText?: string;
}

export interface GameEvent {
  id: string;
  type: EventCategory;
  title: string;
  text: string;
  weight: number;
  minTier?: CareerTier;
  maxTier?: CareerTier;
  requiredFlags?: string[];
  excludedFlags?: string[];
  statConditions?: Partial<Record<StatKey, { min?: number; max?: number }>>;
  choices: EventChoice[];
}

// ---- Rewarded Ads ----

export interface RewardedAd {
  id: string;
  name: string;
  description: string;
  effects: StatEffects;
  triggerCondition: "post_content" | "post_scandal" | "celebrity_threshold" | "brand_deal" | "low_energy" | "any";
}

// ---- Milestones ----

export interface Milestone {
  id: string;
  title: string;
  description: string;
  check: (state: GameState) => boolean;
}

// ---- Run Log ----

export interface LogEntry {
  week: number;
  text: string;
  type: "action" | "event" | "milestone" | "ad" | "system";
}

// ---- Game State ----

export type GamePhase =
  | "start"
  | "choose_action"
  | "event"
  | "event_outcome"
  | "rewarded_ad"
  | "milestone"
  | "game_over";

export interface GameState {
  phase: GamePhase;
  week: number;
  archetype: ArchetypeId;
  stats: Stats;
  flags: string[];
  careerTier: CareerTier;
  log: LogEntry[];
  milestones: string[];
  currentEvent: GameEvent | null;
  currentChoiceResult: { choice: EventChoice; event: GameEvent } | null;
  pendingAd: RewardedAd | null;
  pendingMilestones: string[];
  lastActionId: string | null;
  recentEventIds: string[];
  brandDeals: number;
  scandals: number;
  celebrityEvents: number;
  relationships: number;
  gameOverReason: string | null;
}

// ---- Summary ----

export interface GameSummary {
  archetype: ArchetypeId;
  archetypeName: string;
  weeksPlayed: number;
  followers: number;
  fameTier: string;
  money: number;
  brandDeals: number;
  scandals: number;
  celebrityEvents: number;
  relationships: number;
  endingReason: string;
  milestones: string[];
}
