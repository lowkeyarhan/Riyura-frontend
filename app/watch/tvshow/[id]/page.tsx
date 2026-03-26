"use client";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
import { useTVShowPlayer } from "@/src/hooks/player/useTVShowPlayer";
import PlayerSkeleton from "@/src/components/skeletons/PlayerSkeleton";
import { PlayerLayout } from "@/src/components/player/PlayerLayout";
import { TVShowPlayerSidebar } from "@/src/components/player/TVShowPlayerSidebar";
import { EpisodeBrowser } from "@/src/components/player/EpisodeBrowser";

export default function TVShowPlayer() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const tvShowId = params.id as string;

  const streamParam = searchParams.get("stream");
  const seasonParam = searchParams.get("season");
  const episodeParam = searchParams.get("episode");

  const initialSeason = seasonParam ? parseInt(seasonParam) : 1;
  const initialEpisode = episodeParam ? parseInt(episodeParam) : 1;

  const {
    tvShow,
    servers,
    episodes,
    loading,
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

  // Set initial server based on stream parameter
  useEffect(() => {
    if (streamParam && servers.length > 0) {
      const serverIndex = servers.findIndex((s) => s.id === streamParam);
      if (serverIndex !== -1) {
        setActiveServerIndex(serverIndex);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streamParam, servers.length, setActiveServerIndex]);

  // Save watch history on unmount
  useEffect(() => {
    const handleBeforeUnload = () => saveWatchHistoryOnUnmount();
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      saveWatchHistoryOnUnmount();
    };
  }, [saveWatchHistoryOnUnmount]);

  if (loading) return <PlayerSkeleton />;

  if (servers.length === 0) {
    return (
      <PlayerLayout>
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
          <p className="text-xl text-white/90 mb-2">
            Unable to play any content
          </p>
          <p className="text-white/60 text-sm text-center max-w-md">
            No stream sources are available for this episode.
          </p>
        </div>
      </PlayerLayout>
    );
  }

  return (
    <PlayerLayout>
      {/* --- SECTION 1: THEATER (Full Viewport) --- */}
      <div className="min-h-screen flex flex-col pt-24 pb-6 px-4 md:px-8 lg:px-12 max-w-[1920px] mx-auto">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-full">
          {/* Left: Player (9 cols) */}
          <div className="lg:col-span-9 flex flex-col h-auto lg:h-full border border-white/5 rounded-3xl aspect-video lg:aspect-auto">
            <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl group">
              <iframe
                src={servers[activeServerIndex].url}
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
