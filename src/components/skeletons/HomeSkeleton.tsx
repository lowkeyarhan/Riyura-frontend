"use client";

import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import BannerSkeleton from "./BannerSkeleton";
import { MediaCardSkeleton } from "./MediaCardSkeleton";
import { ContinueWatchingSkeleton } from "./ContinueWatchingSkeleton";

function NowPlayingCardSkeleton() {
  return (
    <div className="relative min-w-[285px] sm:min-w-[330px] lg:min-w-[360px] aspect-[16/9] rounded-xl overflow-hidden bg-[#1a1d26]">
      <Skeleton height="100%" containerClassName="h-full block" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
        <Skeleton width="70%" height={24} className="mb-2" />
        <Skeleton width="40%" height={16} />
      </div>
    </div>
  );
}

export default function HomeSkeleton() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-pink-500 selection:text-white">
      {/* Banner Skeleton Section */}
      <section className="relative w-full bg-black pb-8 md:pb-10">
        <div className="relative w-full h-[90vh] min-h-[560px] md:h-screen bg-black overflow-hidden">
          <BannerSkeleton />
        </div>

        {/* Continue Watching Skeleton */}
        <SkeletonTheme baseColor="#1a1d26" highlightColor="#2a2d36">
          <div className="relative z-20 px-6 md:px-20">
            <div className="border-t border-white/20 pt-5">
              <Skeleton width={220} height={32} className="mb-2" />
              <Skeleton width={180} height={20} className="mb-5 md:mb-6" />

              <div className="grid grid-flow-col auto-cols-[calc((100%_-_0.75rem)/1.5)] gap-3 overflow-x-auto pb-2 md:grid-flow-row md:auto-cols-auto md:grid-cols-3 md:gap-5 lg:grid-cols-5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <ContinueWatchingSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </SkeletonTheme>
      </section>

      {/* Main Content Area */}
      <div className="px-6 pb-16 pt-6 md:px-20 md:pt-8 relative z-10">
        <SkeletonTheme baseColor="#1a1d26" highlightColor="#2a2d36">
          {/* Tabs Filter Skeleton */}
          <div className="border-t border-white/15 pt-5">
            <div className="flex gap-6 md:gap-8">
              <Skeleton width={80} height={28} />
              <Skeleton width={100} height={28} />
              <Skeleton width={70} height={28} />
            </div>
          </div>

          {/* Now Playing Section */}
          <section className="mt-10 md:mt-12">
            <div className="mb-5 md:mb-6">
              <Skeleton width={200} height={32} />
            </div>
            <div className="flex gap-4 md:gap-5 overflow-hidden pb-3">
              {[1, 2, 3, 4].map((i) => (
                <NowPlayingCardSkeleton key={i} />
              ))}
            </div>
          </section>

          {/* Trending Section */}
          <section className="mt-12 md:mt-16">
            <div className="mb-5 md:mb-6">
              <Skeleton width={200} height={32} />
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-5 xl:grid-cols-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <MediaCardSkeleton key={`t-${i}`} />
              ))}
            </div>
          </section>

          {/* Popular Section */}
          <section className="mt-12 md:mt-16">
            <div className="mb-5 md:mb-6">
              <Skeleton width={200} height={32} />
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-5 xl:grid-cols-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <MediaCardSkeleton key={`p-${i}`} />
              ))}
            </div>
          </section>
        </SkeletonTheme>
      </div>
    </div>
  );
}
