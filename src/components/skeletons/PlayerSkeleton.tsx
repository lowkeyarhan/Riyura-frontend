"use client";

import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function PlayerSkeleton() {
  return (
    <SkeletonTheme baseColor="#1a1d26" highlightColor="#2a2d36">
      <div className="relative min-h-screen bg-black font-sans pt-24 md:pt-32">
        <div className="px-4 md:px-8 pb-12">
          {/* Player and Sidebar Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-9 gap-4 md:gap-6">
            {/* Main Player Area (9 columns) */}
            <div className="lg:col-span-6">
              {/* Video Player */}
              <div className="w-full bg-black aspect-video rounded-xl overflow-hidden mb-4">
                <Skeleton height={480} className="w-full h-full" />
              </div>

              {/* Player Controls Placeholder */}
              <div className="space-y-3 mb-8">
                <Skeleton height={6} className="w-full rounded-full" />
                <div className="flex gap-3">
                  <Skeleton width={100} height={30} />
                  <Skeleton width={80} height={30} />
                </div>
              </div>
            </div>

            {/* Sidebar (3 columns) */}
            <div className="lg:col-span-3 space-y-6">
              {/* Info Card */}
              <div className="bg-[#1518215f] border border-white/5 rounded-xl p-4">
                <Skeleton width="60%" height={24} className="mb-4" />
                <Skeleton width="40%" height={16} className="mb-3" />
                <Skeleton width="100%" height={16} />
              </div>

              {/* Server Selector */}
              <div className="bg-[#1518215f] border border-white/5 rounded-xl p-4">
                <Skeleton width="50%" height={20} className="mb-3" />
                <Skeleton height={36} className="w-full" />
              </div>

              {/* Seasons/Episodes (TV only) */}
              <div className="bg-[#1518215f] border border-white/5 rounded-xl p-4">
                <Skeleton width="50%" height={20} className="mb-3" />
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} height={32} className="w-full" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Below-Player Info Sections */}
          <div className="mt-10 space-y-8">
            {/* Story/Description Section */}
            <div>
              <Skeleton width={100} height={24} className="mb-4" />
              <div className="space-y-2">
                <Skeleton height={12} className="w-full" />
                <Skeleton height={12} width="95%" />
                <Skeleton height={12} width="90%" />
              </div>
            </div>

            {/* Cast Section */}
            <div>
              <Skeleton width={80} height={24} className="mb-4" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="text-center">
                    <Skeleton height={120} borderRadius={8} className="mb-2" />
                    <Skeleton width="70%" height={14} className="mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
}
