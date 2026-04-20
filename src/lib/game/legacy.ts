import { CareerLegacy, GameState, RunRecord } from "./types";
import { badges } from "@/data/badges";
import { generateSummary } from "./summary";
import { getItem, setItem, removeItem, reportBadgeAchievements, reportFameScore, trackEvent } from "@/lib/native";

const LEGACY_KEY = "fame-life-legacy-v1";
const MAX_RUN_HISTORY = 20;

// Per-run bonus granted after a successful share.
export const SHARE_BONUS_MONEY = 5000;
export const SHARE_BONUS_FAME_MULT = 1.10;

// ---- Default Legacy ----

function createDefaultLegacy(): CareerLegacy {
  return {
    version: 1,
    totalRuns: 0,
    lifetimeEarnings: 0,
    bestFollowers: 0,
    bestFame: 0,
    bestFameScore: 0,
    bestMoney: 0,
    longestRun: 0,
    mostScandals: 0,
    fastestTo1M: null,
    unlockedBadges: [],
    unlockedTitles: [],
    runHistory: [],
    sharesCompleted: 0,
    pendingShareBonus: false,
  };
}

// Hydrate a parsed payload into a full CareerLegacy. Handles both the case
// where older saves are missing newer fields AND the case where a persisted
// field is the wrong shape (e.g. `unlockedBadges: null` from a partial write).
// Every field is defensively coerced; on any type mismatch we fall back to
// the default. This prevents `.includes()` / `.filter()` crashes deep in
// badge/title processing when storage has been corrupted.
function hydrateLegacy(parsed: unknown): CareerLegacy {
  const defaults = createDefaultLegacy();
  if (!parsed || typeof parsed !== "object") return defaults;
  const p = parsed as Record<string, unknown>;

  const asNum = (v: unknown, d: number): number =>
    typeof v === "number" && Number.isFinite(v) ? v : d;
  const asNumOrNull = (v: unknown): number | null =>
    v === null ? null : typeof v === "number" && Number.isFinite(v) ? v : null;
  const asBool = (v: unknown, d: boolean): boolean =>
    typeof v === "boolean" ? v : d;
  const asStringArray = (v: unknown): string[] =>
    Array.isArray(v) ? v.filter((s): s is string => typeof s === "string") : [];
  const asRunHistory = (v: unknown): RunRecord[] =>
    Array.isArray(v)
      ? (v.filter((r) => r && typeof r === "object") as RunRecord[])
      : [];

  return {
    version: 1,
    totalRuns: asNum(p.totalRuns, defaults.totalRuns),
    lifetimeEarnings: asNum(p.lifetimeEarnings, defaults.lifetimeEarnings),
    bestFollowers: asNum(p.bestFollowers, defaults.bestFollowers),
    bestFame: asNum(p.bestFame, defaults.bestFame),
    bestFameScore: asNum(p.bestFameScore, defaults.bestFameScore),
    bestMoney: asNum(p.bestMoney, defaults.bestMoney),
    longestRun: asNum(p.longestRun, defaults.longestRun),
    mostScandals: asNum(p.mostScandals, defaults.mostScandals),
    fastestTo1M: asNumOrNull(p.fastestTo1M),
    unlockedBadges: asStringArray(p.unlockedBadges),
    unlockedTitles: asStringArray(p.unlockedTitles),
    runHistory: asRunHistory(p.runHistory),
    sharesCompleted: asNum(p.sharesCompleted, defaults.sharesCompleted),
    pendingShareBonus: asBool(p.pendingShareBonus, defaults.pendingShareBonus),
  };
}

// ---- Persistence (async, native-backed) ----

/** Cached in-memory copy for synchronous access after initial load. */
let cachedLegacy: CareerLegacy | null = null;

/**
 * Load legacy data. Uses cached copy if available, otherwise
 * reads from native storage (async) with localStorage fallback.
 */
export async function loadLegacyAsync(): Promise<CareerLegacy> {
  if (cachedLegacy) return cachedLegacy;

  try {
    const saved = await getItem(LEGACY_KEY);
    if (saved) {
      const parsed: unknown = JSON.parse(saved);
      if (parsed && typeof parsed === "object" && (parsed as { version?: unknown }).version === 1) {
        cachedLegacy = hydrateLegacy(parsed);
        return cachedLegacy;
      }
    }
  } catch {
    // Ignore corrupt data
  }
  cachedLegacy = createDefaultLegacy();
  return cachedLegacy;
}

/**
 * Synchronous legacy load — reads from cache or localStorage.
 * Used by components that need legacy data during render.
 */
export function loadLegacy(): CareerLegacy {
  if (cachedLegacy) return cachedLegacy;

  // Fallback to localStorage for synchronous access
  try {
    const saved = localStorage.getItem(LEGACY_KEY);
    if (saved) {
      const parsed: unknown = JSON.parse(saved);
      if (parsed && typeof parsed === "object" && (parsed as { version?: unknown }).version === 1) {
        cachedLegacy = hydrateLegacy(parsed);
        return cachedLegacy;
      }
    }
  } catch {
    // Ignore corrupt data
  }
  return createDefaultLegacy();
}

export async function saveLegacy(legacy: CareerLegacy): Promise<void> {
  cachedLegacy = legacy;
  try {
    await setItem(LEGACY_KEY, JSON.stringify(legacy));
  } catch {
    // Storage error — non-fatal
  }
}

export async function resetLegacy(): Promise<void> {
  cachedLegacy = null;
  await removeItem(LEGACY_KEY);
}

// ---- End-of-Run Processing ----

export interface RunUnlocks {
  newBadges: string[];
  newTitles: string[];
  updatedLegacy: CareerLegacy;
}

/**
 * Process a completed run: update lifetime stats, check badge/title unlocks,
 * record run history. Returns the new unlocks and updated legacy.
 */
export async function processRunEnd(state: GameState): Promise<RunUnlocks> {
  const legacy = await loadLegacyAsync();
  const summary = generateSummary(state);

  // ---- Update lifetime stats ----
  legacy.totalRuns += 1;
  legacy.lifetimeEarnings += Math.max(0, state.stats.money);
  legacy.bestFollowers = Math.max(legacy.bestFollowers, state.stats.followers);
  legacy.bestFame = Math.max(legacy.bestFame, state.stats.fame);
  legacy.bestFameScore = Math.max(legacy.bestFameScore, summary.fameScore);
  legacy.bestMoney = Math.max(legacy.bestMoney, state.stats.money);
  legacy.longestRun = Math.max(legacy.longestRun, state.week);
  legacy.mostScandals = Math.max(legacy.mostScandals, state.scandals);

  // Track fastest to 1M followers
  if (state.stats.followers >= 1_000_000) {
    if (legacy.fastestTo1M === null || state.week < legacy.fastestTo1M) {
      legacy.fastestTo1M = state.week;
    }
  }

  // ---- Check badge unlocks ----
  const newBadges: string[] = [];
  for (const badge of badges) {
    if (!legacy.unlockedBadges.includes(badge.id)) {
      if (badge.check(state, legacy)) {
        legacy.unlockedBadges.push(badge.id);
        newBadges.push(badge.id);
      }
    }
  }

  // Re-check meta badges after adding new badges (for badges that count badges)
  for (const badge of badges) {
    if (badge.category === "meta" && !legacy.unlockedBadges.includes(badge.id)) {
      if (badge.check(state, legacy)) {
        legacy.unlockedBadges.push(badge.id);
        newBadges.push(badge.id);
      }
    }
  }

  // ---- Check title unlocks ----
  const titleId = summary.earnedTitle;
  const newTitles: string[] = [];
  if (!legacy.unlockedTitles.includes(titleId)) {
    legacy.unlockedTitles.push(titleId);
    newTitles.push(titleId);
  }

  // ---- Record run history ----
  const record: RunRecord = {
    date: new Date().toISOString(),
    characterName: state.character.name,
    avatar: state.character.avatar,
    archetype: state.archetype,
    earnedTitle: summary.earnedTitle,
    earnedTitleEmoji: summary.earnedTitleEmoji,
    fameScore: summary.fameScore,
    followers: state.stats.followers,
    money: state.stats.money,
    quartersPlayed: state.week,
    endingReason: state.gameOverReason ?? "Unknown",
    newBadges,
    newTitles,
  };

  legacy.runHistory = [record, ...legacy.runHistory].slice(0, MAX_RUN_HISTORY);

  // ---- Save & report to Game Center ----
  await saveLegacy(legacy);

  // Report new badge achievements to Game Center
  if (newBadges.length > 0) {
    reportBadgeAchievements(newBadges).catch(() => {});
  }

  // Report fame score to leaderboard
  if (summary.fameScore > 0) {
    reportFameScore(summary.fameScore).catch(() => {});
  }

  // Analytics
  trackEvent("run_complete", {
    fameScore: summary.fameScore,
    followers: state.stats.followers,
    money: state.stats.money,
    quarters: state.week,
    newBadges: newBadges.length,
    reason: state.gameOverReason,
  });

  return { newBadges, newTitles, updatedLegacy: legacy };
}

// ---- Next Goals ----

export interface NextGoal {
  emoji: string;
  text: string;
}

/** Suggest 3-5 goals the player hasn't achieved yet. */
export function getNextGoals(legacy: CareerLegacy): NextGoal[] {
  const goals: NextGoal[] = [];

  if (legacy.bestFollowers < 1_000_000) {
    goals.push({ emoji: "👥", text: "Reach 1M followers" });
  }
  if (legacy.bestFollowers < 5_000_000 && legacy.bestFollowers >= 1_000_000) {
    goals.push({ emoji: "🌍", text: "Reach 5M followers — become a Global Icon" });
  }
  if (!legacy.unlockedBadges.includes("studio_owner")) {
    goals.push({ emoji: "🏢", text: "Build your own studio" });
  }
  if (!legacy.unlockedBadges.includes("teflon")) {
    goals.push({ emoji: "🛡️", text: "Survive 3+ scandals without getting cancelled" });
  }
  if (!legacy.unlockedTitles.includes("Internet Legend")) {
    goals.push({ emoji: "👑", text: "Earn the Internet Legend title" });
  }
  if (!legacy.unlockedBadges.includes("viral_force")) {
    goals.push({ emoji: "🔥", text: "Go viral 3 times in one run" });
  }
  if (legacy.bestFameScore < 800) {
    goals.push({ emoji: "⭐", text: "Score 800+ to reach A-List rank" });
  }
  if (!legacy.unlockedBadges.includes("comeback_monarch")) {
    goals.push({ emoji: "🦅", text: "Make 3 comebacks in a single run" });
  }
  if (legacy.totalRuns < 3) {
    goals.push({ emoji: "🔁", text: `Complete ${3 - legacy.totalRuns} more run${3 - legacy.totalRuns === 1 ? "" : "s"}` });
  }
  if (!legacy.unlockedBadges.includes("empire_builder")) {
    goals.push({ emoji: "🏰", text: "Build a full creator empire" });
  }
  if (legacy.bestMoney < 1_000_000) {
    goals.push({ emoji: "💎", text: "Become a millionaire in a single run" });
  }

  return goals.slice(0, 5);
}

/** Get a badge definition by ID */
export function getBadgeById(id: string) {
  return badges.find(b => b.id === id) ?? null;
}

// ---- Share Reward ----

export interface ShareRewardResult {
  /** True if this share unlocked the Storyteller badge for the first time. */
  newlyUnlockedStoryteller: boolean;
  /** True if the pending-bonus flag was set (stacks only once until consumed). */
  bonusArmed: boolean;
}

/**
 * Called when the player successfully completes a share from the summary
 * screen. Increments share count, arms the next-run bonus, and unlocks the
 * Storyteller badge + Game Center achievement on first share.
 */
export async function claimShareReward(): Promise<ShareRewardResult> {
  const legacy = await loadLegacyAsync();

  const wasFirstShare = legacy.sharesCompleted === 0;
  legacy.sharesCompleted += 1;

  const bonusArmed = !legacy.pendingShareBonus; // treat repeated shares pre-consume as no-ops
  legacy.pendingShareBonus = true;

  let newlyUnlockedStoryteller = false;
  if (wasFirstShare && !legacy.unlockedBadges.includes("storyteller")) {
    legacy.unlockedBadges.push("storyteller");
    newlyUnlockedStoryteller = true;
  }

  await saveLegacy(legacy);

  if (newlyUnlockedStoryteller) {
    reportBadgeAchievements(["storyteller"]).catch(() => {});
  }

  trackEvent("share_completed", {
    totalShares: legacy.sharesCompleted,
    firstShare: wasFirstShare,
  });

  return { newlyUnlockedStoryteller, bonusArmed };
}

/**
 * Consume the pending share bonus (called at run start). Returns the bonus
 * that should be applied, or null if there's nothing to grant. Clears the
 * flag and persists so the bonus can't double-dip.
 */
export function consumePendingShareBonus():
  | { money: number; fameMultiplier: number }
  | null {
  const legacy = loadLegacy();
  if (!legacy.pendingShareBonus) return null;

  legacy.pendingShareBonus = false;
  saveLegacy(legacy).catch(() => {
    // Storage error — bonus is still consumed in memory, next run won't repeat.
  });

  return { money: SHARE_BONUS_MONEY, fameMultiplier: SHARE_BONUS_FAME_MULT };
}
