import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/src/lib/auth/supabase";
import { WatchlistItem } from "@/src/dto/media";

export function useWatchlist(userId: string | undefined) {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          const res = await fetch("/api/watchlist", {
            headers: { Authorization: `Bearer ${session.access_token}` },
          });

          if (res.ok) {
            const data = await res.json();
            setItems(data || []);
          } else {
            throw new Error("Failed to fetch watchlist");
          }
        }
      } catch (err) {
        console.error("Error loading watchlist:", err);
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

        const res = await fetch(
          `/api/watchlist?tmdbId=${tmdbId}&mediaType=${mediaType}`,
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
    removeItem,
  };
}
