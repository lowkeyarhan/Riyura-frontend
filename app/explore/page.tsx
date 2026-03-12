"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp, Film, Tv, Sparkles, Globe } from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import type { ExploreProp } from "@/src/props/explore/explore";
import type { SearchProp } from "@/src/props/search/search";
import { MediaType } from "@/src/props/global/mediaType";
import { SearchCardSkeleton } from "@/src/components/skeletons/SearchCardSkeleton";
import { SearchResultCard } from "@/src/components/search/SearchResultCard";
import "react-loading-skeleton/dist/skeleton.css";

// --- Constants ---
const GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Music",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "War",
  "Western",
];

const LANGUAGES = [
  { label: "All", value: "" },
  { label: "English", value: "en" },
  { label: "Japanese", value: "ja" },
  { label: "Spanish", value: "es" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Korean", value: "ko" },
  { label: "Hindi", value: "hi" },
  { label: "Portuguese", value: "pt" },
  { label: "Italian", value: "it" },
];

const MEDIA_TYPES = [
  { label: "All", value: "all", icon: Sparkles },
  { label: "Movies", value: "movie", icon: Film },
  { label: "TV Shows", value: "tv", icon: Tv },
];


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

// Card variants with fade only (no scale) to match search page
const cardVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.25, // Faster disappear animation
    },
  },
};

export default function ExplorePage() {
  const router = useRouter();
  const [selectedGenres, setSelectedGenres] = useState<string[]>(["Action"]);
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
        const res = await fetch(`/api/explore?${params.toString()}`, { signal });
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

  const filteredItems = items.filter((item) => {
    if (mediaType === "all") return true;
    if (mediaType === "movie") return item.mediaType === MediaType.Movie;
    if (mediaType === "tv") return item.mediaType === MediaType.TV;
    return true;
  });

  return (
    <div className="relative min-h-screen bg-black pt-20 md:pt-28 px-4 sm:px-6 md:px-16 lg:px-16 pb-20 md:pb-12 font-sans">
      {/* --- STATIC BACKGROUND LAYER  --- */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-[#155f75b5] blur-[130px] opacity-40" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-[#9a341299] blur-[130px] opacity-30 mix-blend-screen" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,#000000_100%)]" />
      </div>

      <div className="relative z-10">
        <div className="mb-8 md:mb-10">
          <h1 className="text-4xl md:text-7xl font-semibold text-white tracking-tight">
            Explore
          </h1>
        </div>

        <div className="mb-6 md:mb-7 flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center rounded-xl border border-white/10 bg-[#131722]/80 p-1">
            {MEDIA_TYPES.map((type) => {
              const isActive = mediaType === type.value;
              return (
                <button
                  key={type.value}
                  onClick={() => handleTypeChange(type.value)}
                  className={`relative cursor-pointer px-4 md:px-6 py-2 text-sm md:text-[15px] font-medium rounded-lg transition-colors ${isActive
                    ? "text-white"
                    : "text-white/55 hover:text-white/80"
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeMediaType"
                      className="absolute inset-0 rounded-lg bg-white/8 border border-white/10"
                      transition={{
                        type: "spring",
                        bounce: 0.18,
                        duration: 0.45,
                      }}
                    />
                  )}
                  <span className="relative z-10">{type.label}</span>
                </button>
              );
            })}
          </div>

          <div className="inline-flex items-center rounded-xl border border-white/10 bg-[#131722]/80 p-1">
            <Globe className="ml-3 mr-2 w-4 h-4 text-white/55 shrink-0" />
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="appearance-none bg-transparent pr-8 py-2 pl-0 text-sm md:text-[15px] font-medium text-white cursor-pointer focus:outline-none focus:ring-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.55)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.5rem center",
                backgroundSize: "1.25rem",
              }}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.value || "all"} value={lang.value} className="bg-[#131722] text-white">
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-8 md:mb-9 border-b border-white/10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 md:gap-7 overflow-x-auto scrollbar-hide pb-2 md:pb-4">
              {GENRES.map((genre) => {
                const isSelected = selectedGenres.includes(genre);
                return (
                  <button
                    key={genre}
                    onClick={() => handleGenreToggle(genre)}
                    className={`relative cursor-pointer text-sm md:text-xl font-medium whitespace-nowrap transition-colors ${isSelected
                      ? "text-white"
                      : "text-white/55 hover:text-white/85"
                      }`}
                  >
                    {genre}
                    {isSelected && (
                      <span className="absolute left-0 top-full mt-[6px] md:mt-[14px] h-[2px] w-full rounded-full bg-white" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* --- Media Grid --- */}
        <LayoutGroup>
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6"
          >
            <AnimatePresence mode="sync">
              {/* Show items if it's NOT the initial load (so we keep them during infinite scroll) */}
              {!(loading && page === 1) &&
                filteredItems.map((item) => {
                  const searchItem = toSearchProp(item);
                  return (
                    <motion.div
                      layout
                      layoutId={`explore-card-${item.tmdbId}`}
                      key={item.tmdbId}
                      variants={cardVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                    >
                      <SearchResultCard
                        item={searchItem}
                        onClick={() =>
                          router.push(
                            item.mediaType === MediaType.Movie
                              ? `/details/movie/${item.tmdbId}`
                              : `/details/tvshow/${item.tmdbId}`,
                          )
                        }
                      />
                    </motion.div>
                  );
                })}
            </AnimatePresence>

            {/* --- Skeleton Loader --- */}
            {/* Initial Load: Show full grid */}
            {loading && page === 1 && (
              <>
                {Array.from({ length: 18 }).map((_, i) => (
                  <SearchCardSkeleton key={`skeleton-init-${i}`} />
                ))}
              </>
            )}

            {/* Infinite Scroll Load: Append a few skeletons at the bottom */}
            {loading && page > 1 && (
              <>
                {Array.from({ length: 6 }).map((_, i) => (
                  <SearchCardSkeleton key={`skeleton-more-${i}`} />
                ))}
              </>
            )}
          </motion.div>
        </LayoutGroup>

        {/* --- Infinite Scroll Trigger --- */}
        <div ref={loadMoreRef} className="h-10 w-full mt-8" />

        {!hasMore && items.length > 0 && (
          <div className="text-center text-white/40 text-sm mt-8 pb-8">
            You've reached the end
          </div>
        )}

        {/* --- Scroll To Top --- */}
        {showTopBtn && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-10 md:bottom-8 left-1/2 -translate-x-1/2 z-40 backdrop-blur-2xl bg-white/10 hover:bg-white text-white hover:text-black rounded-full cursor-pointer px-2.5 sm:px-5 py-2.5 sm:py-3 shadow-2xl transition-all flex items-center gap-2 font-bold text-xs sm:text-sm touch-manipulation"
          >
            <ArrowUp size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="hidden sm:inline">Scroll</span>
          </button>
        )}
      </div>
    </div>
  );
}
