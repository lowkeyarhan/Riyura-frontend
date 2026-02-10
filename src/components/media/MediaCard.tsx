"use client";

import React from "react";
import Image from "next/image";
import { Play, Sparkles, Star, Trash2 } from "lucide-react";
import { MediaCardProps, MediaCardType } from "@/src/dto/components";

const MovieIcon = () => (
  <svg
    className="w-5 h-5 text-white"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
    />
  </svg>
);

const TVIcon = () => (
  <svg
    className="w-5 h-5 text-white"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const TYPE_CONFIG: Record<
  MediaCardType,
  { label: string; icon: React.ReactNode }
> = {
  movie: { label: "Movie", icon: <MovieIcon /> },
  tv: { label: "TV", icon: <TVIcon /> },
  anime: { label: "Anime", icon: <Sparkles className="w-5 h-5 text-white" /> },
};

export default function MediaCard({
  title,
  posterUrl,
  year,
  rating,
  type,
  seasons,
  episodes,
  onClick,
  onRemove,
}: MediaCardProps) {
  const typeConfig = TYPE_CONFIG[type];
  const hasRemove = typeof onRemove === "function";

  return (
    <div
      className="
        group relative cursor-pointer rounded-xl overflow-hidden 
        bg-[#0f1115]
        border border-white/5 
        transition-colors duration-300 
        shadow-md
      "
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative aspect-[2/3] overflow-hidden bg-[#0f1115]">
        <Image
          src={posterUrl}
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          className="object-cover transition-transform duration-500 group-hover:scale-102"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0f1115] via-[#0f1115]/60 to-transparent" />

        {/* Hover Action Overlay (Desktop) */}
        <div className="hidden md:flex absolute inset-0 bg-[#0f1115]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center gap-4 z-20">
          <div className="flex flex-col items-center gap-2 scale-0 group-hover:scale-100 transition-transform duration-300 delay-75">
            <button
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:scale-110 transition-transform text-black"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              <Play className="w-5 h-5 ml-1 fill-black" />
            </button>
            <span className="text-xs font-medium text-white tracking-wide">
              Watch
            </span>
          </div>

          {hasRemove && (
            <div className="flex flex-col items-center gap-2 scale-0 group-hover:scale-100 transition-transform duration-300 delay-100">
              <button
                className="w-12 h-12 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 hover:border-red-600 hover:scale-110 transition-all text-red-500 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(e);
                }}
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <span className="text-xs font-medium text-red-400 tracking-wide">
                Remove
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content Info */}
      <div className="p-3 md:p-4">
        <h3 className="text-white text-sm md:text-lg font-semibold truncate group-hover:text-orange-500 transition-all duration-300">
          {title}
        </h3>
        <div className="flex items-center justify-between mt-1 mb-3 md:mb-0">
          <span className="text-xs md:text-sm text-gray-400">
            {typeConfig.label}
          </span>
          <span className="text-xs md:text-sm text-gray-400">
            {year || "Unknown Year"}
          </span>
          {/* {type === "tv" && (seasons || episodes) && (
            <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">
              {seasons ? `${seasons}S` : ""}
              {seasons && episodes ? " • " : ""}
              {episodes ? `${episodes}Ep` : ""}
            </span>
          )} */}
        </div>

        {/* Mobile Actions (Visible only on mobile) */}
        <div className="flex md:hidden items-center gap-2 mt-2 pt-2 border-t border-white/5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white/10 text-white text-xs font-semibold active:bg-white/20 transition-colors"
          >
            <Play className="w-3 h-3 fill-current" />
            Watch
          </button>
          {hasRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(e);
              }}
              className="flex items-center justify-center p-1.5 rounded-lg bg-red-500/10 text-red-500 active:bg-red-500/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
