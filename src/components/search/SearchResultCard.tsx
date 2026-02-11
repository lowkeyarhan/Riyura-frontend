import Image from "next/image";
import { TMDBSearchResult } from "@/src/dto/tmdb/lists";
import { MovieIcon, TVIcon, StarIcon, CalendarIcon } from "./SearchIcons";

interface SearchResultCardProps {
  item: TMDBSearchResult;
  onClick: () => void;
  formatDate: (date: string | null | undefined) => string;
}

const FONT_STYLE = { fontFamily: "Be Vietnam Pro, sans-serif" };

export function SearchResultCard({
  item,
  onClick,
  formatDate,
}: SearchResultCardProps) {
  return (
    <div
      className="group flex flex-col bg-white/5 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-102 hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-[2/3]">
        {item.poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
            alt={item.title || item.name || ""}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">
            No Poster
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 right-3 z-10 bg-black/70 backdrop-blur-sm rounded p-1.5">
          {item.media_type === "movie" ? <MovieIcon /> : <TVIcon />}
        </div>
      </div>

      <div className="p-2 md:p-4 flex flex-col gap-2 md:gap-3">
        <h3
          className="text-white text-sm md:text-lg font-semibold line-clamp-1"
          style={FONT_STYLE}
        >
          {item.title || item.name}
        </h3>

        <div className="flex items-center justify-between text-sm">
          <div
            className="flex items-center gap-1.5 text-gray-400"
            style={FONT_STYLE}
          >
            <CalendarIcon />
            <span>{formatDate(item.release_date || item.first_air_date)}</span>
          </div>
          {(item.vote_average ?? 0) > 0 && (
            <div className="flex items-center gap-1 text-yellow-400">
              <StarIcon />
              <span className="font-semibold" style={FONT_STYLE}>
                {(item.vote_average ?? 0).toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {item.overview && (
          <p
            className="text-gray-400 text-xs md:text-sm line-clamp-2 leading-relaxed"
            style={FONT_STYLE}
          >
            {item.overview}
          </p>
        )}
      </div>
    </div>
  );
}
