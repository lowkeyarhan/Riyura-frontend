"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp, Film, Tv, Sparkles, Filter } from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { TMDBDiscoverItem, TMDBSearchResult } from "@/src/dto/tmdb/lists";
import { SearchCardSkeleton } from "@/src/components/skeletons/SearchCardSkeleton";
import { SearchResultCard } from "@/src/components/search/SearchResultCard";
import { SkeletonTheme } from "react-loading-skeleton";
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

const MEDIA_TYPES = [
  { label: "All", value: "all", icon: Sparkles },
  { label: "Movies", value: "movie", icon: Film },
  { label: "TV Shows", value: "tv", icon: Tv },
];

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
  const [items, setItems] = useState<TMDBSearchResult[]>([]);
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
        const url = `/api/explore?page=${page}&genres=${genreParams}&mediaType=${mediaType}`;
        const res = await fetch(url, { signal });
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

        const normalizedResults: TMDBSearchResult[] = (
          data.results as TMDBDiscoverItem[]
        ).map((item) => ({
          ...item,
          media_type:
            item.media_type ||
            (mediaType === "tv"
              ? "tv"
              : mediaType === "movie"
                ? "movie"
                : "movie"),
        })) as TMDBSearchResult[];

        setItems((prev) =>
          page === 1 ? normalizedResults : [...prev, ...normalizedResults],
        );
        setHasMore(data.page < data.total_pages);
      } catch (error: any) {
        if (error.name !== "AbortError") console.error(error);
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [page, selectedGenres, mediaType]);

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

  const formatDate = (date: string | null | undefined) => {
    if (!date) return "Unknown";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

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

        <div className="mb-6 md:mb-7">
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
                items.map((item, idx) => (
                  <motion.div
                    layout
                    layoutId={`explore-card-${item.id}`}
                    key={item.id}
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    <SearchResultCard
                      item={item}
                      onClick={() =>
                        router.push(
                          item.media_type === "movie"
                            ? `/details/movie/${item.id}`
                            : `/details/tvshow/${item.id}`,
                        )
                      }
                      formatDate={formatDate}
                    />
                  </motion.div>
                ))}
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
