import { TrendingCardSkeleton } from "../skeletons/TrendingCardSkeleton";
import { TrendingCard } from "./TrendingCard";
import type { MediaCardProp } from "@/src/props/global/mediaCard";

interface TrendingSectionProps {
  items: MediaCardProp[];
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
          <h2 className="text-3xl md:text-4xl font-semibold text-white mt-2">
            Riyura Spotlight
          </h2>
          <p className="text-sm text-slate-400 mt-3 max-w-xl">
            Your personalized mix of movies and shows lighting up the charts
            this week.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-7 md:grid-cols-2 xl:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
            <TrendingCardSkeleton key={`skeleton-${i}`} />
          ))
          : items.map((item) => {
            const isMovie = item.media_type === "Movie";
            const href = isMovie
              ? `/details/movie/${item.tmdbId}`
              : `/details/tvshow/${item.tmdbId}`;

            return (
              <TrendingCard
                key={`${item.tmdbId}-${item.media_type}`}
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
