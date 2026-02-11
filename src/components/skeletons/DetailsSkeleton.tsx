"use client";

import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function DetailsSkeleton() {
  return (
    <SkeletonTheme baseColor="#1a1d26" highlightColor="#2a2d36">
      <div className="min-h-screen bg-black pt-24 md:pt-32">
        {/* Backdrop Hero Section */}
        <div className="relative w-full h-[50vh] md:h-[60vh] mb-8 md:mb-12">
          <Skeleton height="100%" className="w-full" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/30 to-black" />
        </div>

        {/* Content Container */}
        <div className="px-4 md:px-16 pb-20">
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 md:-mt-32">
            {/* Poster Card */}
            <div className="shrink-0 w-40 md:w-56 mx-auto md:mx-0">
              <div className="rounded-xl overflow-hidden shadow-2xl bg-[#1a1d26] aspect-[2/3]">
                <Skeleton height="100%" className="w-full h-full" />
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1">
              {/* Title */}
              <Skeleton width="80%" height={40} className="mb-4" />

              {/* Metadata Badges */}
              <div className="flex flex-wrap gap-3 mb-6">
                <Skeleton width={70} height={24} borderRadius={4} />
                <Skeleton width={70} height={24} borderRadius={4} />
                <Skeleton width={70} height={24} borderRadius={4} />
                <Skeleton width={70} height={24} borderRadius={4} />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mb-8">
                <Skeleton width={130} height={44} borderRadius={8} />
                <Skeleton width={130} height={44} borderRadius={8} />
                <Skeleton width={60} height={44} borderRadius={8} />
              </div>

              {/* Overview/Description */}
              <div className="mb-10">
                <Skeleton width={120} height={22} className="mb-3" />
                <div className="space-y-2">
                  <Skeleton height={14} className="w-full" />
                  <Skeleton height={14} width="95%" />
                  <Skeleton height={14} width="90%" />
                  <Skeleton height={14} width="85%" />
                </div>
              </div>

              {/* Additional Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i}>
                    <Skeleton width={100} height={16} className="mb-2" />
                    <Skeleton width="80%" height={14} />
                  </div>
                ))}
              </div>

              {/* Cast Section */}
              <div>
                <Skeleton width={100} height={22} className="mb-4" />
                <div className="flex overflow-x-auto gap-4 pb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex-shrink-0 text-center w-24">
                      <Skeleton
                        width={96}
                        height={96}
                        borderRadius={8}
                        className="mb-2"
                      />
                      <Skeleton width="100%" height={12} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
}
