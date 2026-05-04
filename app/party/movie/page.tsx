"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { PlayerLayout } from "@/src/components/player/PlayerLayout";
import { Suspense, useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Link as LinkIcon,
  Upload,
  Download,
  Loader2,
  Lock,
  RotateCcw,
  RotateCw,
  Info,
  Smile,
} from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";
import { useWatchParty } from "@/src/hooks/party/useWatchParty";
import { useMoviePlayer } from "@/src/hooks/player/useMoviePlayer";
import { MediaType } from "@/src/props/global/mediaType";

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
function fmt(ts: number) {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
async function extractColors(src: string): Promise<string[]> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.src = src;
    img.onload = () => {
      const c = document.createElement("canvas");
      const ctx = c.getContext("2d");
      if (!ctx) return resolve(["#0f172a", "#000"]);
      c.width = c.height = 2;
      ctx.drawImage(img, 0, 0, 2, 2);
      const d = ctx.getImageData(0, 0, 2, 2).data;
      const out: string[] = [];
      for (let i = 0; i < d.length; i += 4)
        out.push(`rgb(${d[i]},${d[i + 1]},${d[i + 2]})`);
      resolve(out);
    };
    img.onerror = () => resolve(["#0f172a", "#000"]);
  });
}

// ─── Page ─────────────────────────────────────────────────────────────────────
function PartyMovieContent() {
  const searchParams = useSearchParams();
  const tmdbId = parseInt(searchParams.get("movie") ?? "0");
  const partyIdParam = searchParams.get("party");
  const { user } = useAuth();

  // Player data + stream URLs
  const {
    movie,
    servers,
    loading: movieLoading,
    activeServerIndex,
    setActiveServerIndex,
  } = useMoviePlayer({ movieId: String(tmdbId), userId: user?.id });

  // Watch party
  const {
    partyId,
    messages,
    participantIds,
    isHost,
    strictSync,
    remoteSyncCommand,
    currentTimeRef,
    sendChat,
    pushSync,
    requestSync,
    notifyBuffering,
    notifyBufferingComplete,
    toggleStrictSync,
  } = useWatchParty({
    partyId: partyIdParam,
    mediaType: MediaType.Movie,
    tmdbId,
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [gradientColors, setGradientColors] = useState<string[]>([]);
  const [chatInput, setChatInput] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const bgSrc = movie?.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : "/watch_party_page_temp_bg.jpg";

  const streamUrl = servers[activeServerIndex]?.url ?? null;

  // Dynamic gradient from backdrop
  useEffect(() => {
    extractColors(bgSrc).then(setGradientColors);
  }, [bgSrc]);

  // Scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Apply remote sync commands to iframe player
  useEffect(() => {
    if (!remoteSyncCommand) return;
    console.log(
      "WatchParty [PLAYER]: Applying sync command →",
      remoteSyncCommand,
    );
    if (remoteSyncCommand.action === "PLAY") setIsPlaying(true);
    if (remoteSyncCommand.action === "PAUSE") setIsPlaying(false);
    // For iframe players we can't directly seek, but we update the visual state
  }, [remoteSyncCommand]);

  // Update currentTimeRef every second (used by auto host push-sync)
  useEffect(() => {
    const id = setInterval(() => {
      // Increment a rough tracker — real seek tracking requires postMessage with the provider
      currentTimeRef.current += isPlaying ? 1 : 0;
    }, 1000);
    return () => clearInterval(id);
  }, [isPlaying, currentTimeRef]);

  const canControl = isHost || !strictSync;
  const inviteLink = typeof window !== "undefined" ? window.location.href : "";

  const handlePlayPause = () => {
    if (!canControl) return;
    const next = !isPlaying;
    setIsPlaying(next);
    pushSync(currentTimeRef.current, next ? "PLAY" : "PAUSE");
  };

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

  // Avatar: use senderProfilePhoto if available, else initials
  const Avatar = ({
    id,
    name,
    photo,
  }: {
    id: string;
    name?: string;
    photo?: string;
  }) =>
    photo ? (
      <Image
        src={photo}
        alt={name ?? id}
        width={40}
        height={40}
        className="rounded-full object-cover flex-shrink-0"
      />
    ) : (
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-[15px] flex-shrink-0"
        style={{ backgroundColor: colorForId(id) }}
      >
        {(name ?? id).substring(0, 1).toUpperCase()}
      </div>
    );

  return (
    <div className="min-h-screen relative z-10 flex flex-col lg:flex-row pt-24 lg:pt-20 pb-4 px-4 gap-4 overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
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

      {/* ─── Player ──────────────────────────────────────────────────────── */}
      <div
        className="flex-1 flex flex-col rounded-[2rem] max-w-[75%] overflow-hidden relative group"
        style={{
          border: "1px solid rgba(255,255,255,0.05)",
          boxShadow:
            "inset 0 1px 0 0 rgba(255,255,255,0.1),0 20px 40px rgba(0,0,0,0.4)",
          aspectRatio: "16/9",
        }}
      >
        {streamUrl ? (
          <iframe
            ref={iframeRef}
            src={streamUrl}
            className="w-full h-full border-0"
            allowFullScreen
            allow="autoplay; fullscreen"
            title="Watch Party Player"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-black/60">
            <Image
              src={bgSrc}
              alt="poster"
              fill
              className="object-cover opacity-30"
            />
            {movieLoading ? (
              <Loader2 className="animate-spin text-white z-10" size={48} />
            ) : (
              <p className="text-white/60 z-10 text-sm">No stream available</p>
            )}
          </div>
        )}
      </div>

      {/* ─── Sidebar ─────────────────────────────────────────────────────── */}
      <div className="w-full max-w-[25%] flex flex-col gap-3 h-[calc(100vh-8rem)] lg:h-[calc(100vh-6rem)] relative z-10">
        {/* Controls grid */}
        <div className="grid grid-cols-5 grid-rows-3 gap-3 flex-shrink-0">
          {/* Push sync – host only */}
          <button
            onClick={() =>
              pushSync(currentTimeRef.current, isPlaying ? "PLAY" : "PAUSE")
            }
            disabled={!isHost}
            className={`apple-glass col-span-2 row-span-1 transition-all rounded-full flex items-center justify-start p-2 gap-2.5 ${isHost ? "bg-black/20 hover:bg-black/30" : "bg-black/10 opacity-50 cursor-not-allowed"}`}
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
                    movie?.backdrop_path
                      ? `https://image.tmdb.org/t/p/w200${movie.backdrop_path}`
                      : "/landing-page/perf_card_3.png"
                  }
                  alt="now playing"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <h3 className="text-white font-bold text-[14px] leading-tight truncate tracking-wide">
                  {movieLoading ? "Loading…" : (movie?.title ?? "Movie")}
                </h3>
                <p className="text-white/60 text-[12px] truncate mt-1 tracking-wide font-medium uppercase">
                  {isHost ? "You are HOST" : "Participant"}
                </p>
              </div>
            </div>
            <div className="flex justify-center items-center gap-6 relative z-10 mt-3 pb-1">
              <button
                className={`transition-colors ${canControl ? "text-white/60 hover:text-white" : "text-white/20 cursor-not-allowed"}`}
                disabled={!canControl}
              >
                <RotateCcw size={20} strokeWidth={2.5} />
              </button>
              <button
                onClick={handlePlayPause}
                disabled={!canControl}
                className={`transition-transform ${canControl ? "text-white hover:scale-105" : "text-white/40 cursor-not-allowed"}`}
              >
                {isPlaying ? (
                  <Pause size={32} fill="currentColor" />
                ) : (
                  <Play
                    size={32}
                    fill="currentColor"
                    className="translate-x-0.5"
                  />
                )}
              </button>
              <button
                className={`transition-colors ${canControl ? "text-white/60 hover:text-white" : "text-white/20 cursor-not-allowed"}`}
                disabled={!canControl}
              >
                <RotateCw size={20} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Buffering */}
          <button
            onClick={handleBuffering}
            className="apple-glass col-span-2 row-span-1 bg-black/20 hover:bg-black/30 transition-all rounded-full flex items-center justify-start p-2 gap-2.5"
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

          {/* Strict sync – host only */}
          <button
            onClick={toggleStrictSync}
            disabled={!isHost}
            className={`apple-glass col-span-2 row-span-1 transition-all rounded-full flex items-center justify-start p-2 gap-2.5 ${isHost ? "bg-black/20 hover:bg-black/30" : "bg-black/10 opacity-50 cursor-not-allowed"}`}
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

          {/* Request sync – participant only */}
          <button
            onClick={requestSync}
            disabled={isHost}
            className={`apple-glass col-span-2 row-span-1 transition-all rounded-full flex items-center justify-start p-2 gap-1 ${!isHost ? "bg-black/20 hover:bg-black/30" : "bg-black/10 opacity-50 cursor-not-allowed"}`}
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
              <p className="text-white/50 text-xs">Share party link</p>
            </div>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(inviteLink);
            }}
            className="bg-[#E8470A] text-white rounded-full px-4 py-2 text-sm font-medium shadow-[0_0_20px_rgba(232,71,10,0.4)]"
          >
            Copy
          </button>
        </div>

        {/* ─── Chat ──────────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden rounded-[2rem] apple-glass shadow-2xl">
          {/* Chat header — participant avatars */}
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

          {/* Messages — sent right, received left */}
          <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-3">
            {messages.map((msg, idx) => {
              const isOwn = msg.senderId === user?.id;
              return (
                <div
                  key={idx}
                  className={`flex items-end gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar */}
                  {!isOwn && (
                    <Avatar
                      id={msg.senderId}
                      name={msg.senderDisplayName}
                      photo={msg.senderProfilePhoto}
                    />
                  )}
                  <div
                    className={`max-w-[75%] flex flex-col ${isOwn ? "items-end" : "items-start"}`}
                  >
                    {!isOwn && (
                      <span className="text-[11px] text-white/50 font-semibold mb-1 ml-1">
                        {msg.senderDisplayName}
                      </span>
                    )}
                    <div
                      className={`px-3 py-2 rounded-2xl text-[13px] leading-[1.5] ${isOwn ? "bg-[#E8470A] text-white rounded-br-sm" : "bg-white/10 text-white/90 rounded-bl-sm"}`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-white/30 mt-1 mx-1">
                      {fmt(msg.serverTime)}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 flex-shrink-0 flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full pl-3 pr-2 py-2 flex-1 apple-glass">
              <button className="p-1 text-gray-400 hover:text-white/80 transition-colors flex-shrink-0">
                <Smile size={20} className="stroke-[1.5]" />
              </button>
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
