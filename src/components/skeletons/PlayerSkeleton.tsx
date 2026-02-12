"use client";

import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function PlayerSkeleton() {
  return (
    <SkeletonTheme baseColor="#1a1d26" highlightColor="#2a2d36">
      <div className="min-h-screen w-full bg-black text-white font-sans flex flex-col">
        {/* Background layers (matching actual player) */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-black">
          <div className="absolute inset-0 bg-black" />
          <div className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-[#155f75b5] blur-[130px] opacity-40" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-[#9a341299] blur-[130px] opacity-30 mix-blend-screen" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,#000000_100%)]" />
        </div>

        {/* Main Content - Matching actual flex layout */}
        <div className="min-h-screen relative z-10 flex flex-col lg:flex-row pt-24 lg:pt-20 pb-4 px-4 gap-4">
          {/* LEFT: Video Player */}
          <div className="flex-1 flex flex-col rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 relative group aspect-video lg:aspect-auto bg-[#0a0b0f]">
            <div className="w-full h-full flex items-center justify-center">
              <Skeleton className="w-full h-full" />
            </div>
          </div>

          {/* RIGHT: Sidebar (Fixed width 24rem) */}
          <div className="w-full lg:w-[24rem] flex flex-col gap-4 h-auto lg:h-full lg:min-h-0">
            {/* 1. Info Header Card */}
            <div className="bg-[#1518215f] border border-white/5 rounded-3xl p-5 shadow-xl flex-shrink-0">
              {/* Title - larger and more prominent */}
              <div className="mb-3">
                <Skeleton height={32} className="w-[90%] mb-2" />
                <Skeleton height={32} className="w-[75%]" />
              </div>

              {/* Meta tags row - bigger to match actual */}
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0f1115] border border-white/5">
                  <Skeleton width={12} height={12} circle />
                  <Skeleton width={45} height={12} />
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0f1115] border border-white/5">
                  <Skeleton width={12} height={12} circle />
                  <Skeleton width={55} height={12} />
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-yellow-500/10 border border-yellow-500/20">
                  <Skeleton width={12} height={12} circle />
                  <Skeleton width={25} height={12} />
                </div>
              </div>

              {/* Genre tags - proper badge style */}
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                <span className="px-2 py-1 rounded bg-white/5 border border-white/5">
                  <Skeleton width={65} height={10} />
                </span>
                <span className="px-2 py-1 rounded bg-white/5 border border-white/5">
                  <Skeleton width={50} height={10} />
                </span>
                <span className="px-2 py-1 rounded bg-white/5 border border-white/5">
                  <Skeleton width={45} height={10} />
                </span>
              </div>
            </div>

            {/* 2. Server Selector (Flexible Height) */}
            <div className="bg-[#1518215f] border border-white/5 rounded-3xl p-5 shadow-xl overflow-hidden flex flex-col min-h-[200px] lg:flex-1 lg:min-h-0">
              {/* Section header with icon */}
              <div className="flex items-center gap-2 mb-4">
                <Skeleton width={14} height={14} />
                <Skeleton width={90} height={10} />
              </div>

              {/* Server rows - matching actual styling */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between w-full p-3 rounded-xl border transition-all ${i === 1
                      ? "bg-gradient-to-r from-orange-600/10 to-red-600/10 border-orange-500/50"
                      : "bg-[#29292930] border-white/5"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${i === 1 ? "bg-orange-600" : "bg-[#29292930]"
                          }`}
                      >
                        <Skeleton width={14} height={14} />
                      </div>
                      <Skeleton width={75} height={14} />
                    </div>
                    <Skeleton width={65} height={10} />
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Synopsis */}
            <div className="bg-[#1518215f] border border-white/5 rounded-3xl p-5 shadow-xl flex-shrink-0 max-h-none lg:max-h-[800px] overflow-y-auto">
              {/* Section header with icon */}
              <div className="flex items-center gap-2 mb-3">
                <Skeleton width={14} height={14} />
                <Skeleton width={75} height={10} />
              </div>

              {/* Synopsis text - more lines to match actual */}
              <div className="space-y-2 mb-4">
                <Skeleton height={14} className="w-full" />
                <Skeleton height={14} className="w-full" />
                <Skeleton height={14} className="w-[98%]" />
                <Skeleton height={14} className="w-full" />
                <Skeleton height={14} className="w-[95%]" />
                <Skeleton height={14} className="w-full" />
                <Skeleton height={14} className="w-[92%]" />
                <Skeleton height={14} className="w-[88%]" />
              </div>

              {/* Budget/Revenue section */}
              <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs">
                <div>
                  <Skeleton width={50} height={12} className="mb-2" />
                  <Skeleton width={55} height={12} />
                </div>
                <div className="text-right">
                  <Skeleton width={55} height={12} className="mb-2" />
                  <Skeleton width={60} height={12} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
}
