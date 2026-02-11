"use client";

import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ProfileSkeleton() {
  return (
    <SkeletonTheme baseColor="#1a1d26" highlightColor="#2a2d36">
      <div className="relative min-h-screen bg-black text-white font-sans overflow-x-hidden">
        {/* --- BACKGROUND LAYERS --- */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-black" />
          <div className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-[#155f75b5] blur-[130px] opacity-40" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-[#9a341299] blur-[130px] opacity-30 mix-blend-screen" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,#000000_100%)]" />
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className="relative z-10 w-full h-full pt-20 md:pb-24 px-4 md:pt-32 pb-8 md:px-16 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start h-full">
            {/* --- LEFT COLUMN: Identity & Navigation --- */}
            <div className="lg:col-span-4 flex flex-col justify-between lg:sticky lg:top-32 h-fit">
              {/* Profile Card */}
              <div className="rounded-3xl p-4 md:p-6 relative shadow-2xl">
                <div className="relative flex flex-col items-center text-center mt-4">
                  {/* Avatar */}
                  <Skeleton circle width={112} height={112} className="mb-5" />

                  {/* Name */}
                  <Skeleton width={200} height={32} className="mb-1" />

                  {/* Email */}
                  <Skeleton width={180} height={16} className="mb-6 md:mb-8" />

                  {/* Stats */}
                  <div className="flex gap-2 md:gap-3 w-full mb-6 md:mb-8">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex-1 flex flex-col items-center p-4 rounded-2xl"
                      >
                        <Skeleton width={40} height={24} className="mb-2" />
                        <Skeleton width={52} height={10} />
                      </div>
                    ))}
                  </div>

                  {/* Sign Out Button - Desktop */}
                  <div className="hidden md:block w-full">
                    <Skeleton height={46} className="w-full rounded-xl" />
                  </div>

                  {/* Sign Out Button - Mobile */}
                  <div className="md:hidden w-full">
                    <Skeleton height={46} className="w-full rounded-xl" />
                  </div>
                </div>
              </div>

              {/* PREFERENCES - Desktop Only */}
              <div className="hidden lg:block space-y-3 mt-6 mb-2">
                <Skeleton width={120} height={12} className="mb-4" />
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-full rounded-xl p-4">
                    <div className="flex items-center gap-4">
                      <Skeleton width={40} height={40} className="rounded-lg" />
                      <div className="flex-1">
                        <Skeleton width={160} height={14} className="mb-2" />
                        <Skeleton width={120} height={12} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* --- RIGHT COLUMN: Content Feed --- */}
            <div className="lg:col-span-8 space-y-8 md:space-y-12 lg:overflow-y-auto lg:max-h-[calc(100vh-8rem)] scrollbar-hide">
              {/* Dashboard Title */}
              <div className="hidden md:flex flex-col items-start gap-1">
                <Skeleton width={280} height={48} className="mb-1" />
                <Skeleton width={250} height={18} />
              </div>

              {/* Continue Watching Section */}
              <section>
                <div className="flex items-center justify-between mb-4 md:mb-5">
                  <Skeleton width={180} height={22} />
                  <Skeleton width={80} height={14} />
                </div>
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="group relative flex items-center gap-3 p-2 md:gap-5 md:p-4 rounded-2xl"
                    >
                      <div className="relative w-28 md:w-40 aspect-[3/2] md:aspect-video rounded-lg overflow-hidden flex-shrink-0">
                        <Skeleton height="100%" className="w-full h-full" />
                        {/* Play button overlay area */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Skeleton
                            circle
                            width={32}
                            height={32}
                            className="md:w-10 md:h-10"
                          />
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
                          <Skeleton
                            width={60}
                            height={16}
                            className="rounded"
                          />
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
                        <Skeleton
                          circle
                          width={32}
                          height={32}
                          className="md:w-10 md:h-10"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Watchlist Section */}
              <section>
                <div className="flex items-center justify-between mb-4 md:mb-5">
                  <Skeleton width={120} height={22} />
                  <Skeleton width={70} height={14} />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="aspect-[2/3] rounded-xl overflow-hidden"
                    >
                      <Skeleton
                        height="100%"
                        containerClassName="h-full block"
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* Recommendations Section */}
              <section>
                <div className="flex items-center justify-between mb-4 md:mb-5">
                  <Skeleton width={200} height={22} />
                  <Skeleton width={80} height={14} />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="aspect-[2/3] rounded-xl overflow-hidden"
                    >
                      <Skeleton
                        height="100%"
                        containerClassName="h-full block"
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* Mobile Preferences + Sign Out */}
              <div className="lg:hidden space-y-8 pt-8">
                <div className="space-y-3">
                  <Skeleton width={120} height={12} className="mb-4" />
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-full rounded-xl p-4">
                      <div className="flex items-center gap-4">
                        <Skeleton
                          width={40}
                          height={40}
                          className="rounded-lg"
                        />
                        <div className="flex-1">
                          <Skeleton width={160} height={14} className="mb-2" />
                          <Skeleton width={120} height={12} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center">
                  <Skeleton width={200} height={46} className="rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:hidden relative z-10 px-4 pb-6">
          <div className="flex items-center justify-between">
            <Skeleton width={120} height={12} />
            <Skeleton width={80} height={12} />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
}
