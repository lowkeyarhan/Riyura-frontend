import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RecommendationCard from "@/src/components/media/RecommendationCard";
import { MediaCardSkeleton } from "@/src/components/skeletons/MediaCardSkeleton";
import type { RecommendationProp } from "@/src/props/profile/recommendation";
import { normalizeTmdbImageUrl } from "@/src/lib/tmdb-images";

interface RecommendationsSectionProps {
  recommendations: RecommendationProp[];
  isLoading: boolean;
  error: string | null;
  hasApiKey: boolean;
  onRefresh: () => void;
  onItemClick: (item: RecommendationProp) => void;
}

export function RecommendationsSection({
  recommendations,
  isLoading,
  error,
  hasApiKey,
  onRefresh,
  onItemClick,
}: RecommendationsSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4 md:mb-5">
        <h3
          className="text-xl md:text-2xl font-bold text-white flex items-center gap-3"
          style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
        >
          Recommended for You
        </h3>
        <div className="flex items-center gap-3">
          {hasApiKey && !isLoading && (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh recommendations"
            >
              <svg
                className={`w-4 h-4 text-gray-400 hover:text-white transition-transform ${isRefreshing ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          )}
          {recommendations.length > 4 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-xs md:text-sm font-bold text-gray-400 hover:text-white transition-colors"
            >
              {showAll ? "Show Less" : "Show More"}
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <MediaCardSkeleton key={`loading-${i}`} />
          ))}
        </div>
      ) : error || !hasApiKey ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="group relative aspect-[2/3] bg-[#1518215f] border border-white/5 rounded-xl overflow-hidden shadow-md"
            >
              <div className="absolute inset-0 flex items-center justify-center text-gray-700 text-xs font-bold tracking-widest">
                {error ? "ERROR" : "NO API KEY"}
              </div>
              <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-[#0f1115]/90 border border-white/10 shadow-sm">
                <span className="text-[10px] font-bold text-white">AI</span>
              </div>
              <div className="absolute bottom-0 inset-x-0 p-3">
                <div className="w-3/4 h-3 bg-white/10 rounded mb-2 animate-pulse" />
                <div className="w-1/2 h-2 bg-white/5 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : recommendations.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p>
            No recommendations yet. Watch some content to get personalized
            suggestions!
          </p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5"
        >
          <AnimatePresence mode="popLayout">
            {(showAll
              ? recommendations.slice(0, 8)
              : recommendations.slice(0, 4)
            ).map((item, index) => (
              <motion.div
                key={`${item.tmdbId}-${index}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <RecommendationCard
                  title={item.title}
                  posterUrl={
                    normalizeTmdbImageUrl(item.posterPath, "w500") || null
                  }
                  year={item.year}
                  type={item.mediaType}
                  reason={item.reason}
                  onClick={() => onItemClick(item)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
