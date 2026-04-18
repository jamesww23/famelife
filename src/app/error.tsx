"use client";

import { useEffect } from "react";
import { captureError } from "@/lib/native/analytics";

/**
 * Segment-level error boundary.
 * Catches render errors inside the route and surfaces a recoverable UI
 * instead of letting the WKWebView render a blank white screen — which is an
 * automatic App Store rejection trigger.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    captureError(error, { boundary: "segment", digest: error.digest });
  }, [error]);

  return (
    <main
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#fff",
        padding: "max(env(safe-area-inset-top), 24px) 24px max(env(safe-area-inset-bottom), 24px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ fontSize: 48, marginBottom: 12 }}>😵</div>
      <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 8px" }}>
        Something went sideways
      </h1>
      <p style={{ fontSize: 15, opacity: 0.85, maxWidth: 320, margin: "0 0 24px" }}>
        Fame Life hit an unexpected snag. Your save is safe — try again.
      </p>
      <button
        onClick={reset}
        style={{
          minHeight: 48,
          padding: "12px 28px",
          borderRadius: 14,
          border: "none",
          background: "#fff",
          color: "#764ba2",
          fontWeight: 700,
          fontSize: 16,
          cursor: "pointer",
        }}
      >
        Try again
      </button>
    </main>
  );
}
