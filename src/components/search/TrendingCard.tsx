import Image from "next/image";
import { Film, Tv } from "lucide-react";
import { StarIcon, CalendarIcon, PlayIcon } from "./SearchIcons";

interface TrendingCardProps {
  item: {
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
  };
  onClick: () => void;
  formatDate: (date: string | null | undefined) => string;
}

export function TrendingCard({ item, onClick, formatDate }: TrendingCardProps) {
  const isMovie = item.mediaCategory === "movie";
  const Icon = isMovie ? Film : Tv;
  const releaseDate = item.release_date || item.first_air_date;
  const cardOverview =
    item.overview ||
    (isMovie
      ? "Experience the cinematic moment everyone is talking about."
      : "Binge the series that is dominating conversations right now.");

  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#161a39] via-[#10172c] to-[#070b18] p-3 md:p-6 cursor-pointer transition-all duration-500 hover:shadow-[0_30px_60px_-18px_rgba(7,11,24,0.9)] aspect-[2/3] md:aspect-auto"
    >
      {item.backdrop_path || item.poster_path ? (
        <Image
          src={`https://image.tmdb.org/t/p/w780${
            item.backdrop_path || item.poster_path
          }`}
          alt={item.title || item.name || ""}
          fill
          className="object-cover opacity-40 group-hover:opacity-55 transition-opacity duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-700/20 to-purple-700/10" />
      )}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/70" />

      <div className="relative z-10 flex flex-col gap-2 md:gap-6 md:h-full justify-between min-h-0 overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 md:gap-2 rounded-full bg-white/10 px-2 py-0.5 md:px-3 md:py-1 text-[9px] md:text-[11px] uppercase tracking-[0.2em] md:tracking-[0.32em] text-slate-200">
            <Icon className="w-3 h-3 md:w-4 md:h-4" />
            {isMovie ? "Movie" : "TV"}
          </span>
          {(item.vote_average ?? 0) > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/10 px-1.5 py-0.5 md:px-2.5 md:py-1 text-[10px] md:text-xs font-semibold text-amber-300">
              <StarIcon />
              {(item.vote_average ?? 0).toFixed(1)}
            </span>
          )}
        </div>

        <div className="flex-1 overflow-hidden">
          <h3 className="text-sm md:text-2xl font-semibold text-white leading-tight line-clamp-1">
            {item.title || item.name}
          </h3>
          <p className="mt-1 md:mt-3 text-xs md:text-sm text-slate-300/80 leading-relaxed line-clamp-2 md:line-clamp-3">
            {cardOverview}
          </p>
        </div>

        <div className="flex items-center justify-between text-[10px] md:text-xs text-slate-300">
          <div className="flex items-center gap-1 md:gap-2">
            <span className="text-slate-400">Premiere</span>
            <div className="flex items-center gap-1 text-slate-200">
              <CalendarIcon />
              <span>{formatDate(releaseDate)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 md:gap-2 uppercase tracking-[0.2em] md:tracking-[0.3em] text-pink-300">
            <PlayIcon />
            <span>Watch</span>
          </div>
        </div>
      </div>
    </div>
  );
}
