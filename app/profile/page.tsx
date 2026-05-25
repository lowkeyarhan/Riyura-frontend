"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import Footer from "@/src/components/layout/Footer";
import { useAuth } from "@/src/hooks/useAuth";
import { useProfileData } from "@/src/hooks/profile/useProfileData";
import { ApiKeyProvider, useApiKey } from "@/src/lib/contexts/ApiKeyContext";
import { useRecommendations } from "@/src/hooks/profile/useRecommendations";
import { useWatchHistory } from "@/src/hooks/profile/useWatchHistory";
import { supabase } from "@/src/lib/auth/supabase";
import { useNotification } from "@/src/lib/contexts/NotificationContext";
import ProfileSkeleton from "@/src/components/skeletons/ProfileSkeleton";
import { MediaType } from "@/src/props/global/mediaType";
import type { ContinueWatchingItem } from "@/src/props/profile/continueWatching";
import type { RecommendationProp } from "@/src/props/profile/recommendation";
import type { MediaCardProp } from "@/src/props/global/mediaCard";

import { ProfileHeader } from "@/src/components/profile/ProfileHeader";
import { SettingsSection } from "@/src/components/profile/SettingsSection";
import { ContinueWatchingSection } from "@/src/components/profile/ContinueWatchingSection";
import { WatchlistSection } from "@/src/components/profile/WatchlistSection";
import { RecommendationsSection } from "@/src/components/profile/RecommendationsSection";
import { StatBadge } from "@/src/components/profile/StatBadge";
import { extractColors } from "@/src/lib/utils/color";

export default function ProfilePage() {
  return (
    <ApiKeyProvider>
      <ProfilePageContent />
    </ApiKeyProvider>
  );
}

function ProfilePageContent() {
  const { user, loading, fullName, avatarUrl } = useAuth();
  const router = useRouter();
  const { addNotification } = useNotification();
  const [isSignOutLoading, setIsSignOutLoading] = useState(false);
  const [gradientColors, setGradientColors] = useState<string[]>([]);

  useEffect(() => {
    if (avatarUrl) {
      extractColors(avatarUrl).then(setGradientColors);
    }
  }, [avatarUrl]);

  // Custom hooks for data management
  const {
    continueWatching,
    watchlist,
    stats,
    isLoadingHistory,
    isLoadingWatchlist,
    setContinueWatching,
  } = useProfileData(user?.id);

  const apiKey = useApiKey();

  const {
    recommendations,
    isLoading: isLoadingRecommendations,
    error: recommendationsError,
    refresh: refreshRecommendations,
  } = useRecommendations(user?.id, apiKey.hasApiKey);

  const { deleteHistoryItem } = useWatchHistory();

  // Auth Guard
  useEffect(() => {
    if (!loading && !user) router.replace("/auth");
  }, [loading, user, router]);

  // Handlers
  const handleSignOut = async () => {
    setIsSignOutLoading(true);
    await supabase.auth.signOut();
    router.push("/landing");
  };

  const handlePlayClick = useCallback(
    (item: ContinueWatchingItem) => {
      if (item.mediaType === MediaType.Movie) {
        const url = `/watch/movie/${item.tmdbId}${
          item.streamId ? `?stream=${item.streamId}` : ""
        }`;
        router.push(url);
      } else {
        const params = new URLSearchParams();
        if (item.streamId) params.set("stream", item.streamId);
        if (item.seasonNumber)
          params.set("season", item.seasonNumber.toString());
        if (item.episodeNumber)
          params.set("episode", item.episodeNumber.toString());
        router.push(
          `/watch/tvshow/${item.tmdbId}${
            params.toString() ? `?${params.toString()}` : ""
          }`,
        );
      }
    },
    [router],
  );

  const handleDeleteHistory = async (e: React.MouseEvent, itemId: number) => {
    e.stopPropagation();

    const item = continueWatching.find((i) => i.id === itemId);
    if (!item) return;

    // Optimistic update
    setContinueWatching((prev) => prev.filter((i) => i.id !== itemId));

    const success = await deleteHistoryItem(item.tmdbId, item.mediaType);
    if (success) {
      addNotification("Removed from watch history", "success");
    } else {
      addNotification("Failed to remove item", "error");
    }
  };

  const handleWatchlistItemClick = (item: MediaCardProp) => {
    router.push(
      item.media_type === MediaType.Movie
        ? `/details/movie/${item.tmdbId}`
        : `/details/tvshow/${item.tmdbId}`,
    );
  };

  const handleRecommendationClick = (item: RecommendationProp) => {
    router.push(
      item.mediaType === MediaType.Movie
        ? `/details/movie/${item.tmdbId}`
        : `/details/tvshow/${item.tmdbId}`,
    );
  };

  const handleApiKeySave = async (key: string) => {
    await apiKey.saveApiKey(key);
    refreshRecommendations();
  };

  if (loading || !user) return <ProfileSkeleton />;

  return (
    <div className="relative min-h-screen text-white font-sans overflow-x-hidden antialiased">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-black">
        {gradientColors.length > 0 ? (
          <div
            className="absolute inset-0 opacity-50"
            style={{
              background: `radial-gradient(circle at 0% 0%,${gradientColors[0]} 0%,transparent 50%),radial-gradient(circle at 100% 0%,${gradientColors[1]} 0%,transparent 50%),radial-gradient(circle at 0% 100%,${gradientColors[2]} 0%,transparent 50%),radial-gradient(circle at 100% 100%,${gradientColors[3]} 0%,transparent 50%)`,
              filter: "blur(80px)",
              transform: "scale(1.2)",
            }}
          />
        ) : null}
      </div>
      {/* --- MAIN CONTENT --- */}
      <div className="relative z-10 w-full h-full pt-20 px-4 md:pt-32 pb-8 md:px-16 lg:px-16">
        <div className="flex flex-col lg:flex-row gap-8 items-start h-full">
          {/* --- LEFT COLUMN: Identity & Navigation --- */}
          <div className="w-full lg:w-[24rem] flex flex-col justify-between lg:sticky lg:top-32 flex-shrink-0">
            <ProfileHeader
              fullName={fullName || "User"}
              email={user.email || ""}
              avatarUrl={avatarUrl}
            />

            {/* Control Center Grid: Stats & Sign Out */}
            <div className="grid grid-cols-2 gap-3 mt-4 md:mt-6">
              {stats.map((stat) => (
                <StatBadge key={stat.label} stat={stat} />
              ))}

              <button
                onClick={handleSignOut}
                disabled={isSignOutLoading}
                className="flex apple-glass rounded-full items-center justify-start p-2 gap-3 transition-all hover:bg-red-500/10 border border-transparent hover:border-red-500/30"
              >
                <div className="w-[50px] h-[50px] rounded-full flex flex-shrink-0 items-center justify-center bg-red-500/20">
                  {isSignOutLoading ? (
                    <span className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <LogOut size={24} className="text-red-500" />
                  )}
                </div>
                <div className="flex flex-col text-left justify-center flex-1 min-w-0 pr-2">
                  <span className="text-[15px] md:text-[17px] text-red-500 font-bold leading-tight tracking-wide truncate">
                    Sign Out
                  </span>
                </div>
              </button>
            </div>

            {/* Preferences - Desktop Only (Moved to bottom on mobile) */}
            <div className="hidden lg:block">
              <SettingsSection
                apiKey={{
                  ...apiKey,
                  saveApiKey: handleApiKeySave,
                }}
              />
            </div>
          </div>

          {/* --- RIGHT COLUMN: Content Feed --- */}
          <div className="flex-1 min-w-0 space-y-8 md:space-y-12 lg:overflow-y-auto lg:max-h-[calc(100vh-8rem)] scrollbar-hide w-full">
            <div className="hidden md:flex flex-col items-start gap-1">
              <h1
                className="text-2xl md:text-5xl font-bold text-white tracking-tight"
                style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
              >
                Dashboard
              </h1>
              <p className="text-sm md:text-base text-gray-400">
                Welcome back to your collection.
              </p>
            </div>

            {/* Continue Watching */}
            <ContinueWatchingSection
              items={continueWatching}
              isLoading={isLoadingHistory}
              onPlay={handlePlayClick}
              onDelete={handleDeleteHistory}
            />

            {/* Watchlist */}
            <WatchlistSection
              items={watchlist}
              isLoading={isLoadingWatchlist}
              onItemClick={handleWatchlistItemClick}
              onViewAll={() => router.push("/watchlist")}
            />

            {/* Recommended */}
            <RecommendationsSection
              recommendations={recommendations}
              isLoading={isLoadingRecommendations}
              error={recommendationsError}
              hasApiKey={apiKey.hasApiKey}
              onRefresh={refreshRecommendations}
              onItemClick={handleRecommendationClick}
            />

            {/* --- MOBILE ONLY SECTIONS (Preferences & Sign Out) --- */}
            <div className="lg:hidden space-y-8">
              <SettingsSection
                apiKey={{
                  ...apiKey,
                  saveApiKey: handleApiKeySave,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <div className="lg:hidden relative z-10">
        <Footer />
      </div>
    </div>
  );
}
