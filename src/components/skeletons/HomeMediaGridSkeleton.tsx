import React from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { MediaCardSkeleton } from "@/src/components/skeletons/MediaCardSkeleton";

function NowPlayingCardSkeleton() {
  return (
    <div className="min-w-[285px] sm:min-w-[330px] lg:min-w-[360px] aspect-video rounded-xl overflow-hidden bg-[#1a1d26]">
      <Skeleton height="100%" containerClassName="h-full block" />
    </div>
  );
}

export function HomeMediaGridSkeleton() {
  return (
    <SkeletonTheme baseColor="#1a1d26" highlightColor="#2a2d36">
      {/* Now Playing Section */}
      <section className="mt-10 md:mt-12">
        <div className="mb-5 md:mb-6">
          <Skeleton width={200} height={32} />
        </div>
        <div className="flex gap-4 md:gap-5 overflow-hidden pb-3">
          {[1, 2, 3, 4, 5].map((i) => (
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

      {/* Coming Soon Section */}
      <section className="mt-12 md:mt-16">
        <div className="mb-5 md:mb-6">
          <Skeleton width={200} height={32} />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <MediaCardSkeleton key={`c-${i}`} />
          ))}
        </div>
      </section>
    </SkeletonTheme>
  );
}
