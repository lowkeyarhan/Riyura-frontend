"use client";

import React from "react";
import Banner from "@/src/components/media/Banner";
import Footer from "@/src/components/layout/Footer";
import MoviesTvMediaGrid from "@/src/components/media/MoviesTvMediaGrid";
import AnimeMediaGrid from "@/src/components/media/AnimeMediaGrid";
import { HomeMediaGridSkeleton } from "@/src/components/skeletons/HomeMediaGridSkeleton";
import { useHomeData, type MediaSelector } from "@/src/hooks/useHomeData";

const SELECTOR_TABS: Array<{ id: MediaSelector; label: string }> = [
  { id: "movie", label: "Movies" },
  { id: "tv", label: "TV Shows" },
  { id: "anime", label: "Anime" },
];

export default function HomePage() {
  const {
    activeFilter,
    isLoading,
    isTabSwitching,
    isAnime,
    selectedMediaType,
    nowPlayingItems,
    trendingItems,
    popularItems,
    comingSoonItems,
    animeItems,
    hasSectionContent,
    handleTabChange,
    handleCardClick,
  } = useHomeData();

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
                  onClick={() => handleTabChange(tab.id)}
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

        {isLoading || isTabSwitching || !hasSectionContent ? (
          <HomeMediaGridSkeleton />
        ) : isAnime ? (
          <AnimeMediaGrid trending={animeItems} onCardClick={handleCardClick} />
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
