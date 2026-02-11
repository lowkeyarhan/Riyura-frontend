import { TMDBSearchResult } from "@/src/dto/tmdb/lists";
import { SearchResultCard } from "./SearchResultCard";

interface SearchResultsSectionProps {
  results: TMDBSearchResult[];
  lastQuery: string;
  searchQuery: string;
  onCardClick: (item: TMDBSearchResult) => void;
  formatDate: (date: string | null | undefined) => string;
}

const FONT_STYLE = { fontFamily: "Be Vietnam Pro, sans-serif" };

export function SearchResultsSection({
  results,
  lastQuery,
  searchQuery,
  onCardClick,
  formatDate,
}: SearchResultsSectionProps) {
  if (results.length === 0) return null;

  return (
    <div>
      <div className="mb-8 text-center">
        <h2
          className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 bg-clip-text text-transparent"
          style={FONT_STYLE}
        >
          Search Results
        </h2>
        {(lastQuery || searchQuery) && (
          <p className="text-gray-300 text-lg" style={FONT_STYLE}>
            Found{" "}
            <span className="text-white font-semibold">{results.length}</span>{" "}
            {results.length === 1 ? "result" : "results"} for "
            {lastQuery || searchQuery}"
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
        {results.map((item) => (
          <SearchResultCard
            key={item.id}
            item={item}
            onClick={() => onCardClick(item)}
            formatDate={formatDate}
          />
        ))}
      </div>
    </div>
  );
}
