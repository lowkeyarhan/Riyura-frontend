import Image from "next/image";
import { Play, Star } from "lucide-react";

interface MediaCardProps {
  item?: any;
  onClick?: () => void;
  variant?: "watchlist" | "recommendation";
}

export function MediaCard({
  item,
  onClick,
  variant = "watchlist",
}: MediaCardProps) {
  // Skeleton/placeholder card
  if (!item) {
    return (
      <div className="group relative aspect-[2/3] bg-[#1518215f] border border-white/5 rounded-xl hover:border-white/10 hover:bg-[#15182170] overflow-hidden cursor-pointer shadow-md transition-all duration-300">
        <div className="absolute inset-0">
          <div className="absolute inset-0 flex items-center justify-center text-gray-700 text-xs font-bold tracking-widest">
            POSTER
          </div>
          <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#0f1115]/90 border border-white/10 shadow-sm">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-[10px] font-bold text-white">8.5</span>
          </div>
          <div className="absolute bottom-0 inset-x-0 p-3">
            <div className="w-3/4 h-3 bg-white/10 rounded mb-2" />
            <div className="w-1/2 h-2 bg-white/5 rounded" />
          </div>
        </div>
        <div className="absolute inset-0 bg-[#0f1115]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-4 h-4 fill-black ml-0.5" />
          </div>
        </div>
      </div>
    );
  }

  const posterUrl = item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : null;
  const year = item.release_date
    ? new Date(item.release_date).getFullYear()
    : null;

  return (
    <div
      className="group relative aspect-[2/3] bg-[#1518215f] border border-white/5 rounded-xl hover:border-white/10 hover:bg-[#15182170] overflow-hidden cursor-pointer shadow-md transition-all duration-300"
      onClick={onClick}
    >
      {posterUrl ? (
        <Image
          src={posterUrl}
          alt={item.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-gray-700 text-xs font-bold tracking-widest">
          NO IMAGE
        </div>
      )}
      <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
        <h4 className="text-sm font-bold text-white line-clamp-2 mb-1">
          {item.title}
        </h4>
        <div className="flex items-center gap-2 text-xs text-gray-300">
          {year && <span>{year}</span>}
          {item.media_type === "tv" && item.number_of_seasons && (
            <span>{item.number_of_seasons} seasons</span>
          )}
        </div>
      </div>
      <div className="absolute inset-0 bg-[#0f1115]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
          <Play className="w-4 h-4 fill-black ml-0.5" />
        </div>
      </div>
    </div>
  );
}
