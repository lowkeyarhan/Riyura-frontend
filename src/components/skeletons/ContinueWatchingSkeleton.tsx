"use client";

import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export function ContinueWatchingSkeleton() {
  return (
    <div className="group w-full text-left">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-[#1a1d26]">
        <Skeleton height="100%" className="w-full h-full" />
      </div>

      {/* Progress Bar placeholder */}
      <div className="w-full mb-2 mt-2">
        <Skeleton height={4} className="w-full rounded-full" />
      </div>

      <Skeleton width="80%" height={18} className="mb-1" />
      <Skeleton width="40%" height={12} />
    </div>
  );
}

export function ContinueWatchingListSkeleton() {
  return (
    <div className="group relative flex items-center gap-3 p-2 md:gap-5 md:p-4 rounded-2xl">
      <div className="relative w-28 md:w-40 aspect-[3/2] md:aspect-video rounded-lg overflow-hidden flex-shrink-0">
        <Skeleton height="100%" className="w-full h-full" />
        {/* Play button overlay area */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton circle width={32} height={32} className="md:w-10 md:h-10" />
        </div>
        {/* Progress bar at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1">
          <Skeleton height={4} className="w-1/3" />
        </div>
      </div>
      <div className="flex-1 min-w-0 py-1 pr-6 sm:pr-0">
        {/* Title */}
        <Skeleton width="70%" height={20} className="mb-2" />
        {/* Type badge and year */}
        <div className="flex items-center gap-2 mb-2">
          <Skeleton width={60} height={16} className="rounded" />
          <Skeleton width={8} height={8} circle />
          <Skeleton width={40} height={12} />
        </div>
        {/* Progress info */}
        <div className="flex items-center gap-2 text-xs">
          <Skeleton width={80} height={10} />
          <Skeleton width={4} height={4} circle />
          <Skeleton width={60} height={10} />
        </div>
      </div>
      {/* Delete button */}
      <div className="absolute top-2 right-2 sm:static">
        <Skeleton circle width={32} height={32} className="md:w-10 md:h-10" />
      </div>
    </div>
  );
}
