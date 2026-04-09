/**
 * Ad service abstraction for AppLovin MAX.
 *
 * Ad format choices for Fame Life:
 *
 * 1. **Rewarded Video** — user-initiated, offered as in-game "boosts" after
 *    events. This maps naturally to the existing RewardedBoost system.
 *    Players opt in voluntarily for stat bonuses. Highest eCPM, best UX.
 *
 * 2. **Interstitial** — shown between game turns (every N turns), during the
 *    natural break between activity→event phases. Non-intrusive because
 *    the player is already waiting for the next screen. Capped frequency.
 *
 * No banners — the card-based UI doesn't have a natural banner slot,
 * and banners would hurt the premium feel for low eCPM.
 *
 * Architecture:
 * - This module is the ONLY place ad logic lives
 * - Game code calls `showRewardedAd()` or `maybeShowInterstitial()`
 * - All state (loaded, frequency caps) is internal
 * - Fails silently — ads never block gameplay
 * - Respects ADS_ENABLED flag for future "Remove Ads" IAP
 */

import { registerPlugin } from "@capacitor/core";
import { isNative } from "./platform";
import { ADS_ENABLED, AD_UNIT_IDS, INTERSTITIAL_FREQUENCY, APPLOVIN_SDK_KEY, IS_DEV } from "./config";
import { trackAdEvent, addBreadcrumb, captureError } from "./analytics";
import { hasTrackingConsent } from "./privacy";

// ── Plugin Bridge ────────────────────────────────────────

interface AdsPlugin {
  initialize(opts: { sdkKey: string; hasConsent: boolean }): Promise<void>;
  loadInterstitial(opts: { adUnitId: string }): Promise<void>;
  showInterstitial(opts: { adUnitId: string }): Promise<{ shown: boolean }>;
  loadRewarded(opts: { adUnitId: string }): Promise<void>;
  showRewarded(opts: { adUnitId: string }): Promise<{ rewarded: boolean }>;
  isRewardedReady(opts: { adUnitId: string }): Promise<{ ready: boolean }>;
}

const Ads = registerPlugin<AdsPlugin>("AdsPlugin");

// ── State ────────────────────────────────────────────────

let initialized = false;
let turnsSinceLastInterstitial = 0;

// ── Initialization ───────────────────────────────────────

/**
 * Initialize the ad SDK. Call once after ATT prompt resolves.
 * Safe to call multiple times — subsequent calls are no-ops.
 */
export async function initializeAds(): Promise<void> {
  if (initialized || !ADS_ENABLED || !isNative()) return;

  // Don't initialize with placeholder or missing keys
  if (
    APPLOVIN_SDK_KEY.includes("PLACEHOLDER") ||
    APPLOVIN_SDK_KEY === "" ||
    APPLOVIN_SDK_KEY.startsWith("YOUR_")
  ) {
    addBreadcrumb("ads", "Skipping init — SDK key not configured. Set NEXT_PUBLIC_APPLOVIN_SDK_KEY in .env.local");
    return;
  }

  if (
    AD_UNIT_IDS.interstitial.includes("PLACEHOLDER") ||
    AD_UNIT_IDS.rewarded.includes("PLACEHOLDER")
  ) {
    addBreadcrumb("ads", "Skipping init — ad unit IDs not configured. Set NEXT_PUBLIC_AD_UNIT_INTERSTITIAL and NEXT_PUBLIC_AD_UNIT_REWARDED in .env.local");
    return;
  }

  try {
    await Ads.initialize({
      sdkKey: APPLOVIN_SDK_KEY,
      hasConsent: hasTrackingConsent(),
    });
    initialized = true;
    addBreadcrumb("ads", "MAX SDK initialized");

    // Pre-load first ads
    preloadAds();
  } catch (err) {
    captureError(err, { context: "ad-init" });
  }
}

/** Pre-load ads in background. */
function preloadAds(): void {
  Ads.loadInterstitial({ adUnitId: AD_UNIT_IDS.interstitial }).catch((err) => {
    trackAdEvent("error", "interstitial", { message: String(err) });
  });
  Ads.loadRewarded({ adUnitId: AD_UNIT_IDS.rewarded }).catch((err) => {
    trackAdEvent("error", "rewarded", { message: String(err) });
  });
}

// ── Interstitial (between turns) ─────────────────────────

/**
 * Call at the end of each game turn. Shows an interstitial if the
 * frequency cap allows it. Never blocks the game.
 */
export async function maybeShowInterstitial(): Promise<void> {
  if (!initialized || !ADS_ENABLED || IS_DEV) return;

  turnsSinceLastInterstitial++;
  if (turnsSinceLastInterstitial < INTERSTITIAL_FREQUENCY) return;

  try {
    const { shown } = await Ads.showInterstitial({ adUnitId: AD_UNIT_IDS.interstitial });
    if (shown) {
      turnsSinceLastInterstitial = 0;
      trackAdEvent("show", "interstitial");
    }
    // Reload for next time
    Ads.loadInterstitial({ adUnitId: AD_UNIT_IDS.interstitial }).catch(() => {});
  } catch (err) {
    trackAdEvent("error", "interstitial", { message: String(err) });
  }
}

// ── Rewarded Video (user-initiated boosts) ───────────────

/**
 * Show a rewarded video ad. Returns true if the user watched the full ad
 * and earned the reward. Returns false if the ad wasn't available or the
 * user skipped it. Never throws.
 */
export async function showRewardedAd(): Promise<boolean> {
  if (!initialized || !ADS_ENABLED) {
    // In dev or when ads disabled, auto-grant the reward
    if (IS_DEV || !ADS_ENABLED) return true;
    return false;
  }

  try {
    trackAdEvent("show", "rewarded");
    const { rewarded } = await Ads.showRewarded({ adUnitId: AD_UNIT_IDS.rewarded });
    if (rewarded) {
      trackAdEvent("reward", "rewarded");
    }
    // Reload for next time
    Ads.loadRewarded({ adUnitId: AD_UNIT_IDS.rewarded }).catch(() => {});
    return rewarded;
  } catch (err) {
    trackAdEvent("error", "rewarded", { message: String(err) });
    return false;
  }
}

/**
 * Check if a rewarded ad is ready to show.
 * Used to decide whether to display the boost offer UI.
 */
export async function isRewardedAdReady(): Promise<boolean> {
  if (!initialized || !ADS_ENABLED) return IS_DEV || !ADS_ENABLED;

  try {
    const { ready } = await Ads.isRewardedReady({ adUnitId: AD_UNIT_IDS.rewarded });
    return ready;
  } catch {
    return false;
  }
}

/** Reset interstitial frequency counter (e.g., on new game). */
export function resetAdState(): void {
  turnsSinceLastInterstitial = 0;
}
