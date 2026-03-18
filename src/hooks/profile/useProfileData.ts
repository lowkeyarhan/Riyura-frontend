import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/src/lib/auth/supabase";
import { Film, Tv, Clock } from "lucide-react";
import { Stat } from "@/src/components/profile/StatBadge";
import {
  ContinueWatchingItem,
  WatchlistItem,
  ProfileStat,
} from "@/src/dto/media";

const INITIAL_STATS: Stat[] = [
  { label: "Movies", value: "0", icon: Film, color: "text-cyan-400" },
  { label: "Series", value: "0", icon: Tv, color: "text-orange-400" },
  { label: "Hours", value: "0", icon: Clock, color: "text-purple-400" },
];

interface ProfileData {
  continueWatching: ContinueWatchingItem[];
  watchlist: WatchlistItem[];
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
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
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

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        const res = await fetch("/api/profile", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        if (res.ok) {
          const { data } = await res.json();
          setContinueWatching(data.continueWatching || []);
          setWatchlist(data.watchlist || []);
          setStats(
            data.stats.map((stat: ProfileStat, idx: number) => ({
              ...INITIAL_STATS[idx],
              value: stat.value,
            })),
          );
        }
      }
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
    if (userId) {
      fetchAllData();
    }
  }, [userId, fetchAllData]);

  const refetch = () => {
    setDataInitialized(false);
    fetchingRef.current = false;
    fetchAllData();
  };

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
