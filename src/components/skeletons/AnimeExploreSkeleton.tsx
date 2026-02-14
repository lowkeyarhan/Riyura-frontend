"use client";

import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { MediaCardSkeleton } from "./MediaCardSkeleton";

export default function AnimeExploreSkeleton() {
  return (
    <SkeletonTheme baseColor="#1a1d26" highlightColor="#2a2d36">
      <div className="min-h-screen bg-black pt-20 md:pt-28 px-4 sm:px-6 md:px-16 lg:px-16 pb-20 font-sans">
        {/* Hero Section */}
        <div className="mb-8 md:mb-12 text-center">
          <Skeleton width="60%" height={48} className="mb-3 mx-auto" />
          <Skeleton width="50%" height={20} className="mx-auto" />
        </div>

        {/* Sticky Control Bar */}
        <div className="sticky top-16 md:top-24 z-30 bg-[#1518215f] backdrop-blur-xl border border-white/10 rounded-xl md:rounded-2xl p-3 mb-8 shadow-2xl">
          {/* Media Type Toggle */}
          <div className="flex items-center gap-8 px-2">
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} width={80} height={40} borderRadius={10} />
              ))}
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-8 bg-white/10" />

            {/* Genre Scroll */}
            <div className="hidden md:flex items-center gap-2 flex-1 overflow-hidden">
              <Skeleton width={100} height={20} borderRadius={4} />
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} width={70} height={32} borderRadius={8} />
              ))}
            </div>

            {/* Clear Button */}
            <Skeleton width={40} height={40} circle />
          </div>
        </div>

        {/* Trending Now Section - Only section for Anime */}
        <section className="mt-10 md:mt-12">
          <div className="mb-5 md:mb-6">
            <Skeleton width={180} height={32} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {Array.from({ length: 18 }).map((_, i) => (
              <MediaCardSkeleton key={i} />
            ))}
          </div>
        </section>
      </div>
    </SkeletonTheme>
  );
}
