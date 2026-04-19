/**
 * Game Center achievements integration.
 *
 * Maps Fame Life's internal milestone/badge system to iOS Game Center
 * achievements. The mapping is one-way: game milestones trigger achievement
 * reports, but Game Center never affects gameplay.
 *
 * Achievement IDs must be created in App Store Connect under:
 *   App Store Connect → Your App → Services → Game Center → Achievements
 *
 * Each achievement ID below must exactly match what you create there.
 * Convention: com.uptap.famelife.achievement.<snake_case_name>
 *
 * Reference: https://developer.apple.com/documentation/gamekit/achievements
 */

import { registerPlugin } from "@capacitor/core";
import { isNative } from "./platform";
import { trackGameCenter, captureError } from "./analytics";

// ── Plugin Bridge ────────────────────────────────────────

interface GameCenterPlugin {
  authenticate(): Promise<{ authenticated: boolean; playerId?: string }>;
  reportAchievement(opts: { id: string; percentComplete: number }): Promise<void>;
  reportScore(opts: { leaderboardId: string; score: number }): Promise<void>;
  showAchievements(): Promise<void>;
  showLeaderboards(): Promise<void>;
}

const GameCenter = registerPlugin<GameCenterPlugin>("GameCenterPlugin");

// ── State ────────────────────────────────────────────────

let authenticated = false;

// ── Achievement ID Mapping ───────────────────────────────

/**
 * Maps in-game milestone IDs → Game Center achievement IDs.
 *
 * To add a new achievement:
 * 1. Add the milestone in src/data/milestones.ts
 * 2. Add the mapping here
 * 3. Create the achievement in App Store Connect with the matching ID
 */
const MILESTONE_TO_ACHIEVEMENT: Record<string, string> = {
  // Growth
  first_10k:          "com.uptap.famelife.achievement.first_10k",
  first_100k:         "com.uptap.famelife.achievement.first_100k",
  half_million:       "com.uptap.famelife.achievement.half_million",
  first_1m:           "com.uptap.famelife.achievement.first_1m",
  // Financial
  rich:               "com.uptap.famelife.achievement.rich",
  quarter_mil:        "com.uptap.famelife.achievement.quarter_mil",
  millionaire_money:  "com.uptap.famelife.achievement.millionaire_money",
  // Events
  first_brand_deal:   "com.uptap.famelife.achievement.first_brand_deal",
  first_scandal:      "com.uptap.famelife.achievement.first_scandal",
  first_celebrity_event: "com.uptap.famelife.achievement.first_celebrity_event",
  // Resilience
  burnout_survivor:   "com.uptap.famelife.achievement.burnout_survivor",
  triple_scandal:     "com.uptap.famelife.achievement.triple_scandal",
  viral_king:         "com.uptap.famelife.achievement.viral_king",
  comeback_kid:       "com.uptap.famelife.achievement.comeback_kid",
  // Empire
  empire_builder:     "com.uptap.famelife.achievement.empire_builder",
  managed_talent:     "com.uptap.famelife.achievement.managed_talent",
  first_purchase:     "com.uptap.famelife.achievement.first_purchase",
  luxury_life:        "com.uptap.famelife.achievement.luxury_life",
  business_mogul:     "com.uptap.famelife.achievement.business_mogul",
  // Social
  charity_hero:       "com.uptap.famelife.achievement.charity_hero",
  feud_starter:       "com.uptap.famelife.achievement.feud_starter",
  industry_respect:   "com.uptap.famelife.achievement.industry_respect",
};

/**
 * Maps badge IDs → Game Center achievement IDs.
 * Badges are cross-run achievements checked at end-of-run.
 */
const BADGE_TO_ACHIEVEMENT: Record<string, string> = {
  global_icon:        "com.uptap.famelife.achievement.global_icon",
  millionaire:        "com.uptap.famelife.achievement.millionaire_badge",
  chaos_agent:        "com.uptap.famelife.achievement.chaos_agent",
  empire_builder:     "com.uptap.famelife.achievement.empire_builder_badge",
  comeback_monarch:   "com.uptap.famelife.achievement.comeback_monarch",
  fame_life:          "com.uptap.famelife.achievement.fame_life",
  speed_runner:       "com.uptap.famelife.achievement.speed_runner",
  hall_of_fame:       "com.uptap.famelife.achievement.hall_of_fame",
  veteran:            "com.uptap.famelife.achievement.veteran",
  storyteller:        "com.uptap.famelife.achievement.storyteller",
};

// ── Public API ───────────────────────────────────────────

/**
 * Authenticate with Game Center. Call once at app startup.
 * On iOS, this triggers the Game Center welcome banner if the user is signed in.
 * Fails silently on web or if the user isn't signed into Game Center.
 */
export async function authenticateGameCenter(): Promise<boolean> {
  if (!isNative()) return false;

  try {
    const result = await GameCenter.authenticate();
    authenticated = result.authenticated;
    trackGameCenter("auth", { authenticated, playerId: result.playerId });
    return authenticated;
  } catch (err) {
    trackGameCenter("error", { context: "authenticate", message: String(err) });
    return false;
  }
}

/**
 * Report a milestone achievement. Call when a milestone is first earned.
 * Safe to call multiple times for the same milestone — Game Center deduplicates.
 */
export async function reportMilestoneAchievement(milestoneId: string): Promise<void> {
  const achievementId = MILESTONE_TO_ACHIEVEMENT[milestoneId];
  if (!achievementId || !authenticated) return;

  try {
    await GameCenter.reportAchievement({ id: achievementId, percentComplete: 100 });
    trackGameCenter("achievement", { milestoneId, achievementId });
  } catch (err) {
    trackGameCenter("error", { context: "reportAchievement", milestoneId, message: String(err) });
  }
}

/**
 * Report badge achievements earned at end of run.
 */
export async function reportBadgeAchievements(badgeIds: string[]): Promise<void> {
  if (!authenticated) return;

  for (const badgeId of badgeIds) {
    const achievementId = BADGE_TO_ACHIEVEMENT[badgeId];
    if (!achievementId) continue;

    try {
      await GameCenter.reportAchievement({ id: achievementId, percentComplete: 100 });
      trackGameCenter("achievement", { badgeId, achievementId });
    } catch (err) {
      trackGameCenter("error", { context: "reportBadgeAchievement", badgeId, message: String(err) });
    }
  }
}

/** Hard ceiling on the fame leaderboard. The summary score is documented as 0–1000;
 *  anything above is either a balance regression or a tampered save. We clamp before
 *  submitting to Game Center so the leaderboard stays meaningful. */
const FAME_SCORE_MAX = 1000;

/**
 * Report the player's fame score to the leaderboard at end of run.
 * Clamped to the documented 0–1000 range to defeat tampered local saves.
 */
export async function reportFameScore(score: number): Promise<void> {
  if (!authenticated) return;
  if (!Number.isFinite(score) || score <= 0) return;

  const clamped = Math.min(FAME_SCORE_MAX, Math.max(0, Math.floor(score)));

  try {
    const { LEADERBOARD_FAME_SCORE } = await import("./config");
    await GameCenter.reportScore({ leaderboardId: LEADERBOARD_FAME_SCORE, score: clamped });
    trackGameCenter("leaderboard", { score: clamped, raw: score });
  } catch (err) {
    trackGameCenter("error", { context: "reportScore", score: clamped, message: String(err) });
  }
}

/**
 * Show the native Game Center achievements UI.
 */
export async function showAchievementsUI(): Promise<void> {
  if (!authenticated) return;

  try {
    await GameCenter.showAchievements();
  } catch (err) {
    captureError(err, { context: "showAchievements" });
  }
}

/**
 * Show the native Game Center leaderboards UI.
 */
export async function showLeaderboardsUI(): Promise<void> {
  if (!authenticated) return;

  try {
    await GameCenter.showLeaderboards();
  } catch (err) {
    captureError(err, { context: "showLeaderboards" });
  }
}

/** Whether Game Center is currently authenticated. */
export function isGameCenterAuthenticated(): boolean {
  return authenticated;
}

/**
 * Get all achievement IDs that need to be created in App Store Connect.
 * Useful for documentation and setup verification.
 */
export function getAllAchievementIds(): string[] {
  return [
    ...new Set([
      ...Object.values(MILESTONE_TO_ACHIEVEMENT),
      ...Object.values(BADGE_TO_ACHIEVEMENT),
    ]),
  ];
}
