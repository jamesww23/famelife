/**
 * Environment configuration for native services.
 *
 * All SDK keys, ad unit IDs, and vendor config are centralized here.
 * Values are read from environment variables at build time where available,
 * falling back to placeholder strings that clearly indicate missing config.
 *
 * For production builds, set these in your CI/CD environment or .env.local file.
 * NEVER commit real keys to source control.
 */

// ── AppLovin MAX ─────────────────────────────────────────
export const APPLOVIN_SDK_KEY =
  process.env.NEXT_PUBLIC_APPLOVIN_SDK_KEY ?? "APPLOVIN_SDK_KEY_PLACEHOLDER";

export const AD_UNIT_IDS = {
  /** Shown between game turns (every ~3 turns). */
  interstitial:
    process.env.NEXT_PUBLIC_AD_UNIT_INTERSTITIAL ?? "INTERSTITIAL_AD_UNIT_PLACEHOLDER",
  /** User-initiated for in-game boosts. */
  rewarded:
    process.env.NEXT_PUBLIC_AD_UNIT_REWARDED ?? "REWARDED_AD_UNIT_PLACEHOLDER",
} as const;

/** True when real (non-placeholder) ad credentials are configured. */
export const HAS_AD_CREDENTIALS =
  !APPLOVIN_SDK_KEY.includes("PLACEHOLDER") &&
  !APPLOVIN_SDK_KEY.startsWith("YOUR_") &&
  APPLOVIN_SDK_KEY !== "" &&
  !AD_UNIT_IDS.interstitial.includes("PLACEHOLDER") &&
  !AD_UNIT_IDS.rewarded.includes("PLACEHOLDER");

/**
 * Minimum turns between interstitial ads.
 * Keeps monetization sustainable without ruining pacing.
 */
export const INTERSTITIAL_FREQUENCY = 3;

// ── Game Center ──────────────────────────────────────────
/**
 * Game Center leaderboard ID for fame score.
 * Must match the ID created in App Store Connect.
 */
export const LEADERBOARD_FAME_SCORE = "com.uptap.famelife.leaderboard.fame_score";

// ── Analytics / Observability ────────────────────────────
export const SENTRY_DSN =
  process.env.NEXT_PUBLIC_SENTRY_DSN ?? "";

// ── Feature Flags ────────────────────────────────────────
/** Master switch for ad display. Set false to disable all ads (e.g. after IAP "Remove Ads"). */
export const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED !== "false";

/** Whether the current build is a development/debug build. */
export const IS_DEV = process.env.NODE_ENV === "development";
