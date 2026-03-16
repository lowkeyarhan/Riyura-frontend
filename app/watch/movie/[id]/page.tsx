"use client";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
import { useMoviePlayer } from "@/src/hooks/useMoviePlayer";
import { useStreamUrls } from "@/src/hooks/useStreamUrls";
import PlayerSkeleton from "@/src/components/skeletons/PlayerSkeleton";
import { PlayerLayout } from "@/src/components/player/PlayerLayout";
import { MoviePlayerSidebar } from "@/src/components/player/MoviePlayerSidebar";

export default function MoviePlayer() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const movieId = params.id as string;

  const {
    movie,
    loading: movieLoading,
    activeServerIndex,
    setActiveServerIndex,
    saveWatchHistoryOnUnmount,
  } = useMoviePlayer({
    movieId,
    userId: user?.id,
  });

  const { generateMovieLinks, loading: streamsLoading } =
    useStreamUrls("movie");
  const servers = generateMovieLinks(movieId);
  const loading = movieLoading || streamsLoading;

  // Set initial server based on stream parameter (only on mount or when stream param changes)
  const streamParam = searchParams.get("stream");
  useEffect(() => {
    if (streamParam && servers.length > 0) {
      const serverIndex = servers.findIndex((s) => s.id === streamParam);
      if (serverIndex !== -1) {
        setActiveServerIndex(serverIndex);
      }
    }
  }, [streamParam, servers.length, setActiveServerIndex]); // Stable deps: run when stream param or server count changes, NOT every render

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

  if (servers.length === 0) {
    return (
      <PlayerLayout>
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
          <p className="text-xl text-white/90 mb-2">
            Unable to play any content
          </p>
          <p className="text-white/60 text-sm text-center max-w-md">
            No stream sources are configured. Please add stream URLs for movies
            in the admin settings.
          </p>
        </div>
      </PlayerLayout>
    );
  }

  return (
    <PlayerLayout>
      <div className="min-h-screen relative z-10 flex flex-col lg:flex-row pt-24 lg:pt-20 pb-4 px-4 gap-4">
        {/* --- LEFT: CINEMA PLAYER --- */}
        <div className="flex-1 flex flex-col rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 relative group aspect-video lg:aspect-auto">
          {/* The Player */}
          <iframe
            src={servers[activeServerIndex].link}
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
