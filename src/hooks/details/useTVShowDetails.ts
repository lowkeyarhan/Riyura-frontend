"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
import { useNotification } from "@/src/lib/contexts/NotificationContext";
import { supabase } from "@/src/lib/auth/supabase";
import { MediaType } from "@/src/props/global/mediaType";
import type { TvDetailProp } from "@/src/props/tv/tvDetail";
import type { MediaCardProp } from "@/src/props/global/mediaCard";

export function useTVShowDetails(id: string) {
  const router = useRouter();
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [tvShow, setTVShow] = useState<TvDetailProp | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [similarShows, setSimilarShows] = useState<MediaCardProp[]>([]);

  const fetchTVShowDetails = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/details/tv/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error ?? "Failed to fetch TV show details");
      }

      setTVShow(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setTVShow(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchSimilarShows = useCallback(async () => {
    if (!id) return;
    try {
      const response = await fetch(`/api/details/tv/${id}/similiar`);
      if (!response.ok) return;
      const data = await response.json();
      if (Array.isArray(data)) {
        setSimilarShows(data);
      }
    } catch {
      // silently fail — similar shows are non-critical
    }
  }, [id]);

  useEffect(() => {
    fetchTVShowDetails();
    fetchSimilarShows();
  }, [fetchTVShowDetails, fetchSimilarShows]);

  useEffect(() => {
    const checkWatchlistStatus = async () => {
      if (user && tvShow) {
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (session) {
            const res = await fetch(
              `/api/profile/watchlist?tmdbId=${tvShow.id}&mediaType=${MediaType.TV}`,
              {
                headers: {
                  Authorization: `Bearer ${session.access_token}`,
                },
              },
            );
            const data = await res.json();
            setIsWatchlisted(data.isInWatchlist);
          }
        } catch (err) {
          console.error("Error checking watchlist status:", err);
        }
      }
    };

    checkWatchlistStatus();
  }, [user, tvShow]);

  const toggleWatchlist = async () => {
    if (!user) {
      router.push("/auth");
      return;
    }

    if (!tvShow) return;

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        console.error("No session found");
        return;
      }

      if (isWatchlisted) {
        const res = await fetch("/api/profile/watchlist", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            tmdb_id: tvShow.id,
            media_type: MediaType.TV,
          }),
        });
        if (!res.ok) throw new Error("Failed to remove from watchlist");
      } else {
        const res = await fetch("/api/profile/watchlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            tmdb_id: tvShow.id,
            media_type: MediaType.TV,
          }),
        });

        if (!res.ok) throw new Error("Failed to add to watchlist");

        setIsWatchlisted(true);
        addNotification(`${tvShow.name} added to watchlist`, "success");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      addNotification("Failed to update watchlist", "error");
    }
  };

  return {
    tvShow,
    loading,
    error,
    isWatchlisted,
    showTrailer,
    setShowTrailer,
    toggleWatchlist,
    similarShows,
  };
}
