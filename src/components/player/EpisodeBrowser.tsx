import { useState } from "react";
import Image from "next/image";
import { Search, LayoutGrid, List, PlayCircle } from "lucide-react";
import { TvPlayerEpisode, TvPlayerSeason } from "@/src/props/tv/tvPlayer";

interface EpisodeBrowserProps {
  validSeasons: TvPlayerSeason[];
  episodes: TvPlayerEpisode[];
  selectedSeason: number;
  selectedEpisode: number;
  onSeasonChange: (seasonNumber: number) => void;
  onEpisodeChange: (episodeNumber: number) => void;
}

const getImageUrl = (path: string | null, w: number) =>
  path ? `https://image.tmdb.org/t/p/w${w}${path}` : "/placeholder.jpg";

export function EpisodeBrowser({
  validSeasons,
  episodes,
  selectedSeason,
  selectedEpisode,
  onSeasonChange,
  onEpisodeChange,
}: EpisodeBrowserProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768 ? "list" : "grid";
    }
    return "grid";
  });
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEpisodes = episodes.filter(
    (ep) =>
      ep.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.episode_number.toString().includes(searchQuery),
  );

  const handleEpisodeClick = (episodeNumber: number) => {
    onEpisodeChange(episodeNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative z-10 px-4 md:px-8 lg:px-12 pb-16 max-w-[1920px] mx-auto">
      <div className="flex flex-col bg-[#1518215f] border border-white/5 rounded-3xl overflow-hidden shadow-xl h-auto min-h-[300px]">
        {/* Header */}
        <div className="p-4 md:p-6">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">
              Seasons and episodes
            </h3>
            <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-xs">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#29292930] border border-white/10 rounded-2xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/20"
                />
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/40" />
              </div>
            </div>
            <div className="flex rounded-lg p-0.5 border border-white/5">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition ${
                  viewMode === "grid"
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <LayoutGrid size={14} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition ${
                  viewMode === "list"
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <List size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-[240px_1fr] h-auto">
          {/* Sidebar: Seasons */}
          <div className="pt-2 px-4 md:px-6 pb-4 md:pb-6 h-auto md:h-full md:max-h-[800px] overflow-x-auto md:overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 border-b md:border-b-0 md:border-r border-white/5 mb-4 md:mb-0 flex-shrink-0">
            <div className="flex flex-row md:flex-col gap-3 md:gap-4 min-w-max md:min-w-0">
              {validSeasons.map((season: TvPlayerSeason) => {
                const isActive = selectedSeason === season.season_number;
                return (
                  <button
                    key={season.season_number}
                    onClick={() => onSeasonChange(season.season_number)}
                    className={`
                      w-40 md:w-full flex items-center gap-3 p-2 rounded-lg border border-white/5 transition-all group text-left relative overflow-hidden flex-shrink-0
                      ${
                        isActive
                          ? "bg-white/5 border border-orange-500/30"
                          : "hover:bg-white/5 border border-transparent"
                      }
                    `}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-orange-500 rounded-r-full" />
                    )}

                    <div className="relative w-8 h-11 flex-shrink-0 overflow-hidden rounded bg-black shadow-sm">
                      <Image
                        src={getImageUrl(season.poster_path, 200)}
                        alt={`S${season.season_number}`}
                        fill
                        className={`object-cover ${
                          isActive
                            ? "opacity-100"
                            : "opacity-70 group-hover:opacity-100"
                        }`}
                      />
                    </div>
                    <div>
                      <span
                        className={`text-xs font-bold block ${
                          isActive
                            ? "text-white"
                            : "text-gray-400 group-hover:text-white"
                        }`}
                      >
                        Season {season.season_number}
                      </span>
                      <span className="text-[10px] text-gray-600 font-medium">
                        {season.episode_count} Eps
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main: Episodes */}
          <div className="pt-2 px-4 md:px-6 pb-4 md:pb-6 h-auto md:border-l border-white/5">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
                {filteredEpisodes.map((ep) => {
                  const isSelected = selectedEpisode === ep.episode_number;
                  return (
                    <div
                      key={ep.episode_number}
                      onClick={() => handleEpisodeClick(ep.episode_number)}
                      className={`group relative rounded-lg overflow-hidden cursor-pointer border transition-all ${
                        isSelected
                          ? "border-orange-500/50 shadow-lg ring-1 ring-orange-500/20"
                          : "border-white/5 hover:border-white/20 hover:bg-[#1a1d29]"
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className="relative aspect-video bg-black">
                        <Image
                          src={getImageUrl(ep.still_path, 400)}
                          alt={`${ep.name}`}
                          fill
                          className="object-cover opacity-80 group-hover:opacity-100 transition duration-500"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition" />
                        {isSelected && (
                          <div className="absolute inset-0 bg-orange-500/20 flex items-center justify-center">
                            <PlayCircle className="text-white drop-shadow-lg w-10 h-10" />
                          </div>
                        )}
                        <span className="absolute top-1.5 left-1.5 bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded border border-white/10">
                          E{ep.episode_number}
                        </span>
                      </div>
                      {/* Info */}
                      <div className="p-2.5 bg-[#0f1115]">
                        <h4
                          className={`text-xs font-bold line-clamp-1 mb-1 ${
                            isSelected
                              ? "text-orange-400"
                              : "text-gray-200 group-hover:text-white"
                          }`}
                        >
                          {ep.name}
                        </h4>
                        <div className="text-[10px] text-gray-600 font-medium text-right">
                          {ep.air_date
                            ? new Date(ep.air_date).toLocaleDateString()
                            : ""}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {filteredEpisodes.map((ep) => {
                  const isSelected = selectedEpisode === ep.episode_number;
                  return (
                    <div
                      key={ep.episode_number}
                      onClick={() => handleEpisodeClick(ep.episode_number)}
                      className={`flex gap-3 p-2 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-white/5 border-orange-500/30"
                          : "hover:bg-white/5 border-white/5"
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className="relative w-28 h-16 rounded bg-black flex-shrink-0 overflow-hidden border border-white/5">
                        <Image
                          src={getImageUrl(ep.still_path, 300)}
                          alt={ep.name}
                          fill
                          className="object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <PlayCircle className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </div>
                      {/* Info */}
                      <div className="flex flex-col justify-center min-w-0 py-0.5">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-px rounded ${
                              isSelected
                                ? "bg-orange-500 text-black"
                                : "bg-white/10 text-gray-300"
                            }`}
                          >
                            E{ep.episode_number}
                          </span>
                          <span className="text-[10px] text-gray-500 font-medium">
                            {ep.air_date}
                          </span>
                        </div>
                        <span
                          className={`text-sm font-bold truncate ${
                            isSelected
                              ? "text-orange-400"
                              : "text-gray-200 group-hover:text-white"
                          }`}
                        >
                          {ep.name}
                        </span>
                        <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                          {ep.overview}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
