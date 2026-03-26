import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { supabase } from "@/src/lib/auth/supabase";
import { MediaType } from "@/src/props/global/mediaType";
import {
  TvPlayerProp,
  TvPlayerEpisode,
  TvPlayerSeason,
} from "@/src/props/tv/tvPlayer";
import { ProviderProp } from "@/src/props/global/provider";
import { HistoryProp } from "@/src/props/profile/history";

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
  const [tvShow, setTvShow] = useState<TvPlayerProp | null>(null);
  const [servers, setServers] = useState<ProviderProp[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(initialSeason);
  const [selectedEpisode, setSelectedEpisode] = useState(initialEpisode);
  const [activeServerIndex, setActiveServerIndex] =
    useState(initialServerIndex);

  const watchDuration = useRef(0);
  const watchTimer = useRef<NodeJS.Timeout | null>(null);
  const hasSavedWatch = useRef(false);

  const activeServerIndexRef = useRef(activeServerIndex);
  const tvShowRef = useRef(tvShow);
  const serversRef = useRef(servers);
  const selectedSeasonRef = useRef(selectedSeason);
  const selectedEpisodeRef = useRef(selectedEpisode);

  useEffect(() => {
    activeServerIndexRef.current = activeServerIndex;
    tvShowRef.current = tvShow;
    serversRef.current = servers;
    selectedSeasonRef.current = selectedSeason;
    selectedEpisodeRef.current = selectedEpisode;
  }, [activeServerIndex, tvShow, servers, selectedSeason, selectedEpisode]);

  // Fetch TV show data (once, on mount)
  useEffect(() => {
    const fetchShow = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/player/tv/${tvShowId}`);
        if (res.ok) {
          const data = await res.json();
          setTvShow(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    if (tvShowId) fetchShow();
  }, [tvShowId]);

  // Fetch stream URLs whenever season or episode changes
  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const body: Record<string, unknown> = {
          tmdbId: parseInt(tvShowId),
          seasonNo: selectedSeason,
          episodeNo: selectedEpisode,
        };

        const {
          data: { session },
        } = await supabase.auth.getSession();
        const authHeader = session?.access_token
          ? `Bearer ${session.access_token}`
          : null;

        const res = await fetch(`/api/stream/tv`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(authHeader ? { Authorization: authHeader } : {}),
          },
          body: JSON.stringify(body),
        });

        if (res.ok) {
          const data = await res.json();
          setServers(data);
          // Reset to first server when changing episodes
          setActiveServerIndex(0);
        }
      } catch (e) {
        console.error(e);
      }
    };

    if (tvShowId) fetchStreams();
  }, [tvShowId, selectedSeason, selectedEpisode]);

  // Watch duration tracking
  useEffect(() => {
    watchTimer.current = setInterval(() => {
      watchDuration.current += 1;
    }, WATCH_TIMER_INTERVAL);

    return () => {
      if (watchTimer.current) clearInterval(watchTimer.current);
    };
  }, [userId, tvShowId]);

  const saveWatchHistoryOnUnmount = useCallback(() => {
    if (
      !userId ||
      !tvShowRef.current ||
      hasSavedWatch.current ||
      watchDuration.current < 0
    ) {
      return;
    }

    hasSavedWatch.current = true;
    const providerId =
      serversRef.current[activeServerIndexRef.current]?.id || "unknown";

    const currentSeason = tvShowRef.current.seasons.find(
      (s: TvPlayerSeason) => s.season_number === selectedSeasonRef.current,
    );
    const currentEpisode = currentSeason?.episodes?.find(
      (e: TvPlayerEpisode) => e.episode_number === selectedEpisodeRef.current,
    );

    const watchData: HistoryProp = {
      tmdbId: parseInt(tvShowId),
      title: tvShowRef.current.title,
      backdropPath: null,
      mediaType: MediaType.TV,
      providerId,
      durationSec: watchDuration.current,
      episodeLength: null,
      episodeName: currentEpisode?.name ?? null,
      episodeNumber: selectedEpisodeRef.current,
      seasonNumber: selectedSeasonRef.current,
      isAnime: tvShowRef.current.is_anime,
      releaseYear: null,
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return;
      console.log("📝 Saving TV watch history", {
        tmdbId: watchData.tmdbId,
        providerId: watchData.providerId,
        seasonNumber: watchData.seasonNumber,
        episodeNumber: watchData.episodeNumber,
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
            console.error("❌ TV watch history save failed", {
              status: res.status,
              payload,
            });
            return;
          }
          console.log("✅ TV show watch history saved", payload);
        })
        .catch((err) =>
          console.error("❌ Failed to save TV show watch history:", err),
        );
    });
  }, [userId, tvShowId]);

  // Derive episodes from tvShow data for the selected season
  const episodes = useMemo((): TvPlayerEpisode[] => {
    if (!tvShow) return [];
    const season = tvShow.seasons.find(
      (s: TvPlayerSeason) => s.season_number === selectedSeason,
    );
    return season?.episodes || [];
  }, [tvShow, selectedSeason]);

  // Filter out season 0 (specials) and empty seasons
  const validSeasons = useMemo((): TvPlayerSeason[] => {
    return (tvShow?.seasons || []).filter(
      (s: TvPlayerSeason) => s.season_number !== 0 && s.episode_count > 0,
    );
  }, [tvShow]);

  return {
    tvShow,
    servers,
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
