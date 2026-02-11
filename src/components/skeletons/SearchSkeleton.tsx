"use client";

import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { MediaCardSkeleton } from "./MediaCardSkeleton";

export default function SearchSkeleton() {
  return (
    <SkeletonTheme baseColor="#1a1d26" highlightColor="#2a2d36">
      <div className="min-h-screen bg-[#0a0e1a] text-white pt-24 md:pt-32 px-4 md:px-16 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-12 max-w-5xl mx-auto">
          <Skeleton width="70%" height={48} className="mb-4 mx-auto" />
          <Skeleton width="80%" height={20} className="mx-auto" />
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="flex items-center gap-4 rounded-full bg-[#1a2332]/80 border border-white/10 px-4 py-3 md:px-6 md:py-4 shadow-lg">
            <Skeleton width={20} height={20} circle />
            <Skeleton width="100%" height={24} />
          </div>
        </div>

        {/* Results Grid */}
        <div className="w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {Array.from({ length: 15 }).map((_, i) => (
              <MediaCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
}
