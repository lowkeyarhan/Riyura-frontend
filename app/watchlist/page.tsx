"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LayoutGrid } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";
import { getWatchlist, removeFromWatchlist } from "@/src/lib/db/database";
import { useNotification } from "@/src/lib/contexts/NotificationContext";
import MediaCard from "@/src/components/media/MediaCard";
import WatchlistSkeleton from "@/src/components/skeletons/WatchlistSkeleton";
import { WatchlistPageItem } from "@/src/dto/ui/profile";

// --- Constants ---
const FONT_FAMILY = "Be Vietnam Pro, sans-serif";

const TABS = [
  { id: "all", label: "All" },
  { id: "movie", label: "Movies" },
  { id: "tv", label: "TV Shows" },
];

// --- Helper Components ---
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

// --- Main Component ---
export default function WatchlistPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { addNotification } = useNotification();

  const [items, setItems] = useState<WatchlistPageItem[]>([]);
  const [filter, setFilter] = useState<"all" | "movie" | "tv">("all");
  const [loading, setLoading] = useState(true);

  // Fetch Data
  useEffect(() => {
    const fetchWatchlist = async () => {
      if (authLoading) return;
      if (!user) {
        setLoading(false);
        return;
      }

      const cacheKey = `watchlist_${user.id}`;
      const cached = sessionStorage.getItem(cacheKey);

      if (cached) {
        try {
          setItems(JSON.parse(cached));
          setLoading(false);
          return;
        } catch {
          sessionStorage.removeItem(cacheKey);
        }
      }

      try {
        const watchlistData = await getWatchlist(user.id);
        const formatted: WatchlistPageItem[] = watchlistData.map((item) => ({
          id: item.tmdb_id,
          dbId: item.id,
          type: item.media_type,
          title: item.title,
          poster: item.poster_path
            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
            : "/placeholder.jpg",
          year: item.release_date
            ? new Date(item.release_date).getFullYear()
            : undefined,
          rating: item.vote || undefined,
          seasons: item.number_of_seasons || undefined,
          episodes: item.number_of_episodes || undefined,
        }));

        sessionStorage.setItem(cacheKey, JSON.stringify(formatted));
        setItems(formatted);
      } catch (err) {
        console.error("Error loading watchlist:", err);
        addNotification("Failed to load watchlist", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [user, authLoading, addNotification]);

  // Filter Logic
  const visible = useMemo(() => {
    if (!Array.isArray(items)) {
      return [];
    }
    return filter === "all" ? items : items.filter((i) => i.type === filter);
  }, [items, filter]);

  // Remove Logic
  const removeItem = async (
    e: React.MouseEvent,
    id: number,
    type: "movie" | "tv",
  ) => {
    e.stopPropagation(); // Prevent card click
    if (!user) return;

    // Optimistic update
    const previousItems = [...items];
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    sessionStorage.setItem(`watchlist_${user.id}`, JSON.stringify(updated));

    try {
      await removeFromWatchlist(user.id, id, type);
      addNotification("Removed from watchlist", "success");
    } catch (err) {
      // Revert on fail
      setItems(previousItems);
      addNotification("Failed to remove item", "error");
      console.error("Error removing:", err);
    }
  };

  // Auth Redirect
  useEffect(() => {
    if (!authLoading && !loading && !user) {
      router.push("/auth");
    }
  }, [user, authLoading, loading, router]);

  // --- Render ---
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
            A personalized collection of movies and shows you want to
            experience.
          </p>
        </div>

        {/* Controls */}
        {!loading && items.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {TABS.map((tab) => (
              <FilterButton
                key={tab.id}
                active={filter === tab.id}
                onClick={() => setFilter(tab.id as "all" | "movie" | "tv")}
              >
                {tab.label}
              </FilterButton>
            ))}
          </div>
        )}

        {/* Content Grid */}
        {loading ? (
          // Skeletons inside Results Container
          <div className="bg-[#3c3c3c17] border border-white/5 rounded-3xl p-4 md:p-8 shadow-lg">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-[#0f111562] border border-white/5 aspect-[2/3] relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-20 animate-pulse" />
                  <div className="absolute bottom-4 left-4 right-4 space-y-2">
                    <div className="h-4 bg-white/10 rounded w-3/4" />
                    <div className="h-3 bg-white/5 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : visible.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-32 text-center border border-white/5 rounded-3xl bg-[#3c3c3c17] shadow-lg">
            <div className="w-24 h-24 bg-[#0f111564] rounded-full flex items-center justify-center mb-6 border border-white/5 shadow-inner">
              <LayoutGrid className="w-10 h-10 text-gray-500" />
            </div>
            <h2
              className="text-2xl md:text-3xl font-bold text-white mb-3"
              style={{ fontFamily: FONT_FAMILY }}
            >
              {items.length === 0
                ? "Your watchlist is empty"
                : `No ${filter === "movie" ? "movies" : "TV shows"} found`}
            </h2>
            <p className="text-gray-400 text-lg max-w-md px-4">
              {items.length === 0
                ? "Go explore trending titles and bookmark the ones that catch your eye."
                : `You haven't added any ${
                    filter === "movie" ? "movies" : "TV shows"
                  } to your list yet.`}
            </p>
          </div>
        ) : (
          // Results Container with "Fake Glass" Style
          <div className="bg-[#1518215f] border border-white/5 rounded-3xl p-4 md:p-8 shadow-lg">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
              {visible.map((item) => (
                <MediaCard
                  key={item.id}
                  title={item.title}
                  posterUrl={item.poster}
                  year={item.year}
                  rating={item.rating}
                  type={item.type}
                  seasons={item.seasons}
                  episodes={item.episodes}
                  onRemove={(e: React.MouseEvent) =>
                    removeItem(e, item.id, item.type)
                  }
                  onClick={() => {
                    router.push(
                      `/details/${item.type === "movie" ? "movie" : "tvshow"}/${
                        item.id
                      }`,
                    );
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
