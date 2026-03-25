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

// ---- Character Build ----

export interface CharacterBuild {
  name: string;
  avatar: string;       // emoji avatar
  traitId: TraitId;
}

export type TraitId =
  | "rich_family"
  | "street_smart"
  | "natural_talent"
  | "hard_worker"
  | "thick_skin"
  | "social_butterfly";

export interface Trait {
  id: TraitId;
  name: string;
  emoji: string;
  description: string;
  modifiers: StatEffects;
}

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

// ---- Career Phases (derived from stats + flags) ----

export type CareerPhase =
  | "early_creator"
  | "emerging"
  | "breakout"
  | "famous"
  | "celebrity"
  | "empire";

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

export type GameMode = "full";

// ---- Events (Reigns-style) ----

export type EventCategory =
  | "viral"
  | "drama"
  | "brand"
  | "celebrity"
  | "platform"
  | "lifestyle"
  | "failure"
  | "recovery"
  | "empire";

// ---- Risk System ----

export type RiskTag = "high_risk" | "reputation_risk" | "big_opportunity";

export interface RiskStakes {
  upside: string;
  downside: string;
}

export interface ScheduledEvent {
  eventId: string;
  triggerWeek: number;
}

export interface EventChoice {
  id: string;
  text: string;         // short label for button
  effects: StatEffects;
  setFlags?: string[];
  removeFlags?: string[];
  followUpText?: string; // narrative result
  triggerChain?: string; // chain ID to continue after this choice
  socialReaction?: SocialReaction; // fake social media reaction
  // Risk system
  riskTag?: RiskTag;
  stakes?: RiskStakes;
  requiresConfirmation?: boolean;
  scheduledEvent?: { eventId: string; delay: number }; // fires N turns later
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
  // Phase support
  minPhase?: CareerPhase;
  maxPhase?: CareerPhase;
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

// ---- Shop System ----

export type ShopCategory = "growth" | "business" | "luxury" | "access" | "risk";

export interface PassiveEffects {
  followerGainMultiplier?: number; // e.g. 0.1 = +10%
  incomeMultiplier?: number;       // all income
  adRevenueMultiplier?: number;
  sponsorshipMultiplier?: number;
  businessIncome?: number;         // flat quarterly business income
  scandalReduction?: number;       // e.g. 0.5 = 50% less scandal damage
  energyRecoveryBonus?: number;
  mentalHealthRecoveryBonus?: number;
}

export interface ShopItem {
  id: string;
  name: string;
  emoji: string;
  description: string;
  category: ShopCategory;
  cost: number;
  upkeep: number; // quarterly
  onPurchaseEffects?: StatEffects;
  passiveEffects?: PassiveEffects;
  requires?: {
    minFollowers?: number;
    minFame?: number;
    minPhase?: CareerPhase;
    purchases?: string[]; // prerequisite item IDs
  };
  enablesFlex?: boolean;
  setFlags?: string[];
}

// ---- Quarterly Income ----

export interface QuarterlyIncome {
  adRevenue: number;
  sponsorships: number;
  donations: number;
  subscriptions: number;
  affiliates: number;
  businessIncome: number;
  totalIncome: number;
  itemUpkeep: number;
  lifestyleExpenses: number;
  expenses: number;
  net: number;
}

// ---- Quarterly Activities ----

export interface ActivityTier {
  id: string;
  name: string;
  emoji: string;
  effects: StatEffects;
}

export interface QuarterlyActivity {
  id: string;
  name: string;
  emoji: string;
  description: string;
  category?: "work" | "lifestyle";
  minMoney?: number;
  minFollowers?: number;
  requiresPurchases?: string[]; // item IDs needed to see this activity
  tiers?: ActivityTier[];
  getEffects: (state: GameState) => StatEffects;
}

// ---- Game State ----

export type GamePhase =
  | "start"
  | "activity"
  | "event"
  | "outcome"
  | "boost_offer"
  | "milestone"
  | "game_over";

export interface GameState {
  phase: GamePhase;
  week: number;
  mode: GameMode;
  archetype: ArchetypeId;
  character: CharacterBuild;
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
    riskOutcome?: "lucky" | "unlucky" | null;
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
  // Risk system
  riskLevel: number; // 0-100, affects outcome variance
  scheduledEvents: ScheduledEvent[];
  // Purchases & Economy
  purchases: string[]; // owned shop item IDs
  // Income & Activities
  quarterlyIncome: QuarterlyIncome | null;
  // End
  gameOverReason: string | null;
}

// ---- Career Legacy (persistent across runs) ----

export type BadgeRarity = "common" | "rare" | "epic" | "legendary";
export type BadgeCategory = "growth" | "wealth" | "fame" | "drama" | "comeback" | "empire" | "social" | "meta";

export interface BadgeDef {
  id: string;
  name: string;
  emoji: string;
  description: string;
  rarity: BadgeRarity;
  category: BadgeCategory;
  /** Check against final run state + lifetime legacy */
  check: (run: GameState, legacy: CareerLegacy) => boolean;
}

export interface RunRecord {
  date: string;           // ISO date
  characterName: string;
  avatar: string;
  archetype: ArchetypeId;
  earnedTitle: string;
  earnedTitleEmoji: string;
  fameScore: number;
  followers: number;
  money: number;
  quartersPlayed: number;
  endingReason: string;
  newBadges: string[];    // badge IDs unlocked this run
  newTitles: string[];    // title IDs unlocked this run
}

export interface CareerLegacy {
  version: number;
  totalRuns: number;
  lifetimeEarnings: number;
  bestFollowers: number;
  bestFame: number;
  bestFameScore: number;
  bestMoney: number;
  longestRun: number;       // quarters
  mostScandals: number;
  fastestTo1M: number | null; // quarters, null if never achieved
  unlockedBadges: string[]; // badge IDs
  unlockedTitles: string[]; // title IDs (from earned titles)
  runHistory: RunRecord[];  // last 20 runs
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
  // Enhanced summary
  earnedTitle: string;      // run-specific title (e.g. "Chaos Celebrity")
  earnedTitleEmoji: string;
  storyRecap: string;       // one-line BitLife-style recap
}
