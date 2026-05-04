import { useState } from "react";
import Image from "next/image";
import {
  Search,
  Filter,
  ArrowUpDown,
  Play,
  LayoutGrid,
  List,
} from "lucide-react";
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
  path
    ? `https://image.tmdb.org/t/p/w${w}${path}`
    : "/images/placeholder-poster.png";

export function EpisodeBrowser({
  validSeasons,
  episodes,
  selectedSeason,
  selectedEpisode,
  onSeasonChange,
  onEpisodeChange,
}: EpisodeBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredEpisodes = episodes.filter(
    (ep) =>
      ep.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.episode_number.toString().includes(searchQuery),
  );

  const currentSeasonBlock = validSeasons.find(
    (s) => s.season_number === selectedSeason,
  );

  return (
    <div className="flex flex-1 gap-6 md:flex-row flex-col w-full mx-auto px-4 md:px-8 lg:px-12 mb-8 font-sans">
      {/* Sidebar */}
      <aside className="apple-glass w-full md:w-64 flex flex-col gap-6 p-4 rounded-[24px] flex-shrink-0">
        <nav className="flex flex-col gap-4 overflow-y-auto max-h-[60vh] scrollbar-thin scrollbar-thumb-white/10">
          {validSeasons.map((season) => {
            const isActive = selectedSeason === season.season_number;
            return (
              <button
                key={season.season_number}
                onClick={() => onSeasonChange(season.season_number)}
                className={`flex items-center bg-white/[0.06] justify-between px-4 py-3 rounded-full text-sm font-medium border ${isActive ? "border-[#ffffff80]" : "border-none hover:bg-white/[0.08]"}`}
              >
                <span>{season.name}</span>
                <span className="text-white/40 text-xs">
                  {season.episode_count} Episodes
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 rounded-[2rem] pt-4 pb-6 px-6 flex flex-col gap-8 apple-glass">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-white tracking-tight">
              {currentSeasonBlock?.name || `Season ${selectedSeason}`}
            </h1>
            <p className="text-white/40 mt-1 text-sm">
              {currentSeasonBlock?.overview
                ? currentSeasonBlock.overview
                : "Select an episode to start watching."}
            </p>
          </div>
          <div className="flex gap-3">
            <div
              className="flex items-center rounded-full bg-white/[0.04] p-1 h-10"
              style={{
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${
                  viewMode === "grid"
                    ? "bg-white/10 text-white"
                    : "text-white/40 hover:text-white"
                }`}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${
                  viewMode === "list"
                    ? "bg-white/10 text-white"
                    : "text-white/40 hover:text-white"
                }`}
              >
                <List size={16} />
              </button>
            </div>
            <div
              className="flex w-64 items-stretch rounded-full overflow-hidden h-10"
              style={{
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <div className="text-white/50 flex items-center justify-center pl-4 pr-2">
                <Search size={16} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search episode..."
                className="w-full bg-transparent border-none text-white focus:ring-0 placeholder:text-white/40 px-2 text-sm outline-none"
              />
            </div>
          </div>
        </div>

        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
              : "flex flex-col gap-4"
          }
        >
          {filteredEpisodes.map((ep) => {
            const isActive = selectedEpisode === ep.episode_number;
            return (
              <div
                key={ep.episode_number}
                onClick={() => {
                  onEpisodeChange(ep.episode_number);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`bg-white/[0.06] border ${isActive ? "border-[#ffffff80]" : "border-none hover:bg-white/[0.08]"} rounded-[1rem] overflow-hidden group cursor-pointer transition-colors relative ${viewMode === "grid" ? "flex flex-col" : "flex flex-row"}`}
              >
                <div
                  className={`relative bg-cover bg-center ${viewMode === "grid" ? "aspect-video w-full" : "aspect-video w-40 md:w-64 shrink-0"}`}
                  style={{
                    backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%), url('${getImageUrl(ep.still_path, 500)}')`,
                  }}
                >
                  <div
                    className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                  >
                    <div
                      className={`size-12 rounded-full flex items-center justify-center ${isActive ? "bg-[#ff571e]/80 shadow-[0_0_20px_rgba(232,71,10,0.5)]" : "bg-white/[0.06] border border-white/[0.14]"}`}
                    >
                      <Play
                        fill="currentColor"
                        className="text-white"
                        size={24}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className={`flex flex-col gap-1 ${viewMode === "grid" ? "p-2 pb-4" : "p-4 justify-center"}`}
                >
                  <h4 className="text-white font-semibold line-clamp-1">
                    {ep.name}
                  </h4>
                  <p className="text-white/40 text-[12px]">
                    {ep.air_date
                      ? new Date(ep.air_date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Unknown"}{" "}
                    • EP {ep.episode_number}
                  </p>
                  <p className="text-white/60 text-sm mt-2 line-clamp-2">
                    {ep.overview || "No overview available."}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
