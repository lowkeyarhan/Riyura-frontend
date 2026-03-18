"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { MediaType } from "@/src/props/global/mediaType";
import type { SearchProp } from "@/src/props/search/search";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { useSearchData } from "@/src/hooks/useSearchData";
import { useTrendingData } from "@/src/hooks/home/useTrendingData";
import { usePlaceholderAnimation } from "@/src/hooks/usePlaceholderAnimation";

import { SearchHero } from "@/src/components/search/SearchHero";
import { SearchBar } from "@/src/components/search/SearchBar";
import { FilterTabs } from "@/src/components/search/FilterTabs";
import { TrendingSection } from "@/src/components/search/TrendingSection";
import { SearchResultsSection } from "@/src/components/search/SearchResultsSection";
import { EmptyState } from "@/src/components/search/EmptyState";
import { SearchCardSkeleton } from "@/src/components/skeletons/SearchCardSkeleton";

function SearchPageContent() {
  const router = useRouter();

  const {
    searchQuery,
    isLoading,
    isLoadingMore,
    lastQuery,
    activeTab,
    sortBy,
    setSearchQuery,
    setActiveTab,
    setSortBy,
    handleSearch,
    loadMore,
    clearSearch,
    filteredResults,
    hasMore,
  } = useSearchData();

  const { trendingHighlights, isLoading: isTrendingLoading } =
    useTrendingData();
  const { currentPlaceholder, opacity: placeholderOpacity } =
    usePlaceholderAnimation();

  const navigateToDetails = (item: SearchProp) =>
    router.push(
      item.media_type === MediaType.Movie
        ? `/details/movie/${item.tmdbId}`
        : `/details/tvshow/${item.tmdbId}`,
    );

  const submitSearch = (query?: string) => {
    handleSearch(query ?? searchQuery);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white relative overflow-hidden">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-[#155f75b5] blur-[130px] opacity-40" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-[#9a341299] blur-[130px] opacity-30 mix-blend-screen" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,#000000_100%)]" />
      </div>

      <div className="relative z-10 px-4 md:px-16 lg:px-16 pt-24 md:pt-32 pb-12">
        <SearchHero show={!lastQuery} />

        <SearchBar
          query={searchQuery}
          onChange={setSearchQuery}
          onSearch={() => submitSearch()}
          onClear={clearSearch}
          onKeyPress={(e) => e.key === "Enter" && submitSearch(searchQuery)}
          placeholderText={currentPlaceholder}
          placeholderOpacity={placeholderOpacity}
          isLoading={isLoading}
        />

        <TrendingSection
          items={trendingHighlights}
          isLoading={isTrendingLoading}
          onCardClick={(href) => router.push(href)}
          show={!lastQuery && !isLoading}
        />

        <FilterTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          sortBy={sortBy}
          onSortChange={setSortBy}
          show={filteredResults.length > 0}
        />

        {isLoading && filteredResults.length === 0 && (
          <SkeletonTheme baseColor="#1a1d26" highlightColor="#2a2d36">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-7">
              {Array.from({ length: 10 }).map((_, i) => (
                <SearchCardSkeleton key={i} />
              ))}
            </div>
          </SkeletonTheme>
        )}

        {!isLoading &&
          !isLoadingMore &&
          filteredResults.length === 0 &&
          lastQuery && <EmptyState query={searchQuery} />}

        {filteredResults.length > 0 && (
          <SearchResultsSection
            results={filteredResults}
            lastQuery={lastQuery}
            searchQuery={searchQuery}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
            onCardClick={navigateToDetails}
            onLoadMore={loadMore}
          />
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
          <div className="animate-pulse text-white/60">Loading...</div>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
