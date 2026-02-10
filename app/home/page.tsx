"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Banner from "@/src/components/media/Banner";
import Footer from "@/src/components/layout/Footer";
import MoviesTvMediaGrid from "@/src/components/media/MoviesTvMediaGrid";
import AnimeMediaGrid from "@/src/components/media/AnimeMediaGrid";
import { HomeInitialDataResponse } from "@/src/dto/ui/home";
import { MediaGridItem } from "@/src/dto/ui/card";

type MediaSelector = "movie" | "tv" | "anime";

const SELECTOR_TABS: Array<{ id: MediaSelector; label: string }> = [
  { id: "movie", label: "Movies" },
  { id: "tv", label: "TV Shows" },
  { id: "anime", label: "Anime" },
];

const EMPTY_MEDIA_RESULTS = { results: [] as MediaGridItem[] };

const EMPTY_HOME_DATA: HomeInitialDataResponse = {
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

const getDetailsPath = (item: MediaGridItem) => {
  if (item.media_type === "movie") return `/details/movie/${item.id}`;
  if (item.media_type === "tv") return `/details/tvshow/${item.id}`;
  if (item.first_air_date && !item.release_date) {
    return `/details/tvshow/${item.id}`;
  }
  return `/details/movie/${item.id}`;
};

async function fetchMedia(
  path: string,
  signal: AbortSignal,
): Promise<{ results: MediaGridItem[] }> {
  try {
    const response = await fetch(path, { signal, cache: "no-store" });
    if (!response.ok) return EMPTY_MEDIA_RESULTS;
    return await response.json();
  } catch {
    return EMPTY_MEDIA_RESULTS;
  }
}

export default function HomePage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<MediaSelector>("movie");
  const [homeData, setHomeData] =
    useState<HomeInitialDataResponse>(EMPTY_HOME_DATA);

  useEffect(() => {
    const controller = new AbortController();

    const loadHomeData = async () => {
      const [
        nowPlayingMovies,
        nowPlayingTV,
        trendingMovies,
        trendingTV,
        trendingAnime,
        popularMovies,
        popularTV,
        upcomingMovies,
        upcomingTV,
      ] = await Promise.all([
        fetchMedia("/api/home/now-playing/movies", controller.signal),
        fetchMedia("/api/home/now-playing/tv", controller.signal),
        fetchMedia("/api/home/trending/movies", controller.signal),
        fetchMedia("/api/home/trending/tv", controller.signal),
        fetchMedia("/api/home/trending/anime", controller.signal),
        fetchMedia("/api/home/popular/movies", controller.signal),
        fetchMedia("/api/home/popular/tv", controller.signal),
        fetchMedia("/api/home/upcoming/movies", controller.signal),
        fetchMedia("/api/home/upcoming/tv", controller.signal),
      ]);

      setHomeData({
        nowPlaying: {
          movie: nowPlayingMovies,
          tv: nowPlayingTV,
          anime: trendingAnime,
        },
        trending: {
          movie: trendingMovies,
          tv: trendingTV,
          anime: trendingAnime,
        },
        popular: {
          movie: popularMovies,
          tv: popularTV,
          anime: trendingAnime,
        },
        comingSoon: {
          movie: upcomingMovies,
          tv: upcomingTV,
          anime: trendingAnime,
        },
        bannerData: { items: [] },
      });
    };

    loadHomeData();
    return () => controller.abort();
  }, []);

  const isAnime = activeFilter === "anime";
  const selectedMediaType: "movie" | "tv" =
    activeFilter === "tv" ? "tv" : "movie";

  const nowPlayingItems =
    selectedMediaType === "movie"
      ? homeData.nowPlaying.movie.results.slice(0, 6)
      : homeData.nowPlaying.tv.results.slice(0, 6);

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

  const handleCardClick = (item: MediaGridItem) => {
    router.push(getDetailsPath(item));
  };

  return (
    <div className="min-h-screen">
      <Banner />
      <div className="px-6 pb-16 pt-6 md:px-20 md:pt-8 relative z-10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 top-16 h-[55vh] w-[55vw] rounded-full bg-cyan-500/10 blur-[140px]" />
          <div className="absolute -right-24 bottom-0 h-[60vh] w-[50vw] rounded-full bg-orange-500/10 blur-[160px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_40%,rgba(0,0,0,0.55)_100%)]" />
        </div>
        <div className="border-t border-white/15 pt-5">
          <div className="flex items-center gap-6 md:gap-8 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {SELECTOR_TABS.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id)}
                  className={`relative shrink-0 pb-2.5 text-base md:text-lg font-semibold transition-all duration-200 ${
                    isActive
                      ? "text-white"
                      : "text-white/50 hover:text-white/75"
                  }`}
                  style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
                >
                  {tab.label}
                  {isActive && (
                    <span className="absolute inset-x-0 -bottom-px h-[2.5px] bg-white rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {isAnime ? (
          <AnimeMediaGrid
            trending={homeData.trending.anime.results}
            onCardClick={handleCardClick}
          />
        ) : (
          <MoviesTvMediaGrid
            mediaType={selectedMediaType}
            nowPlaying={nowPlayingItems}
            trending={trendingItems}
            popular={popularItems}
            comingSoon={comingSoonItems}
            onCardClick={handleCardClick}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}
