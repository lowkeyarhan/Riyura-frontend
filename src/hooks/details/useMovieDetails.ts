"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
import { useNotification } from "@/src/lib/contexts/NotificationContext";
import { supabase } from "@/src/lib/auth/supabase";
import { MediaType } from "@/src/props/global/mediaType";
import type { MovieDetailProp } from "@/src/props/movie/movieDetail";

export function useMovieDetails(id: string) {
  const router = useRouter();
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [movie, setMovie] = useState<MovieDetailProp | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovieDetails = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/details/movie/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error ?? "Failed to fetch movie details");
      }

      setMovie(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setMovie(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMovieDetails();
  }, [fetchMovieDetails]);

  useEffect(() => {
    const checkWatchlistStatus = async () => {
      if (user && movie) {
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (session) {
            const res = await fetch(
              `/api/profile/watchlist?tmdbId=${movie.id}&mediaType=${MediaType.Movie}`,
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
  }, [user, movie]);

  const toggleWatchlist = async () => {
    if (!user) {
      router.push("/auth");
      return;
    }

    if (!movie) return;

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
            tmdb_id: movie.id,
            media_type: MediaType.Movie,
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
            tmdb_id: movie.id,
            media_type: MediaType.Movie,
          }),
        });

        if (!res.ok) throw new Error("Failed to add to watchlist");

        addNotification(`${movie.title} added to watchlist`, "success");
      }

      setIsWatchlisted(!isWatchlisted);
    } catch (err) {
      console.error("❌ Error toggling watchlist:", err);
      addNotification("Failed to update watchlist", "error");
    }
  };

  return {
    movie,
    loading,
    error,
    isWatchlisted,
    showTrailer,
    setShowTrailer,
    toggleWatchlist,
  };
}
