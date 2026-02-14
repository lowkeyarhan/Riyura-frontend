"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, Transition, Variants } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Play, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import BannerSkeleton from "@/src/components/skeletons/BannerSkeleton";
import ContinueWatchingCard from "@/src/components/media/ContinueWatchingCard";
import { BannerItem, ContinueWatchingOverlayItem } from "@/src/dto/ui/card";
import { WatchHistoryItem } from "@/src/dto/media";
import { useAuth } from "@/src/hooks/useAuth";
import { ContinueWatchingSkeleton } from "../skeletons/ContinueWatchingSkeleton";
import { SkeletonTheme } from "react-loading-skeleton";
import { useNotification } from "@/src/lib/contexts/NotificationContext";
import {
  addToWatchlist,
  isInWatchlist,
  removeFromWatchlist,
} from "@/src/lib/db/database";
import { supabase } from "@/src/lib/auth/supabase";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";
const CARD_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w780";
const AUTO_SLIDE_INTERVAL = 8000;
const CONTINUE_NON_DESKTOP_MAX_CARDS = 3;
const CONTINUE_DESKTOP_MAX_CARDS = 5;

interface BannerProps {
  initialItems?: BannerItem[];
}

const EMPTY_BANNER_ITEMS: BannerItem[] = [];

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
const getCardImageUrl = (path?: string | null) =>
  path ? `${CARD_IMAGE_BASE_URL}${path}` : "/placeholder-image.jpg";

const truncate = (text: string, maxLength: number) =>
  text?.length > maxLength ? `${text.slice(0, maxLength)}...` : text || "";

const getDisplayTitle = (item?: BannerItem) =>
  item?.title || item?.name || item?.original_name || "Untitled";

const getMediaTypeLabel = (contentType: BannerItem["contentType"]) =>
  contentType === "movie" ? "Movie" : "TV Show";

// Image Transition
const IMAGE_TRANSITION: Transition = {
  duration: 2.1,
  ease: [0.4, 0, 0.2, 1] as const,
};
const IMAGE_FADE_EASE: [number, number, number, number] = [0.42, 0, 0.58, 1];

// Content Transition
const CONTENT_TRANSITION: Transition = {
  duration: 0.8,
  ease: "easeOut" as const,
  delay: 0.2,
};

// Image Variants
const imageVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "10%" : "-10%",
    opacity: 0,
    zIndex: 2,
  }),
  center: {
    x: "0%",
    opacity: 1,
    zIndex: 2,
    transition: {
      x: IMAGE_TRANSITION,
      opacity: {
        duration: 1.6,
        delay: 0.2,
        ease: IMAGE_FADE_EASE,
      },
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-10%" : "10%",
    opacity: 0,
    zIndex: 1,
    transition: {
      x: IMAGE_TRANSITION,
      opacity: {
        duration: 1.6,
        ease: IMAGE_FADE_EASE,
      },
    },
  }),
};

// Content Variants
const contentVariants: Variants = {
  enter: { opacity: 0, y: 20 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const mapWatchHistoryItem = (
  item: WatchHistoryItem,
): ContinueWatchingOverlayItem => {
  const fallbackLength = item.media_type === "movie" ? 7200 : 2700;
  const totalLength = Math.max(60, item.episode_length || fallbackLength);
  const watchedSeconds = Math.max(0, item.duration_sec || 0);
  const remainingSeconds = Math.max(0, totalLength - watchedSeconds);

  return {
    id: item.id,
    tmdbId: item.tmdb_id,
    title: item.title || "Untitled",
    image: getCardImageUrl(item.backdrop_path || item.poster_path),
    progress: Math.min(100, Math.round((watchedSeconds / totalLength) * 100)),
    meta:
      item.media_type === "movie"
        ? "Movie"
        : `S${item.season_number || 1} E${item.episode_number || 1}`,
    remaining:
      remainingSeconds === 0
        ? "Completed"
        : `${Math.ceil(remainingSeconds / 60)}m remaining`,
    mediaType: item.media_type,
    seasonNumber: item.season_number || 1,
    episodeNumber: item.episode_number || 1,
    streamId: item.stream_id,
  };
};

export default function Banner({ initialItems }: BannerProps) {
  const safeInitialItems = initialItems ?? EMPTY_BANNER_ITEMS;
  const router = useRouter();
  const { user } = useAuth();
  const { addNotification } = useNotification();

  const [[currentSlide, direction], setCurrentSlide] = useState([0, 0]);

  const [items, setItems] = useState<BannerItem[]>(safeInitialItems);
  const [loading, setLoading] = useState(safeInitialItems.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [continueWatching, setContinueWatching] = useState<
    ContinueWatchingOverlayItem[]
  >([]);
  const [continueWatchingLoading, setContinueWatchingLoading] = useState(true);
  const [isDesktopViewport, setIsDesktopViewport] = useState(false);

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

  // Paginate
  const paginate = useCallback(
    (newDirection: number) => {
      if (items.length === 0) return;
      setCurrentSlide(([prevIndex]) => {
        let nextIndex = (prevIndex + newDirection) % items.length;
        if (nextIndex < 0) nextIndex = items.length - 1;
        return [nextIndex, newDirection];
      });
    },
    [items.length],
  );

  const goToSlide = useCallback(
    (index: number) => {
      if (items.length === 0) return;
      const nextIndex = Math.max(0, Math.min(items.length - 1, index));
      setCurrentSlide(([prevIndex]) => [nextIndex, nextIndex - prevIndex]);
    },
    [items.length],
  );

  // Next Slide
  const nextSlide = useCallback(() => paginate(1), [paginate]);
  // Previous Slide
  const prevSlide = useCallback(() => paginate(-1), [paginate]);

  // Reset the auto slide interval
  const resetInterval = useCallback(() => {
    clearAutoSlide();
    if (items.length <= 1) return;
    slideTimerRef.current = setInterval(() => {
      nextSlide();
    }, AUTO_SLIDE_INTERVAL);
  }, [clearAutoSlide, items.length, nextSlide]);

  // Fetch the banner content
  useEffect(() => {
    if (safeInitialItems.length > 0) {
      setItems(safeInitialItems);
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
          if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
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
  }, [safeInitialItems]);

  // Reset the auto slide interval when the items change
  useEffect(() => {
    if (items.length === 0) return;
    resetInterval();
    return clearAutoSlide;
  }, [items.length, resetInterval, clearAutoSlide]);

  // Get the current item
  const currentItem = items[currentSlide];
  const currentItemId = currentItem?.id;
  const currentContentType = currentItem?.contentType;

  // Check the watchlist status
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

  // Deduplication: Use ref to track ongoing/recent fetch
  const fetchCacheRef = useRef<{
    promise: Promise<ContinueWatchingOverlayItem[]> | null;
    userId: string | null;
  }>({ promise: null, userId: null });

  useEffect(() => {
    let isActive = true;

    const fetchContinueWatching = async () => {
      if (!user) {
        setContinueWatching([]);
        setContinueWatchingLoading(false);
        return;
      }

      // Deduplication: If there's an ongoing fetch for this user, reuse it
      if (
        fetchCacheRef.current.promise &&
        fetchCacheRef.current.userId === user.id
      ) {
        try {
          const cachedResult = await fetchCacheRef.current.promise;
          if (isActive) setContinueWatching(cachedResult);
        } catch {
          if (isActive) setContinueWatching([]);
        } finally {
          if (isActive) setContinueWatchingLoading(false);
        }
        return;
      }

      try {
        setContinueWatchingLoading(true);

        // Create and cache the promise
        const fetchPromise = (async () => {
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (!session?.access_token) {
            return [];
          }

          const response = await fetch("/api/watch-history", {
            headers: { Authorization: `Bearer ${session.access_token}` },
          });

          if (!response.ok) {
            throw new Error("Failed to load watch history");
          }

          const payload = (await response.json()) as {
            data?: WatchHistoryItem[];
          };

          return Array.isArray(payload.data)
            ? payload.data
                .map(mapWatchHistoryItem)
                .filter((item) => item.progress <= 95)
                .slice(0, CONTINUE_DESKTOP_MAX_CARDS)
            : [];
        })();

        fetchCacheRef.current = { promise: fetchPromise, userId: user.id };

        const mappedItems = await fetchPromise;

        if (isActive) setContinueWatching(mappedItems);

        // Clear cache after successful completion
        setTimeout(() => {
          if (fetchCacheRef.current.userId === user.id) {
            fetchCacheRef.current = { promise: null, userId: null };
          }
        }, 1000);
      } catch {
        if (isActive) setContinueWatching([]);
        fetchCacheRef.current = { promise: null, userId: null };
      } finally {
        if (isActive) setContinueWatchingLoading(false);
      }
    };

    fetchContinueWatching();

    return () => {
      isActive = false;
    };
  }, [user?.id]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleViewportChange = () => {
      setIsDesktopViewport(mediaQuery.matches);
    };

    handleViewportChange();
    mediaQuery.addEventListener("change", handleViewportChange);

    return () => {
      mediaQuery.removeEventListener("change", handleViewportChange);
    };
  }, []);

  // Get the item genres
  const itemGenres =
    currentItem?.genre_ids
      ?.map((id) => GENRE_MAP[id])
      .filter(Boolean)
      .slice(0, 2) || [];

  // Get the metadata parts
  const metadataParts = currentItem
    ? [
        getMediaTypeLabel(currentItem.contentType),
        currentItem.date,
        ...itemGenres,
      ].filter((part): part is string => Boolean(part))
    : [];

  // Handle the play button click
  const handlePlay = () => {
    if (!currentItem) return;
    if (currentItem.contentType === "movie") {
      router.push(`/player/movie/${currentItem.id}`);
      return;
    }
    router.push(`/player/tvshow/${currentItem.id}?season=1&episode=1`);
  };

  // Toggle the watchlist
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
        await removeFromWatchlist(
          user.id,
          currentItem.id,
          currentItem.contentType,
        );
        setIsWatchlisted(false);
        addNotification(`${mediaTitle} removed from watchlist`, "success");
      } else {
        await addToWatchlist(user.id, {
          tmdb_id: currentItem.id,
          title: mediaTitle,
          media_type: currentItem.contentType,
          poster_path:
            currentItem.poster_path || currentItem.backdrop_path || null,
          release_date: currentItem.date || null,
          vote: currentItem.vote_average || null,
        });
        setIsWatchlisted(true);
        addNotification(`${mediaTitle} added to watchlist`, "success");
      }
    } catch {
      addNotification("Failed to update watchlist", "error");
    } finally {
      setWatchlistLoading(false);
    }
  };

  // Handle the touch start event
  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchEndXRef.current = null;
    touchStartXRef.current = event.targetTouches[0]?.clientX ?? null;
  };

  // Handle the touch move event
  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    touchEndXRef.current = event.targetTouches[0]?.clientX ?? null;
  };

  // Handle the touch end event
  const handleTouchEnd = () => {
    if (touchStartXRef.current === null || touchEndXRef.current === null)
      return;
    const distance = touchStartXRef.current - touchEndXRef.current;
    if (distance > minSwipeDistance) {
      nextSlide();
      resetInterval();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
      resetInterval();
    }
  };

  const handlePlayClick = useCallback(
    (item: any) => {
      if (item.mediaType === "movie") {
        const url = `/player/movie/${item.tmdbId}${
          item.streamId ? `?stream=${item.streamId}` : ""
        }`;
        router.push(url);
      } else {
        const params = new URLSearchParams();
        if (item.streamId) params.set("stream", item.streamId);
        if (item.seasonNumber)
          params.set("season", item.seasonNumber.toString());
        if (item.episodeNumber)
          params.set("episode", item.episodeNumber.toString());
        router.push(
          `/player/tvshow/${item.tmdbId}${
            params.toString() ? `?${params.toString()}` : ""
          }`,
        );
      }
    },
    [router],
  );

  const continueWatchingVisibleItems = continueWatching.slice(
    0,
    isDesktopViewport
      ? CONTINUE_DESKTOP_MAX_CARDS
      : CONTINUE_NON_DESKTOP_MAX_CARDS,
  );

  return (
    <section className="relative w-full bg-black pb-8 md:pb-10">
      <div
        className="relative w-full h-[90vh] min-h-[560px] md:h-screen bg-black overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {loading && <BannerSkeleton />}

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

        {/* Animate the current item background image */}
        <AnimatePresence initial={false} custom={direction} mode="sync">
          {currentItem && (
            <motion.div
              key={`${currentItem.contentType}-${currentItem.id}-${currentSlide}`}
              custom={direction}
              variants={imageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-y-0 -left-[18%] h-full w-[136%] will-change-transform"
            >
              <Image
                src={getImageUrl(currentItem.backdrop_path)}
                alt={getDisplayTitle(currentItem)}
                fill
                priority
                className="object-cover object-center"
                sizes="136vw"
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-0 z-[5] bg-gradient-to-t from-black/95 via-black/75 to-transparent" />

        {/* Content Container */}
        <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-16 md:px-20 md:pb-24 pointer-events-none">
          <div className="w-full max-w-2xl">
            <AnimatePresence mode="wait">
              {/* Animate the current item content */}
              {currentItem && (
                <motion.div
                  key={`${currentItem.contentType}-${currentItem.id}-${currentSlide}`}
                  variants={contentVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={CONTENT_TRANSITION}
                >
                  {/* Title */}
                  <h1
                    className="mb-4 text-6xl md:text-7xl lg:text-8xl font-extrabold uppercase leading-[0.95] tracking-tight text-white"
                    style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
                  >
                    {getDisplayTitle(currentItem)}
                  </h1>

                  {/* Metadata */}
                  <div className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-2 text-white/80">
                    <span className="inline-flex h-7 items-center justify-center rounded-full border border-white/20 bg-white/10 px-2 text-xs font-semibold">
                      HD+
                    </span>

                    {metadataParts.map((part, index) => (
                      <React.Fragment key={`${part}-${index}`}>
                        <span className="text-sm md:text-[1.02rem]">
                          {part}
                        </span>
                        {index < metadataParts.length - 1 && (
                          <span className="text-white/50">•</span>
                        )}
                      </React.Fragment>
                    ))}

                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-white/70 px-1 text-[10px] font-bold leading-none">
                      {currentItem.adult ? "A" : "U/A"}
                    </span>
                  </div>

                  {/* Overview */}
                  <p
                    className="max-w-3xl text-base leading-relaxed text-white/70 md:text-[1.1rem]"
                    style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
                  >
                    {truncate(currentItem.overview, 140)}
                  </p>

                  {/* Buttons */}
                  <div className="pointer-events-auto mt-7 flex items-center gap-3">
                    {/* Play Button */}
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

                    {/* Toggle the watchlist */}
                    <button
                      onClick={toggleWatchlist}
                      disabled={watchlistLoading}
                      aria-label={
                        isWatchlisted
                          ? "Remove from watchlist"
                          : "Add to watchlist"
                      }
                      className={`flex h-14 w-14 items-center justify-center rounded-full border border-white/15 transition ${
                        isWatchlisted
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

          {/* Side Navigation
          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => {
                  prevSlide();
                  resetInterval();
                }}
                aria-label="Previous banner"
                className="pointer-events-auto absolute left-1 top-[50%] z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-white transition hover:bg-black/20 md:hidden"
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => {
                  nextSlide();
                  resetInterval();
                }}
                aria-label="Next banner"
                className="pointer-events-auto md:hidden absolute right-1 top-[50%] z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/10 text-white backdrop-blur-sm transition hover:bg-black/20 md:right-8 md:top-1/2 md:h-14 md:w-14"
              >
                <ChevronRight
                  className="h-5 w-5 md:h-7 md:w-7"
                  strokeWidth={2}
                />
              </button>
            </>
          )} */}
        </div>

        {/* Slide Dots (kept inside viewport) */}
        {items.length > 1 && (
          <div className="pointer-events-auto absolute inset-x-0 bottom-10 z-20 hidden items-center justify-center gap-2 px-6 md:flex md:px-20">
            {items.map((_, index) => (
              <motion.button
                key={index}
                type="button"
                onClick={() => {
                  goToSlide(index);
                  resetInterval();
                }}
                // Use Framer Motion layout prop for smooth width transition
                layout
                initial={false}
                animate={{
                  width: index === currentSlide ? 32 : 8,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`h-2 rounded-full ${
                  index === currentSlide ? "bg-white" : "bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Continue Watching */}
      {(continueWatchingLoading || continueWatchingVisibleItems.length > 0) && (
        <div className="relative z-20 px-6 md:px-20">
          {/* Continue Watching Title */}
          <div className="border-t border-white/20 pt-5">
            <h2
              className="text-2xl md:text-3xl font-bold text-white tracking-tight"
              style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
            >
              Continue Watching
            </h2>
            <p
              className="mt-2 mb-5 md:mb-6 text-sm md:text-base text-white/60"
              style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
            >
              Pick up where you left off
            </p>

            {continueWatchingLoading ? (
              <SkeletonTheme baseColor="#1a1d26" highlightColor="#2a2d36">
                <div className="grid grid-flow-col auto-cols-[calc((100%_-_0.75rem)/1.5)] gap-3 overflow-x-auto pb-2 md:grid-flow-row md:auto-cols-auto md:grid-cols-3 md:gap-5 lg:grid-cols-5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <ContinueWatchingSkeleton key={i} />
                  ))}
                </div>
              </SkeletonTheme>
            ) : (
              <div className="grid grid-flow-col auto-cols-[calc((100%_-_0.75rem)/1.5)] gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:grid-flow-row md:auto-cols-auto md:grid-cols-3 md:overflow-visible md:gap-5 lg:grid-cols-5">
                {continueWatchingVisibleItems.map((item) => (
                  <ContinueWatchingCard
                    key={item.id}
                    item={item}
                    onClick={handlePlayClick}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
