"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import { Wifi, RefreshCcw, LogOut } from "lucide-react";

interface ServerProp {
  id: string;
  name: string;
  quality: string;
}

interface PartyHostControlsProps {
  servers: ServerProp[];
  activeServerIndex: number;
  onServerChange: (index: number) => void;
  onSync: () => Promise<unknown> | void;
  onLeave: () => void;
  title: string;
  subtitle: string;
  backdropPath: string | null;
  isHost: boolean;
}

export function PartyHostControls({
  servers,
  activeServerIndex,
  onServerChange,
  onSync,
  onLeave,
  title,
  subtitle,
  backdropPath,
  isHost,
}: PartyHostControlsProps) {
  const [syncing, setSyncing] = useState(false);

  const handleSync = useCallback(async () => {
    if (syncing) return;
    setSyncing(true);
    try {
      await onSync();
    } finally {
      setTimeout(() => setSyncing(false), 1500);
    }
  }, [onSync, syncing]);

  // Split servers: top servers go in the left column next to Now Playing.
  // The last server goes in the bottom row next to Sync and Leave.
  const topServers = servers.slice(0, Math.max(servers.length - 1, 1));
  const bottomServer = servers.length > 1 ? servers[servers.length - 1] : null;

  const bgSrc = backdropPath
    ? `https://image.tmdb.org/t/p/w200${backdropPath}`
    : "/landing-page/perf_card_3.png";

  return (
    <div className="flex flex-col gap-2.5 w-full flex-shrink-0">
      {/* Top Section */}
      <div className="grid grid-cols-2 gap-2.5 items-stretch">
        {/* Left Col: Server Buttons */}
        <div className="flex flex-col gap-2 justify-between">
          {topServers.map((s, i) => {
            const isActive = i === activeServerIndex;
            return (
              <button
                key={s.id}
                disabled={!isHost}
                onClick={() => onServerChange(i)}
                className={`transition-all rounded-full flex items-center justify-start p-2 gap-2.5 w-full border ${
                  isActive
                    ? "shadow-[0_0_15px_rgba(255,87,30,0.15)]"
                    : "border-white/5 shadow-inner hover:scale-[1.01]"
                } ${!isHost ? "cursor-not-allowed opacity-80" : ""}`}
                style={{
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(40px)",
                  WebkitBackdropFilter: "blur(40px)",
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                }}
              >
                <div
                  className={`w-12 h-12 rounded-full flex flex-shrink-0 items-center justify-center transition-colors shadow-inner ${
                    isActive
                      ? "bg-[#ff571e] text-white shadow-[0_0_10px_rgba(255,87,30,0.5)]"
                      : "bg-white/10 group-hover:bg-white/20 text-white"
                  }`}
                >
                  <Wifi size={22} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col text-left justify-center flex-1 min-w-0 pr-1">
                  <span className="text-[13px] text-white font-bold leading-tight tracking-wide truncate block">
                    {s.name}
                  </span>
                  <span
                    className={`text-[11px] font-medium leading-tight mt-0.5 tracking-wide block uppercase ${
                      isActive ? "text-[#ff571e]" : "text-white/50"
                    }`}
                  >
                    {s.quality}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Col: Now Playing Card (tall, matching left column height) */}
        <div
          className="rounded-[20px] border border-white/5 bg-white/4 p-4 flex flex-col justify-between relative overflow-hidden"
          style={{
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
          }}
        >
          <div className="flex flex-col gap-3 h-full justify-between">
            <div className="w-11 h-11 rounded-lg overflow-hidden relative flex-shrink-0 shadow-lg">
              <Image
                src={bgSrc}
                alt="now playing"
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <span className="text-white/40 text-[9px] uppercase tracking-wider font-bold">
                Now watching
              </span>
              <h3 className="text-white font-bold text-[13px] leading-snug truncate mt-0.5 tracking-wide">
                {title}
              </h3>
              <p className="text-[#ff571e] text-[10px] font-semibold mt-0.5">
                {subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-7 gap-2">
        {/* Bottom Server button */}
        {bottomServer ? (
          (() => {
            const bottomServerIndex = servers.length - 1;
            const isActive = bottomServerIndex === activeServerIndex;
            return (
              <button
                disabled={!isHost}
                onClick={() => onServerChange(bottomServerIndex)}
                className={`transition-all col-span-3 rounded-full flex items-center justify-start p-2 gap-2.5 w-full border ${
                  isActive
                    ? "bg-[#ff571e]/10 border-[#ff571e]/30 shadow-[0_0_15px_rgba(255,87,30,0.15)]"
                    : "border-white/5 shadow-inner hover:scale-[1.01]"
                } ${!isHost ? "cursor-not-allowed opacity-80" : ""}`}
                style={{
                  border: isActive
                    ? "1px solid rgba(255, 87, 30, 0.3)"
                    : "1px solid rgba(255, 255, 255, 0.05)",
                  boxShadow: isActive
                    ? "inset 0 1px 0 0 rgba(255, 255, 255, 0.1), 0 0 15px rgba(255,87,30,0.15)"
                    : "inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(40px)",
                  WebkitBackdropFilter: "blur(40px)",
                  backgroundColor: isActive
                    ? "rgba(255, 87, 30, 0.1)"
                    : "rgba(255, 255, 255, 0.03)",
                }}
              >
                <div
                  className={`w-12 h-12 rounded-full flex flex-shrink-0 items-center justify-center transition-colors shadow-inner ${
                    isActive
                      ? "bg-[#ff571e] text-white shadow-[0_0_10px_rgba(255,87,30,0.5)]"
                      : "bg-white/10 group-hover:bg-white/20 text-white"
                  }`}
                >
                  <Wifi size={22} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col text-left justify-center flex-1 min-w-0 pr-1">
                  <span className="text-[13px] text-white font-bold leading-tight tracking-wide truncate block">
                    {bottomServer.name}
                  </span>
                  <span
                    className={`text-[11px] font-medium leading-tight mt-0.5 tracking-wide block uppercase ${
                      isActive ? "text-[#ff571e]" : "text-white/50"
                    }`}
                  >
                    {bottomServer.quality}
                  </span>
                </div>
              </button>
            );
          })()
        ) : (
          <div
            className="rounded-full flex items-center justify-center text-[11px] text-white/20 border border-white/5 bg-white/3 min-h-[66px]"
            style={{
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)",
            }}
          >
            No server
          </div>
        )}

        {/* Sync & Leave Controls */}
        <div className="col-span-4 flex items-center gap-2 w-full">
          {/* Sync Button */}
          <button
            onClick={handleSync}
            disabled={syncing}
            className={`transition-all rounded-full flex items-center justify-start p-2 gap-2.5 flex-1 border ${
              syncing
                ? "bg-green-500/10 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.15)]"
                : "border-white/5 shadow-inner hover:scale-[1.01]"
            }`}
            style={{
              border: syncing
                ? "1px solid rgba(34, 197, 94, 0.3)"
                : "1px solid rgba(255, 255, 255, 0.05)",
              boxShadow: syncing
                ? "inset 0 1px 0 0 rgba(255, 255, 255, 0.1), 0 0 15px rgba(34,197,94,0.15)"
                : "inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)",
              backgroundColor: syncing
                ? "rgba(34, 197, 94, 0.1)"
                : "rgba(255, 255, 255, 0.03)",
            }}
          >
            <div
              className={`w-12 h-12 rounded-full flex flex-shrink-0 items-center justify-center transition-colors shadow-inner ${
                syncing
                  ? "bg-green-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                  : "bg-white/10 group-hover:bg-white/20 text-white"
              }`}
            >
              <RefreshCcw
                size={22}
                className={syncing ? "animate-spin" : ""}
                strokeWidth={2.5}
              />
            </div>
            <div className="flex flex-col text-left justify-center flex-1 min-w-0 pr-1">
              <span className="text-[13px] text-white font-bold leading-tight tracking-wide truncate block">
                Sync
              </span>
              <span
                className={`text-[11px] font-medium leading-tight mt-0.5 tracking-wide block uppercase ${
                  syncing ? "text-green-400" : "text-white/50"
                }`}
              >
                {syncing ? "Synced!" : "To Host"}
              </span>
            </div>
          </button>

          {/* Leave Button */}
          <button
            onClick={onLeave}
            className="transition-all rounded-full flex-shrink-0 flex items-center justify-center p-2 border border-white/5 shadow-inner hover:scale-[1.01] hover:bg-red-500/10 hover:border-red-500/30 aspect-square"
            style={{
              border: "1px solid rgba(255, 255, 255, 0.05)",
              boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)",
              backgroundColor: "rgba(255, 255, 255, 0.03)",
            }}
          >
            <div className="w-12 h-12 rounded-full  group-hover:bg-white/20 text-white flex flex-shrink-0 items-center justify-center transition-colors shadow-inner">
              <LogOut size={22} strokeWidth={2.5} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
