import Link from "next/link";
import { Wifi, Info, Server, Users, Link as LinkIcon } from "lucide-react";
import { MoviePlayerProp } from "@/src/props/movie/moviePlayer";
import { ProviderProp } from "@/src/props/global/provider";

const PARTY_AVATARS = [
  { label: "S", color: "#F97316" },
  { label: "N", color: "#6366F1" },
  { label: "B", color: "#22C55E" },
];

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

const CreatePartyCard = ({ movie }: { movie: MoviePlayerProp | null }) => {
  const partyHref = movie?.tmdbId
    ? `/party/movie?movie=${movie.tmdbId}`
    : "/party/movie";

  return (
    <div className="apple-glass rounded-[32px] p-4 flex-shrink-0 relative overflow-hidden">
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-white leading-tight">
            Create a party
          </h2>
          <p className="text-xs text-white/50 leading-relaxed mt-1">
            Start a synced room for {movie?.title || "this movie"} and invite
            your circle.
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center">
          {PARTY_AVATARS.map((avatar, index) => (
            <div
              key={avatar.label}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold ring-2 ring-white/80"
              style={{
                backgroundColor: avatar.color,
                marginLeft: index === 0 ? 0 : -9,
                zIndex: PARTY_AVATARS.length - index,
              }}
            >
              {avatar.label}
            </div>
          ))}
          <div className="w-8 h-8 -ml-[9px] rounded-full bg-white/10 flex items-center justify-center text-white/80 text-[13px] font-bold ring-2 ring-white/20">
            +
          </div>
        </div>

        <Link
          href={partyHref}
          className="bg-[#E8470A] text-white rounded-full px-4 py-2 text-sm font-semibold cursor-pointer transition-all hover:scale-[1.03] hover:bg-[#ff571e] shadow-[0_0_20px_rgba(232,71,10,0.4)] flex items-center gap-2 whitespace-nowrap"
        >
          <LinkIcon size={15} />
          Create
        </Link>
      </div>
    </div>
  );
};

interface MoviePlayerSidebarProps {
  movie: MoviePlayerProp | null;
  servers: ProviderProp[];
  activeServerIndex: number;
  onServerChange: (index: number) => void;
}

export function MoviePlayerSidebar({
  movie,
  servers,
  activeServerIndex,
  onServerChange,
}: MoviePlayerSidebarProps) {
  return (
    <div className="w-full lg:w-[24rem] flex flex-col gap-4 h-auto lg:h-full lg:min-h-0 flex-shrink-0">
      {/* 1. Info Header Card */}
      <div className="apple-glass rounded-3xl p-5 shadow-xl flex-shrink-0">
        <h1
          className="text-2xl font-bold text-white leading-tight mb-3"
          style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
        >
          {movie?.title}
        </h1>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {movie?.genres?.map((genre: string) => (
            <span
              key={genre}
              className="px-2 py-1 rounded text-[10px] font-bold bg-white/5 text-gray-400 border border-white/5 uppercase tracking-wide whitespace-nowrap"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>

      {/* 2. Create Party */}
      <CreatePartyCard movie={movie} />

      {/* 3. Server Selector (Flexible Height) */}
      <div className="apple-glass border border-white/5 rounded-3xl p-5 shadow-xl overflow-hidden flex flex-col min-h-[200px] lg:flex-1 lg:min-h-0">
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

      {/* 4. Synopsis */}
      <div className="apple-glass rounded-3xl p-5 shadow-xl flex-shrink-0 max-h-none lg:max-h-[800px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
        <div className="flex items-center gap-2 mb-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
          <Info size={14} />
          <span>Synopsis</span>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed">
          {movie?.overview || "No details available."}
        </p>
      </div>
    </div>
  );
}
