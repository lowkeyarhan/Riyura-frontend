import { Wifi, Info, Server } from "lucide-react";
import { TvPlayerProp } from "@/src/props/tv/tvPlayer";
import { ProviderProp } from "@/src/props/global/provider";

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
          : "bg-[#29292930] border-white/5 hover:bg-[#1a1d29] hover:border-white/10"
      }
    `}
  >
    <div className="flex items-center gap-3">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
          isActive ? "text-orange-600" : " text-gray-500 group-hover:text-white"
        }`}
      >
        <Wifi size={14} />
      </div>
      <span
        className={`text-sm font-bold ${
          isActive ? "text-white" : "text-gray-300 group-hover:text-white"
        }`}
      >
        {name}
      </span>
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

interface TVShowPlayerSidebarProps {
  tvShow: TvPlayerProp | null;
  servers: ProviderProp[];
  activeServerIndex: number;
  onServerChange: (index: number) => void;
}

export function TVShowPlayerSidebar({
  tvShow,
  servers,
  activeServerIndex,
  onServerChange,
}: TVShowPlayerSidebarProps) {
  return (
    <div className="lg:col-span-3 flex flex-col gap-4 h-auto lg:h-full lg:min-h-0 flex-shrink-0">
      {/* Info Card */}
      <div className="bg-[#1518215f] border border-white/5 rounded-3xl p-5 shadow-xl flex-shrink-0">
        <h1
          className="text-xl md:text-2xl font-bold text-white leading-tight mb-3"
          style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
        >
          {tvShow?.title}
        </h1>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {tvShow?.genres?.map((genre: string) => (
            <span
              key={genre}
              className="px-2 py-1 rounded text-[10px] font-bold bg-white/5 text-gray-400 border border-white/5 uppercase tracking-wide whitespace-nowrap"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>

      {/* Server Selector (Scrollable) */}
      <div className="bg-[#1518215f] border border-white/5 rounded-3xl p-5 shadow-xl overflow-hidden flex flex-col min-h-[200px] lg:flex-1 lg:min-h-0">
        <div className="flex items-center gap-2 mb-4 text-gray-400 text-xs font-bold uppercase tracking-widest">
          <Server size={14} />
          <span>Source</span>
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

      {/* Synopsis */}
      <div className="bg-[#1518215f] border border-white/5 rounded-3xl p-5 shadow-xl flex-shrink-0 max-h-none lg:max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
        <div className="flex items-center gap-2 mb-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
          <Info size={14} />
          <span>Synopsis</span>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed">
          {tvShow?.overview || "No details available."}
        </p>
      </div>
    </div>
  );
}
