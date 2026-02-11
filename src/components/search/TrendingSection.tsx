import TrendingSkeleton from "./TrendingSkeleton";
import { TrendingCard } from "./TrendingCard";

interface TrendingSectionProps {
  items: Array<{
    id: number;
    title?: string;
    name?: string;
    overview?: string;
    poster_path?: string | null;
    backdrop_path?: string | null;
    vote_average?: number;
    release_date?: string;
    first_air_date?: string;
    mediaCategory: "movie" | "tv";
  }>;
  isLoading: boolean;
  onCardClick: (href: string) => void;
  formatDate: (date: string | null | undefined) => string;
  show: boolean;
}

export function TrendingSection({
  items,
  isLoading,
  onCardClick,
  formatDate,
  show,
}: TrendingSectionProps) {
  if (!show) return null;

  return (
    <section className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
        <div className="text-left">
          <p className="flex items-center gap-2 text-xs tracking-[0.35em] uppercase text-slate-400">
            Trending Now
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-white mt-2">
            Riyura Spotlight
          </h2>
          <p className="text-sm text-slate-400 mt-3 max-w-xl">
            Your personalized mix of movies and shows lighting up the charts
            this week.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-7 sm:grid-cols-2 xl:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <TrendingSkeleton key={`skeleton-${i}`} />
            ))
          : items.map((item) => {
              const isMovie = item.mediaCategory === "movie";
              const href = isMovie
                ? `/details/movie/${item.id}`
                : `/details/tvshow/${item.id}`;

              return (
                <TrendingCard
                  key={`${item.id}-${item.mediaCategory}`}
                  item={item}
                  onClick={() => onCardClick(href)}
                  formatDate={formatDate}
                />
              );
            })}
      </div>
    </section>
  );
}
