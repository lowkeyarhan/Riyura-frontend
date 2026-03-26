import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/src/lib/auth/supabase";
import { MediaType } from "@/src/props/global/mediaType";
import { MoviePlayerProp } from "@/src/props/movie/moviePlayer";
import { ProviderProp } from "@/src/props/global/provider";
import { HistoryProp } from "@/src/props/profile/history";

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
  const [movie, setMovie] = useState<MoviePlayerProp | null>(null);
  const [servers, setServers] = useState<ProviderProp[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeServerIndex, setActiveServerIndex] =
    useState(initialServerIndex);

  const watchDuration = useRef(0);
  const watchTimer = useRef<NodeJS.Timeout | null>(null);
  const hasSavedWatch = useRef(false);

  const activeServerIndexRef = useRef(activeServerIndex);
  const movieRef = useRef(movie);
  const serversRef = useRef(servers);

  useEffect(() => {
    activeServerIndexRef.current = activeServerIndex;
    movieRef.current = movie;
    serversRef.current = servers;
  }, [activeServerIndex, movie, servers]);

  // Fetch movie data and stream URLs in parallel
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const streamBody: Record<string, unknown> = {
          tmdbId: parseInt(movieId),
        };

        const {
          data: { session },
        } = await supabase.auth.getSession();
        const authHeader = session?.access_token
          ? `Bearer ${session.access_token}`
          : null;

        const [movieRes, streamRes] = await Promise.all([
          fetch(`/api/player/movie/${movieId}`),
          fetch(`/api/stream/movie`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(authHeader ? { Authorization: authHeader } : {}),
            },
            body: JSON.stringify(streamBody),
          }),
        ]);

        if (movieRes.ok) {
          const data = await movieRes.json();
          setMovie(data);
        }

        if (streamRes.ok) {
          const data = await streamRes.json();
          setServers(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    if (movieId) fetchAll();
  }, [movieId]);

  // Watch duration tracking
  useEffect(() => {
    watchTimer.current = setInterval(() => {
      watchDuration.current += 1;
    }, WATCH_TIMER_INTERVAL);

    return () => {
      if (watchTimer.current) clearInterval(watchTimer.current);
    };
  }, [userId, movieId]);

  const saveWatchHistoryOnUnmount = useCallback(() => {
    if (
      !userId ||
      !movieRef.current ||
      hasSavedWatch.current ||
      watchDuration.current < 0
    ) {
      return;
    }

    hasSavedWatch.current = true;
    const providerId =
      serversRef.current[activeServerIndexRef.current]?.id || "unknown";
    const watchData: HistoryProp = {
      tmdbId: parseInt(movieId),
      title: movieRef.current.title,
      backdropPath: null,
      mediaType: MediaType.Movie,
      providerId,
      durationSec: watchDuration.current,
      episodeLength: null,
      episodeName: null,
      episodeNumber: null,
      seasonNumber: null,
      isAnime: movieRef.current.is_anime,
      releaseYear: null,
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return;
      console.log("📝 Saving movie watch history", {
        tmdbId: watchData.tmdbId,
        providerId: watchData.providerId,
        durationSec: watchData.durationSec,
      });
      fetch("/api/profile/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(watchData),
        keepalive: true,
      })
        .then(async (res) => {
          const payload = await res.json().catch(() => null);
          if (!res.ok) {
            console.error("❌ Movie watch history save failed", {
              status: res.status,
              payload,
            });
            return;
          }
          console.log("✅ Movie watch history saved", payload);
        })
        .catch((err) =>
          console.error("❌ Failed to save movie watch history:", err),
        );
    });
  }, [userId, movieId]);

  return {
    movie,
    servers,
    loading,
    activeServerIndex,
    setActiveServerIndex,
    saveWatchHistoryOnUnmount,
  };
}
