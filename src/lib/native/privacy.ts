/**
 * App Tracking Transparency (ATT) service.
 *
 * Per Apple's docs, you MUST request ATT authorization before collecting
 * IDFA or enabling personalized ads. AppLovin MAX uses IDFA for higher
 * eCPMs, so we prompt before initializing ads.
 *
 * On web or pre-iOS 14, this is a no-op that returns "authorized".
 *
 * Reference: https://developer.apple.com/documentation/apptrackingtransparency
 */

import { isNative } from "./platform";
import { addBreadcrumb, captureError } from "./analytics";
import { registerPlugin } from "@capacitor/core";

// ── Plugin Bridge ────────────────────────────────────────

interface PrivacyPlugin {
  requestTrackingAuthorization(): Promise<{ status: ATTStatus }>;
  getTrackingStatus(): Promise<{ status: ATTStatus }>;
}

export type ATTStatus =
  | "authorized"
  | "denied"
  | "not-determined"
  | "restricted"
  | "unavailable";

const Privacy = registerPlugin<PrivacyPlugin>("PrivacyPlugin");

// ── State ────────────────────────────────────────────────

let cachedStatus: ATTStatus = "not-determined";

// ── Public API ───────────────────────────────────────────

/**
 * Request ATT permission. Should be called once during first app launch,
 * before initializing ad SDKs. Safe to call multiple times — iOS only
 * shows the prompt once.
 */
export async function requestTrackingPermission(): Promise<ATTStatus> {
  if (!isNative()) {
    cachedStatus = "authorized"; // Web doesn't need ATT
    return cachedStatus;
  }

  try {
    const { status } = await Privacy.requestTrackingAuthorization();
    cachedStatus = status;
    addBreadcrumb("privacy", `ATT result: ${status}`);
    return status;
  } catch (err) {
    captureError(err, { context: "ATT request" });
    cachedStatus = "unavailable";
    return cachedStatus;
  }
}

/** Get the current ATT status without prompting. */
export async function getTrackingStatus(): Promise<ATTStatus> {
  if (!isNative()) return "authorized";

  try {
    const { status } = await Privacy.getTrackingStatus();
    cachedStatus = status;
    return status;
  } catch {
    return cachedStatus;
  }
}

/** Whether we have ATT consent for personalized ads. */
export function hasTrackingConsent(): boolean {
  return cachedStatus === "authorized";
}
