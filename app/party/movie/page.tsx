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
} from "lucide-react";
import { useState } from "react";

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

  return (
    <PlayerLayout>
      <div className="min-h-screen relative z-10 flex flex-col lg:flex-row pt-24 lg:pt-20 pb-4 px-4 gap-4">
        {/* ─── LEFT: Cinema Player ─── */}
        <div className="flex-1 flex flex-col rounded-[2rem] max-w-[70%] overflow-hidden shadow-2xl ring-1 ring-white/10 relative group aspect-video lg:aspect-auto bg-black">
          <Image
            src="/landing-page/perf_card_3.png"
            alt="Mock Player Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
            <div className="flex justify-between items-start">
              <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-white text-xs font-bold tracking-widest uppercase">
                  Live Party
                </span>
              </div>
              <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white/90 text-sm font-medium flex items-center gap-2">
                <Users size={14} className="text-gray-400" />
                12 Viewers
              </div>
            </div>
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
        <div className="w-full max-w-[30%] flex flex-col gap-4 h-[calc(100vh-8rem)] lg:h-[calc(100vh-6rem)]">
          {/* Host Controls */}
          <div className="bg-[#10121880] backdrop-blur-lg border border-white/5 rounded-[2rem] p-5 shadow-2xl flex-shrink-0 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-[40px] pointer-events-none" />
            <div className="flex items-center justify-between mb-5 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/20 text-orange-500 flex items-center justify-center">
                  <Shield size={20} />
                </div>
                <div>
                  <h2
                    className="text-lg font-bold text-white tracking-wide leading-tight"
                    style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
                  >
                    Host Controls
                  </h2>
                  <p className="text-xs text-white/50 font-medium">
                    Manage party settings
                  </p>
                </div>
              </div>
              <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
                <Settings size={18} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 relative z-10">
              <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 transition-all group">
                <div className="p-2 rounded-full bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                  <Users size={18} />
                </div>
                <span className="text-xs text-white/70 font-semibold uppercase tracking-wider">
                  Manage Guests
                </span>
              </button>
              <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 transition-all group">
                <div className="p-2 rounded-full bg-green-500/10 text-green-400 group-hover:scale-110 transition-transform">
                  <MicOff size={18} />
                </div>
                <span className="text-xs text-white/70 font-semibold uppercase tracking-wider">
                  Mute All
                </span>
              </button>
            </div>
          </div>

          {/* ─── Chat Panel ─── */}
          <div
            className="flex-1 flex flex-col overflow-hidden rounded-[2rem] shadow-2xl"
            style={{
              backgroundColor: "#F5F5F5",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-3 flex-shrink-0"
              style={{
                backgroundColor: "#FFFFFF",
                borderBottom: "1px solid #EBEBEB",
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
              style={{ backgroundColor: "#F5F5F5" }}
            >
              {MESSAGES.map((msg) => {
                // ── Event bubble (WhatsApp-style) ──
                if (msg.type === "event") {
                  return (
                    <div key={msg.id} className="flex justify-center">
                      <span className="text-[11.5px] font-medium text-gray-500 bg-black/[0.06] px-3 py-1 rounded-full leading-tight">
                        {msg.text}
                      </span>
                    </div>
                  );
                }

                // ── Regular chat message ──
                return (
                  <div key={msg.id} className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-[15px] flex-shrink-0"
                      style={{ backgroundColor: msg.avatarColor }}
                    >
                      {msg.sender[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span
                          className="text-[14px] font-semibold"
                          style={{ color: msg.nameColor }}
                        >
                          {msg.sender}
                        </span>
                        <span className="text-[12px] text-gray-400">
                          {msg.time}
                        </span>
                      </div>
                      <p className="text-[14px] text-gray-800 leading-[1.55] mt-0.5">
                        {renderText(msg.text)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Bar */}
            <div
              className="px-4 py-3 flex-shrink-0 flex items-center gap-3 w-full"
              style={{ backgroundColor: "#F5F5F5" }}
            >
              <div
                className="flex items-center gap-3 rounded-full px-4 py-3 w-full"
                style={{ backgroundColor: "#EBEBEB" }}
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && chatInput.trim()) setChatInput("");
                  }}
                  placeholder="Say something..."
                  className="flex-1 bg-transparent text-[14px] text-gray-700 placeholder:text-gray-400 outline-none min-w-0"
                  style={{ fontFamily: "inherit" }}
                />
              </div>
              <button
                onClick={() => {
                  if (chatInput.trim()) setChatInput("");
                }}
                className="h-12 w-12 rounded-full bg-black/80 flex items-center justify-center hover:bg-black transition-colors flex-shrink-0"
              >
                <Send size={25} strokeWidth={1.5} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </PlayerLayout>
  );
}
