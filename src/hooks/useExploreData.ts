"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { ExploreProp } from "@/src/props/explore/explore";
import type { SearchProp } from "@/src/props/search/search";
import { MediaType } from "@/src/props/global/mediaType";
import { EXPLORE_GENRES } from "@/src/lib/constants/explore";
import { getDetailsPath } from "@/src/lib/utils/format";

function toSearchProp(item: ExploreProp): SearchProp & { id: number } {
  return {
    id: item.tmdbId,
    tmdbId: item.tmdbId,
    title: item.title,
    description: item.description,
    media_type: item.mediaType as MediaType,
    original_language: item.originalLanguage,
    poster_path: item.posterPath,
    release_year: item.releaseYear,
  };
}

export function useExploreData() {
  const router = useRouter();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([
    EXPLORE_GENRES[0],
  ]);
  const [mediaType, setMediaType] = useState("all");
  const [language, setLanguage] = useState("");
  const [items, setItems] = useState<ExploreProp[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setLoading(true);

      try {
        const genreParams = selectedGenres.join(",");
        const params = new URLSearchParams({
          page: String(page),
          genres: genreParams,
        });
        if (language) params.set("language", language);
        const res = await fetch(`/api/explore?${params.toString()}`, {
          signal,
        });
        if (!res.ok) {
          let message = "Fetch failed";
          try {
            const errorData = await res.json();
            message = errorData?.error || message;
          } catch {
            message = `Fetch failed (${res.status})`;
          }
          throw new Error(message);
        }
        const data = await res.json();
        const rawResults = (data.results ?? []) as ExploreProp[];

        setItems((prev) => {
          if (page === 1) return rawResults;
          const existingIds = new Set(prev.map((i) => i.tmdbId));
          const newItems = rawResults.filter((i) => !existingIds.has(i.tmdbId));
          return [...prev, ...newItems];
        });
        setHasMore(rawResults.length > 0);
      } catch (error: unknown) {
        if (error instanceof Error && error.name !== "AbortError")
          console.error(error);
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [page, selectedGenres, language]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1, rootMargin: "100px" },
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [loading, hasMore]);

  useEffect(() => {
    const handleScroll = () => setShowTopBtn(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGenreToggle = (genre: string) => {
    setPage(1);
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre],
    );
  };

  const handleTypeChange = (type: string) => {
    setPage(1);
    setMediaType(type);
  };

  const handleLanguageChange = (lang: string) => {
    setPage(1);
    setLanguage(lang);
  };

  const filteredItems = useMemo<(SearchProp & { id: number })[]>(
    () =>
      items
        .filter((item) => {
          if (mediaType === "all") return true;
          if (mediaType === "movie") return item.mediaType === MediaType.Movie;
          if (mediaType === "tv") return item.mediaType === MediaType.TV;
          return true;
        })
        .map(toSearchProp),
    [items, mediaType],
  );

  const handleCardClick = (item: SearchProp) => {
    router.push(getDetailsPath(item.tmdbId, item.media_type));
  };

  return {
    selectedGenres,
    mediaType,
    language,
    filteredItems,
    loading,
    page,
    hasMore,
    showTopBtn,
    loadMoreRef,
    handleGenreToggle,
    handleTypeChange,
    handleLanguageChange,
    handleCardClick,
  };
}
