"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { MediaType } from "@/src/props/global/mediaType";
import type { SearchProp } from "@/src/props/search/search";

import { useSearchData } from "@/src/hooks/useSearchData";
import PageBackdrop from "@/src/components/layout/PageBackdrop";
import { useTrendingData } from "@/src/hooks/home/useTrendingData";
import { usePlaceholderAnimation } from "@/src/hooks/usePlaceholderAnimation";

import { SearchHero } from "@/src/components/search/SearchHero";
import { SearchBar } from "@/src/components/search/SearchBar";
import { FilterTabs } from "@/src/components/search/FilterTabs";
import { TrendingSection } from "@/src/components/search/TrendingSection";
import { SearchResultsSection } from "@/src/components/search/SearchResultsSection";
import { EmptyState } from "@/src/components/search/EmptyState";
import { MediaCardSkeleton } from "@/src/components/skeletons/MediaCardSkeleton";

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
      <PageBackdrop />

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
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <MediaCardSkeleton key={i} />
            ))}
          </div>
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
