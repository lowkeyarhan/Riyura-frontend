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
  const { items, loading, error, removeItem } = useWatchlist(user?.id);

  const [filter, setFilter] = useState<"all" | "movie" | "tv">("all");

  // Debug logging
  useEffect(() => {
    console.log("[WatchlistPage] State:", {
      user: user?.id,
      authLoading,
      loading,
      error,
      itemsCount: items?.length,
      items: items,
    });
  }, [user, authLoading, loading, error, items]);

  // Show error notification
  useEffect(() => {
    if (error) {
      console.error("[WatchlistPage] Error:", error);
      addNotification(`Error loading watchlist: ${error}`, "error");
    }
  }, [error, addNotification]);

  // Filter Logic - ensure items is always an array
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

  // Show error state if there's an error
  if (error && (!items || items.length === 0)) {
    return (
      <div className="relative min-h-screen bg-black font-sans">
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-black" />
          <div className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-[#155f75b5] blur-[130px] opacity-40" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-[#9a341299] blur-[130px] opacity-30 mix-blend-screen" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,#000000_100%)]" />
        </div>
        <div className="relative z-10 px-4 md:px-16 lg:px-16 pt-24 md:pt-32 pb-12">
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/30">
              <svg
                className="w-12 h-12 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Error Loading Watchlist
            </h2>
            <p className="text-gray-400 text-lg max-w-md px-4 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
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
          hasItems={Array.isArray(items) && items.length > 0}
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
