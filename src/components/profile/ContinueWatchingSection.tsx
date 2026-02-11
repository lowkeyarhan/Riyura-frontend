import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock } from "lucide-react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ContinueWatchingListSkeleton } from "@/src/components/skeletons/ContinueWatchingSkeleton";
import { ContinueWatchingCard } from "./ContinueWatchingCard";

interface ContinueWatchingSectionProps {
  items: any[];
  isLoading: boolean;
  onPlay: (item: any) => void;
  onDelete: (e: React.MouseEvent, itemId: number) => void;
}

export function ContinueWatchingSection({
  items,
  isLoading,
  onPlay,
  onDelete,
}: ContinueWatchingSectionProps) {
  const [showAll, setShowAll] = useState(false);

  return (
    <section>
      <div className="flex items-center justify-between mb-4 md:mb-5">
        <h3
          className="text-lg md:text-xl font-bold text-white flex items-center gap-3"
          style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
        >
          Continue Watching
        </h3>
        {!isLoading && items.length > 2 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs md:text-sm font-bold text-gray-400 hover:text-white transition-colors"
          >
            {showAll ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
      <motion.div layout className="flex flex-col">
        {isLoading ? (
          <SkeletonTheme baseColor="#1a1d26" highlightColor="#2a2d36">
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <ContinueWatchingListSkeleton key={i} />
              ))}
            </div>
          </SkeletonTheme>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>
              No watch history yet. Start watching to see your progress here!
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {(showAll ? items : items.slice(0, 2)).map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{
                  opacity: index < 2 ? 1 : 0,
                  y: index < 2 ? 0 : -20,
                  scale: index < 2 ? 1 : 0.95,
                  zIndex: index < 2 ? 10 : 0,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  zIndex: 10,
                  marginBottom: 16,
                  transition: {
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                    delay: index > 1 ? (index - 2) * 0.08 : 0,
                  },
                }}
                exit={{
                  opacity: 0,
                  y: -20,
                  scale: 0.95,
                  height: 0,
                  marginBottom: 0,
                  zIndex: 0,
                  transition: {
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  },
                }}
                transition={{
                  layout: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                }}
              >
                <ContinueWatchingCard
                  item={item}
                  onClick={() => onPlay(item)}
                  onDelete={(e) => onDelete(e, item.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </motion.div>
    </section>
  );
}
