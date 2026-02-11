"use client";

import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ProfileSkeleton() {
  return (
    <SkeletonTheme baseColor="#1a1d26" highlightColor="#2a2d36">
      <div className="min-h-screen bg-[#070910]">
        {/* Header / Cover */}
        <div className="relative h-48 md:h-64 w-full">
          <Skeleton height="100%" width="100%" borderRadius={0} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070910] to-transparent" />
        </div>

        {/* Profile Card */}
        <div className="relative z-10 px-6 md:px-16 -mt-20">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            <Skeleton circle width={120} height={120} />
            <div className="text-center md:text-left">
              <Skeleton width={200} height={32} className="mb-2" />
              <Skeleton width={160} height={18} />
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="px-6 md:px-16 mt-10">
          <div className="grid grid-cols-3 gap-4 max-w-lg">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-[#151821] rounded-xl p-4 border border-white/5"
              >
                <Skeleton width={40} height={28} className="mb-2" />
                <Skeleton width={60} height={16} />
              </div>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div className="px-6 md:px-16 mt-12 space-y-10 pb-20">
          {/* Watch History */}
          <div>
            <Skeleton width={180} height={28} className="mb-6" />
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="min-w-[160px] md:min-w-[200px] aspect-[2/3] rounded-xl overflow-hidden bg-[#1a1d26]"
                >
                  <Skeleton height="100%" containerClassName="h-full block" />
                </div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div>
            <Skeleton width={150} height={28} className="mb-6" />
            <div className="space-y-3 max-w-xl">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#151821] border border-white/5"
                >
                  <Skeleton circle width={40} height={40} />
                  <div className="flex-1">
                    <Skeleton width={140} height={18} className="mb-1" />
                    <Skeleton width={100} height={14} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
}
