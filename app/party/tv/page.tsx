"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { PlayerLayout } from "@/src/components/player/PlayerLayout";
import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import {
  Link as LinkIcon,
  Upload,
  Download,
  Loader2,
  Lock,
  Info,
  Smile,
  User,
} from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";
import { useWatchParty } from "@/src/hooks/party/useWatchParty";
import { useTVShowPlayer } from "@/src/hooks/player/useTVShowPlayer";
import { useWatchProgress } from "@/src/hooks/player/useWatchProgress";
import { EpisodeBrowser } from "@/src/components/player/EpisodeBrowser";
import { MediaType } from "@/src/props/global/mediaType";
import { extractColors } from "@/src/lib/utils/color";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  "#F97316",
  "#6366F1",
  "#22C55E",
  "#EC4899",
  "#8B5CF6",
  "#14B8A6",
  "#F59E0B",
];
function colorForId(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = id.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}
function fmtTime(ts: number) {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}


// ─── Page ─────────────────────────────────────────────────────────────────────
function PartyTVContent() {
  const searchParams = useSearchParams();
  const tmdbId = parseInt(searchParams.get("tv") ?? "0");
  const partyIdParam = searchParams.get("party");
  const initSeason = parseInt(searchParams.get("s") ?? "1");
  const initEp = parseInt(searchParams.get("e") ?? "1");
  const { user } = useAuth();

  // TV player hook — metadata + stream URLs per episode
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

  // Progress tracking via postMessage from iframe
  const { getLatestProgress, setProgress } = useWatchProgress({
    serverName: activeServer?.name,
    isNanovue,
    initialProgressSec: 0,
    onProgress: (sec) => {
      currentTimeRef.current = sec;
      console.log(`WatchParty [PLAYER TV]: Progress → ${sec.toFixed(2)}s`);
    },
  });

  // Watch party hook
  const {
    partyId,
    partyState,
    messages,
    participantIds,
    isHost,
    strictSync,
    remoteSyncCommand,
    currentTimeRef,
    currentProviderRef,
    currentUserId,
    sendChat,
    pushSync,
    requestSync,
    notifyBuffering,
    notifyBufferingComplete,
    toggleStrictSync,
    providerId,
    changeProvider,
  } = useWatchParty({
    partyId: partyIdParam,
    mediaType: MediaType.TV,
    tmdbId,
    seasonNo: initSeason,
    episodeNo: initEp,
    // Pass the current server name so party create stores it in party state
    providerId: activeServer?.name,
  });

  const [isBuffering, setIsBuffering] = useState(false);
  const [gradientColors, setGradientColors] = useState<string[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [copiedInvite, setCopiedInvite] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Keep currentProviderRef updated whenever the active server changes
  useEffect(() => {
    if (activeServer?.name) {
      currentProviderRef.current = activeServer.name;
    }
  }, [activeServer?.name, currentProviderRef]);

  // Host: broadcast server change to participants
  useEffect(() => {
    if (isHost && activeServerIndex >= 0 && servers[activeServerIndex]) {
      changeProvider(servers[activeServerIndex].name);
    }
  }, [activeServerIndex, isHost, servers, changeProvider]);

  // Participants: switch local server when host switches
  useEffect(() => {
    if (!isHost && providerId && servers.length > 0) {
      const idx = servers.findIndex(
        (s) => s.name === providerId || s.id === providerId,
      );
      if (idx !== -1 && idx !== activeServerIndex) {
        setActiveServerIndex(idx);
      }
    }
  }, [providerId, isHost, servers, activeServerIndex, setActiveServerIndex]);

  const bgSrc = tvShow?.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${tvShow.backdrop_path}`
    : "/watch_party_page_temp_bg.jpg";

  // Rebuild stream URL whenever the server changes.
  // If there's a pending remoteSyncCommand, embed its startAt so the
  // new iframe starts from the synced position immediately.
  useEffect(() => {
    if (!activeServer?.url) {
      setStreamUrl(null);
      return;
    }
    const pendingStart = remoteSyncCommand?.startAt ?? 0;
    if (pendingStart > 0) {
      try {
        const url = new URL(activeServer.url);
        url.searchParams.set("start", Math.floor(pendingStart).toString());
        url.searchParams.set("t", Math.floor(pendingStart).toString());
        setStreamUrl(url.toString());
        currentTimeRef.current = pendingStart;
        setProgress(pendingStart);
        return;
      } catch {
        const sep = activeServer.url.includes("?") ? "&" : "?";
        setStreamUrl(
          `${activeServer.url}${sep}start=${Math.floor(pendingStart)}&t=${Math.floor(pendingStart)}`,
        );
        currentTimeRef.current = pendingStart;
        setProgress(pendingStart);
        return;
      }
    }
    setStreamUrl(activeServer.url);
    // Reset currentTime when episode/server changes with no pending sync
    currentTimeRef.current = 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeServer?.url, currentTimeRef]);

  // Apply remote sync — rebuild URL with startAt
  useEffect(() => {
    if (!remoteSyncCommand || !activeServer?.url) return;
    const { startAt, action } = remoteSyncCommand;
    console.log(
      `WatchParty [PLAYER TV]: Remote sync → action=${action} startAt=${startAt}s`,
    );

    if (action === "SEEK" || action === "PLAY") {
      try {
        const url = new URL(activeServer.url);
        url.searchParams.set("start", Math.floor(startAt).toString());
        url.searchParams.set("t", Math.floor(startAt).toString());
        setStreamUrl(url.toString());
        currentTimeRef.current = startAt;
        setProgress(startAt);
        console.log(
          `WatchParty [PLAYER TV]: Reloading iframe → ${url.toString()}`,
        );
      } catch {
        const sep = activeServer.url.includes("?") ? "&" : "?";
        setStreamUrl(
          `${activeServer.url}${sep}start=${Math.floor(startAt)}&t=${Math.floor(startAt)}`,
        );
        currentTimeRef.current = startAt;
        setProgress(startAt);
      }
    }
  }, [remoteSyncCommand, activeServer?.url, currentTimeRef, setProgress]);

  useEffect(() => {
    extractColors(bgSrc).then(setGradientColors);
  }, [bgSrc]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Save watch history on unmount — same as regular TV watch page
  useEffect(() => {
    const handleBeforeUnload = () =>
      saveWatchHistoryOnUnmount(getLatestProgress());
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      saveWatchHistoryOnUnmount(getLatestProgress());
    };
  }, [getLatestProgress, saveWatchHistoryOnUnmount]);

  const handlePushSync = useCallback(() => {
    const t = getLatestProgress();
    console.log(
      `WatchParty [HOST TV]: Manual push sync → startAt=${t.toFixed(2)}s`,
    );
    pushSync(t, "SEEK");
  }, [getLatestProgress, pushSync]);

  const handleBuffering = () => {
    if (isBuffering) {
      notifyBufferingComplete();
      setIsBuffering(false);
    } else {
      notifyBuffering();
      setIsBuffering(true);
    }
  };

  const handleSendChat = () => {
    if (chatInput.trim()) {
      sendChat(chatInput.trim());
      setChatInput("");
    }
  };

  const handleCopyInvite = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      console.log("WatchParty [INVITE]: Copied →", window.location.href);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = window.location.href;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  };

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

        {/* ─── Player (no overlays) ────────────────────────────────── */}
        <div
          className="flex-1 flex flex-col rounded-[2rem] max-w-[75%] overflow-hidden relative"
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
              <p className="text-white/50 text-sm">
                No stream source available
              </p>
            </div>
          )}
        </div>

        {/* ─── Sidebar ──────────────────────────────────────────────── */}
        <div className="w-full max-w-[25%] flex flex-col gap-3 h-[calc(100vh-8rem)] lg:h-[calc(100vh-6rem)] relative z-10">
          {/* Controls grid */}
          <div className="grid grid-cols-5 grid-rows-3 gap-3 flex-shrink-0">
            {/* Host sync */}
            <button
              onClick={handlePushSync}
              disabled={!isHost}
              className={`apple-glass col-span-2 row-span-1 transition-all rounded-full flex items-center justify-start p-2 gap-2.5 ${isHost ? "hover:bg-black/30" : "opacity-40 cursor-not-allowed"}`}
            >
              <div className="w-[37%] h-[50px] rounded-full bg-white/20 flex flex-shrink-0 items-center justify-center shadow-inner">
                <Upload size={25} strokeWidth={2} className="text-white" />
              </div>
              <div className="flex flex-col text-left justify-center flex-1 min-w-0 pr-1">
                <span className="text-[13px] text-white font-bold leading-tight tracking-wide truncate">
                  Host sync
                </span>
                <span className="text-[11px] text-white/50 font-medium leading-tight mt-0.5 tracking-wide">
                  Push
                </span>
              </div>
            </button>

            {/* Now watching */}
            <div className="apple-glass col-span-3 row-span-2 rounded-[32px] p-4 flex flex-col justify-between relative overflow-hidden">
              <div className="flex gap-3 items-start w-full mt-1 relative z-10">
                <div className="w-12 h-12 rounded-lg overflow-hidden relative flex-shrink-0 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                  <Image
                    src={
                      tvShow?.backdrop_path
                        ? `https://image.tmdb.org/t/p/w200${tvShow.backdrop_path}`
                        : "/landing-page/perf_card_3.png"
                    }
                    alt="now playing"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <h3 className="text-white font-bold text-[14px] leading-tight truncate tracking-wide">
                    {tvLoading ? "Loading…" : (tvShow?.title ?? "TV Show")}
                  </h3>
                  <p className="text-white/60 text-[11px] truncate mt-0.5 tracking-wide font-medium uppercase">
                    {isHost ? "You are HOST" : "Participant"}
                  </p>
                  <p className="text-white/40 text-[11px] mt-0.5">
                    S{selectedSeason} E{selectedEpisode}
                  </p>
                </div>
              </div>
              {/* Server switcher */}
              {servers.length > 1 && (
                <div className="flex gap-1.5 flex-wrap mt-2 relative z-10">
                  {servers.map((s, i) => (
                    <button
                      key={s.id}
                      onClick={() => setActiveServerIndex(i)}
                      className={`text-[10px] px-2 py-1 rounded-full font-medium transition-colors ${i === activeServerIndex ? "bg-[#E8470A] text-white" : "bg-white/10 text-white/60 hover:bg-white/20"}`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Buffering */}
            <button
              onClick={handleBuffering}
              className="apple-glass col-span-2 row-span-1 hover:bg-black/30 transition-all rounded-full flex items-center justify-start p-2 gap-2.5"
            >
              <div
                className={`w-[35%] h-[50px] rounded-full flex flex-shrink-0 items-center justify-center shadow-inner ${isBuffering ? "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" : "bg-white/20"}`}
              >
                <Loader2
                  size={25}
                  strokeWidth={2}
                  className={`text-white ${isBuffering ? "animate-spin" : ""}`}
                />
              </div>
              <div className="flex flex-col text-left justify-center flex-1 min-w-0 pr-1">
                <span className="text-[13px] text-white font-bold leading-tight tracking-wide truncate">
                  Buffering
                </span>
                <span className="text-[11px] text-white/50 font-medium leading-tight mt-0.5 tracking-wide">
                  {isBuffering ? "On" : "Off"}
                </span>
              </div>
            </button>

            {/* Strict sync — host only */}
            <button
              onClick={toggleStrictSync}
              disabled={!isHost}
              className={`apple-glass col-span-2 row-span-1 transition-all rounded-full flex items-center justify-start p-2 gap-2.5 ${isHost ? "hover:bg-black/30" : "opacity-40 cursor-not-allowed"}`}
            >
              <div
                className={`w-[35%] h-[50px] rounded-full flex flex-shrink-0 items-center justify-center transition-colors ${strictSync ? "bg-[#ff571e]/90 shadow-[0_0_10px_rgba(255,87,30,0.5)]" : "bg-white/20"}`}
              >
                <Lock size={25} strokeWidth={2} className="text-white" />
              </div>
              <div className="flex flex-col text-left justify-center flex-1 min-w-0 pr-1">
                <span className="text-[13px] text-white font-bold leading-tight tracking-wide truncate">
                  Strict
                </span>
                <span
                  className={`text-[11px] font-medium leading-tight mt-0.5 tracking-wide ${strictSync ? "text-white/90" : "text-white/50"}`}
                >
                  {strictSync ? "On" : "Off"}
                </span>
              </div>
            </button>

            {/* Request sync — participant only */}
            <button
              onClick={requestSync}
              disabled={isHost}
              className={`apple-glass col-span-2 row-span-1 transition-all rounded-full flex items-center justify-start p-2 gap-1 ${!isHost ? "hover:bg-black/30" : "opacity-40 cursor-not-allowed"}`}
            >
              <div className="w-[35%] h-[50px] rounded-full bg-white/20 flex flex-shrink-0 items-center justify-center">
                <Download size={25} strokeWidth={2} className="text-white" />
              </div>
              <div className="flex flex-col text-left justify-center flex-1 min-w-0 pr-1">
                <span className="text-[13px] text-white font-bold leading-tight tracking-wide truncate">
                  Player sync
                </span>
                <span className="text-[11px] text-white/90 font-medium leading-tight mt-0.5 tracking-wide">
                  Request
                </span>
              </div>
            </button>

            <button className="apple-glass col-span-1 row-span-1 transition-all rounded-full flex items-center justify-center p-2 w-full h-full">
              <Info size={25} strokeWidth={2} className="text-white" />
            </button>
          </div>

          {/* Invite */}
          <div className="rounded-[32px] apple-glass p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <LinkIcon size={18} className="text-[#ff571e]" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">
                  Invite Friends
                </h3>
                <p className="text-white/50 text-xs truncate max-w-[120px]">
                  {partyId
                    ? `Party: ${partyId.substring(0, 8)}…`
                    : "Creating party…"}
                </p>
              </div>
            </div>
            <button
              onClick={handleCopyInvite}
              disabled={!partyId}
              className="bg-[#E8470A] text-white rounded-full px-4 py-2 text-sm font-medium shadow-[0_0_20px_rgba(232,71,10,0.4)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {copiedInvite ? "Copied!" : "Copy"}
            </button>
          </div>

          {/* ─── Chat ───────────────────────────────────────────────── */}
          <div className="flex-1 flex flex-col overflow-hidden rounded-[2rem] apple-glass shadow-2xl">
            {/* Participants header */}
            <div
              className="flex items-center justify-between px-2 py-3 m-2 rounded-[1.5rem] flex-shrink-0"
              style={{
                border: "1px solid rgba(255,255,255,0.05)",
                boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.1)",
              }}
            >
              <div className="flex items-center pl-2" style={{ height: 40 }}>
                {participantIds.map((pid, i) => (
                  <div
                    key={pid}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-bold ring-2 ring-black flex-shrink-0"
                    style={{
                      backgroundColor: colorForId(pid),
                      marginLeft: i === 0 ? 0 : -10,
                      zIndex: participantIds.length - i,
                      position: "relative",
                    }}
                  >
                    {pid.substring(0, 1).toUpperCase()}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-[12px] font-semibold text-gray-500">
                  {participantIds.length} watching
                </span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-3">
              {messages.map((msg, idx) => {
                const isMe = msg.senderId === currentUserId;
                return msg.isSystemMessage ? (
                  <div key={idx} className="flex justify-center my-1">
                    <span className="text-[11px] font-medium text-white/50 bg-white/5 px-3 py-1 rounded-full">
                      {msg.text}
                    </span>
                  </div>
                ) : (
                  <div
                    key={idx}
                    className={`flex items-start gap-2.5 ${isMe ? "flex-row-reverse" : ""}`}
                  >
                    {!isMe &&
                      (msg.senderProfilePhoto ? (
                        <Image
                          src={msg.senderProfilePhoto}
                          alt={msg.senderDisplayName ?? "user"}
                          width={36}
                          height={36}
                          className="rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-[13px] flex-shrink-0"
                          style={{ backgroundColor: colorForId(msg.senderId) }}
                        >
                          {(msg.senderDisplayName ?? msg.senderId)
                            .substring(0, 1)
                            .toUpperCase()}
                        </div>
                      ))}
                    <div
                      className={`flex flex-col break-words max-w-[70%] min-w-0 ${isMe ? "items-end" : ""}`}
                    >
                      <div
                        className={`flex items-baseline gap-2 mb-0.5 ${isMe ? "flex-row-reverse" : ""}`}
                      >
                        <span className="text-[13px] font-semibold text-white truncate max-w-[120px]">
                          {msg.senderDisplayName}
                        </span>
                        <span className="text-[10px] text-white/30 flex-shrink-0">
                          {fmtTime(msg.serverTime)}
                        </span>
                      </div>
                      <p
                        className={`text-[13px] text-white/80 leading-snug break-all ${isMe ? "pl-2 text-right" : "pr-2"}`}
                      >
                        {msg.text}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-3 flex-shrink-0 flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-full pl-3 pr-2 py-2 flex-1 apple-glass">
                <Smile
                  size={20}
                  className="text-gray-400 flex-shrink-0 stroke-[1.5]"
                />
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                  placeholder="Say something…"
                  className="flex-1 bg-transparent text-[13px] text-white/80 placeholder:text-gray-500 outline-none min-w-0"
                />
              </div>
              <button
                onClick={handleSendChat}
                className="px-4 py-2 rounded-full apple-glass hover:bg-white/10 text-white text-[13px] font-medium flex-shrink-0"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Episode Browser */}
      <div className="w-full relative z-10 px-4 mt-4">
        <EpisodeBrowser
          validSeasons={validSeasons}
          episodes={episodes}
          selectedSeason={selectedSeason}
          selectedEpisode={selectedEpisode}
          onSeasonChange={(s) => {
            setSelectedSeason(s);
            currentTimeRef.current = 0;
          }}
          onEpisodeChange={(e) => {
            setSelectedEpisode(e);
            currentTimeRef.current = 0;
          }}
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
