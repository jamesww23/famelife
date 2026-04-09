/**
 * Lightweight analytics and error reporting service.
 *
 * Provides a minimal, production-useful observability layer that:
 * - Captures errors with context breadcrumbs
 * - Tracks key game events for debugging
 * - Logs to console in dev, collects in memory for native
 * - Is shaped for easy Sentry or Firebase swap-in later
 *
 * This avoids adding a heavy SDK dependency for v1 while giving
 * real production debugging value.
 */

import { IS_DEV } from "./config";

// ── Types ────────────────────────────────────────────────

interface Breadcrumb {
  timestamp: number;
  category: string;
  message: string;
  data?: Record<string, unknown>;
}

interface CapturedError {
  timestamp: number;
  message: string;
  stack?: string;
  breadcrumbs: Breadcrumb[];
  tags: Record<string, string>;
}

// ── State ────────────────────────────────────────────────

const breadcrumbs: Breadcrumb[] = [];
const capturedErrors: CapturedError[] = [];
const MAX_BREADCRUMBS = 50;
const MAX_ERRORS = 20;
const tags: Record<string, string> = {};

// ── Public API ───────────────────────────────────────────

/** Set a persistent tag on all future error reports. */
export function setTag(key: string, value: string): void {
  tags[key] = value;
}

/** Add a breadcrumb for debugging context. */
export function addBreadcrumb(
  category: string,
  message: string,
  data?: Record<string, unknown>,
): void {
  const crumb: Breadcrumb = { timestamp: Date.now(), category, message, data };
  breadcrumbs.push(crumb);
  if (breadcrumbs.length > MAX_BREADCRUMBS) breadcrumbs.shift();
  if (IS_DEV) {
    console.debug(`[${category}] ${message}`, data ?? "");
  }
}

/** Capture an error with current breadcrumb context. */
export function captureError(error: unknown, context?: Record<string, unknown>): void {
  const err = error instanceof Error ? error : new Error(String(error));
  const entry: CapturedError = {
    timestamp: Date.now(),
    message: err.message,
    stack: err.stack,
    breadcrumbs: [...breadcrumbs],
    tags: { ...tags, ...(context ? { context: JSON.stringify(context) } : {}) },
  };
  capturedErrors.push(entry);
  if (capturedErrors.length > MAX_ERRORS) capturedErrors.shift();

  if (IS_DEV) {
    console.error("[analytics:error]", err.message, context ?? "");
  }
}

/** Log a named event (lightweight analytics). */
export function trackEvent(name: string, data?: Record<string, unknown>): void {
  addBreadcrumb("event", name, data);
}

// ── Convenience: ad observability ────────────────────────

export function trackAdEvent(
  action: "load" | "show" | "reward" | "error" | "click",
  adType: "interstitial" | "rewarded",
  data?: Record<string, unknown>,
): void {
  addBreadcrumb("ads", `${adType}:${action}`, data);
  if (action === "error") {
    captureError(new Error(`Ad ${action}: ${adType}`), data);
  }
}

/** Track a Game Center reporting outcome. */
export function trackGameCenter(
  action: "auth" | "achievement" | "leaderboard" | "error",
  data?: Record<string, unknown>,
): void {
  addBreadcrumb("gamecenter", action, data);
  if (action === "error") {
    captureError(new Error(`GameCenter ${action}`), data);
  }
}

// ── Debug access ─────────────────────────────────────────

/** Get recent errors (for debug screens or crash upload). */
export function getRecentErrors(): readonly CapturedError[] {
  return capturedErrors;
}

/** Get recent breadcrumbs. */
export function getRecentBreadcrumbs(): readonly Breadcrumb[] {
  return breadcrumbs;
}
