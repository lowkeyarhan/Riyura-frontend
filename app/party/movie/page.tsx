"use client";

import Image from "next/image";
import { PlayerLayout } from "@/src/components/player/PlayerLayout";
import {
  Shield,
  Settings,
  Users,
  Send,
  Play,
  Pause,
  MicOff,
  UserPlus,
  Type,
  FastForward,
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
import { useState, useEffect } from "react";

// ─── Extract colors for dynamic gradient ─────────────────────────────────────
function extractColors(src: string): Promise<string[]> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(["#0f172a", "#000000"]);
      canvas.width = 2;
      canvas.height = 2;
      ctx.drawImage(img, 0, 0, 2, 2);
      const data = ctx.getImageData(0, 0, 2, 2).data;
      const colors = [];
      for (let i = 0; i < data.length; i += 4) {
        colors.push(`rgb(${data[i]}, ${data[i + 1]}, ${data[i + 2]})`);
      }
      resolve(colors);
    };
    img.onerror = () => resolve(["#0f172a", "#000000"]);
  });
}

// ─── Types ────────────────────────────────────────────────────────────────────

type ChatMessage = {
  id: number;
  type?: never;
  sender: string;
  time: string;
  text: string;
  avatarColor: string;
  nameColor: string;
  date: "yesterday" | "today";
};

type EventMessage = {
  id: number;
  type: "event";
  text: string;
  date: "yesterday" | "today";
};

type Message = ChatMessage | EventMessage;

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MESSAGES: Message[] = [
  {
    id: 1,
    sender: "Samantha",
    time: "13:45",
    text: "Hi @Nico Alexis I'm very excited to start working on this project. Can we begin by discussing the main goals and objectives of the design?",
    avatarColor: "#F97316",
    nameColor: "#F97316",
    date: "yesterday",
  },
  {
    id: 2,
    sender: "Nico Alexis",
    time: "13:50",
    text: "Of course, thank you for joining 🥰",
    avatarColor: "#6366F1",
    nameColor: "#6366F1",
    date: "yesterday",
  },
  {
    id: 3,
    sender: "Samantha",
    time: "14:00",
    text: "That sounds great. Do we have any data on how users currently interact with our site?",
    avatarColor: "#F97316",
    nameColor: "#F97316",
    date: "yesterday",
  },
  {
    id: 13,
    type: "event",
    text: "Jay left",
    date: "today",
  },
  {
    id: 4,
    sender: "Bima Algifari",
    time: "8:30",
    text: "Thank you. Based on this data, we can start creating user personas @Samantha",
    avatarColor: "#22C55E",
    nameColor: "#22C55E",
    date: "today",
  },
  {
    id: 14,
    type: "event",
    text: "Nico Alexis is now the host",
    date: "today",
  },
  {
    id: 5,
    sender: "Samantha",
    time: "9:00",
    text: "I like this approach 👍",
    avatarColor: "#F97316",
    nameColor: "#F97316",
    date: "today",
  },
];

const PARTICIPANTS = [
  { name: "Samantha", color: "#F97316" },
  { name: "Nico Alexis", color: "#6366F1" },
  { name: "Bima", color: "#22C55E" },
  { name: "Jay", color: "#EC4899" },
  { name: "Alex", color: "#8B5CF6" },
  { name: "Priya", color: "#14B8A6" },
  { name: "Omar", color: "#F59E0B" },
];

function IconSync() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M23 4v6h-6" />
      <path d="M1 20v-6h6" />
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
    </svg>
  );
}

function IconForceSync() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

function IconLoader() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

function IconStop() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
  );
}

// ─── Simple Control Button ────────────────────────────────────────────────────

function ControlButton({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center gap-2.5 px-3.5 py-3 rounded-2xl transition-all w-full"
      style={{
        backgroundColor: hovered ? "#EBEBEB" : "#F5F5F5",
        border: "1px solid #EBEBEB",
      }}
    >
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: "#E5E7EB", color: "#6B7280" }}
      >
        {icon}
      </div>
      <span className="text-md font-semibold text-gray-700 leading-tight">
        {label}
      </span>
    </button>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function renderText(text: string) {
  return text
    .split(/(@[\w\s]+)/g)
    .map((part, i) => <span key={i}>{part}</span>);
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PartyMoviePage() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [isBuffering, setIsBuffering] = useState(false);
  const [gradientColors, setGradientColors] = useState<string[]>([]);
  const bgImageSrc = "/watch_party_page_temp_bg.jpg";

  useEffect(() => {
    extractColors(bgImageSrc).then((colors) => setGradientColors(colors));
  }, [bgImageSrc]);

  return (
    <PlayerLayout>
      <div className="fixed inset-0 z-0 pointer-events-none">
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
            src={bgImageSrc}
            alt="Mock WatchPartyPage Background"
            fill
            className="object-cover absolute inset-0 opacity-20"
            priority
          />
        )}
      </div>
      <div className="min-h-screen relative z-10 flex flex-col lg:flex-row pt-24 lg:pt-20 pb-4 px-4 gap-4 overflow-hidden">
        {/* ─── LEFT: Cinema Player ─── */}
        <div
          className="flex-1 flex flex-col rounded-[2rem] max-w-[75%] overflow-hidden relative group aspect-video lg:aspect-auto"
          style={{
            border: "1px solid rgba(255, 255, 255, 0.05)",
            boxShadow:
              "inset 0 1px 0 0 rgba(255, 255, 255, 0.1), 0 20px 40px rgba(0, 0, 0, 0.4)",
          }}
        >
          <Image
            src="/landing-page/perf_card_3.png"
            alt="Mock Player Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
            <div className="flex items-center justify-center flex-1">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-20 h-20 rounded-full bg-orange-600/90 hover:bg-orange-500 text-white flex items-center justify-center transition-transform hover:scale-105 shadow-[0_0_40px_rgba(234,88,12,0.4)] backdrop-blur-sm"
              >
                {isPlaying ? (
                  <Pause size={32} />
                ) : (
                  <Play size={32} className="translate-x-1" />
                )}
              </button>
            </div>
            <div className="w-full flex flex-col gap-3">
              <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden cursor-pointer group/progress relative">
                <div className="bg-orange-600 w-1/3 h-full rounded-full relative shadow-[0_0_10px_rgba(234,88,12,0.8)]">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg scale-0 group-hover/progress:scale-100 transition-transform" />
                </div>
              </div>
              <div className="flex justify-between items-center text-white">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="hover:text-orange-500 transition-colors"
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <span className="text-xs font-medium text-white/80 font-mono">
                    24:12 / 1:56:40
                  </span>
                </div>
                <button className="hover:text-orange-500 transition-colors">
                  <Settings size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ─── RIGHT: Sidebar ─── */}
        <div className="w-full max-w-[25%] flex flex-col gap-3 h-[calc(100vh-8rem)] lg:h-[calc(100vh-6rem)]">
          {/* Host Controls Grid (Apple Control Center Style) */}
          <div className="grid grid-cols-5 grid-rows-3 gap-3 flex-shrink-0">
            {/* Row 1, Col 1: Push Sync */}
            <button className="apple-glass col-span-2 row-span-1 bg-black/20 hover:bg-black/30 transition-all rounded-full flex items-center justify-start p-2 gap-2.5 ">
              <div className="w-[37%] h-[50px] rounded-full bg-white/20 group-hover:bg-white/30 flex flex-shrink-0 items-center justify-center transition-colors shadow-inner">
                <Upload size={25} strokeWidth={2} className="text-white" />
              </div>
              <div className="flex flex-col text-left justify-center flex-1 min-w-0 pr-1">
                <span className="text-[13px] text-white font-bold leading-tight tracking-wide truncate block">
                  Host sync
                </span>
                <span className="text-[11px] text-white/50 font-medium leading-tight mt-0.5 tracking-wide block">
                  Push
                </span>
              </div>
            </button>

            {/* Row 1/2, Col 2/3: Now Watching */}
            <div className="apple-glass col-span-3 row-span-2 rounded-[32px] p-4 flex flex-col justify-between relative overflow-hidden">
              <div className="flex gap-3 items-start relative z-10 w-full mt-1">
                <div className="w-12 h-12 rounded-lg overflow-hidden relative flex-shrink-0 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                  <Image
                    src="/landing-page/perf_card_3.png"
                    alt="Now Playing"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <h3 className="text-white font-bold text-[14px] leading-tight truncate tracking-wide">
                    Darkhaast [Slowe...
                  </h3>
                  <p className="text-white/60 text-[12px] truncate mt-1 tracking-wide font-medium uppercase">
                    REVIBE
                  </p>
                </div>
              </div>

              <div className="flex justify-center items-center gap-6 relative z-10 mt-3 pb-1">
                <button className="text-white/60 hover:text-white transition-colors">
                  <RotateCcw size={20} strokeWidth={2.5} />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-white transition-transform hover:scale-105"
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
                <button className="text-white/60 hover:text-white transition-colors">
                  <RotateCw size={20} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Row 2, Col 1: Buffering */}
            <button className="apple-glass col-span-2 row-span-1 bg-black/20 hover:bg-black/30 transition-all rounded-full flex items-center justify-start p-2 gap-2.5 ">
              <div className="w-[35%] h-[50px] rounded-full bg-white/20 group-hover:bg-white/30 flex flex-shrink-0 items-center justify-center transition-colors shadow-inner">
                <Loader2 size={25} strokeWidth={2} className="text-white" />
              </div>
              <div className="flex flex-col text-left justify-center flex-1 min-w-0 pr-1">
                <span className="text-[13px] text-white font-bold leading-tight tracking-wide truncate block">
                  Buffering
                </span>
                <span className="text-[11px] text-white/50 font-medium leading-tight mt-0.5 tracking-wide block">
                  Off
                </span>
              </div>
            </button>

            {/* Row 3, Col 1: Strict */}
            <button className="apple-glass col-span-2 row-span-1 bg-black/20 hover:bg-black/30 transition-all rounded-full flex items-center justify-start p-2 gap-2.5 ">
              <div className="w-[35%] h-[50px] rounded-full bg-[#ff571e]/90 group-hover:bg-[#ff571e] flex flex-shrink-0 items-center justify-center transition-colors shadow-[0_0_10px_rgba(255,87,30,0.5)]">
                <Lock size={25} strokeWidth={2} className="text-white" />
              </div>
              <div className="flex flex-col text-left justify-center flex-1 min-w-0 pr-1">
                <span className="text-[13px] text-white font-bold leading-tight tracking-wide truncate block">
                  Strict
                </span>
                <span className="text-[11px] text-white/90 font-medium leading-tight mt-0.5 tracking-wide block">
                  On
                </span>
              </div>
            </button>

            {/* Row 3, Col 2: Request Sync */}
            <button className="apple-glass col-span-2 row-span-1 bg-black/20 hover:bg-black/30 transition-all rounded-full flex  items-center justify-start p-2 gap-1 relative z-10">
              <div className="w-[35%] h-[50px] rounded-full bg-white/20 group-hover:bg-white/30 flex flex-shrink-0 items-center justify-center transition-colors">
                <Download size={25} strokeWidth={2} className="text-white" />
              </div>
              <div className="flex flex-col text-left justify-center flex-1 min-w-0 pr-1">
                <span className="text-[13px] text-white font-bold leading-tight tracking-wide truncate block">
                  Player sync
                </span>
                <span className="text-[11px] text-white/90 font-medium leading-tight mt-0.5 tracking-wide block">
                  Request
                </span>
              </div>
            </button>

            {/* Row 3, Col 3: Info */}
            <button className="apple-glass col-span-1 row-span-1 transition-all rounded-full flex flex-col items-center justify-center p-2 gap-1 group shadow-[0_8px_32px_rgba(0,0,0,0.2)] relative z-10 w-full h-full">
              <Info size={25} strokeWidth={2} className="text-white" />
            </button>
          </div>

          {/* Middle Card: Invite People */}
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
            <button className="bg-[#E8470A] text-white rounded-full px-4 py-2 text-sm font-medium cursor-pointer transition-transform shadow-[0_0_20px_rgba(232,71,10,0.4)]">
              Copy
            </button>
          </div>

          {/* ─── Chat Panel ─── */}
          <div
            className="flex-1 flex flex-col overflow-hidden rounded-[2rem] apple-glass shadow-2xl"
            style={{
              // backgroundColor: "#F5F5F5",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-2 py-3 m-2 rounded-[1.5rem] flex-shrink-0"
              style={{
                border: "1px solid rgba(255, 255, 255, 0.05)",
                boxShadow:
                  "inset 0 1px 0 0 rgba(255, 255, 255, 0.1), 0 20px 40px rgba(0, 0, 0, 0.3)",
              }}
            >
              <div
                className="relative flex pl-2 items-center flex-1 overflow-hidden"
                style={{ height: 40 }}
              >
                <div className="flex items-center">
                  {PARTICIPANTS.map((p, i) => (
                    <div
                      key={p.name}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0 ring-2 ring-white"
                      style={{
                        backgroundColor: p.color,
                        marginLeft: i === 0 ? 0 : -10,
                        zIndex: PARTICIPANTS.length - i,
                        position: "relative",
                      }}
                    >
                      {p.name[0]}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 ml-2 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-[12px] font-semibold text-gray-500">
                  {PARTICIPANTS.length} watching
                </span>
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto px-5 py-4 space-y-5"
              // style={{ backgroundColor: "#F5F5F5" }}
            >
              {MESSAGES.map((msg) => {
                // ── Event bubble (WhatsApp-style) ──
                if (msg.type === "event") {
                  return (
                    <div key={msg.id} className="flex justify-center">
                      <span className="text-[11.5px] font-medium text-white-500 bg-black/30 px-3 py-1 rounded-full leading-tight">
                        {msg.text}
                      </span>
                    </div>
                  );
                }

                // ── Regular chat message ──
                return (
                  <div key={msg.id} className="flex items-start gap-2">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-[15px] flex-shrink-0"
                      style={{ backgroundColor: msg.avatarColor }}
                    >
                      {msg.sender[0]}
                    </div>
                    <div className="flex-1 min-w-0 -mt-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[14px] font-semibold">
                          {msg.sender}
                        </span>
                        <span className="text-[12px] text-gray-400">
                          {msg.time}
                        </span>
                      </div>
                      <p className="text-[14px] text-white/80 leading-[1.55] mt-0.5">
                        {renderText(msg.text)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Bar */}
            <div className="px-3 py-3 flex-shrink-0 flex items-center gap-3 w-full ">
              <div className="flex items-center gap-1 rounded-full pl-3 pr-4 py-2 w-full apple-glass">
                <button
                  type="button"
                  className="p-1 text-gray-400 hover:text-white/80 transition-colors flex-shrink-0 focus:outline-none"
                >
                  <Smile size={22} className="stroke-[1.5]" />
                </button>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && chatInput.trim()) setChatInput("");
                  }}
                  placeholder="Say something..."
                  className="flex-1 bg-transparent text-[14px] text-white/80 placeholder:text-gray-400 outline-none min-w-0"
                  style={{ fontFamily: "inherit" }}
                />
              </div>
              <button
                onClick={() => {
                  if (chatInput.trim()) setChatInput("");
                }}
                className="h-full px-4 rounded-full cursor-pointer flex items-center justify-center transition-colors flex-shrink-0 apple-glass"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </PlayerLayout>
  );
}
