import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/src/lib/auth/supabase";
import { MediaType } from "@/src/props/global/mediaType";
import type { MediaCardProp } from "@/src/props/global/mediaCard";

export function useWatchlist(userId: string | undefined) {
  const [items, setItems] = useState<MediaCardProp[]>([]);
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
          setError("No active session");
          setLoading(false);
          return;
        }

        const res = await fetch("/api/profile/watchlist", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        const json = await res.json();

        if (!res.ok) {
          setError(json?.error ?? `Failed to fetch watchlist: ${res.status}`);
          setItems([]);
        } else {
          setItems(Array.isArray(json.data) ? json.data : []);
        }
      } catch (err) {
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

      const previousItems = [...items];
      setItems(items.filter((i) => i.tmdbId !== tmdbId));

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          setItems(previousItems);
          return { success: false };
        }

        const dbMediaType =
          mediaType === "movie" ? MediaType.Movie : MediaType.TV;

        const res = await fetch("/api/profile/watchlist", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ tmdb_id: tmdbId, media_type: dbMediaType }),
        });

        if (!res.ok) {
          setItems(previousItems);
          return { success: false };
        }

        return { success: true };
      } catch {
        setItems(previousItems);
        return { success: false };
      }
    },
    [userId, items],
  );

  return { items, loading, error, removeItem };
}
