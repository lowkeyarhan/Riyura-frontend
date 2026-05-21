"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { PlayerLayout } from "@/src/components/player/PlayerLayout";
import { Suspense, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";
import { useWatchParty } from "@/src/hooks/party/useWatchParty";
import { useMoviePlayer } from "@/src/hooks/player/useMoviePlayer";
import { useWatchProgress } from "@/src/hooks/player/useWatchProgress";
import { MediaType } from "@/src/props/global/mediaType";
import { extractColors } from "@/src/lib/utils/color";
import { PartyChatPanel } from "@/src/components/party/PartyChatPanel";
import { PartyHostControls } from "@/src/components/party/PartyHostControls";
import { useState } from "react";

const HARDCODED_PROVIDERS = [
  { id: "ironlink", name: "Ironlink", quality: "1080p Fast" },
  { id: "syntherion", name: "Syntherion", quality: "1080p Subs" },
  { id: "dormannu", name: "Dormannu", quality: "4k Ads" },
];

function PartyMovieContent() {
  const searchParams = useSearchParams();
  const tmdbId = parseInt(searchParams.get("movie") ?? "0");
  const partyIdParam = searchParams.get("party");
  // Provider ID is baked into the URL by the player page sidebar ("Create" button)
  const streamParam = searchParams.get("stream") ?? undefined;
  const { user } = useAuth();

  // Still fetch movie metadata for the "Now Watching" header card
  const { movie, saveWatchHistoryOnUnmount } = useMoviePlayer({
    movieId: String(tmdbId),
    userId: user?.id,
  });

  const {
    partyId,
    partyState,
    participants,
    messages,
    isHost,
    isConnected,
    currentUserId,
    streamUrl,
    currentTimeRef,
    currentProviderRef,
    sendChat,
    leaveParty,
    syncPlayer,
    pushProgress,
  } = useWatchParty({
    partyId: partyIdParam,
    mediaType: MediaType.Movie,
    tmdbId,
    // Pass the provider from the URL so the backend gets the right stream source
    providerId: streamParam,
  });

  // Nanovue detection based on the stream URL returned by the backend
  const isNanovue = streamUrl?.toLowerCase().includes("nanovue") ?? false;

  const { getLatestProgress, setProgress } = useWatchProgress({
    serverName: streamParam,
    isNanovue,
    initialProgressSec: 0,
    onProgress: (sec) => {
      currentTimeRef.current = sec;
    },
  });

  const [gradientColors, setGradientColors] = useState<string[]>([]);

  const bgSrc = movie?.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : "/watch_party_page_temp_bg.jpg";

  // Seed progress tracker from the startAt param in the participant stream URL
  useEffect(() => {
    console.log("[PartyMovieContent] streamUrl in page is:", streamUrl);
    if (streamUrl && !isHost) {
      try {
        const u = new URL(streamUrl);
        const t = u.searchParams.get("start") ?? u.searchParams.get("t");
        if (t) {
          console.log("[PartyMovieContent] Extracted start progress:", t);
          setProgress(Number(t));
        }
      } catch (err) {
        console.warn(
          "[PartyMovieContent] Failed to parse start parameter from streamUrl:",
          streamUrl,
          err,
        );
      }
    }
  }, [streamUrl, isHost, setProgress]);

  useEffect(() => {
    const handler = () => saveWatchHistoryOnUnmount(getLatestProgress());
    window.addEventListener("beforeunload", handler);
    return () => {
      window.removeEventListener("beforeunload", handler);
      saveWatchHistoryOnUnmount(getLatestProgress());
    };
  }, [getLatestProgress, saveWatchHistoryOnUnmount]);

  useEffect(() => {
    extractColors(bgSrc).then(setGradientColors);
  }, [bgSrc]);

  const handleLeave = useCallback(async () => {
    saveWatchHistoryOnUnmount(getLatestProgress());
    await leaveParty();
    window.location.href = "/";
  }, [leaveParty, saveWatchHistoryOnUnmount, getLatestProgress]);

  return (
    <div className="min-h-screen relative z-10 flex flex-col lg:flex-row pt-24 lg:pt-20 pb-4 px-4 gap-4 overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-black">
        {gradientColors.length > 0 ? (
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(circle at 0% 0%,${gradientColors[0]} 0%,transparent 50%),radial-gradient(circle at 100% 0%,${gradientColors[1]} 0%,transparent 50%),radial-gradient(circle at 0% 100%,${gradientColors[2]} 0%,transparent 50%),radial-gradient(circle at 100% 100%,${gradientColors[3]} 0%,transparent 50%)`,
              filter: "blur(80px)",
              transform: "scale(1.2)",
            }}
          />
        ) : (
          <Image
            src={bgSrc}
            alt="bg"
            fill
            className="object-cover opacity-20"
            priority
          />
        )}
      </div>

      {/* Player */}
      <div
        className="flex-1 flex flex-col rounded-[2rem] overflow-hidden relative group aspect-video lg:aspect-auto"
        style={{
          border: "1px solid rgba(255,255,255,0.05)",
          boxShadow:
            "inset 0 1px 0 0 rgba(255,255,255,0.1),0 20px 40px rgba(0,0,0,0.4)",
          aspectRatio: "16/9",
        }}
      >
        {streamUrl ? (
          <iframe
            key={streamUrl}
            src={streamUrl}
            className="w-full h-full border-0 object-cover"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            title="Watch Party Player"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black/80">
            <Loader2 className="animate-spin text-white/40" size={32} />
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-[24rem] col-span-7 flex-shrink-0 flex flex-col gap-3 h-[calc(100vh-8rem)] lg:h-[calc(100vh-6rem)] relative z-10">
        <PartyHostControls
          servers={HARDCODED_PROVIDERS}
          activeServerIndex={Math.max(
            HARDCODED_PROVIDERS.findIndex(
              (s) =>
                s.id === (partyState?.providerId || currentProviderRef.current),
            ),
            0,
          )}
          onServerChange={(idx) => {
            const server = HARDCODED_PROVIDERS[idx];
            pushProgress(server.id, getLatestProgress());
          }}
          onSync={
            !isHost
              ? syncPlayer
              : () => pushProgress(undefined, getLatestProgress())
          }
          onLeave={handleLeave}
          title={movie?.title ?? "Movie"}
          subtitle="Movie"
          backdropPath={movie?.backdrop_path ?? null}
          isHost={isHost}
        />

        <PartyChatPanel
          participants={participants}
          messages={messages}
          currentUserId={currentUserId}
          partyId={partyId}
          isConnected={isConnected}
          onSendChat={sendChat}
        />
      </div>
    </div>
  );
}

export default function PartyMoviePage() {
  return (
    <PlayerLayout>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="animate-spin text-white" size={40} />
          </div>
        }
      >
        <PartyMovieContent />
      </Suspense>
    </PlayerLayout>
  );
}
