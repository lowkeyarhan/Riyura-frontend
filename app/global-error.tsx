"use client";

import type { CSSProperties } from "react";

const page: CSSProperties = {
  backgroundColor: "#0a0e1a",
  color: "#fff",
  display: "flex",
  flexDirection: "column",
  fontFamily:
    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  margin: 0,
  minHeight: "100vh",
  overflow: "hidden",
  position: "relative",
};

const glow: CSSProperties = {
  background:
    "radial-gradient(circle at 15% 15%, rgba(6,182,212,0.10), transparent 45%), radial-gradient(circle at 85% 85%, rgba(249,115,22,0.12), transparent 45%), radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)",
  inset: 0,
  pointerEvents: "none",
  position: "absolute",
};

const primary: CSSProperties = {
  backgroundColor: "#fff",
  border: 0,
  borderRadius: 9999,
  color: "#000",
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 600,
  padding: "12px 24px",
};

const secondary: CSSProperties = {
  backgroundColor: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 9999,
  color: "rgba(255,255,255,0.7)",
  fontSize: 14,
  fontWeight: 500,
  padding: "12px 24px",
  textDecoration: "none",
};

export default function GlobalError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  const digest = (error as { digest?: string } | null)?.digest;

  return (
    <html lang="en">
      <body style={page}>
        <title>Something went wrong — Riyura</title>
        <div aria-hidden style={glow} />
        <header style={{ padding: "28px 32px", position: "relative" }}>
          <span
            style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.22em" }}
          >
            RIYURA
          </span>
        </header>
        <main
          style={{
            alignItems: "center",
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 24px 80px",
            position: "relative",
            textAlign: "center",
          }}
        >
          <div
            style={{
              alignItems: "center",
              backgroundColor: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 9999,
              display: "flex",
              height: 64,
              justifyContent: "center",
              width: 64,
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fb923c"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h1
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              margin: "24px 0 0",
            }}
          >
            Something went wrong.
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: 14,
              lineHeight: 1.6,
              margin: "12px 0 0",
              maxWidth: 420,
            }}
          >
            The app hit an unexpected error. Try again, or head back home.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              justifyContent: "center",
              marginTop: 32,
            }}
          >
            <button onClick={() => retry()} style={primary}>
              Try again
            </button>
            <a href="/home" style={secondary}>
              Back home
            </a>
          </div>
          {digest && (
            <p
              style={{
                color: "rgba(255,255,255,0.2)",
                fontSize: 10,
                letterSpacing: "0.2em",
                marginTop: 40,
                textTransform: "uppercase",
              }}
            >
              Reference {digest}
            </p>
          )}
        </main>
        <p
          style={{
            color: "rgba(255,255,255,0.2)",
            fontSize: 10,
            letterSpacing: "0.25em",
            paddingBottom: 24,
            position: "relative",
            textAlign: "center",
            textTransform: "uppercase",
          }}
        >
          Stream anything, anywhere, anytime.
        </p>
      </body>
    </html>
  );
}
