import {
  Calendar,
  Star,
  Clock,
  Wifi,
  DollarSign,
  Info,
  Server,
} from "lucide-react";
import { TMDBMovieDetailsResponse } from "@/src/dto/tmdb/details";

const MetaTag = ({ icon: Icon, text }: { icon: any; text: string }) => (
  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0f1115] border border-white/5 text-xs font-medium text-gray-300">
    <Icon size={12} className="text-gray-500" />
    {text}
  </div>
);

const ServerRow = ({
  name,
  quality,
  isActive,
  onClick,
}: {
  name: string;
  quality: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`
      flex items-center justify-between w-full p-3 rounded-xl border cursor-pointer transition-all duration-200 group
      ${
        isActive
          ? "bg-gradient-to-r from-orange-600/10 to-red-600/10 border-orange-500/50"
          : "bg-[#29292930] border-white/5 hover:bg-[#29292950] hover:border-white/10"
      }
    `}
  >
    <div className="flex items-center gap-3">
      <div
        className={`
        w-8 h-8 rounded-lg flex items-center justify-center transition-colors
        ${
          isActive
            ? "bg-orange-600 text-white"
            : "bg-[#29292930] text-gray-500 group-hover:text-white"
        }
      `}
      >
        <Wifi size={14} />
      </div>
      <div className="text-left">
        <h4
          className={`text-sm font-bold ${
            isActive ? "text-white" : "text-gray-300 group-hover:text-white"
          }`}
        >
          {name}
        </h4>
      </div>
    </div>
    <span
      className={`text-[10px] font-bold uppercase tracking-wider ${
        isActive ? "text-orange-500" : "text-gray-600"
      }`}
    >
      {quality}
    </span>
  </button>
);

interface MoviePlayerSidebarProps {
  movie: TMDBMovieDetailsResponse | null;
  servers: Array<{ id: string; name: string; quality: string; link: string }>;
  activeServerIndex: number;
  onServerChange: (index: number) => void;
}

const formatRuntime = (m: number) => `${Math.floor(m / 60)}h ${m % 60}m`;
const formatMoney = (a: number) =>
  a ? `$${(a / 1000000).toFixed(1)}M` : "N/A";

export function MoviePlayerSidebar({
  movie,
  servers,
  activeServerIndex,
  onServerChange,
}: MoviePlayerSidebarProps) {
  return (
    <div className="w-full lg:w-[24rem] flex flex-col gap-4 h-auto lg:h-full lg:min-h-0">
      {/* 1. Info Header Card */}
      <div className="bg-[#1518215f] border border-white/5 rounded-3xl p-5 shadow-xl flex-shrink-0">
        <h1
          className="text-2xl font-bold text-white leading-tight mb-3"
          style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
        >
          {movie?.title}
        </h1>

        <div className="flex flex-wrap gap-2 mb-4">
          <MetaTag
            icon={Calendar}
            text={movie?.release_date?.split("-")[0] || "N/A"}
          />
          <MetaTag icon={Clock} text={formatRuntime(movie?.runtime || 0)} />
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-yellow-500/10 border border-yellow-500/20 text-xs font-bold text-yellow-500">
            <Star size={12} fill="currentColor" />
            {movie?.vote_average?.toFixed(1)}
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {movie?.genres?.slice(0, 3).map((g: any) => (
            <span
              key={g.id}
              className="px-2 py-1 rounded text-[10px] font-bold bg-white/5 text-gray-400 border border-white/5 uppercase tracking-wide"
            >
              {g.name}
            </span>
          ))}
        </div>
      </div>

      {/* 2. Server Selector (Flexible Height) */}
      <div className="bg-[#1518215f] border border-white/5 rounded-3xl p-5 shadow-xl overflow-hidden flex flex-col min-h-[200px] lg:flex-1 lg:min-h-0">
        <div className="flex items-center gap-2 mb-4 text-gray-400 text-xs font-bold uppercase tracking-widest">
          <Server size={14} />
          <span>Select Source</span>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 pr-2 space-y-2">
          {servers.map((server, index) => (
            <ServerRow
              key={server.id}
              name={server.name}
              quality={server.quality}
              isActive={index === activeServerIndex}
              onClick={() => onServerChange(index)}
            />
          ))}
        </div>
      </div>

      {/* 3. Synopsis */}
      <div className="bg-[#1518215f] border border-white/5 rounded-3xl p-5 shadow-xl flex-shrink-0 max-h-none lg:max-h-[800px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
        <div className="flex items-center gap-2 mb-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
          <Info size={14} />
          <span>Synopsis</span>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed">
          {movie?.overview || "No details available."}
        </p>

        <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs">
          <div className="text-gray-500">
            <span className="block font-bold text-gray-400">Budget</span>
            {formatMoney(movie?.budget ?? 0)}
          </div>
          <div className="text-right text-gray-500">
            <span className="block font-bold text-gray-400">Revenue</span>
            {formatMoney(movie?.revenue ?? 0)}
          </div>
        </div>
      </div>
    </div>
  );
}
