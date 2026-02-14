import { TMDBSearchResult } from "@/src/dto/tmdb/lists";
import { SearchResultCard } from "./SearchResultCard";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

interface SearchResultsSectionProps {
  results: TMDBSearchResult[];
  lastQuery: string;
  searchQuery: string;
  onCardClick: (item: TMDBSearchResult) => void;
  formatDate: (date: string | null | undefined) => string;
}

const FONT_STYLE = { fontFamily: "Be Vietnam Pro, sans-serif" };

// Card variants with fade only (no scale)
const cardVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.25, // Faster disappear animation
    },
  },
};

// Layout transition config with smooth motion
const layoutTransition = {
  duration: 0.3,
};

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
        <h2 className="text-3xl md:text-4xl font-bold mb-2" style={FONT_STYLE}>
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

      <LayoutGroup>
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6"
        >
          <AnimatePresence mode="sync">
            {results.map((item) => (
              <motion.div
                layout
                layoutId={`search-card-${item.id}`}
                key={item.id}
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={layoutTransition}
              >
                <SearchResultCard
                  item={item}
                  onClick={() => onCardClick(item)}
                  formatDate={formatDate}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>
    </div>
  );
}
