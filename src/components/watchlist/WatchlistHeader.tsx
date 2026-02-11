const FONT_FAMILY = "Be Vietnam Pro, sans-serif";

const TABS = [
  { id: "all", label: "All" },
  { id: "movie", label: "Movies" },
  { id: "tv", label: "TV Shows" },
];

const FilterButton = ({ active, onClick, children }: any) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 md:px-6 md:py-2.5 rounded-full text-xs md:text-base font-bold uppercase tracking-wider transition-all duration-300 ${
      active
        ? "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] scale-105"
        : "bg-[#151821] text-gray-400 border border-white/10 hover:border-white/20 hover:text-white hover:bg-white/5"
    }`}
    style={{ fontFamily: "Montserrat, sans-serif" }}
  >
    {children}
  </button>
);

interface WatchlistHeaderProps {
  filter: "all" | "movie" | "tv";
  onFilterChange: (filter: "all" | "movie" | "tv") => void;
  hasItems: boolean;
}

export function WatchlistHeader({
  filter,
  onFilterChange,
  hasItems,
}: WatchlistHeaderProps) {
  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col items-center mb-8 md:mb-12 text-center">
        <h1
          className="text-3xl md:text-6xl font-bold text-white mb-4 tracking-tight drop-shadow-2xl"
          style={{ fontFamily: FONT_FAMILY }}
        >
          Your Watchlist
        </h1>
        <p
          className="text-gray-400 text-sm md:text-lg max-w-xl"
          style={{ fontFamily: FONT_FAMILY }}
        >
          A personalized collection of movies and shows you want to experience.
        </p>
      </div>

      {/* Controls */}
      {hasItems && (
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {TABS.map((tab) => (
            <FilterButton
              key={tab.id}
              active={filter === tab.id}
              onClick={() => onFilterChange(tab.id as "all" | "movie" | "tv")}
            >
              {tab.label}
            </FilterButton>
          ))}
        </div>
      )}
    </>
  );
}
