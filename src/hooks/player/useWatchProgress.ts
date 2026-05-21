import { useEffect, useRef, useCallback } from "react";

interface UseWatchProgressOptions {
  serverName?: string;
  isNanovue: boolean;
  initialProgressSec?: number;
  onProgress: (durationSec: number) => void;
}

/**
 * Tracks watch progress from iframe message events (Ironlink, Dormannu, Syntherion)
 * or via a local timer for the Nanovue server.
 *
 * - Non-Nanovue: extracts `watched` / `timestamp` from postMessage events
 * - Nanovue: increments a local timer every second, seeded from `initialProgressSec`
 * - Logs watched duration every 10s; calls `onProgress` so the caller can sync URL + post history
 * - No localStorage usage
 */
export function useWatchProgress({
  serverName,
  isNanovue,
  initialProgressSec = 0,
  onProgress,
}: UseWatchProgressOptions) {
  // The latest known progress in seconds (from either messages or timer)
  const latestProgressRef = useRef<number>(initialProgressSec);

  // Stable ref for the callback so effects don't need to re-run on re-render
  const onProgressRef = useRef(onProgress);
  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);

  const previousServerRef = useRef<string | undefined>(serverName);
  const isNanovueRef = useRef(isNanovue);
  useEffect(() => {
    isNanovueRef.current = isNanovue;
  }, [isNanovue]);

  // ──────────────────────────────────────────────────────────────────────────
  // 1. Log + notify when the server changes
  // ──────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (serverName !== undefined && serverName !== previousServerRef.current) {
      const prev = previousServerRef.current;
      previousServerRef.current = serverName;

      console.log(`🔄 Server changed: ${prev ?? "—"} → ${serverName}`);

      // If switching TO Nanovue, seed its timer from the last known progress
      if (isNanovue) {
        console.log(
          `🎬 Seeding Nanovue timer from ${latestProgressRef.current.toFixed(2)}s`,
        );
        // latestProgressRef already holds the previous server's progress;
        // the Nanovue timer effect below will pick it up.
      } else {
        // Switching away from Nanovue (or between non-Nanovue servers):
        // keep the accumulated value so history is correct if they switch back
      }
    }
  }, [serverName, isNanovue]);

  // ──────────────────────────────────────────────────────────────────────────
  // 2a. Non-Nanovue: listen for postMessage events
  // ──────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isNanovue) return;

    const handleMessage = (event: MessageEvent) => {
      // Ironlink (vidlink.pro) — MEDIA_DATA event
      if (
        event.origin === "https://vidlink.pro" ||
        event.origin.includes("vidlink")
      ) {
        if (event.data?.type === "MEDIA_DATA") {
          const data = event.data.data;
          // The data object is a map of id → entry; grab the first entry's progress
          const firstKey = Object.keys(data)[0];
          const watched =
            firstKey && data[firstKey]?.progress?.watched !== undefined
              ? Number(data[firstKey].progress.watched)
              : data?.progress?.watched !== undefined
                ? Number(data.progress.watched)
                : null;

          if (watched !== null) {
            latestProgressRef.current = watched;
          }
          return;
        }
      }

      // Syntherion — string-encoded JSON with PLAYER_EVENT envelope
      // Structure: { type: "PLAYER_EVENT", data: { event, currentTime, duration, ... } }
      // Dormannu  — flat structure: { progress, timestamp|duration, ... }
      if (typeof event.data === "string") {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed && typeof parsed === "object") {
            // Syntherion: PLAYER_EVENT envelope
            if (
              parsed.type === "PLAYER_EVENT" &&
              parsed.data &&
              typeof parsed.data === "object" &&
              "currentTime" in parsed.data
            ) {
              latestProgressRef.current = Number(parsed.data.currentTime ?? 0);
              return;
            }
            // Dormannu: flat structure
            if (
              "progress" in parsed &&
              ("timestamp" in parsed || "duration" in parsed)
            ) {
              latestProgressRef.current = Number(parsed.timestamp ?? 0);
            }
          }
        } catch {
          // Non-JSON strings — ignore
        }
      }
      // Syntherion / Dormannu delivered as an already-parsed object
      else if (event.data && typeof event.data === "object") {
        const d = event.data as Record<string, unknown>;
        // Syntherion object form
        if (
          d.type === "PLAYER_EVENT" &&
          d.data &&
          typeof d.data === "object" &&
          "currentTime" in (d.data as object)
        ) {
          latestProgressRef.current = Number(
            (d.data as Record<string, unknown>).currentTime ?? 0,
          );
        }
        // Dormannu object form
        else if ("progress" in d && ("timestamp" in d || "duration" in d)) {
          const ts = Number(d.timestamp ?? 0);
          latestProgressRef.current = ts;
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [isNanovue]);

  // ──────────────────────────────────────────────────────────────────────────
  // 2b. Nanovue: local timer (starts from latestProgressRef which may be seeded)
  // ──────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isNanovue) return;

    const timer = setInterval(() => {
      latestProgressRef.current += 1;
    }, 1000);

    return () => clearInterval(timer);
  }, [isNanovue]);

  // ──────────────────────────────────────────────────────────────────────────
  // 3. Every 10 seconds: call onProgress to keep URL/state up to date
  // ──────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const intervalId = setInterval(() => {
      const seconds = latestProgressRef.current;
      onProgressRef.current(seconds);
    }, 10000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Expose a getter so the page component can read the latest value on unmount
  const getLatestProgress = useCallback(() => latestProgressRef.current, []);

  // Expose a setter to force update the progress when remote sync is applied
  const setProgress = useCallback((sec: number) => {
    latestProgressRef.current = sec;
  }, []);

  return { getLatestProgress, setProgress };
}
