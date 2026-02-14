const FONT_FAMILY = "Be Vietnam Pro, sans-serif";

interface WatchlistHeaderProps {
  filter: "all" | "movie" | "tv";
  onFilterChange: (filter: "all" | "movie" | "tv") => void;
  sortBy: "recent" | "title" | "year";
  onSortChange: (sort: "recent" | "title" | "year") => void;
  totalItems: number;
  movieCount: number;
  tvCount: number;
}

export function WatchlistHeader({
  filter,
  onFilterChange,
  sortBy,
  onSortChange,
  totalItems,
  movieCount,
  tvCount,
}: WatchlistHeaderProps) {
  return (
    <>
      {/* Title */}
      <div className="mb-8 md:mb-12">
        <h1
          className="text-4xl md:text-5xl font-bold text-white mb-2"
          style={{ fontFamily: FONT_FAMILY }}
        >
          My Library{" "}
          {/* <span className="text-gray-500 font-normal text-2xl md:text-3xl">
            ({totalItems} Items)
          </span> */}
        </h1>
        <p
          className="text-gray-400 text-base md:text-lg max-w-2xl"
          style={{ fontFamily: FONT_FAMILY }}
        >
          Track what you want to watch and keep up with your favorites.
        </p>
      </div>

      {/* Tabs and Sort */}
      <div className="flex flex-row md:items-center justify-between gap-4 mb-8 border-b border-white/10">
        {/* Filter Tabs */}
        <div className="flex gap-4 md:gap-8 overflow-x-auto pb-px scrollbar-hide">
          <button
            onClick={() => onFilterChange("all")}
            className={`md:pb-2.5 text-sm md:text-lg font-medium transition-all relative whitespace-nowrap ${filter === "all"
              ? "text-white"
              : "text-gray-400 hover:text-gray-300"
              }`}
          >
            All
            {filter === "all" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
            )}
          </button>
          <button
            onClick={() => onFilterChange("movie")}
            className={`md:pb-2.5 text-sm md:text-lg font-medium transition-all relative whitespace-nowrap ${filter === "movie"
              ? "text-white"
              : "text-gray-400 hover:text-gray-300"
              }`}
          >
            Movies ({movieCount})
            {filter === "movie" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
            )}
          </button>
          <button
            onClick={() => onFilterChange("tv")}
            className={`md:pb-2.5 text-sm md:text-lg font-medium transition-all relative ${filter === "tv"
              ? "text-white"
              : "text-gray-400 hover:text-gray-300"
              }`}
          >
            TV Shows ({tvCount})
            {filter === "tv" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
            )}
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 md:pb-2.5">
          <span className="text-gray-400 text-sm hidden md:block">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) =>
              onSortChange(e.target.value as "recent" | "title" | "year")
            }
            className="bg-transparent text-white text-sm md:border md:border-white/20 rounded px-3 py-1.5 focus:outline-none focus:border-white/40 cursor-pointer"
          >
            <option value="recent" className="bg-[#151821]">
              Recent
            </option>
            <option value="title" className="bg-[#151821]">
              Title
            </option>
            <option value="year" className="bg-[#151821]">
              Year
            </option>
          </select>
        </div>
      </div>
    </>
  );
}
