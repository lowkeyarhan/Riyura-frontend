"use client";

import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ProfileSkeleton() {
  return (
    <SkeletonTheme baseColor="#1a1d26" highlightColor="#2a2d36">
      <div className="relative min-h-screen bg-black text-white font-sans overflow-x-hidden">
        {/* Background */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-black" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 w-full h-full pt-20 md:pb-24 px-4 md:pt-32 pb-8 md:px-16 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start h-full">
            {/* Left Column - Profile Card & Settings */}
            <div className="lg:col-span-4 flex flex-col justify-between lg:sticky lg:top-32 h-fit">
              {/* Profile Card */}
              <div className="bg-[#1518215f] border border-white/5 rounded-3xl p-4 md:p-6 relative shadow-2xl">
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
                        className="flex-1 flex flex-col items-center p-4 rounded-2xl bg-[#29292930] border border-white/5"
                      >
                        <Skeleton width={40} height={24} className="mb-1" />
                        <Skeleton width={50} height={12} />
                      </div>
                    ))}
                  </div>

                  {/* Sign Out Button */}
                  <div className="hidden md:block w-full">
                    <Skeleton height={50} borderRadius={12} />
                  </div>
                </div>
              </div>

              {/* Settings Links */}
              <div className="hidden lg:block space-y-3 mt-6 mb-2">
                <Skeleton width={120} height={16} className="mb-4 opacity-50" />
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-full bg-[#1518215f] border border-white/5 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-4">
                      <Skeleton width={40} height={40} borderRadius={8} />
                      <div className="flex-1">
                        <Skeleton width={140} height={16} className="mb-1" />
                        <Skeleton width={100} height={12} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="lg:col-span-8 space-y-8 md:space-y-12">
              {/* Dashboard Title */}
              <div className="hidden md:flex flex-col items-start gap-1">
                <Skeleton width="60%" height={48} className="mb-1" />
                <Skeleton width="40%" height={18} />
              </div>

              {/* Continue Watching Section */}
              <section>
                <div className="flex items-center justify-between mb-4 md:mb-5">
                  <Skeleton width={180} height={28} />
                </div>
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-2 md:gap-5 md:p-4 bg-[#1518215f] border border-white/5 rounded-2xl"
                    >
                      {/* Thumbnail */}
                      <div className="w-28 md:w-40 aspect-[3/2] md:aspect-video rounded-lg overflow-hidden flex-shrink-0">
                        <Skeleton
                          height="100%"
                          containerClassName="h-full block"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 py-1 pr-6 sm:pr-0">
                        <Skeleton width="70%" height={20} className="mb-2" />
                        <Skeleton width="40%" height={16} className="mb-2" />
                        <Skeleton width="50%" height={12} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Watchlist Section */}
              <section>
                <div className="flex items-center justify-between mb-4 md:mb-5">
                  <Skeleton width={150} height={28} />
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
                  <Skeleton width={200} height={28} />
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
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
}
