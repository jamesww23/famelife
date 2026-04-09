/**
 * Native services barrel export.
 *
 * Initialization order matters:
 * 1. Platform detection (sync, immediate)
 * 2. Lifecycle listeners (sync)
 * 3. Game Center authentication (async, non-blocking)
 * 4. ATT prompt (async, must complete before ads)
 * 5. Ad SDK initialization (async, after ATT)
 *
 * Call `initNativeServices()` once from the app root.
 */

export { isNative, isIOS, isWeb } from "./platform";
export { getItem, setItem, removeItem } from "./storage";
export {
  initializeAds,
  showRewardedAd,
  maybeShowInterstitial,
  isRewardedAdReady,
  resetAdState,
} from "./ads";
export {
  authenticateGameCenter,
  reportMilestoneAchievement,
  reportBadgeAchievements,
  reportFameScore,
  showAchievementsUI,
  showLeaderboardsUI,
  isGameCenterAuthenticated,
} from "./achievements";
export { requestTrackingPermission, hasTrackingConsent } from "./privacy";
export { initLifecycle, onPause, onResume } from "./lifecycle";
export {
  trackEvent,
  captureError,
  addBreadcrumb,
  trackAdEvent,
  trackGameCenter,
  setTag,
} from "./analytics";

import { isNative } from "./platform";
import { initLifecycle, onResume } from "./lifecycle";
import { authenticateGameCenter } from "./achievements";
import { requestTrackingPermission } from "./privacy";
import { initializeAds } from "./ads";
import { addBreadcrumb } from "./analytics";

/**
 * Initialize all native services in the correct order.
 * Call once when the app mounts. Non-blocking — the game is playable
 * immediately; native services initialize in the background.
 */
export async function initNativeServices(): Promise<void> {
  if (!isNative()) {
    addBreadcrumb("init", "Running in web mode — native services skipped");
    return;
  }

  addBreadcrumb("init", "Initializing native services");

  // 1. Lifecycle listeners (sync)
  initLifecycle();

  // 2. Resume audio on foreground
  onResume(() => {
    // AudioContext resume is handled in sounds.ts getCtx()
    // This breadcrumb helps debug audio issues
    addBreadcrumb("audio", "App resumed — audio context will resume on next play");
  });

  // 3. Game Center (non-blocking)
  authenticateGameCenter().catch(() => {});

  // 4. ATT prompt → Ad init (sequential, but non-blocking to game)
  try {
    await requestTrackingPermission();
    await initializeAds();
  } catch {
    // Ads are optional — game works without them
    addBreadcrumb("init", "Ad initialization failed — continuing without ads");
  }

  addBreadcrumb("init", "Native services initialized");
}
