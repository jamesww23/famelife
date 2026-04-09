/**
 * App lifecycle management.
 *
 * Handles iOS app suspend/resume events to:
 * - Save game state when backgrounded
 * - Resume audio context when foregrounded
 * - Track lifecycle events for debugging
 *
 * Reference: https://capacitorjs.com/docs/apis/app
 */

import { App } from "@capacitor/app";
import { isNative } from "./platform";
import { addBreadcrumb } from "./analytics";

type LifecycleCallback = () => void | Promise<void>;

let initialized = false;
const pauseCallbacks: LifecycleCallback[] = [];
const resumeCallbacks: LifecycleCallback[] = [];

/**
 * Register lifecycle listeners. Call once at app startup.
 */
export function initLifecycle(): void {
  if (initialized) return;
  initialized = true;

  if (!isNative()) return;

  App.addListener("appStateChange", async ({ isActive }) => {
    addBreadcrumb("lifecycle", isActive ? "resume" : "pause");

    if (isActive) {
      for (const cb of resumeCallbacks) {
        try { await cb(); } catch { /* don't crash on resume */ }
      }
    } else {
      for (const cb of pauseCallbacks) {
        try { await cb(); } catch { /* don't crash on pause */ }
      }
    }
  });

  // Handle deep links / URL opens (future use)
  App.addListener("appUrlOpen", ({ url }) => {
    addBreadcrumb("lifecycle", "url-open", { url });
  });
}

/** Register a callback to run when the app is backgrounded. */
export function onPause(cb: LifecycleCallback): void {
  pauseCallbacks.push(cb);
}

/** Register a callback to run when the app is foregrounded. */
export function onResume(cb: LifecycleCallback): void {
  resumeCallbacks.push(cb);
}
