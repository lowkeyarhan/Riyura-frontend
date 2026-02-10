"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MediaGridItem } from "@/src/dto/media-ui";
import { MediaGridProps, MediaType } from "@/src/dto/components";
import MediaCard from "@/src/components/media/MediaCard";

// --- Constants ---
const CACHE_DURATION = 15 * 60 * 1000;
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const MEDIA_CONFIG: Record<
  MediaType,
  { cacheKey: string; fetchUrl: string; emptyLabel: string; detailsBase: string }
> = {
  movies: {
    cacheKey: "homepage:trending-movies",
    fetchUrl: "/api/movies",
    emptyLabel: "No movies found",
    detailsBase: "movie",
  },
  tvshows: {
    cacheKey: "homepage:trending-tv",
    fetchUrl: "/api/trending-tv",
    emptyLabel: "No TV shows found",
    detailsBase: "tvshow",
  },
  anime: {
    cacheKey: "homepage:trending-anime",
    fetchUrl: "/api/trending-anime",
    emptyLabel: "No anime found",
    detailsBase: "anime",
  },
};

// --- Sub-Component: Skeleton ---
const MediaSkeleton = () => (
  <div className="relative aspect-[2/3] rounded-xl bg-[#1a1d29] border border-white/5 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-20 animate-pulse" />
  </div>
);

// --- Main Component ---
export default function MediaGrid({
  mediaType,
  currentPage,
  itemsPerPage,
  onTotalItemsChange,
  initialItems = [],
}: MediaGridProps) {
  const router = useRouter();
  const config = useMemo(() => MEDIA_CONFIG[mediaType], [mediaType]);
  const [items, setItems] = useState<MediaGridItem[]>(initialItems);
  const [loading, setLoading] = useState(initialItems.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setItems(initialItems);
    setLoading(initialItems.length === 0);
    setError(null);
  }, [mediaType, initialItems]);

  useEffect(() => {
    if (initialItems.length > 0) {
      return;
    }

    const fetchItems = async () => {
      try {
        setLoading(true);
        const cached = localStorage.getItem(config.cacheKey);

        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setItems(data.results || []);
            setLoading(false);
            return;
          }
        }

        const response = await fetch(config.fetchUrl);
        if (!response.ok) throw new Error("Failed to fetch content");

        const data = await response.json();
        setItems(data.results || []);
        localStorage.setItem(
          config.cacheKey,
          JSON.stringify({ data, timestamp: Date.now() }),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [config.cacheKey, config.fetchUrl, initialItems.length]);

  useEffect(() => {
    onTotalItemsChange(items.length);
  }, [items.length, onTotalItemsChange]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

  const cardType = useMemo(() => {
    if (mediaType === "movies") return "movie";
    if (mediaType === "tvshows") return "tv";
    return "anime";
  }, [mediaType]);

  const getDetailsPath = (item: MediaGridItem) => {
    if (mediaType === "anime") {
      const path = item.media_type === "movie" ? "movie" : "tvshow";
      return `/details/${path}/${item.id}`;
    }
    return `/details/${config.detailsBase}/${item.id}`;
  };

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] text-center">
        <div className="text-red-400 text-lg mb-2">Unable to load content</div>
        <button
          onClick={() => window.location.reload()}
          className="text-sm text-gray-400 hover:text-white underline"
        >
          Try refreshing
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-6"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.03,
            },
          },
        }}
      >
        {loading ? (
          Array.from({ length: itemsPerPage }).map((_, i) => (
            <MediaSkeleton key={`skeleton-${i}`} />
          ))
        ) : (
          <AnimatePresence mode="popLayout">
            {paginatedItems.map((item) => {
              const date = item.release_date || item.first_air_date;
              const year = date ? new Date(date).getFullYear() : undefined;
              const posterUrl = item.poster_path
                ? `${IMAGE_BASE_URL}${item.poster_path}`
                : "/placeholder.jpg";

              return (
                <MediaCard
                  key={item.id}
                  title={item.title || item.name || "Untitled"}
                  posterUrl={posterUrl}
                  year={Number.isNaN(year as number) ? undefined : year}
                  rating={item.vote_average}
                  type={cardType}
                  onClick={() => router.push(getDetailsPath(item))}
                />
              );
            })}
          </AnimatePresence>
        )}
      </motion.div>

      {!loading && paginatedItems.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-500 gap-2">
          <p className="text-lg">{config.emptyLabel}</p>
        </div>
      )}
    </div>
  );
}
