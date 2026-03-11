import { LayoutGrid } from "lucide-react";
import MediaCard from "@/src/components/media/MediaCard";
import { WatchlistItem } from "@/src/dto/media";
import { ContextMenu } from "@/src/components/media/ContextMenu";
import type { MediaCardProp } from "@/src/props/global/mediaCard";
import { MediaType } from "@/src/props/global/mediaType";
import { useState } from "react";

const FONT_FAMILY = "Be Vietnam Pro, sans-serif";

interface WatchlistGridProps {
  items: WatchlistItem[];
  loading: boolean;
  filter: "all" | "movie" | "tv" | "anime";
  onRemove: (
    e: React.MouseEvent,
    tmdbId: number,
    mediaType: "movie" | "tv",
  ) => void;
  onItemClick: (tmdbId: number, mediaType: "movie" | "tv") => void;
}

export function WatchlistGrid({
  items,
  loading,
  filter,
  onRemove,
  onItemClick,
}: WatchlistGridProps) {
  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    item: WatchlistItem;
  } | null>(null);

  // Handle right-click (desktop)
  const handleContextMenu = (e: React.MouseEvent, item: WatchlistItem) => {
    e.preventDefault(); // Prevent browser context menu
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item,
    });
  };

  // Handle long-press (mobile)
  const handleLongPress = (item: WatchlistItem) => {
    // Position at center of screen for mobile
    setContextMenu({
      x: window.innerWidth / 2 - 100, // Center (100px = half menu width)
      y: window.innerHeight / 2 - 30, // Center (30px = half menu height)
      item,
    });
  };

  // Close context menu
  const closeContextMenu = () => {
    setContextMenu(null);
  };

  // Handle remove from context menu
  const handleRemoveFromMenu = () => {
    if (contextMenu) {
      // Create a mock event with stopPropagation method
      const mockEvent = {
        stopPropagation: () => { },
      } as React.MouseEvent;

      onRemove(
        mockEvent,
        contextMenu.item.tmdb_id,
        contextMenu.item.media_type === "Movie" ? "movie" : "tv",
      );
      closeContextMenu();
    }
  };
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-[#0f111562] border border-white/5 aspect-[2/3] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-20 animate-pulse" />
            <div className="absolute bottom-4 left-4 right-4 space-y-2">
              <div className="h-4 bg-white/10 rounded w-3/4" />
              <div className="h-3 bg-white/5 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <LayoutGrid className="w-10 h-10 text-gray-500" />
        </div>
        <h2
          className="text-2xl md:text-3xl font-bold text-white mb-3"
          style={{ fontFamily: FONT_FAMILY }}
        >
          No items found
        </h2>
        <p className="text-gray-400 text-base max-w-md px-4">
          Add movies and shows to your watchlist to see them here.
        </p>
      </div>
    );
  }

  const toMediaCardProp = (item: WatchlistItem): MediaCardProp => ({
    tmdbId: item.tmdb_id,
    title: item.title,
    poster_path: item.poster_path
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : "",
    year: item.release_date
      ? new Date(item.release_date).getFullYear().toString()
      : "N/A",
    media_type: item.media_type as MediaType,
  });

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-5 xl:grid-cols-6">
        {items.map((item) => (
          <MediaCard
            key={item.tmdb_id}
            item={toMediaCardProp(item)}
            onClick={() => onItemClick(item.tmdb_id, item.media_type === "Movie" ? "movie" : "tv")}
            onContextMenu={(e) => handleContextMenu(e, item)}
            onLongPress={() => handleLongPress(item)}
          />
        ))}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onRemove={handleRemoveFromMenu}
          onClose={closeContextMenu}
        />
      )}
    </>
  );
}
