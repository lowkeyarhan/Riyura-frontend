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
    <div className="flex items-center gap-3 p-2 md:gap-5 md:p-4 bg-[#1518215f] border border-white/5 rounded-2xl mb-3">
      <div className="relative w-28 md:w-40 aspect-[3/2] md:aspect-video rounded-lg overflow-hidden flex-shrink-0">
        <Skeleton height="100%" className="w-full h-full" />
      </div>
      <div className="flex-1 py-1">
        <Skeleton width="60%" height={24} className="mb-2" />
        <Skeleton width="40%" height={16} className="mb-2" />
        <Skeleton width="30%" height={12} />
      </div>
    </div>
  );
}
