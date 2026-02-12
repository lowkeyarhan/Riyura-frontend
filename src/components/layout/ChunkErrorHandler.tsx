"use client";

import { useEffect } from "react";

export function ChunkErrorHandler() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const isChunkError =
        event.message?.includes("Failed to fetch") ||
        event.message?.includes("ChunkLoadError") ||
        event.message?.includes("Loading chunk") ||
        event.message?.includes("Failed to load");

      if (isChunkError) {
        console.warn("Chunk loading error detected, reloading...");
        event.preventDefault();
        window.location.reload();
      }
    };

    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("error", handleError);
    };
  }, []);

  return null;
}
