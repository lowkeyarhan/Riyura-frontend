"use client";

import React from "react";
import Skeleton from "react-loading-skeleton";

export const ContinueWatchingSkeleton = () => {
  return (
    <div className="w-full">
      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-black/40">
        <Skeleton
          height="100%"
          containerClassName="h-full block"
          className="absolute inset-0"
        />
      </div>

      {/* Progress Bar */}
      <div className="w-full mb-2 mt-2">
        <div className="w-full h-1 rounded-full bg-white/20 overflow-hidden">
          <Skeleton height={4} borderRadius={9999} className="!bg-white/10" />
        </div>
      </div>

      {/* Title */}
      <div className="mb-1">
        <Skeleton height={20} width="75%" style={{ lineHeight: 1.04 }} />
      </div>

      {/* Meta info */}
      <div className="mt-0.5">
        <Skeleton height={14} width="55%" />
      </div>
    </div>
  );
};

export const ContinueWatchingListSkeleton = () => {
  return (
    <div className="flex items-center gap-3 p-2 md:gap-5 md:p-4 bg-[#1518215f] border border-white/5 rounded-2xl overflow-hidden shadow-lg mb-4">
      {/* Image Container */}
      <div className="relative w-28 md:w-40 aspect-[3/2] md:aspect-video rounded-lg overflow-hidden bg-[#0f1115] flex-shrink-0">
        <Skeleton
          className="absolute inset-0"
          height="100%"
          containerClassName="w-full h-full block"
        />
      </div>

      {/* Content Info */}
      <div className="flex-1 min-w-0 pr-6 sm:pr-0">
        {/* Title */}
        <Skeleton height={20} width="80%" className="mb-2" />

        {/* Type & Year */}
        <div className="flex items-center gap-2 mb-2">
          <Skeleton width={50} height={16} />
          <Skeleton width={40} height={16} />
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2">
          <Skeleton width={70} height={14} />
          <Skeleton width={30} height={14} />
        </div>
      </div>
    </div>
  );
};
