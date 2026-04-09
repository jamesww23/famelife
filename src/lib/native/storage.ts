/**
 * Durable storage service.
 *
 * On iOS, WKWebView's localStorage can be purged by the OS under storage pressure.
 * This module wraps Capacitor Preferences (backed by UserDefaults on iOS) as the
 * primary store, with localStorage as a synchronous read fallback for web/dev.
 *
 * API is intentionally async — Preferences is async, and the game context
 * already uses useEffect for persistence.
 */

import { Preferences } from "@capacitor/preferences";
import { isNative } from "./platform";

/** Read a value. Tries Preferences first (native), then localStorage. */
export async function getItem(key: string): Promise<string | null> {
  if (isNative()) {
    const { value } = await Preferences.get({ key });
    if (value !== null) return value;
    // One-time migration: pull from localStorage if Preferences is empty
    try {
      const local = localStorage.getItem(key);
      if (local) {
        await Preferences.set({ key, value: local });
        return local;
      }
    } catch {
      // localStorage unavailable
    }
    return null;
  }
  // Web fallback
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Write a value to durable storage. */
export async function setItem(key: string, value: string): Promise<void> {
  if (isNative()) {
    await Preferences.set({ key, value });
    // Mirror to localStorage for immediate synchronous reads if needed
    try { localStorage.setItem(key, value); } catch { /* ok */ }
  } else {
    try { localStorage.setItem(key, value); } catch { /* storage full */ }
  }
}

/** Remove a value from storage. */
export async function removeItem(key: string): Promise<void> {
  if (isNative()) {
    await Preferences.remove({ key });
  }
  try { localStorage.removeItem(key); } catch { /* ok */ }
}
