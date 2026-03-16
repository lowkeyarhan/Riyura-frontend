import { ChevronRight, Film } from "lucide-react";
import MediaCard from "@/src/components/media/MediaCard";
import { MediaCardSkeleton } from "@/src/components/skeletons/MediaCardSkeleton";
import type { MediaCardProp } from "@/src/props/global/mediaCard";
import { MediaType } from "@/src/props/global/mediaType";

export interface WatchlistItemShape {
  id: number;
  tmdb_id?: number;
  title: string;
  poster_path: string | null;
  release_date: string | null;
  media_type: MediaType;
}

interface WatchlistSectionProps {
  items: WatchlistItemShape[];
  isLoading: boolean;
  onItemClick: (item: WatchlistItemShape) => void;
  onViewAll: () => void;
}

export function WatchlistSection({
  items,
  isLoading,
  onItemClick,
  onViewAll,
}: WatchlistSectionProps) {
  const toMediaCardProp = (item: WatchlistItemShape): MediaCardProp => ({
    tmdbId: item.tmdb_id ?? item.id,
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
    <section>
      <div className="flex items-center justify-between mb-4 md:mb-5">
        <h3
          className="text-lg md:text-xl font-bold text-white flex items-center gap-3"
          style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
        >
          Watchlist
        </h3>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-xs md:text-sm font-bold text-white/60 hover:text-white transition-colors"
        >
          View All <ChevronRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <MediaCardSkeleton key={`loading-${i}`} />
          ))
        ) : items.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400">
            <Film className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Your watchlist is empty. Start adding movies and shows!</p>
            <button
              onClick={() => (window.location.href = "/explore")}
              className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
            >
              Explore Content
            </button>
          </div>
        ) : (
          items
            .slice(0, 4)
            .map((item) => (
              <MediaCard
                key={item.id}
                item={toMediaCardProp(item)}
                onClick={() => onItemClick(item)}
              />
            ))
        )}
      </div>
    </section>
  );
}
