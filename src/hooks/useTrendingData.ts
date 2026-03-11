import { useState, useEffect, useCallback } from "react";
import type { MediaCardProp } from "@/src/props/global/mediaCard";

interface TrendingData {
  trendingHighlights: MediaCardProp[];
  isLoading: boolean;
  fetchTrending: () => Promise<void>;
}

export function useTrendingData(): TrendingData {
  const [trendingHighlights, setTrendingHighlights] = useState<MediaCardProp[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);

  const fetchTrending = useCallback(async () => {
    setIsLoading(true);
    try {
      const [moviesRes, tvRes] = await Promise.all([
        fetch("/api/home/trending/movies?limit=12"),
        fetch("/api/home/trending/tv?limit=12"),
      ]);
      const moviesData = await moviesRes.json();
      const tvData = await tvRes.json();

      const movies = moviesData.results || [];
      const tv = tvData.results || [];

      const combined: MediaCardProp[] = [...movies, ...tv].slice(0, 6);
      setTrendingHighlights(combined);
    } catch (error) {
      console.error("Error fetching trending:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  return {
    trendingHighlights,
    isLoading,
    fetchTrending,
  };
}
