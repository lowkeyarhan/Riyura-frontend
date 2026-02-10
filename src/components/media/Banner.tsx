"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Play, Plus } from "lucide-react";
import LoadingDots from "@/src/components/ui/LoadingDots";
import { BannerItem } from "@/src/dto/banner";
import { useAuth } from "@/src/hooks/useAuth";
import { useNotification } from "@/src/lib/contexts/NotificationContext";
import {
  addToWatchlist,
  isInWatchlist,
  removeFromWatchlist,
} from "@/src/lib/db/database";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";
const AUTO_SLIDE_INTERVAL = 5000;

interface BannerProps {
  initialItems?: BannerItem[];
}

const GENRE_MAP: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

const getImageUrl = (path: string) =>
  path ? `${IMAGE_BASE_URL}${path}` : "/placeholder-image.jpg";

const truncate = (text: string, maxLength: number) =>
  text?.length > maxLength ? `${text.slice(0, maxLength)}...` : text || "";

const getDisplayTitle = (item?: BannerItem) =>
  item?.title || item?.name || item?.original_name || "Untitled";

const getMediaTypeLabel = (contentType: BannerItem["contentType"]) =>
  contentType === "movie" ? "Movie" : "TV Show";

export default function Banner({ initialItems = [] }: BannerProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { addNotification } = useNotification();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [items, setItems] = useState<BannerItem[]>(initialItems);
  const [loading, setLoading] = useState(initialItems.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  const slideTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);
  const minSwipeDistance = 50;

  const clearAutoSlide = useCallback(() => {
    if (slideTimerRef.current) {
      clearInterval(slideTimerRef.current);
      slideTimerRef.current = null;
    }
  }, []);

  const nextSlide = useCallback(() => {
    if (items.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prevSlide = useCallback(() => {
    if (items.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const resetInterval = useCallback(() => {
    clearAutoSlide();
    if (items.length <= 1) return;
    slideTimerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % items.length);
    }, AUTO_SLIDE_INTERVAL);
  }, [clearAutoSlide, items.length]);

  const goToSlide = (index: number) => {
    if (index < 0 || index >= items.length) return;
    setCurrentSlide(index);
    resetInterval();
  };

  useEffect(() => {
    if (initialItems.length > 0) {
      setItems(initialItems);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchBannerContent = async () => {
      try {
        setLoading(true);
        setError(null);

        const cacheKey = "banner:trending-content:v3";
        const cached = localStorage.getItem(cacheKey);

        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < 60 * 60 * 1000) {
            setItems(data.items || []);
            setLoading(false);
            return;
          }
        }

        const response = await fetch("/api/banner");
        if (!response.ok) throw new Error("Failed to load banner content");

        const data = await response.json();
        setItems(data.items || []);
        localStorage.setItem(
          cacheKey,
          JSON.stringify({ data, timestamp: Date.now() }),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchBannerContent();
  }, [initialItems]);

  useEffect(() => {
    if (items.length === 0) return;
    resetInterval();
    return clearAutoSlide;
  }, [items.length, resetInterval, clearAutoSlide]);

  const currentItem = items[currentSlide];
  const currentItemId = currentItem?.id;
  const currentContentType = currentItem?.contentType;

  useEffect(() => {
    const checkWatchlistStatus = async () => {
      if (!user || !currentItemId || !currentContentType) {
        setIsWatchlisted(false);
        return;
      }

      try {
        const inWatchlist = await isInWatchlist(
          user.id,
          currentItemId,
          currentContentType,
        );
        setIsWatchlisted(inWatchlist);
      } catch {
        setIsWatchlisted(false);
      }
    };

    checkWatchlistStatus();
  }, [user, currentItemId, currentContentType]);

  const itemGenres =
    currentItem?.genre_ids?.map((id) => GENRE_MAP[id]).filter(Boolean).slice(0, 2) ||
    [];

  const metadataParts = currentItem
    ? [
      getMediaTypeLabel(currentItem.contentType),
      currentItem.date,
      ...itemGenres,
    ].filter((part): part is string => Boolean(part))
    : [];

  const handlePlay = () => {
    if (!currentItem) return;

    if (currentItem.contentType === "movie") {
      router.push(`/player/movie/${currentItem.id}`);
      return;
    }

    router.push(`/player/tvshow/${currentItem.id}?season=1&episode=1`);
  };

  const toggleWatchlist = async () => {
    if (!currentItem) return;

    if (!user) {
      router.push("/auth");
      return;
    }

    setWatchlistLoading(true);
    const mediaTitle = getDisplayTitle(currentItem);

    try {
      if (isWatchlisted) {
        await removeFromWatchlist(user.id, currentItem.id, currentItem.contentType);
        setIsWatchlisted(false);
        addNotification(`${mediaTitle} removed from watchlist`, "success");
      } else {
        await addToWatchlist(user.id, {
          tmdb_id: currentItem.id,
          title: mediaTitle,
          media_type: currentItem.contentType,
          poster_path: currentItem.poster_path || currentItem.backdrop_path || null,
          release_date: currentItem.date || null,
          vote: currentItem.vote_average || null,
        });
        setIsWatchlisted(true);
        addNotification(`${mediaTitle} added to watchlist`, "success");
      }

      sessionStorage.removeItem(`watchlist_${user.id}`);
    } catch {
      addNotification("Failed to update watchlist", "error");
    } finally {
      setWatchlistLoading(false);
    }
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchEndXRef.current = null;
    touchStartXRef.current = event.targetTouches[0]?.clientX ?? null;
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    touchEndXRef.current = event.targetTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null || touchEndXRef.current === null) return;

    const distance = touchStartXRef.current - touchEndXRef.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
      resetInterval();
    }

    if (isRightSwipe) {
      prevSlide();
      resetInterval();
    }
  };

  return (
    <div
      className="relative w-full h-[88vh] min-h-[560px] md:h-screen bg-black overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <LoadingDots />
        </div>
      )}

      {error && !loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center text-xl text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="absolute inset-0 z-20 flex items-center justify-center text-xl text-white">
          No content available
        </div>
      )}

      <AnimatePresence mode="popLayout">
        {currentItem && (
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 h-full w-full"
          >
            <Image
              src={getImageUrl(currentItem.backdrop_path)}
              alt={getDisplayTitle(currentItem)}
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
            {/* <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/55" /> */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-16 md:px-24 md:pb-24 pointer-events-none">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {currentItem && (
              <motion.div
                key={currentItem.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <h1
                  className="mb-4 text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-white md:text-6xl lg:text-7xl"
                  style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
                >
                  {getDisplayTitle(currentItem)}
                </h1>

                <div className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-2 text-white/80">
                  <span className="inline-flex h-7 items-center justify-center rounded-full border border-white/20 bg-white/10 px-2 text-xs font-semibold">
                    HD+
                  </span>

                  {metadataParts.map((part, index) => (
                    <React.Fragment key={`${part}-${index}`}>
                      <span className="text-sm md:text-[1.02rem]">{part}</span>
                      {index < metadataParts.length - 1 && (
                        <span className="text-white/50">•</span>
                      )}
                    </React.Fragment>
                  ))}

                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-white/70 px-1 text-[10px] font-bold leading-none">
                    {currentItem.adult ? "A" : "U/A"}
                  </span>
                </div>

                <p
                  className="max-w-xl text-base leading-relaxed text-white/70 md:text-[1.1rem]"
                  style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
                >
                  {truncate(currentItem.overview, 140)}
                </p>

                <div className="pointer-events-auto mt-7 flex items-center gap-3">
                  <button
                    onClick={handlePlay}
                    className="w-fit rounded-full bg-white px-8 py-3.5 font-semibold text-black transition hover:bg-white/90"
                    style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
                  >
                    <span className="flex items-center gap-2">
                      <Play className="h-5 w-5 fill-black" />
                      <span className="text-2xl leading-none">Play</span>
                    </span>
                  </button>

                  <button
                    onClick={toggleWatchlist}
                    disabled={watchlistLoading}
                    aria-label={
                      isWatchlisted ? "Remove from watchlist" : "Add to watchlist"
                    }
                    className={`flex h-14 w-14 items-center justify-center rounded-full border border-white/15 transition ${isWatchlisted
                      ? "bg-white/35 text-white"
                      : "bg-white/20 text-white hover:bg-white/30"
                      } ${watchlistLoading ? "cursor-not-allowed opacity-70" : ""}`}
                  >
                    <Plus className="h-8 w-8" strokeWidth={1.5} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {items.length > 1 && (
          <div className="pointer-events-auto absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center justify-center gap-2">
            {items.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToSlide(index)}
                layout
                initial={false}
                animate={{
                  width: index === currentSlide ? 32 : 8,
                  backgroundColor:
                    index === currentSlide ? "#ffffff" : "rgba(255,255,255,0.5)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="h-2 rounded-full"
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
