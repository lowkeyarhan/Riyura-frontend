import { useState, useEffect, useRef } from "react";
import { TMDBSearchResult } from "@/src/dto/tmdb/lists";

interface SearchData {
  searchQuery: string;
  results: TMDBSearchResult[];
  isLoading: boolean;
  lastQuery: string;
  activeTab: "all" | "movies" | "tv";
  setSearchQuery: (query: string) => void;
  setActiveTab: (tab: "all" | "movies" | "tv") => void;
  handleSearch: (query?: string) => Promise<void>;
  clearSearch: () => void;
  filteredResults: TMDBSearchResult[];
}

export function useSearchData(): SearchData {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<TMDBSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "movies" | "tv">("all");

  const handleSearch = async (q?: string) => {
    const query = (q ?? searchQuery).trim();
    if (!query) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&type=multi`,
      );
      const data = await response.json();

      const filtered = (data?.results || []).filter(
        (item: TMDBSearchResult) =>
          item.media_type === "movie" || item.media_type === "tv",
      );
      setResults(filtered);
      setLastQuery(query);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setResults([]);
    setLastQuery("");
  };

  const filteredResults = results.filter(
    (item) =>
      activeTab === "all" ||
      item.media_type === (activeTab === "movies" ? "movie" : "tv"),
  );

  return {
    searchQuery,
    results,
    isLoading,
    lastQuery,
    activeTab,
    setSearchQuery,
    setActiveTab,
    handleSearch,
    clearSearch,
    filteredResults,
  };
}
