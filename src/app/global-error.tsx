"use client";

import { useEffect } from "react";
import { captureError } from "@/lib/native/analytics";

/**
 * Root error boundary — catches errors that escape the layout itself.
 * Must render its own <html>/<body> because the layout has crashed.
 *
 * Inline styles only — no Tailwind, no global CSS, no client components,
 * because nothing above this is guaranteed to have loaded.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    captureError(error, { boundary: "global", digest: error.digest });
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
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
        <div style={{ fontSize: 56, marginBottom: 16 }}>💥</div>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px" }}>
          Fame Life crashed
        </h1>
        <p style={{ fontSize: 15, opacity: 0.85, maxWidth: 320, margin: "0 0 24px" }}>
          We&apos;ve logged the issue. Tap below to restart the app.
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
          Restart
        </button>
      </body>
    </html>
  );
}
