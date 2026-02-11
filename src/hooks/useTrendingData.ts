import { useState, useEffect, useCallback } from "react";
import { TMDBTrendingMovie, TMDBTrendingTV } from "@/src/dto/tmdb/lists";

interface TrendingItem {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  mediaCategory: "movie" | "tv";
}

interface TrendingData {
  trendingMovies: TMDBTrendingMovie[];
  trendingTV: TMDBTrendingTV[];
  isLoading: boolean;
  trendingHighlights: TrendingItem[];
  fetchTrending: () => Promise<void>;
}

export function useTrendingData(): TrendingData {
  const [trendingMovies, setTrendingMovies] = useState<TMDBTrendingMovie[]>([]);
  const [trendingTV, setTrendingTV] = useState<TMDBTrendingTV[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTrending = useCallback(async () => {
    setIsLoading(true);
    try {
      const [moviesRes, tvRes] = await Promise.all([
        fetch("/api/home/trending/movies?limit=6"),
        fetch("/api/home/trending/tv?limit=6"),
      ]);
      const moviesData = await moviesRes.json();
      const tvData = await tvRes.json();

      const movies = moviesData.results || [];
      const tv = tvData.results || [];

      setTrendingMovies(movies);
      setTrendingTV(tv);
    } catch (error) {
      console.error("Error fetching trending:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  const trendingHighlights: TrendingItem[] = [
    ...trendingMovies.map((item) => ({
      ...item,
      mediaCategory: "movie" as const,
    })),
    ...trendingTV.map((item) => ({ ...item, mediaCategory: "tv" as const })),
  ].slice(0, 6);

  return {
    trendingMovies,
    trendingTV,
    isLoading,
    trendingHighlights,
    fetchTrending,
  };
}
