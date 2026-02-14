"use client";

import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { SearchCardSkeleton } from "./SearchCardSkeleton";

export default function ExploreSkeleton() {
  return (
    <div className="relative min-h-screen bg-black pt-20 md:pt-28 px-4 sm:px-6 md:px-16 lg:px-16 pb-20 md:pb-12 font-sans">
      {/* --- STATIC BACKGROUND LAYER  --- */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-[#155f75b5] blur-[130px] opacity-40" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-[#9a341299] blur-[130px] opacity-30 mix-blend-screen" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,#000000_100%)]" />
      </div>

      <div className="relative z-10">
        {/* Title */}
        <div className="mb-8 md:mb-10">
          <div className="h-10 md:h-16 bg-white/10 rounded-lg w-48 md:w-64 animate-pulse" />
        </div>

        {/* Media Type Toggle */}
        <div className="mb-6 md:mb-7">
          <div className="inline-flex items-center rounded-xl border border-white/10 bg-[#131722]/80 p-1 gap-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-9 w-20 md:w-28 bg-white/5 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* Genre Selector */}
        <div className="mb-8 md:mb-9 border-b border-white/10">
          <div className="flex items-center gap-4 md:gap-7 overflow-x-auto scrollbar-hide pb-2 md:pb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="h-5 md:h-7 bg-white/10 rounded w-16 md:w-24 whitespace-nowrap animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {Array.from({ length: 18 }).map((_, i) => (
            <SearchCardSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
