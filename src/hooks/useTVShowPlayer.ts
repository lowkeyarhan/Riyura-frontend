import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/src/lib/auth/supabase";
import {
  TMDBEpisode,
  TMDBSeasonSummary,
  TMDBTVShowDetailsResponse,
} from "@/src/dto/tmdb/details";

const MIN_WATCH_DURATION = 60;
const WATCH_TIMER_INTERVAL = 1000;

interface UseTVShowPlayerProps {
  tvShowId: string;
  userId: string | undefined;
  initialSeason?: number;
  initialEpisode?: number;
  initialServerIndex?: number;
}

export function useTVShowPlayer({
  tvShowId,
  userId,
  initialSeason = 1,
  initialEpisode = 1,
  initialServerIndex = 0,
}: UseTVShowPlayerProps) {
  const [tvShow, setTvShow] = useState<TMDBTVShowDetailsResponse | null>(null);
  const [episodes, setEpisodes] = useState<TMDBEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(initialSeason);
  const [selectedEpisode, setSelectedEpisode] = useState(initialEpisode);
  const [activeServerIndex, setActiveServerIndex] =
    useState(initialServerIndex);

  const watchDuration = useRef(0);
  const watchTimer = useRef<NodeJS.Timeout | null>(null);
  const hasSavedWatch = useRef(false);

  // Refs for tracking current state in cleanup/unload
  const activeServerIndexRef = useRef(activeServerIndex);
  const tvShowRef = useRef(tvShow);
  const episodesRef = useRef(episodes);
  const selectedSeasonRef = useRef(selectedSeason);
  const selectedEpisodeRef = useRef(selectedEpisode);

  // Update refs on state change
  useEffect(() => {
    activeServerIndexRef.current = activeServerIndex;
    tvShowRef.current = tvShow;
    episodesRef.current = episodes;
    selectedSeasonRef.current = selectedSeason;
    selectedEpisodeRef.current = selectedEpisode;
  }, [activeServerIndex, tvShow, episodes, selectedSeason, selectedEpisode]);

  // Fetch TV show data
  useEffect(() => {
    const fetchShow = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/tvshow/${tvShowId}`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setTvShow(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (tvShowId) fetchShow();
  }, [tvShowId]);

  // Fetch episodes for selected season
  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const res = await fetch(
          `/api/tvshow/${tvShowId}/season/${selectedSeason}`,
        );
        if (!res.ok) return;
        const data = await res.json();
        setEpisodes(data.episodes || []);
      } catch (e) {
        console.error(e);
      }
    };
    if (tvShowId) fetchEpisodes();
  }, [tvShowId, selectedSeason]);

  // Watch history tracking
  useEffect(() => {
    watchTimer.current = setInterval(() => {
      watchDuration.current += 1;
    }, WATCH_TIMER_INTERVAL);

    const saveWatchHistory = (servers: any[]) => {
      if (
        !userId ||
        !tvShowRef.current ||
        hasSavedWatch.current ||
        watchDuration.current < MIN_WATCH_DURATION
      ) {
        return;
      }

      hasSavedWatch.current = true;
      const currentTvShow = tvShowRef.current;
      const currentEpisodes = episodesRef.current;
      const currentSeason = selectedSeasonRef.current;
      const currentEpisodeNum = selectedEpisodeRef.current;
      const currentServerIndex = activeServerIndexRef.current;

      const currentEpisodeData = currentEpisodes.find(
        (ep) => ep.episode_number === currentEpisodeNum,
      );

      const watchData = {
        tmdb_id: parseInt(tvShowId),
        title: `${currentTvShow.name}`,
        media_type: "TV" as const,
        stream_id: servers[currentServerIndex]?.id || "unknown",
        poster_path: currentTvShow.poster_path,
        backdrop_path: currentTvShow.backdrop_path,
        release_date: currentTvShow.first_air_date,
        duration_sec: watchDuration.current,
        season_number: currentSeason,
        episode_number: currentEpisodeNum,
        episode_name: currentEpisodeData?.name || null,
        episode_length: currentEpisodeData?.runtime
          ? currentEpisodeData.runtime * 60
          : null,
      };

      console.log("💾 Saving TV show watch history (interval):", {
        title: currentTvShow.name,
        season: currentSeason,
        episode: currentEpisodeNum,
        duration: watchDuration.current,
        media_type: "TV"
      });

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
        })
          .then(res => res.json())
          .then(data => console.log("✅ TV show watch history saved (interval):", data))
          .catch((err) => console.error("❌ Failed to save TV show watch history (interval):", err));
      });
    };

    return () => {
      if (watchTimer.current) clearInterval(watchTimer.current);
    };
  }, [userId, tvShowId]);

  const saveWatchHistoryOnUnmount = useCallback(
    (servers: any[]) => {
      if (
        !userId ||
        !tvShowRef.current ||
        hasSavedWatch.current ||
        watchDuration.current < MIN_WATCH_DURATION
      ) {
        return;
      }

      hasSavedWatch.current = true;
      const currentTvShow = tvShowRef.current;
      const currentEpisodes = episodesRef.current;
      const currentSeason = selectedSeasonRef.current;
      const currentEpisodeNum = selectedEpisodeRef.current;
      const currentServerIndex = activeServerIndexRef.current;

      const currentEpisodeData = currentEpisodes.find(
        (ep) => ep.episode_number === currentEpisodeNum,
      );

      const watchData = {
        tmdb_id: parseInt(tvShowId),
        title: `${currentTvShow.name}`,
        media_type: "TV" as const,
        stream_id: servers[currentServerIndex]?.id || "unknown",
        poster_path: currentTvShow.poster_path,
        backdrop_path: currentTvShow.backdrop_path,
        release_date: currentTvShow.first_air_date,
        duration_sec: watchDuration.current,
        season_number: currentSeason,
        episode_number: currentEpisodeNum,
        episode_name: currentEpisodeData?.name || null,
        episode_length: currentEpisodeData?.runtime
          ? currentEpisodeData.runtime * 60
          : null,
      };

      console.log("💾 Saving TV show watch history (unmount):", {
        title: currentTvShow.name,
        season: currentSeason,
        episode: currentEpisodeNum,
        duration: watchDuration.current,
        media_type: "TV"
      });

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
        })
          .then(res => res.json())
          .then(data => console.log("✅ TV show watch history saved (unmount):", data))
          .catch((err) => console.error("❌ Failed to save TV show watch history (unmount):", err));
      });
    },
    [userId, tvShowId],
  );

  const validSeasons = (tvShow?.seasons || []).filter(
    (s: TMDBSeasonSummary) => s.season_number !== 0 && s.episode_count > 0,
  );

  return {
    tvShow,
    episodes,
    loading,
    selectedSeason,
    selectedEpisode,
    activeServerIndex,
    validSeasons,
    setSelectedSeason,
    setSelectedEpisode,
    setActiveServerIndex,
    saveWatchHistoryOnUnmount,
  };
}
