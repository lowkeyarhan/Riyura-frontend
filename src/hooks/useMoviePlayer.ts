import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/src/lib/auth/supabase";
import { TMDBMovieDetailsResponse } from "@/src/dto/tmdb/details";

const MIN_WATCH_DURATION = 60;
const WATCH_TIMER_INTERVAL = 1000;

interface UseMoviePlayerProps {
  movieId: string;
  userId: string | undefined;
  initialServerIndex?: number;
}

export function useMoviePlayer({
  movieId,
  userId,
  initialServerIndex = 0,
}: UseMoviePlayerProps) {
  const [movie, setMovie] = useState<TMDBMovieDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeServerIndex, setActiveServerIndex] =
    useState(initialServerIndex);

  const watchDuration = useRef(0);
  const watchTimer = useRef<NodeJS.Timeout | null>(null);
  const hasSavedWatch = useRef(false);

  // Refs for tracking current state in cleanup/unload
  const activeServerIndexRef = useRef(activeServerIndex);
  const movieRef = useRef(movie);

  // Update refs on state change
  useEffect(() => {
    activeServerIndexRef.current = activeServerIndex;
    movieRef.current = movie;
  }, [activeServerIndex, movie]);

  // Fetch movie data
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/movie/${movieId}`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setMovie(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (movieId) fetchMovie();
  }, [movieId]);

  // Watch history tracking
  useEffect(() => {
    watchTimer.current = setInterval(() => {
      watchDuration.current += 1;
    }, WATCH_TIMER_INTERVAL);

    return () => {
      if (watchTimer.current) clearInterval(watchTimer.current);
    };
  }, [userId, movieId]);

  const saveWatchHistoryOnUnmount = useCallback(
    (servers: any[]) => {
      if (
        !userId ||
        !movieRef.current ||
        hasSavedWatch.current ||
        watchDuration.current < MIN_WATCH_DURATION
      ) {
        return;
      }

      hasSavedWatch.current = true;
      const currentMovie = movieRef.current;
      const currentServerIndex = activeServerIndexRef.current;

      const watchData = {
        tmdb_id: parseInt(movieId),
        title: currentMovie.title,
        media_type: "movie" as const,
        stream_id: servers[currentServerIndex]?.id || "unknown",
        poster_path: currentMovie.poster_path,
        release_date: currentMovie.release_date,
        duration_sec: watchDuration.current,
        episode_length: currentMovie.runtime ? currentMovie.runtime * 60 : null,
      };

      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) return;
        fetch("/api/watch-history", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(watchData),
          keepalive: true,
        }).catch((err) => console.error("Failed to save watch history", err));
      });
    },
    [userId, movieId],
  );

  return {
    movie,
    loading,
    activeServerIndex,
    setActiveServerIndex,
    saveWatchHistoryOnUnmount,
  };
}
