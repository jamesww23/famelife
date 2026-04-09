/**
 * Platform detection utilities.
 * Determines whether we're running inside a Capacitor native shell
 * or in a plain browser context.
 */

import { Capacitor } from "@capacitor/core";

/** True when running inside a native iOS/Android shell. */
export function isNative(): boolean {
  return Capacitor.isNativePlatform();
}

/** True when running on iOS (native or Safari). */
export function isIOS(): boolean {
  return Capacitor.getPlatform() === "ios";
}

/** True when running in a plain web browser (not native). */
export function isWeb(): boolean {
  return Capacitor.getPlatform() === "web";
}
