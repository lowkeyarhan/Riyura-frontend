import { useState, useEffect, useCallback } from "react";
import { getSupabaseSession } from "@/src/lib/auth/getSession";
import { api } from "@/src/lib/api";
import { MediaType } from "@riyura/props/global/mediaType";
import type { MediaCardProp } from "@riyura/props/global/mediaCard";

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
        const session = await getSupabaseSession();
        if (!session) {
          setError("No active session");
          setLoading(false);
          return;
        }

        const res = await api.request("/api/profile/watchlist", {
          auth: true,
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
      const dbMediaType =
        mediaType === "movie" ? MediaType.Movie : MediaType.TV;
      setItems((current) =>
        current.filter(
          (i) => !(i.tmdbId === tmdbId && i.media_type === dbMediaType),
        ),
      );

      try {
        const session = await getSupabaseSession();
        if (!session) {
          setItems(previousItems);
          return { success: false };
        }

        const res = await api.request("/api/profile/watchlist", {
          method: "DELETE",
          auth: true,
          body: { tmdb_id: tmdbId, media_type: dbMediaType },
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
