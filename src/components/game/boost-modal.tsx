"use client";

import { useState, useEffect } from "react";
import { useGame } from "@/state/game-context";
import { playBoost, playTap } from "@/lib/sounds";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { showRewardedAd } from "@/lib/native";
import { addBreadcrumb, captureError } from "@/lib/native/analytics";

const SHARE_URL = "https://famelife.vercel.app";

export function BoostModal() {
  const { state, onAcceptBoost, onDeclineBoost } = useGame();
  const boost = state.pendingBoost;
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<"ad" | "share" | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const ref = useFocusTrap<HTMLDivElement>(!!boost && !loading);

  useEffect(() => {
    if (boost) playBoost();
  }, [boost]);

  if (!boost) return null;

  // Watch Ad path: actually call the ad SDK. Only grants the boost on real
  // reward callback. If the SDK has no fill, init failed, or the user closed
  // the ad early, surface a short error and let them pick another option.
  const handleWatchAd = async () => {
    setMethod("ad");
    setLoading(true);
    setErrorMsg(null);
    try {
      const rewarded = await showRewardedAd();
      if (rewarded) {
        addBreadcrumb("boost", "rewarded ad granted");
        onAcceptBoost();
      } else {
        addBreadcrumb("boost", "rewarded ad not available or skipped");
        setLoading(false);
        setErrorMsg("Ad not available right now — try another option.");
      }
    } catch (err) {
      captureError(err, { context: "boost-watch-ad" });
      setLoading(false);
      setErrorMsg("Ad failed to load — try another option.");
    }
  };

  // Share path: trigger the OS share sheet. iOS WKWebView requires the
  // navigator.share() call to happen synchronously inside the click handler
  // to preserve the user-gesture context. Don't await any setState before it.
  const handleShare = () => {
    setMethod("share");
    setErrorMsg(null);

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      const sharePromise = navigator.share({
        title: "Fame Life",
        text: `${boost.emoji} ${boost.name} — boost activated in Fame Life!`,
        url: SHARE_URL,
      });
      setLoading(true);
      sharePromise
        .then(() => {
          addBreadcrumb("boost", "share completed, granting boost");
          onAcceptBoost();
        })
        .catch((err: unknown) => {
          // AbortError is the expected "user cancelled the share sheet" path.
          // Anything else is a real error worth logging.
          const isAbort = err instanceof Error && err.name === "AbortError";
          if (!isAbort) captureError(err, { context: "boost-share" });
          setLoading(false);
          setErrorMsg(isAbort ? null : "Share failed — try another option.");
        });
    } else {
      // No native share API available (older browsers / weird WebView setups).
      // Fall back to clipboard so the user still has SOMETHING for free.
      const text = `${boost.emoji} ${boost.name} — playing Fame Life! ${SHARE_URL}`;
      const writePromise = navigator.clipboard?.writeText
        ? navigator.clipboard.writeText(text)
        : Promise.reject(new Error("Clipboard API unavailable"));
      setLoading(true);
      writePromise
        .then(() => {
          addBreadcrumb("boost", "share fallback: copied to clipboard");
          // Brief pause so the loading state is visible — feels intentional.
          setTimeout(() => onAcceptBoost(), 600);
        })
        .catch(() => {
          setLoading(false);
          setErrorMsg("Sharing isn't available on this device.");
        });
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="boost-title"
      ref={ref}
      onKeyDown={(e) => {
        if (e.key === "Escape" && !loading) onDeclineBoost();
      }}
      className="boost-overlay fixed inset-0 flex items-center justify-center z-50 p-4 animate-fade-in"
    >
      <div className="game-card p-5 sm:p-6 w-full max-w-[calc(100%-2rem)] sm:max-w-sm animate-scale-in">
        {loading ? (
          <div className="text-center py-8" aria-live="polite">
            <div className="text-4xl mb-3 animate-pulse">{boost.emoji}</div>
            <p className="text-gray-500 font-medium">
              {method === "ad" ? "Loading ad..." : "Sharing..."}
            </p>
            <div className="w-48 h-2 bg-gray-100 rounded-full mx-auto mt-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#e040fb] to-[#ff6b9d] rounded-full animate-pulse"
                style={{ width: "60%" }}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-4">
              <div className="text-4xl sm:text-5xl mb-2" aria-hidden="true">{boost.emoji}</div>
              <h3 id="boost-title" className="text-lg sm:text-xl font-black text-gray-900">{boost.name}</h3>
              <p className="text-gray-500 text-sm mt-1">{boost.description}</p>
            </div>

            {/* Effect preview */}
            <div className="flex flex-wrap justify-center gap-2 mb-5">
              {Object.entries(boost.effects).filter(([,v]) => v !== 0).map(([key, val]) => {
                const emojiMap: Record<string, string> = {
                  followers: "👥", fame: "⭐", reputation: "🛡️",
                  money: "💰", energy: "⚡", mentalHealth: "🧠",
                };
                const v = val as number;
                return (
                  <span key={key} className="text-sm font-bold text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-full">
                    {emojiMap[key]} +{Math.abs(v) >= 1000 ? `${(v/1000).toFixed(0)}K` : v}
                  </span>
                );
              })}
            </div>

            {/* Optional, non-blocking error feedback (e.g. ad couldn't load). */}
            {errorMsg && (
              <p
                role="status"
                className="text-center text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg py-2 px-3 mb-3"
              >
                {errorMsg}
              </p>
            )}

            {/* Optionality note — required by Apple guideline 3.2.1: rewarded ads must be clearly optional */}
            <p className="text-center text-[11px] text-gray-400 mb-3">
              Optional bonus — pick any option below
            </p>

            {/* Action buttons — Watch Ad and Skip share equal visual weight; Apple guideline 3.2.1 */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => { playTap(); handleWatchAd(); }}
                aria-label="Watch a short ad to receive this bonus"
                className="w-full py-3.5 bg-gradient-to-r from-[#e040fb] to-[#ff6b9d] text-white rounded-xl font-bold text-base hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg min-h-[48px]"
                style={{ boxShadow: "0 4px 20px rgba(224, 64, 251, 0.3)" }}
              >
                ▶️ Watch Ad
              </button>
              <button
                type="button"
                onClick={() => { playTap(); handleShare(); }}
                aria-label="Share with friends to receive this bonus"
                className="w-full py-3.5 bg-[#00e5ff] text-gray-900 rounded-xl font-bold text-base hover:scale-[1.02] active:scale-[0.98] transition-all min-h-[48px]"
                style={{ boxShadow: "0 4px 16px rgba(0, 229, 255, 0.25)" }}
              >
                Share with Friends
              </button>
              <button
                type="button"
                onClick={() => { playTap(); onDeclineBoost(); }}
                aria-label="Skip this bonus and continue"
                className="w-full py-3.5 bg-gray-100 text-gray-700 rounded-xl font-bold text-base hover:bg-gray-200 active:scale-[0.98] transition-all min-h-[48px]"
              >
                No Thanks
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
