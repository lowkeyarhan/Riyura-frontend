"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          backgroundColor: "#000",
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
          margin: 0,
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "0 24px",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "1.875rem", margin: 0 }}>
            Something went wrong
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", marginTop: "0.75rem" }}>
            An unexpected error occurred. Try again.
          </p>
          <button
            onClick={reset}
            style={{
              backgroundColor: "#fff",
              border: 0,
              borderRadius: "9999px",
              color: "#000",
              cursor: "pointer",
              fontWeight: 600,
              marginTop: "1.5rem",
              padding: "0.75rem 1.5rem",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
