"use client";

import React from "react";
import { Play } from "lucide-react";

export const MediaCardSkeleton = () => {
  return (
    <div
      className="
        group relative cursor-pointer rounded-xl overflow-hidden 
        bg-[#0f111536]
        border border-white/5 
        transition-colors duration-300 
        shadow-md
      "
    >
      {/* Image Container */}
      <div className="relative aspect-[2/3] overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-20 animate-pulse" />

        {/* Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t bg-[#0f111536] via-[#0f111536]/60 to-transparent" />
      </div>

      {/* Content Info */}
      <div className="p-3 md:p-4">
        <div className="h-4 md:h-5 bg-white/10 rounded w-3/4 mb-2 animate-pulse" />
        <div className="flex items-center justify-between">
          <div className="h-3 bg-white/5 rounded w-16 animate-pulse" />
          <div className="h-3 bg-white/5 rounded w-12 animate-pulse" />
        </div>
      </div>
    </div>
  );
};
