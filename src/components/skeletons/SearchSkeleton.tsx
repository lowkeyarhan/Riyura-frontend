"use client";

import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { SearchCardSkeleton } from "./SearchCardSkeleton";

export default function SearchSkeleton() {
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
        {/* Search Bar Skeleton */}
        <div className="mb-8 md:mb-10">
          <div className="h-12 md:h-14 bg-white/10 rounded-lg w-full max-w-2xl animate-pulse" />
        </div>

        {/* Results Count Skeleton */}
        <div className="mb-6 md:mb-7">
          <div className="h-6 md:h-8 bg-white/10 rounded w-32 md:w-48 animate-pulse" />
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
