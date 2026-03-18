"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { MediaCardProp } from "@/src/props/global/mediaCard";
import { getDetailsPath } from "@/src/lib/utils/format";

export type MediaSelector = "movie" | "tv" | "anime";

interface HomeSectionData {
  results: MediaCardProp[];
}

interface HomeInitialData {
  nowPlaying: {
    movie: HomeSectionData;
    tv: HomeSectionData;
    anime: HomeSectionData;
  };
  trending: {
    movie: HomeSectionData;
    tv: HomeSectionData;
    anime: HomeSectionData;
  };
  popular: {
    movie: HomeSectionData;
    tv: HomeSectionData;
    anime: HomeSectionData;
  };
  comingSoon: {
    movie: HomeSectionData;
    tv: HomeSectionData;
    anime: HomeSectionData;
  };
  bannerData: { items: unknown[] };
}

const EMPTY_MEDIA_RESULTS: HomeSectionData = { results: [] };

const EMPTY_HOME_DATA: HomeInitialData = {
  nowPlaying: {
    movie: EMPTY_MEDIA_RESULTS,
    tv: EMPTY_MEDIA_RESULTS,
    anime: EMPTY_MEDIA_RESULTS,
  },
  trending: {
    movie: EMPTY_MEDIA_RESULTS,
    tv: EMPTY_MEDIA_RESULTS,
    anime: EMPTY_MEDIA_RESULTS,
  },
  popular: {
    movie: EMPTY_MEDIA_RESULTS,
    tv: EMPTY_MEDIA_RESULTS,
    anime: EMPTY_MEDIA_RESULTS,
  },
  comingSoon: {
    movie: EMPTY_MEDIA_RESULTS,
    tv: EMPTY_MEDIA_RESULTS,
    anime: EMPTY_MEDIA_RESULTS,
  },
  bannerData: { items: [] },
};

async function fetchMedia(
  path: string,
  signal: AbortSignal,
): Promise<{ results: MediaCardProp[] }> {
  try {
    const response = await fetch(path, { signal, cache: "no-store" });
    if (!response.ok) return EMPTY_MEDIA_RESULTS;
    return await response.json();
  } catch {
    return EMPTY_MEDIA_RESULTS;
  }
}

export function useHomeData() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<MediaSelector>("movie");
  const [homeData, setHomeData] = useState<HomeInitialData>(EMPTY_HOME_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [isTabSwitching, setIsTabSwitching] = useState(false);
  const [loadedSections, setLoadedSections] = useState<Set<MediaSelector>>(
    new Set(["movie"]),
  );

  // Initial load - only movies
  useEffect(() => {
    const controller = new AbortController();

    const loadMoviesData = async () => {
      const [nowPlayingMovies, trendingMovies, popularMovies, upcomingMovies] =
        await Promise.all([
          fetchMedia(
            "/api/home/now-playing/movies?limit=12",
            controller.signal,
          ),
          fetchMedia("/api/home/trending/movies?limit=12", controller.signal),
          fetchMedia("/api/home/popular/movies?limit=12", controller.signal),
          fetchMedia("/api/home/upcoming/movies?limit=12", controller.signal),
        ]);

      setHomeData({
        nowPlaying: {
          movie: nowPlayingMovies,
          tv: EMPTY_MEDIA_RESULTS,
          anime: EMPTY_MEDIA_RESULTS,
        },
        trending: {
          movie: trendingMovies,
          tv: EMPTY_MEDIA_RESULTS,
          anime: EMPTY_MEDIA_RESULTS,
        },
        popular: {
          movie: popularMovies,
          tv: EMPTY_MEDIA_RESULTS,
          anime: EMPTY_MEDIA_RESULTS,
        },
        comingSoon: {
          movie: upcomingMovies,
          tv: EMPTY_MEDIA_RESULTS,
          anime: EMPTY_MEDIA_RESULTS,
        },
        bannerData: { items: [] },
      });
      setIsLoading(false);
    };

    loadMoviesData();
    return () => controller.abort();
  }, []);

  // Lazy load TV or Anime when tabs are clicked
  useEffect(() => {
    if (
      activeFilter === "movie" ||
      loadedSections.has(activeFilter) ||
      isLoading
    ) {
      return;
    }

    const controller = new AbortController();

    const loadSectionData = async () => {
      setIsTabSwitching(true);

      if (activeFilter === "tv") {
        const [nowPlayingTV, trendingTV, popularTV, upcomingTV] =
          await Promise.all([
            fetchMedia("/api/home/now-playing/tv?limit=12", controller.signal),
            fetchMedia("/api/home/trending/tv?limit=12", controller.signal),
            fetchMedia("/api/home/popular/tv?limit=12", controller.signal),
            fetchMedia("/api/home/upcoming/tv?limit=12", controller.signal),
          ]);

        setHomeData((prev) => ({
          ...prev,
          nowPlaying: { ...prev.nowPlaying, tv: nowPlayingTV },
          trending: { ...prev.trending, tv: trendingTV },
          popular: { ...prev.popular, tv: popularTV },
          comingSoon: { ...prev.comingSoon, tv: upcomingTV },
        }));
      } else if (activeFilter === "anime") {
        const trendingAnime = await fetchMedia(
          "/api/home/trending/anime?limit=12",
          controller.signal,
        );

        setHomeData((prev) => ({
          ...prev,
          nowPlaying: { ...prev.nowPlaying, anime: trendingAnime },
          trending: { ...prev.trending, anime: trendingAnime },
          popular: { ...prev.popular, anime: trendingAnime },
          comingSoon: { ...prev.comingSoon, anime: trendingAnime },
        }));
      }

      setLoadedSections((prev) => new Set([...prev, activeFilter]));
      setIsTabSwitching(false);
    };

    loadSectionData();
    return () => controller.abort();
  }, [activeFilter, loadedSections, isLoading]);

  const isAnime = activeFilter === "anime";
  const selectedMediaType: "movie" | "tv" =
    activeFilter === "tv" ? "tv" : "movie";

  const nowPlayingItems =
    selectedMediaType === "movie"
      ? homeData.nowPlaying.movie.results
      : homeData.nowPlaying.tv.results;

  const trendingItems =
    selectedMediaType === "movie"
      ? homeData.trending.movie.results
      : homeData.trending.tv.results;

  const popularItems =
    selectedMediaType === "movie"
      ? homeData.popular.movie.results
      : homeData.popular.tv.results;

  const comingSoonItems =
    selectedMediaType === "movie"
      ? homeData.comingSoon.movie.results
      : homeData.comingSoon.tv.results;

  const hasSectionContent = isAnime
    ? homeData.trending.anime.results.length > 0
    : nowPlayingItems.length > 0 ||
      trendingItems.length > 0 ||
      popularItems.length > 0 ||
      comingSoonItems.length > 0;

  const handleCardClick = (item: MediaCardProp) => {
    router.push(getDetailsPath(item.tmdbId, item.media_type));
  };

  const handleTabChange = (tab: MediaSelector) => {
    if (tab !== activeFilter) {
      setActiveFilter(tab);
    }
  };

  return {
    activeFilter,
    isLoading,
    isTabSwitching,
    isAnime,
    selectedMediaType,
    nowPlayingItems,
    trendingItems,
    popularItems,
    comingSoonItems,
    animeItems: homeData.trending.anime.results,
    hasSectionContent,
    handleTabChange,
    handleCardClick,
  };
}
