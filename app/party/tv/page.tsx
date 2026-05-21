"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { PlayerLayout } from "@/src/components/player/PlayerLayout";
import { Suspense, useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";
import { useWatchParty } from "@/src/hooks/party/useWatchParty";
import { useTVShowPlayer } from "@/src/hooks/player/useTVShowPlayer";
import { useWatchProgress } from "@/src/hooks/player/useWatchProgress";
import { EpisodeBrowser } from "@/src/components/player/EpisodeBrowser";
import { MediaType } from "@/src/props/global/mediaType";
import { extractColors } from "@/src/lib/utils/color";
import { PartyChatPanel } from "@/src/components/party/PartyChatPanel";
import { PartyHostControls } from "@/src/components/party/PartyHostControls";

function PartyTVContent() {
  const searchParams = useSearchParams();
  const tmdbId = parseInt(searchParams.get("tv") ?? "0");
  const partyIdParam = searchParams.get("party");
  const initSeason = parseInt(searchParams.get("s") ?? "1");
  const initEp = parseInt(searchParams.get("e") ?? "1");
  const { user } = useAuth();

  const {
    tvShow,
    servers,
    loading: tvLoading,
    selectedSeason,
    selectedEpisode,
    activeServerIndex,
    validSeasons,
    episodes,
    setSelectedSeason,
    setSelectedEpisode,
    setActiveServerIndex,
    saveWatchHistoryOnUnmount,
  } = useTVShowPlayer({
    tvShowId: String(tmdbId),
    userId: user?.id,
    initialSeason: initSeason,
    initialEpisode: initEp,
  });

  const activeServer = servers[activeServerIndex];
  const isNanovue =
    activeServer?.name?.toLowerCase().includes("nanovue") ?? false;

  const { getLatestProgress, setProgress } = useWatchProgress({
    serverName: activeServer?.name,
    isNanovue,
    initialProgressSec: 0,
    onProgress: (sec) => {
      currentTimeRef.current = sec;
    },
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
    pushProgress,
    syncPlayer,
  } = useWatchParty({
    partyId: partyIdParam,
    mediaType: MediaType.TV,
    tmdbId,
    seasonNo: initSeason,
    episodeNo: initEp,
    providerId: activeServer?.id,
  });

  const [gradientColors, setGradientColors] = useState<string[]>([]);

  const filteredServers = servers.filter(
    (s) => !s.name?.toLowerCase().includes("nanovue"),
  );
  const activeServerFromHook = servers[activeServerIndex];
  const filteredActiveIndex = Math.max(
    filteredServers.findIndex((s) => s.id === activeServerFromHook?.id),
    0,
  );

  const bgSrc = tvShow?.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${tvShow.backdrop_path}`
    : "/watch_party_page_temp_bg.jpg";

  useEffect(() => {
    if (activeServer?.id) currentProviderRef.current = activeServer.id;
  }, [activeServer?.id, currentProviderRef]);

  // Keep TV active server in sync with the party state
  useEffect(() => {
    if (partyState?.providerId) {
      const idx = servers.findIndex(
        (s) => s.id.toLowerCase() === partyState.providerId.toLowerCase(),
      );
      if (idx !== -1 && idx !== activeServerIndex) {
        setActiveServerIndex(idx);
      }
    }
  }, [
    partyState?.providerId,
    servers,
    activeServerIndex,
    setActiveServerIndex,
  ]);

  // Seed the progress tracker from the startAt param embedded in the participant's stream URL
  useEffect(() => {
    console.log("[PartyTVContent] streamUrl in page is:", streamUrl);
    if (streamUrl && !isHost) {
      try {
        const u = new URL(streamUrl);
        const t = u.searchParams.get("start") ?? u.searchParams.get("t");
        if (t) {
          console.log("[PartyTVContent] Extracted start progress:", t);
          setProgress(Number(t));
        }
      } catch (err) {
        console.warn(
          "[PartyTVContent] Failed to parse start parameter from streamUrl:",
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

  // Reset progress tracking when the episode changes
  const handleSeasonChange = useCallback(
    (s: number) => {
      setSelectedSeason(s);
      currentTimeRef.current = 0;
    },
    [setSelectedSeason, currentTimeRef],
  );

  const handleEpisodeChange = useCallback(
    (e: number) => {
      setSelectedEpisode(e);
      currentTimeRef.current = 0;
    },
    [setSelectedEpisode, currentTimeRef],
  );

  return (
    <div className="flex flex-col pb-16">
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
          {tvLoading ? (
            <div className="w-full h-full flex items-center justify-center bg-black/80">
              <Loader2 className="animate-spin text-white" size={48} />
            </div>
          ) : streamUrl ? (
            <iframe
              key={streamUrl}
              src={streamUrl}
              className="w-full h-full border-0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              title="Watch Party TV"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-black/80">
              <Loader2 className="animate-spin text-white/40" size={32} />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[24rem] flex-shrink-0 flex flex-col gap-3 h-[calc(100vh-8rem)] lg:h-[calc(100vh-6rem)] relative z-10">
          <PartyHostControls
            servers={filteredServers}
            activeServerIndex={filteredActiveIndex}
            onServerChange={(idx) => {
              const targetServer = filteredServers[idx];
              const originalIdx = servers.findIndex(
                (s) => s.id === targetServer.id,
              );
              if (originalIdx !== -1) {
                setActiveServerIndex(originalIdx);
                if (isHost) pushProgress(targetServer.id, getLatestProgress());
              }
            }}
            onSync={
              !isHost
                ? syncPlayer
                : () => pushProgress(undefined, getLatestProgress())
            }
            onLeave={handleLeave}
            title={tvLoading ? "Loading…" : (tvShow?.title ?? "TV Show")}
            subtitle={`S${selectedSeason} · E${selectedEpisode}`}
            backdropPath={tvShow?.backdrop_path ?? null}
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

      {/* Episode browser */}
      <div className="w-full relative z-10 px-4 mt-4">
        <EpisodeBrowser
          validSeasons={validSeasons}
          episodes={episodes}
          selectedSeason={selectedSeason}
          selectedEpisode={selectedEpisode}
          onSeasonChange={handleSeasonChange}
          onEpisodeChange={handleEpisodeChange}
        />
      </div>
    </div>
  );
}

export default function PartyTVPage() {
  return (
    <PlayerLayout>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="animate-spin text-white" size={40} />
          </div>
        }
      >
        <PartyTVContent />
      </Suspense>
    </PlayerLayout>
  );
}
