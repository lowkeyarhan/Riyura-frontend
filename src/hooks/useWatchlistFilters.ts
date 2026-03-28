import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { MediaType } from "@/src/props/global/mediaType";
import { getDetailsPath } from "@/src/lib/utils/format";
import type { MediaCardProp } from "@/src/props/global/mediaCard";

interface UseWatchlistFiltersParams {
  items: MediaCardProp[];
  removeItem: (
    tmdbId: number,
    mediaType: "movie" | "tv",
  ) => Promise<{ success: boolean }>;
  addNotification: (message: string, type: "success" | "error") => void;
  router: ReturnType<typeof useRouter>;
}

interface UseWatchlistFiltersReturn {
  filter: "all" | "movie" | "tv";
  setFilter: (value: "all" | "movie" | "tv") => void;
  sortBy: "recent" | "title" | "year";
  setSortBy: (value: "recent" | "title" | "year") => void;
  counts: { movie: number; tv: number; total: number };
  visibleItems: MediaCardProp[];
  handleRemove: (
    e: React.MouseEvent,
    tmdbId: number,
    mediaType: "movie" | "tv",
  ) => Promise<void>;
  handleItemClick: (tmdbId: number, mediaType: "movie" | "tv") => void;
}

export function useWatchlistFilters({
  items,
  removeItem,
  addNotification,
  router,
}: UseWatchlistFiltersParams): UseWatchlistFiltersReturn {
  const [filter, setFilter] = useState<"all" | "movie" | "tv">("all");
  const [sortBy, setSortBy] = useState<"recent" | "title" | "year">("recent");

  const counts = useMemo(() => {
    if (!Array.isArray(items)) return { movie: 0, tv: 0, total: 0 };
    return {
      movie: items.filter((i) => i.media_type === MediaType.Movie).length,
      tv: items.filter((i) => i.media_type === MediaType.TV).length,
      total: items.length,
    };
  }, [items]);

  const visibleItems = useMemo(() => {
    if (!Array.isArray(items)) return [];

    const filtered =
      filter === "movie"
        ? items.filter((i) => i.media_type === MediaType.Movie)
        : filter === "tv"
          ? items.filter((i) => i.media_type === MediaType.TV)
          : items;

    // "recent" preserves backend order (already sorted by added_at desc)
    if (sortBy === "recent") return filtered;

    const sorted = [...filtered];
    if (sortBy === "title") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "year") {
      sorted.sort(
        (a, b) => (parseInt(b.year, 10) || 0) - (parseInt(a.year, 10) || 0),
      );
    }
    return sorted;
  }, [items, filter, sortBy]);

  const handleRemove = async (
    e: React.MouseEvent,
    tmdbId: number,
    mediaType: "movie" | "tv",
  ) => {
    e.stopPropagation();
    const { success } = await removeItem(tmdbId, mediaType);
    addNotification(
      success ? "Removed from watchlist" : "Failed to remove item",
      success ? "success" : "error",
    );
  };

  const handleItemClick = (tmdbId: number, mediaType: "movie" | "tv") => {
    router.push(
      getDetailsPath(
        tmdbId,
        mediaType === "movie" ? MediaType.Movie : MediaType.TV,
      ),
    );
  };

  return {
    filter,
    setFilter,
    sortBy,
    setSortBy,
    counts,
    visibleItems,
    handleRemove,
    handleItemClick,
  };
}
