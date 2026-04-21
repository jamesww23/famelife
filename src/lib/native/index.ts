/**
 * Native services barrel export.
 *
 * Initialization order matters:
 * 1. Platform detection (sync, immediate)
 * 2. Lifecycle listeners (sync)
 * 3. Game Center authentication (async, non-blocking)
 *
 * ATT + ad SDK init are deliberately NOT in initNativeServices — they are
 * triggered by the first user interaction on the start screen (the "Start
 * Your Fame Story" button). Calling ATTrackingManager too early during app
 * launch (while the scene isn't yet UIScene.ActivationState.foregroundActive)
 * silently resolves without showing the prompt. On iPadOS 26+ this is strict
 * enough that Apple's review team will reject the submission with
 * Guideline 2.1 — exactly what happened to Fame Life v1.0 build 9.
 *
 * Call `initNativeServices()` once from the app root.
 * Call `requestTrackingAndInitAds()` from the first user gesture.
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
export { requestTrackingPermission, hasTrackingConsent, getTrackingStatus } from "./privacy";
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

  // NOTE: ATT prompt + ad init deliberately NOT here. See header comment.
  // Call requestTrackingAndInitAds() from the start screen button tap.
  addBreadcrumb("init", "Native services initialized (ATT deferred to user gesture)");
}

/**
 * Trigger the App Tracking Transparency prompt and initialize the ad SDK.
 *
 * MUST be called from a user interaction handler (e.g. button onClick) to
 * guarantee the app is in foreground-active state. iOS silently suppresses
 * the ATT prompt if requested during app launch. Safe to call multiple
 * times — iOS only shows the prompt once per install, subsequent calls
 * resolve immediately with the cached decision.
 */
export async function requestTrackingAndInitAds(): Promise<void> {
  if (!isNative()) return;
  try {
    await requestTrackingPermission();
    await initializeAds();
  } catch {
    addBreadcrumb("init", "Ad initialization failed — continuing without ads");
  }
}
