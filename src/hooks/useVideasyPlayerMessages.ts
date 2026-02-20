"use client";

import { useEffect } from "react";

const VIDEASY_ORIGIN = "https://player.videasy.net";

/**
 * Listens for postMessage events from the videasy player (player.videasy.net).
 * Use for watch progress tracking. Logs when the player page is closed.
 *
 * Videasy URL structure (from docs):
 * - Anime shows: https://player.videasy.net/anime/{anilist_id}/{episode}?dub=true|false
 * - Anime movies: https://player.videasy.net/anime/{anilist_id}?dub=true|false
 * - TV: https://player.videasy.net/tv/{id}/{season}/{episode}
 */
export function useVideasyPlayerMessages() {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from videasy player
      if (event.origin !== VIDEASY_ORIGIN) return;

      try {
        if (typeof event.data === "string") {
          const parsed = JSON.parse(event.data);
          console.log("Message received from videasy player:", parsed);
          // TODO: Use parsed data for watch progress tracking
        } else if (typeof event.data === "object") {
          console.log("Message received from videasy player:", event.data);
        }
      } catch {
        // Not JSON, log raw string
        if (typeof event.data === "string") {
          console.log(
            "Message received from videasy player (raw):",
            event.data,
          );
        }
      }
    };

    const logPlayerPageClosed = (reason: string) => {
      console.log("[Videasy] Player page closed:", reason);
    };

    const handleBeforeUnload = () => {
      logPlayerPageClosed("tab/browser closed or navigated away");
    };

    const handlePageHide = () => {
      logPlayerPageClosed("page hidden (tab switch, minimize, etc.)");
    };

    window.addEventListener("message", handleMessage);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("message", handleMessage);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handlePageHide);
      logPlayerPageClosed("navigated away within app");
    };
  }, []);
}
