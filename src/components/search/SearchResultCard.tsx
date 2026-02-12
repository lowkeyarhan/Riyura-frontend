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
  const getMediaTypeLabel = () => {
    if (item.media_type === "movie") return "Movie";
    if (item.media_type === "tv") return "TV";
    return "Media";
  };

  const getYear = () => {
    const date = item.release_date || item.first_air_date;
    if (!date) return "";
    return new Date(date).getFullYear().toString();
  };

  const getRating = () => {
    const rating = item.vote_average ?? 0;
    return rating > 0 ? `${rating.toFixed(1)}` : "";
  };

  const getLanguage = () => {
    if (!item.original_language) return "";
    return item.original_language.toUpperCase();
  };

  const metadataItems = [
    getMediaTypeLabel(),
    getYear(),
    getLanguage(),
    getRating(),
  ]
    .filter(Boolean)
    .join(" • ");

  return (
    <div
      className="group flex flex-col h-full rounded-2xl overflow-hidden
        border border-white/5 
        transition-colors duration-300 
        shadow-md hover:shadow-2xl hover:shadow-black/40 hover:border-white/40 cursor-pointer"
      onClick={onClick}
    >
      {/* Poster Image Section */}
      <div className="relative aspect-[2/3] overflow-hidden bg-[#2429342c]">
        {item.poster_path ? (
          <>
            <Image
              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
              alt={item.title || item.name || ""}
              fill
              className="object-cover transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0f1115] via-[#0f1115]/60 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full  flex items-center justify-center text-gray-500">
            No Poster
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="flex-1 flex flex-col gap-2 p-4 md:p-5 bg-[#0f1115]">
        {/* Title */}
        <h3
          className="text-white text-lg md:text-xl font-bold line-clamp-2"
          style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
        >
          {item.title || item.name}
        </h3>

        {/* Metadata */}
        <p
          className="text-gray-400 text-xs md:text-sm font-semibold tracking-wide"
          style={FONT_STYLE}
        >
          {metadataItems}
        </p>

        {/* Overview - Always present to maintain consistent height */}
        <p
          className="text-gray-400 text-sm leading-relaxed line-clamp-3 flex-1 min-h-[4rem]"
          style={FONT_STYLE}
        >
          {item.overview || ""}
        </p>
      </div>
    </div>
  );
}
