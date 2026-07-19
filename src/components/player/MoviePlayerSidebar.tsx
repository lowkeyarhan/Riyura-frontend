"use client";

import { Wifi, Info } from "lucide-react";
import type { MoviePlayerProp } from "@/src/props/movie/moviePlayer";
import type { ProviderProp } from "@/src/props/global/provider";
import { CreatePartyCard } from "@/src/components/party/CreatePartyCard";

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
    className={`transition-all rounded-full flex items-center justify-start p-2 gap-2.5 w-full border ${isActive
        ? "bg-[#ff571e]/10 border-[#ff571e]/30 shadow-[0_0_15px_rgba(255,87,30,0.15)]"
        : "border-white/5 shadow-inner"
      }`}
    style={{
      border: "1px solid rgba(255, 255, 255, 0.05)",
      boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(40px)",
      WebkitBackdropFilter: "blur(40px)",
      backgroundColor: isActive
        ? "rgba(255, 87, 30, 0.1)"
        : "rgba(255, 255, 255, 0.03)",
    }}
  >
    <div
      className={`w-12 h-12 rounded-full flex flex-shrink-0 items-center justify-center transition-colors shadow-inner ${isActive
          ? "bg-[#ff571e] text-white shadow-[0_0_10px_rgba(255,87,30,0.5)]"
          : "bg-white/10 group-hover:bg-white/20 text-white"
        }`}
    >
      <Wifi size={22} strokeWidth={2.5} />
    </div>
    <div className="flex flex-col text-left justify-center flex-1 min-w-0 pr-1">
      <span className="text-[13px] text-white font-bold leading-tight tracking-wide truncate block">
        {name}
      </span>
      <span
        className={`text-[11px] font-medium leading-tight mt-0.5 tracking-wide block uppercase ${isActive ? "text-[#ff571e]" : "text-white/50"
          }`}
      >
        {quality}
      </span>
    </div>
  </button>
);


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
      <div className="apple-glass rounded-3xl p-4 shadow-xl flex-shrink-0">
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
      <CreatePartyCard
        title={movie?.title || "this movie"}
        contextLabel=""
        partyHref={
          movie?.tmdbId
            ? `/party/movie?movie=${movie.tmdbId}${servers[activeServerIndex]?.id ? `&stream=${encodeURIComponent(servers[activeServerIndex].id)}` : ""}`
            : "/party/movie"
        }
      />

      {/* 3. Server Selector (Flexible Height) */}
      {/* <div className="overflow-hidden flex flex-col min-h-[200px] lg:flex-1 lg:min-h-0"> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto bg-transparent">
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
      {/* </div> */}

      {/* 4. Synopsis */}
      <div className="apple-glass rounded-3xl p-4 shadow-xl overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
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
