"use client";

import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { MediaCardSkeleton } from "./MediaCardSkeleton";

export default function WatchlistSkeleton() {
  return (
    <SkeletonTheme baseColor="#1a1d26" highlightColor="#2a2d36">
      <div className="relative min-h-screen bg-black font-sans">
        {/* --- BACKGROUND LAYERS --- */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-black" />
          <div className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-[#155f75b5] blur-[130px] opacity-40" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-[#9a341299] blur-[130px] opacity-30 mix-blend-screen" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,#000000_100%)]" />
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className="relative z-10 px-4 md:px-16 lg:px-16 pt-24 md:pt-32 pb-12">
          {/* Title and Description */}
          <div className="mb-8 md:mb-12">
            <Skeleton
              height={60}
              width="40%"
              className="mb-4 rounded-lg bg-[#0f111536]"
            />
            <Skeleton
              height={24}
              width="60%"
              className="rounded-lg bg-[#0f111536]"
            />
          </div>

          {/* Tabs and Sort Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 border-b border-white/10 pb-4">
            {/* Filter Tabs */}
            <div className="flex gap-8">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton
                  key={i}
                  width={80}
                  height={20}
                  className="rounded-lg"
                />
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <Skeleton width={60} height={20} className="rounded-lg" />
              <Skeleton width={100} height={32} className="rounded-lg" />
            </div>
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <MediaCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
}
