"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
import { useMoviePlayer } from "@/src/hooks/player/useMoviePlayer";
import { useWatchProgress } from "@/src/hooks/player/useWatchProgress";
import PlayerSkeleton from "@/src/components/skeletons/PlayerSkeleton";
import { PlayerLayout } from "@/src/components/player/PlayerLayout";
import { MoviePlayerSidebar } from "@/src/components/player/MoviePlayerSidebar";
import { normalizeTmdbImageUrl } from "@/src/lib/tmdb-images";
import { extractColors } from "@/src/lib/utils/color";

export default function MoviePlayer() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const movieId = params.id as string;

  // URL params
  const streamParam = searchParams.get("stream");
  const initialProgressSec =
    parseFloat(searchParams.get("progress") ?? "0") || 0;

  const {
    movie,
    servers,
    loading,
    activeServerIndex,
    setActiveServerIndex,
    saveWatchHistoryOnUnmount,
  } = useMoviePlayer({
    movieId,
    userId: user?.id,
  });

  const activeServer = servers[activeServerIndex];
  const isNanovue =
    activeServer?.name?.toLowerCase().includes("nanovue") ?? false;

  const [gradientColors, setGradientColors] = useState<string[]>([]);

  const bgImageSrc = movie?.backdrop_path
    ? normalizeTmdbImageUrl(movie.backdrop_path, "w500")
    : "/watch_party_page_temp_bg.jpg";

  useEffect(() => {
    extractColors(bgImageSrc).then((colors) => setGradientColors(colors));
  }, [bgImageSrc]);

  // Keep URL in sync with current stream + progress
  const syncUrl = useCallback(
    (progressSec: number) => {
      const sp = new URLSearchParams(searchParams.toString());
      if (activeServer?.id) sp.set("stream", activeServer.id);
      sp.set("progress", Math.floor(progressSec).toString());
      router.replace(`?${sp.toString()}`, { scroll: false });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeServer?.id, router],
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
  }, [streamParam, servers.length, setActiveServerIndex]);

  // Post history to endpoint on page close / unmount
  useEffect(() => {
    const handleBeforeUnload = () => {
      const progress = getLatestProgress();
      console.log(
        `📤 Posting movie history on close — ${Math.floor(progress)}s`,
      );
      saveWatchHistoryOnUnmount(progress);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      const progress = getLatestProgress();
      console.log(
        `📤 Posting movie history on unmount — ${Math.floor(progress)}s`,
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
            No stream sources are available for this movie.
          </p>
        </div>
      </PlayerLayout>
    );
  }

  return (
    <PlayerLayout>
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
              movie?.backdrop_path
                ? normalizeTmdbImageUrl(movie.backdrop_path, "w500")
                : "/watch_party_page_temp_bg.jpg"
            }
            alt="Movie Backdrop"
            fill
            className="object-cover absolute inset-0 opacity-20"
            priority
          />
        )}
      </div>
      <div className="min-h-screen relative z-10 flex flex-col lg:flex-row pt-24 lg:pt-20 pb-4 px-4 gap-4 overflow-hidden">
        {/* --- LEFT: CINEMA PLAYER --- */}
        <div className="flex-1 flex flex-col rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 relative group aspect-video lg:aspect-auto">
          <iframe
            src={servers[activeServerIndex].url}
            className="w-full h-full object-cover"
            frameBorder="0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>

        {/* --- RIGHT: COMMAND CENTER (Fixed Width sidebar) --- */}
        <MoviePlayerSidebar
          movie={movie}
          servers={servers}
          activeServerIndex={activeServerIndex}
          onServerChange={setActiveServerIndex}
        />
      </div>
    </PlayerLayout>
  );
}
