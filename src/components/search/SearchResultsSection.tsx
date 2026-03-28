import type { SearchProp } from "@/src/props/search/search";
import { SearchResultCard } from "./SearchResultCard";
import { SearchCardSkeleton } from "@/src/components/skeletons/SearchCardSkeleton";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

interface SearchResultsSectionProps {
  results: SearchProp[];
  lastQuery: string;
  searchQuery: string;
  hasMore: boolean;
  isLoadingMore: boolean;
  onCardClick: (item: SearchProp) => void;
  onLoadMore: () => void;
}

const FONT_STYLE = { fontFamily: "Be Vietnam Pro, sans-serif" };

const cardVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: {
    opacity: 0,
    transition: { duration: 0.25 },
  },
};

const layoutTransition = { duration: 0.3 };

const SKELETON_COUNT = 10;

export function SearchResultsSection({
  results,
  lastQuery,
  searchQuery,
  hasMore,
  isLoadingMore,
  onCardClick,
  onLoadMore,
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
                layoutId={`search-card-${item.tmdbId}-${item.media_type}`}
                key={`${item.tmdbId}-${item.media_type}`}
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={layoutTransition}
              >
                <SearchResultCard
                  item={item}
                  onClick={() => onCardClick(item)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoadingMore &&
            Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <SearchCardSkeleton key={`skeleton-${i}`} />
            ))}
        </motion.div>
      </LayoutGroup>

      {hasMore && !isLoadingMore && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={onLoadMore}
            className="px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
            style={FONT_STYLE}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
