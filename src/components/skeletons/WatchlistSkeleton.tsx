"use client";

import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { MediaCardSkeleton } from "./MediaCardSkeleton";

export default function WatchlistSkeleton() {
  return (
    <SkeletonTheme baseColor="#1a1d26" highlightColor="#2a2d36">
      <div className="relative min-h-screen bg-black font-sans pt-24 md:pt-32 px-4 md:px-16 pb-12">
        {/* Header Section */}
        <div className="text-center mb-10 md:mb-12">
          <Skeleton
            width="20%"
            height={48}
            className="mb-3 mx-auto rounded-xl"
          />
          <Skeleton width="30%" height={18} className="mx-auto rounded-xl" />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} width={90} height={40} borderRadius={20} />
          ))}
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 15 }).map((_, i) => (
            <MediaCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </SkeletonTheme>
  );
}
