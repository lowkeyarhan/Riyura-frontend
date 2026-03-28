"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import type { MouseEvent } from "react";
import { MediaType } from "@/src/props/global/mediaType";

type RecommendationCardProps = {
  title: string;
  posterUrl: string | null;
  rating?: number;
  year?: number;
  type: MediaType;
  seasons?: number;
  episodes?: number;
  reason: string;
  onClick: () => void;
  onRemove?: (e: MouseEvent<HTMLButtonElement>) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  onLongPress?: () => void;
};

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

const TYPE_CONFIG: Record<MediaType, { label: string; icon: React.ReactNode }> =
  {
    [MediaType.Movie]: { label: MediaType.Movie, icon: <MovieIcon /> },
    [MediaType.TV]: { label: MediaType.TV, icon: <TVIcon /> },
  };

export default function RecommendationCard({
  title,
  posterUrl,
  year,
  type,
  rating,
  reason,
  onClick,
  onRemove,
  onContextMenu,
  onLongPress,
}: RecommendationCardProps) {
  const normalizedType =
    (type as string).toLowerCase() === "movie" ? MediaType.Movie : MediaType.TV;
  const typeConfig =
    TYPE_CONFIG[normalizedType] ?? TYPE_CONFIG[MediaType.Movie];

  // Long-press detection for mobile
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(
    null,
  );
  const [isLongPressing, setIsLongPressing] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!onLongPress) return;
    setIsLongPressing(true);
    const timer = setTimeout(() => {
      if (navigator.vibrate) {
        navigator.vibrate(50); // Haptic feedback
      }
      onLongPress();
      setIsLongPressing(false);
    }, 500); // 500ms long press
    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    setIsLongPressing(false);
  };

  return (
    <div
      className={`
        group relative cursor-pointer rounded-xl overflow-hidden 
        bg-[#0f1115]
        border border-white/5 
        transition-all duration-300 
        shadow-md
        ${isLongPressing ? "scale-[0.98]" : ""}
      `}
      onClick={onClick}
      onContextMenu={onContextMenu}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchEnd}
    >
      {/* Image Container */}
      <div className="relative aspect-[2/3] overflow-hidden bg-[#0f1115]">
        <Image
          src={posterUrl ?? "/placeholder-image.jpg"}
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          className="object-cover transition-transform duration-500 group-hover:scale-102"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0f1115] via-[#0f1115]/60 to-transparent" />

        {/* Hover Action Overlay (Desktop) - Only Play button */}
        <div className="hidden md:flex absolute inset-0 bg-[#0f1115]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center z-20">
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
          </div>
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
        </div>

        {/* AI Reason - Below content info */}
        <div className="mt-3 pt-3 border-t border-white/5">
          <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">
            {reason}
          </p>
        </div>
      </div>
    </div>
  );
}
