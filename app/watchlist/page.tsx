"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
import { useWatchlist } from "@/src/hooks/useWatchlist";
import { useNotification } from "@/src/lib/contexts/NotificationContext";
import { WatchlistHeader } from "@/src/components/watchlist/WatchlistHeader";
import { WatchlistGrid } from "@/src/components/watchlist/WatchlistGrid";
import WatchlistSkeleton from "@/src/components/skeletons/WatchlistSkeleton";

export default function WatchlistPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { addNotification } = useNotification();
  const { items, loading, removeItem } = useWatchlist(user?.id);

  const [filter, setFilter] = useState<"all" | "movie" | "tv">("all");

  // Filter Logic
  const visibleItems = useMemo(() => {
    if (!Array.isArray(items)) return [];
    return filter === "all"
      ? items
      : items.filter((i) => i.media_type === filter);
  }, [items, filter]);

  // Remove Handler
  const handleRemove = async (
    e: React.MouseEvent,
    tmdbId: number,
    mediaType: "movie" | "tv",
  ) => {
    e.stopPropagation();
    const { success } = await removeItem(tmdbId, mediaType);
    if (success) {
      addNotification("Removed from watchlist", "success");
    } else {
      addNotification("Failed to remove item", "error");
    }
  };

  // Navigation Handler
  const handleItemClick = (tmdbId: number, mediaType: "movie" | "tv") => {
    router.push(
      `/details/${mediaType === "movie" ? "movie" : "tvshow"}/${tmdbId}`,
    );
  };

  // Auth Redirect
  useEffect(() => {
    if (!authLoading && !loading && !user) {
      // Could redirect to login if needed
    }
  }, [user, authLoading, loading, router]);

  if (loading) {
    return <WatchlistSkeleton />;
  }

  return (
    <div className="relative min-h-screen bg-black font-sans">
      {/* --- BACKGROUND LAYERS --- */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-[#155f75b5] blur-[130px] opacity-40" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-[#9a341299] blur-[130px] opacity-30 mix-blend-screen" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,#000000_100%)]" />
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="relative z-10 px-4 md:px-16 lg:px-16 pt-24 md:pt-32 pb-12">
        <WatchlistHeader
          filter={filter}
          onFilterChange={setFilter}
          hasItems={items.length > 0}
        />

        <WatchlistGrid
          items={visibleItems}
          loading={loading}
          filter={filter}
          onRemove={handleRemove}
          onItemClick={handleItemClick}
        />
      </div>
    </div>
  );
}
