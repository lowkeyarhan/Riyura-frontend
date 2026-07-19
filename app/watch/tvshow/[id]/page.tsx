"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
import { useTVShowPlayer } from "@/src/hooks/player/useTVShowPlayer";
import { useWatchProgress } from "@/src/hooks/player/useWatchProgress";
import PlayerSkeleton from "@/src/components/skeletons/PlayerSkeleton";
import { PlayerLayout } from "@/src/components/player/PlayerLayout";
import { TVShowPlayerSidebar } from "@/src/components/player/TVShowPlayerSidebar";
import { EpisodeBrowser } from "@/src/components/player/EpisodeBrowser";
import { normalizeTmdbImageUrl } from "@/src/lib/tmdb-images";
import { extractColors } from "@/src/lib/utils/color";



export default function TVShowPlayer() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const tvShowId = params.id as string;

  // URL params
  const streamParam = searchParams.get("stream");
  const seasonParam = searchParams.get("season");
  const episodeParam = searchParams.get("episode");
  const initialProgressSec =
    parseFloat(searchParams.get("progress") ?? "0") || 0;

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

  const activeServer = servers[activeServerIndex];
  const isNanovue =
    activeServer?.name?.toLowerCase().includes("nanovue") ?? false;

  const [gradientColors, setGradientColors] = useState<string[]>([]);

  useEffect(() => {
    const bgImageSrc = tvShow?.backdrop_path
      ? normalizeTmdbImageUrl(tvShow.backdrop_path, "w500")
      : "/watch_party_page_temp_bg.jpg";

    extractColors(bgImageSrc).then((colors) => setGradientColors(colors));
  }, [tvShow?.backdrop_path]);

  // Keep all URL params in sync: stream, season, episode, progress
  const syncUrl = useCallback(
    (progressSec: number) => {
      const sp = new URLSearchParams(searchParams.toString());
      if (activeServer?.id) sp.set("stream", activeServer.id);
      sp.set("season", selectedSeason.toString());
      sp.set("episode", selectedEpisode.toString());
      sp.set("progress", Math.floor(progressSec).toString());
      router.replace(`?${sp.toString()}`, { scroll: false });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeServer?.id, selectedSeason, selectedEpisode, router],
  );

  const { getLatestProgress } = useWatchProgress({
    serverName: activeServer?.name,
    isNanovue,
    initialProgressSec,
    onProgress: (durationSec) => {
      console.log(`💾 Syncing URL with progress: ${Math.floor(durationSec)}s`);
      syncUrl(durationSec);
    },
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

  // Post history to endpoint on page close / unmount
  useEffect(() => {
    const handleBeforeUnload = () => {
      const progress = getLatestProgress();
      console.log(`📤 Posting TV history on close — ${Math.floor(progress)}s`);
      saveWatchHistoryOnUnmount(progress);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      const progress = getLatestProgress();
      console.log(
        `📤 Posting TV history on unmount — ${Math.floor(progress)}s`,
      );
      saveWatchHistoryOnUnmount(progress);
    };
  }, [getLatestProgress, saveWatchHistoryOnUnmount]);

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
      {/* Dynamic Background Gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-black">
        {gradientColors.length > 0 ? (
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(circle at 0% 0%, ${gradientColors[0]} 0%, transparent 50%), radial-gradient(circle at 100% 0%, ${gradientColors[1]} 0%, transparent 50%), radial-gradient(circle at 0% 100%, ${gradientColors[2]} 0%, transparent 50%), radial-gradient(circle at 100% 100%, ${gradientColors[3]} 0%, transparent 50%)`,
              filter: "blur(80px)",
              transform: "scale(1.2)",
            }}
          />
        ) : (
          <Image
            src={
              tvShow?.backdrop_path
                ? normalizeTmdbImageUrl(tvShow.backdrop_path, "w500")
                : "/watch_party_page_temp_bg.jpg"
            }
            alt="TV Show Backdrop"
            fill
            className="object-cover absolute inset-0 opacity-20"
            priority
          />
        )}
      </div>

      {/* --- SECTION 1: THEATER (Full Viewport) --- */}
      <div className="min-h-screen flex flex-col pt-24 pb-6 px-4 md:px-8 lg:px-12 max-w-[1920px] mx-auto z-10 relative">
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
            selectedSeason={selectedSeason}
            selectedEpisode={selectedEpisode}
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
