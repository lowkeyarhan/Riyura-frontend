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
      const res = await fetch("/api/home/trending/movies?limit=6");
      const data = await res.json();
      const movies = data.results || [];
      setTrendingHighlights(movies);
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
