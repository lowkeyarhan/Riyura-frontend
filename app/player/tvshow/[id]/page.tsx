"use client";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
import { useTVShowPlayer } from "@/src/hooks/useTVShowPlayer";
import { useStreamUrls } from "@/src/hooks/useStreamUrls";
import PlayerSkeleton from "@/src/components/skeletons/PlayerSkeleton";
import { PlayerLayout } from "@/src/components/player/PlayerLayout";
import { TVShowPlayerSidebar } from "@/src/components/player/TVShowPlayerSidebar";
import { EpisodeBrowser } from "@/src/components/player/EpisodeBrowser";

export default function TVShowPlayer() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const tvShowId = params.id as string;

  // Parse query parameters
  const streamParam = searchParams.get("stream");
  const seasonParam = searchParams.get("season");
  const episodeParam = searchParams.get("episode");

  const initialSeason = seasonParam ? parseInt(seasonParam) : 1;
  const initialEpisode = episodeParam ? parseInt(episodeParam) : 1;

  const {
    tvShow,
    episodes,
    loading: tvShowLoading,
    selectedSeason,
    selectedEpisode,
    activeServerIndex,
    validSeasons,
    setSelectedSeason,
    setSelectedEpisode,
    setActiveServerIndex,
    saveWatchHistoryOnUnmount,
  } = useTVShowPlayer({
    tvShowId,
    userId: user?.id,
    initialSeason,
    initialEpisode,
  });

  const { generateTVLinks, loading: streamsLoading } = useStreamUrls("tv");
  const servers = generateTVLinks(tvShowId, selectedSeason, selectedEpisode);
  const loading = tvShowLoading || streamsLoading;

  // Set initial server based on stream parameter
  useEffect(() => {
    if (streamParam && servers.length > 0) {
      const serverIndex = servers.findIndex((s) => s.id === streamParam);
      if (serverIndex !== -1) {
        setActiveServerIndex(serverIndex);
      }
    }
  }, [streamParam, servers]); // Only run when streamParam changes

  // Save watch history on unmount
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveWatchHistoryOnUnmount(servers);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      saveWatchHistoryOnUnmount(servers);
    };
  }, [saveWatchHistoryOnUnmount, servers]);

  if (loading) return <PlayerSkeleton />;

  return (
    <PlayerLayout>
      {/* --- SECTION 1: THEATER (Full Viewport) --- */}
      <div className="min-h-screen flex flex-col pt-24 pb-6 px-4 md:px-8 lg:px-12 max-w-[1920px] mx-auto">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-full">
          {/* Left: Player (9 cols) */}
          <div className="lg:col-span-9 flex flex-col h-auto lg:h-full border border-white/5 rounded-3xl aspect-video lg:aspect-auto">
            <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl group">
              <iframe
                src={servers[activeServerIndex].link}
                className="w-full h-full object-contain border border-white/5"
                frameBorder="0"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </div>

          {/* Right: Sidebar (3 cols) */}
          <TVShowPlayerSidebar
            tvShow={tvShow}
            servers={servers}
            activeServerIndex={activeServerIndex}
            onServerChange={setActiveServerIndex}
          />
        </div>
      </div>

      {/* --- SECTION 2: EPISODE BROWSER (Below Fold) --- */}
      <EpisodeBrowser
        validSeasons={validSeasons}
        episodes={episodes}
        selectedSeason={selectedSeason}
        selectedEpisode={selectedEpisode}
        onSeasonChange={setSelectedSeason}
        onEpisodeChange={setSelectedEpisode}
      />
    </PlayerLayout>
  );
}
