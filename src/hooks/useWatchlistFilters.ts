import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { MediaType } from "@/src/props/global/mediaType";
import { WatchlistItem } from "@/src/dto/media";

interface UseWatchlistFiltersParams {
  items: WatchlistItem[];
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
  visibleItems: WatchlistItem[];
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

    let filtered = items;
    if (filter === "movie") {
      filtered = items.filter((i) => i.media_type === MediaType.Movie);
    } else if (filter === "tv") {
      filtered = items.filter((i) => i.media_type === MediaType.TV);
    }

    const sorted = [...filtered];
    if (sortBy === "recent") {
      sorted.sort((a, b) => {
        const dateA = a.added_at ? new Date(a.added_at).getTime() : 0;
        const dateB = b.added_at ? new Date(b.added_at).getTime() : 0;
        return dateB - dateA;
      });
    } else if (sortBy === "title") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "year") {
      sorted.sort((a, b) => {
        const yearA = a.release_date
          ? new Date(a.release_date).getFullYear()
          : 0;
        const yearB = b.release_date
          ? new Date(b.release_date).getFullYear()
          : 0;
        return yearB - yearA;
      });
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
    if (success) {
      addNotification("Removed from watchlist", "success");
    } else {
      addNotification("Failed to remove item", "error");
    }
  };

  const handleItemClick = (tmdbId: number, mediaType: "movie" | "tv") => {
    router.push(
      `/details/${mediaType === "movie" ? "movie" : "tvshow"}/${tmdbId}`,
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
