"use client";

import { useRouter } from "next/navigation";
import { TMDBSearchResult } from "@/src/dto/tmdb/lists";
import { MediaCardSkeleton } from "@/src/components/skeletons/MediaCardSkeleton";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Custom Hooks
import { useSearchData } from "@/src/hooks/useSearchData";
import { useTrendingData } from "@/src/hooks/useTrendingData";
import { usePlaceholderAnimation } from "@/src/hooks/usePlaceholderAnimation";

// Components
import { SearchHero } from "@/src/components/search/SearchHero";
import { SearchBar } from "@/src/components/search/SearchBar";
import { FilterTabs } from "@/src/components/search/FilterTabs";
import { TrendingSection } from "@/src/components/search/TrendingSection";
import { SearchResultsSection } from "@/src/components/search/SearchResultsSection";
import { EmptyState } from "@/src/components/search/EmptyState";
import { SearchCardSkeleton } from "@/src/components/skeletons/SearchCardSkeleton";

export default function SearchPage() {
  const router = useRouter();

  // Custom Hooks
  const {
    searchQuery,
    isLoading,
    lastQuery,
    activeTab,
    setSearchQuery,
    setActiveTab,
    handleSearch,
    clearSearch,
    filteredResults,
  } = useSearchData();

  const { trendingHighlights, isLoading: isTrendingLoading } =
    useTrendingData();

  const { currentPlaceholder, opacity: placeholderOpacity } =
    usePlaceholderAnimation();

  // Utility Functions
  const formatDate = (date: string | null | undefined) => {
    if (!date) return "Unknown";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const navigateToDetails = (item: TMDBSearchResult) => {
    const path =
      item.media_type === "movie"
        ? `/details/movie/${item.id}`
        : `/details/tvshow/${item.id}`;
    router.push(path);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(searchQuery);
      setSearchQuery("");
    }
  };

  const handleSearchClick = () => {
    handleSearch();
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-[#155f75b5] blur-[130px] opacity-40" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-[#9a341299] blur-[130px] opacity-30 mix-blend-screen" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,#000000_100%)]" />
      </div>

      <div className="relative z-10 px-4 md:px-16 lg:px-16 pt-24 md:pt-32 pb-12">
        {/* Hero Section */}
        <SearchHero show={!lastQuery} />

        {/* Search Bar */}
        <SearchBar
          query={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearchClick}
          onClear={clearSearch}
          onKeyPress={handleKeyPress}
          placeholderText={currentPlaceholder}
          placeholderOpacity={placeholderOpacity}
          isLoading={isLoading}
        />

        {/* Trending Section */}
        <TrendingSection
          items={trendingHighlights}
          isLoading={isTrendingLoading}
          onCardClick={(href) => router.push(href)}
          formatDate={formatDate}
          show={!lastQuery && !isLoading}
        />

        {/* Filter Tabs */}
        <FilterTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          show={filteredResults.length > 0}
        />

        {/* Loading State */}
        {isLoading && (
          <SkeletonTheme baseColor="#1a1d26" highlightColor="#2a2d36">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-7">
              {Array.from({ length: 10 }).map((_, i) => (
                <SearchCardSkeleton key={i} />
              ))}
            </div>
          </SkeletonTheme>
        )}

        {/* Empty State */}
        {!isLoading && filteredResults.length === 0 && (
          <EmptyState query={searchQuery} />
        )}

        {/* Results Grid */}
        {!isLoading && (
          <SearchResultsSection
            results={filteredResults}
            lastQuery={lastQuery}
            searchQuery={searchQuery}
            onCardClick={navigateToDetails}
            formatDate={formatDate}
          />
        )}
      </div>
    </div>
  );
}
