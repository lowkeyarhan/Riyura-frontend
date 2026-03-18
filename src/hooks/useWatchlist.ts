import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/src/lib/auth/supabase";
import { MediaType } from "@/src/props/global/mediaType";
import { WatchlistItem } from "@/src/dto/media";

export function useWatchlist(userId: string | undefined) {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!userId) {
        setLoading(false);
        setItems([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          console.error("[useWatchlist] No session found");
          setError("No active session");
          setLoading(false);
          return;
        }

        const res = await fetch("/api/profile/watchlist", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setItems(Array.isArray(data) ? data : []);
        } else {
          const errorText = await res.text();
          console.error("[useWatchlist] API error:", res.status, errorText);
          setError(`Failed to fetch watchlist: ${res.status}`);
          setItems([]);
        }
      } catch (err) {
        console.error("[useWatchlist] Error loading watchlist:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [userId]);

  const removeItem = useCallback(
    async (tmdbId: number, mediaType: "movie" | "tv") => {
      if (!userId) return { success: false };

      // Optimistic update
      const previousItems = [...items];
      const updated = items.filter((i) => i.tmdb_id !== tmdbId);
      setItems(updated);

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          console.error("No session found");
          setItems(previousItems);
          return { success: false };
        }

        const dbMediaType =
          mediaType === "movie" ? MediaType.Movie : MediaType.TV;
        const res = await fetch(
          `/api/profile/watchlist?tmdbId=${tmdbId}&mediaType=${dbMediaType}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          },
        );

        if (!res.ok) throw new Error("Failed to remove from watchlist");

        return { success: true };
      } catch (err) {
        // Revert on fail
        setItems(previousItems);
        console.error("Error removing:", err);
        return { success: false };
      }
    },
    [userId, items],
  );

  return {
    items,
    loading,
    error,
    removeItem,
  };
}
