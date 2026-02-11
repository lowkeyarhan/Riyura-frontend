import { LayoutGrid } from "lucide-react";
import MediaCard from "@/src/components/media/MediaCard";
import { WatchlistItem } from "@/src/dto/media";

const FONT_FAMILY = "Be Vietnam Pro, sans-serif";

interface WatchlistGridProps {
  items: WatchlistItem[];
  loading: boolean;
  filter: "all" | "movie" | "tv";
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
  if (loading) {
    return (
      <div className="bg-[#3c3c3c17] border border-white/5 rounded-3xl p-4 md:p-8 shadow-lg">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
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
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center border border-white/5 rounded-3xl bg-[#3c3c3c17] shadow-lg">
        <div className="w-24 h-24 bg-[#0f111564] rounded-full flex items-center justify-center mb-6 border border-white/5 shadow-inner">
          <LayoutGrid className="w-10 h-10 text-gray-500" />
        </div>
        <h2
          className="text-2xl md:text-3xl font-bold text-white mb-3"
          style={{ fontFamily: FONT_FAMILY }}
        >
          Your watchlist is empty
        </h2>
        <p className="text-gray-400 text-lg max-w-md px-4">
          Go explore trending titles and bookmark the ones that catch your eye.
        </p>
      </div>
    );
  }

  const posterUrl = (posterPath: string | null) =>
    posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : null;

  const getYear = (releaseDate: string | null) =>
    releaseDate ? new Date(releaseDate).getFullYear() : undefined;

  return (
    <div className="bg-[#1518215f] border border-white/5 rounded-3xl p-4 md:p-8 shadow-lg">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
        {items.map((item) => (
          <MediaCard
            key={item.tmdb_id}
            title={item.title}
            posterUrl={posterUrl(item.poster_path)}
            year={getYear(item.release_date)}
            rating={item.vote ?? undefined}
            type={item.media_type}
            seasons={item.number_of_seasons ?? undefined}
            episodes={item.number_of_episodes ?? undefined}
            onRemove={(e: React.MouseEvent) =>
              onRemove(e, item.tmdb_id, item.media_type)
            }
            onClick={() => onItemClick(item.tmdb_id, item.media_type)}
          />
        ))}
      </div>
    </div>
  );
}
