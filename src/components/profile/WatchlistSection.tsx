import { ChevronRight, Film } from "lucide-react";
import MediaCard from "@/src/components/media/MediaCard";
import { MediaCardSkeleton } from "@/src/components/skeletons/MediaCardSkeleton";
import type { MediaCardProp } from "@/src/props/global/mediaCard";

interface WatchlistSectionProps {
  items: MediaCardProp[];
  isLoading: boolean;
  onItemClick: (item: MediaCardProp) => void;
  onViewAll: () => void;
}

export function WatchlistSection({
  items,
  isLoading,
  onItemClick,
  onViewAll,
}: WatchlistSectionProps) {

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
                key={item.tmdbId}
                item={item}
                onClick={() => onItemClick(item)}
              />
            ))
        )}
      </div>
    </section>
  );
}
