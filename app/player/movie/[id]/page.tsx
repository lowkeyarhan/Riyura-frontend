"use client";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
import { useMoviePlayer } from "@/src/hooks/useMoviePlayer";
import PlayerSkeleton from "@/src/components/skeletons/PlayerSkeleton";
import { PlayerLayout } from "@/src/components/player/PlayerLayout";
import { MoviePlayerSidebar } from "@/src/components/player/MoviePlayerSidebar";

// --- Stream Links ---
const generateStreamLinks = (tmdbId: string) => [
  {
    id: "ironlinkmovie",
    name: "IronLink",
    quality: "1080p • Fast",
    link: `${process.env.NEXT_PUBLIC_VIDLINK_BASE_URL}/movie/${tmdbId}`,
  },
  {
    id: "syntherionmovie",
    name: "Syntherion",
    quality: "1080p • Subs",
    link: `${process.env.NEXT_PUBLIC_VIDSRC_BASE_URL}/movie/${tmdbId}`,
  },
  {
    id: "dormannumovie",
    name: "Dormannu",
    quality: "4K • Ads",
    link: `${process.env.NEXT_PUBLIC_VIDEASY_BASE_URL}/movie/${tmdbId}`,
  },
  {
    id: "nanovuemovie",
    name: "Nanovue",
    quality: "1080p • Backup",
    link: `${process.env.NEXT_PUBLIC_YTHD_BASE_URL}/movie/${tmdbId}`,
  },
];

export default function MoviePlayer() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const movieId = params.id as string;

  const {
    movie,
    loading,
    activeServerIndex,
    setActiveServerIndex,
    saveWatchHistoryOnUnmount,
  } = useMoviePlayer({
    movieId,
    userId: user?.id,
  });

  const servers = generateStreamLinks(movieId);

  // Set initial server based on stream parameter
  useEffect(() => {
    const streamParam = searchParams.get("stream");
    if (streamParam) {
      const serverIndex = servers.findIndex((s) => s.id === streamParam);
      if (serverIndex !== -1) {
        setActiveServerIndex(serverIndex);
      }
    }
  }, [searchParams]); // Only run when searchParams changes

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
