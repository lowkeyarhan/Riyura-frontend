import Image from "next/image";
import { CalendarIcon, PlayIcon } from "./SearchIcons";
import type { MediaCardProp } from "@/src/props/global/mediaCard";

interface TrendingCardProps {
  item: MediaCardProp;
  onClick: () => void;
  formatDate: (date: string | null | undefined) => string;
}

const getImageUrl = (posterPath: string) =>
  posterPath.startsWith("http") ? posterPath : `https://image.tmdb.org/t/p/w780${posterPath}`;

export function TrendingCard({ item, onClick, formatDate }: TrendingCardProps) {
  const isMovie = item.media_type === "Movie";
  const cardOverview = isMovie
    ? "Experience the cinematic moment everyone is talking about."
    : "Binge the series that is dominating conversations right now.";

  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#161a39] via-[#10172c] to-[#070b18] p-3 md:p-6 cursor-pointer transition-all duration-500 hover:shadow-[0_30px_60px_-18px_rgba(7,11,24,0.9)] aspect-[16/9] md:aspect-auto"
    >
      {item.poster_path ? (
        <Image
          src={getImageUrl(item.poster_path)}
          alt={item.title}
          fill
          className="object-cover opacity-40 group-hover:opacity-55 transition-opacity duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-700/20 to-purple-700/10" />
      )}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/70" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Empty space between on mobile */}
        <div className="flex-1" />
        {/* Title at top */}
        <div>
          <h3 className=" text-xl md:text-2xl font-semibold text-white mb-4 leading-tight line-clamp-2 md:line-clamp-1">
            {item.title}
          </h3>
        </div>

        {/* Overview and metadata at bottom */}
        <div className="space-y-3 md:space-y-4">
          <p className="text-sm md:text-sm text-slate-300/80 leading-relaxed line-clamp-2 md:line-clamp-3">
            {cardOverview}
          </p>

          <div className="flex items-center justify-between text-xs md:text-xs text-slate-300">
            <div className="flex items-center gap-1 md:gap-2">
              <div className="flex items-center gap-1 text-slate-200">
                <CalendarIcon />
                <span>{item.year}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 md:gap-2 uppercase tracking-[0.2em] md:tracking-[0.3em] text-pink-300">
              <PlayIcon />
              <span>Watch</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
