"use client";

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          backgroundColor: "#000",
          color: "#fff",
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <title>Something went wrong — Riyura</title>
        <div
          aria-hidden
          style={{
            position: "fixed",
            inset: 0,
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          <div style={{ position: "absolute", inset: 0, background: "#000" }} />
          <div
            style={{
              position: "absolute",
              top: "-10%",
              left: "-10%",
              width: "60vw",
              height: "60vw",
              borderRadius: "9999px",
              background: "#155f75b5",
              opacity: 0.4,
              filter: "blur(130px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-10%",
              right: "-10%",
              width: "60vw",
              height: "60vw",
              borderRadius: "9999px",
              background: "#9a341299",
              opacity: 0.3,
              filter: "blur(130px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 50% 50%, transparent 20%, #000 100%)",
            }}
          />
        </div>

        <main
          style={{
            position: "relative",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "0 24px",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 9999,
              border: "1px solid rgba(239,68,68,0.3)",
              background: "rgba(239,68,68,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ef4444"
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
              margin: 0,
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              color: "#9ca3af",
              fontSize: 16,
              lineHeight: 1.6,
              margin: "12px 0 0",
              maxWidth: 420,
            }}
          >
            We ran into an unexpected error. Try again, or head back home.
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
            <button
              onClick={() => retry()}
              style={{
                background: "#fff",
                color: "#000",
                border: 0,
                borderRadius: 9999,
                padding: "12px 24px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <a
              href="/home"
              style={{
                background: "rgba(255,255,255,0.1)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 9999,
                padding: "12px 24px",
                fontSize: 14,
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              Back to Home
            </a>
          </div>
          {error?.digest && (
            <p
              style={{
                color: "rgba(255,255,255,0.2)",
                fontSize: 10,
                letterSpacing: "0.2em",
                marginTop: 40,
                textTransform: "uppercase",
              }}
            >
              Reference {error.digest}
            </p>
          )}
        </main>
      </body>
    </html>
  );
}
