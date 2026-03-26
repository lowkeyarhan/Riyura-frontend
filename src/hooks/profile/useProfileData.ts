import { useState, useEffect, useRef, useCallback } from "react";
import { getSupabaseSession } from "@/src/lib/auth/getSession";
import { Film, Tv, Clock } from "lucide-react";
import { Stat } from "@/src/components/profile/StatBadge";
import { HistoryProp } from "@/src/props/profile/history";
import { MediaType } from "@/src/props/global/mediaType";
import { imageConfig } from "@/src/lib/config";
import type { WatchlistItemShape } from "@/src/components/profile/WatchlistSection";

export interface ContinueWatchingItem {
  id: number;
  tmdbId: number;
  title: string;
  progress: number;
  image: string;
  type: string;
  year: number | null;
  remaining: string;
  mediaType: MediaType;
  seasonNumber?: number | null;
  episodeNumber?: number | null;
  streamId: string;
}

const INITIAL_STATS: Stat[] = [
  { label: "Movies", value: "0", icon: Film, color: "text-cyan-400" },
  { label: "Series", value: "0", icon: Tv, color: "text-orange-400" },
  { label: "Hours", value: "0", icon: Clock, color: "text-purple-400" },
];

function getBackdropUrl(backdropPath: string | null): string {
  if (!backdropPath) return "/placeholder-image.jpg";
  return `${imageConfig.w780}${backdropPath.startsWith("/") ? backdropPath : `/${backdropPath}`}`;
}

function computeStats(items: HistoryProp[]): Stat[] {
  const moviesCount = items.filter(
    (i) => i.mediaType === MediaType.Movie,
  ).length;
  const seriesCount = new Set(
    items.filter((i) => i.mediaType !== MediaType.Movie).map((i) => i.tmdbId),
  ).size;
  const hoursCount = Math.round(
    items.reduce((acc, i) => acc + (i.durationSec ?? 0), 0) / 3600,
  );

  return [
    { ...INITIAL_STATS[0], value: moviesCount.toString() },
    { ...INITIAL_STATS[1], value: seriesCount.toString() },
    { ...INITIAL_STATS[2], value: hoursCount.toString() },
  ];
}

function mapHistoryItem(item: HistoryProp): ContinueWatchingItem {
  const fallbackLength = item.mediaType === MediaType.Movie ? 7200 : 2700;
  const totalLength = Math.max(60, item.episodeLength ?? fallbackLength);
  const watchedSeconds = Math.max(0, item.durationSec ?? 0);
  const remainingSeconds = Math.max(0, totalLength - watchedSeconds);

  const type =
    item.mediaType === MediaType.Movie
      ? MediaType.Movie
      : item.episodeName
        ? `S${item.seasonNumber} E${item.episodeNumber}: ${item.episodeName}`
        : `S${item.seasonNumber} E${item.episodeNumber}`;

  return {
    id: item.tmdbId,
    tmdbId: item.tmdbId,
    title: item.title,
    progress: Math.min(100, Math.round((watchedSeconds / totalLength) * 100)),
    image: getBackdropUrl(item.backdropPath),
    type,
    year: item.releaseYear,
    remaining:
      remainingSeconds === 0
        ? "Completed"
        : `${Math.ceil(remainingSeconds / 60)}m remaining`,
    mediaType: item.mediaType,
    seasonNumber: item.seasonNumber,
    episodeNumber: item.episodeNumber,
    streamId: item.providerId ?? "",
  };
}

interface ProfileData {
  continueWatching: ContinueWatchingItem[];
  watchlist: WatchlistItemShape[];
  stats: Stat[];
  isLoadingHistory: boolean;
  isLoadingWatchlist: boolean;
  dataInitialized: boolean;
  refetch: () => void;
  setContinueWatching: React.Dispatch<
    React.SetStateAction<ContinueWatchingItem[]>
  >;
}

export function useProfileData(userId: string | undefined): ProfileData {
  const [continueWatching, setContinueWatching] = useState<
    ContinueWatchingItem[]
  >([]);
  const [watchlist, setWatchlist] = useState<WatchlistItemShape[]>([]);
  const [stats, setStats] = useState(INITIAL_STATS);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isLoadingWatchlist, setIsLoadingWatchlist] = useState(true);
  const [dataInitialized, setDataInitialized] = useState(false);
  const fetchingRef = useRef(false);

  const fetchAllData = useCallback(async () => {
    if (!userId || fetchingRef.current) return;

    fetchingRef.current = true;

    try {
      setIsLoadingHistory(true);
      setIsLoadingWatchlist(true);

      const session = await getSupabaseSession();
      if (!session) return;

      const authHeader = `Bearer ${session.access_token}`;

      const [historyRes, watchlistRes] = await Promise.all([
        fetch("/api/profile/history?page=0", {
          headers: { Authorization: authHeader },
        }),
        fetch("/api/profile/watchlist", {
          headers: { Authorization: authHeader },
        }),
      ]);

      if (historyRes.ok) {
        const { data } = await historyRes.json();
        const historyItems: HistoryProp[] = Array.isArray(data) ? data : [];
        setContinueWatching(historyItems.map(mapHistoryItem));
        setStats(computeStats(historyItems));
      }

      setIsLoadingHistory(false);

      if (watchlistRes.ok) {
        const { data } = await watchlistRes.json();
        const raw: Record<string, unknown>[] = Array.isArray(data) ? data : [];
        const mapped: WatchlistItemShape[] = raw.map((item) => ({
          id: (item.tmdbId ?? item.id) as number,
          tmdb_id: (item.tmdbId ?? item.id) as number,
          title: (item.title as string) ?? "",
          poster_path: (item.poster_path as string | null) ?? null,
          release_date: (item.release_date as string | null) ?? null,
          media_type: item.media_type as MediaType,
        }));
        setWatchlist(mapped);
      }

      setIsLoadingWatchlist(false);
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
    } finally {
      setIsLoadingHistory(false);
      setIsLoadingWatchlist(false);
      setDataInitialized(true);
      fetchingRef.current = false;
    }
  }, [userId]);

  useEffect(() => {
    if (userId) fetchAllData();
  }, [userId, fetchAllData]);

  const refetch = useCallback(() => {
    setDataInitialized(false);
    fetchingRef.current = false;
    fetchAllData();
  }, [fetchAllData]);

  return {
    continueWatching,
    watchlist,
    stats,
    isLoadingHistory,
    isLoadingWatchlist,
    dataInitialized,
    refetch,
    setContinueWatching,
  };
}
