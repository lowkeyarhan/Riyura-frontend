"use client";

import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ContinueWatchingSkeleton } from "./ContinueWatchingSkeleton";

export default function BannerSkeleton() {
  return (
    <SkeletonTheme baseColor="#1a1d26" highlightColor="#2a2d36">
      <div className="absolute inset-0 z-20">
        {/* Background shimmer */}
        <div className="absolute inset-0">
          <Skeleton
            height="100%"
            width="100%"
            borderRadius={0}
            containerClassName="block h-full w-full"
          />
        </div>

        {/* Bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

        {/* Content area — anchored to bottom left like real banner */}
        <div className="absolute bottom-0 left-0 w-full px-6 pb-16 md:px-20 md:pb-32 z-10">
          <div className="max-w-2xl">
            {/* HD badge */}
            <Skeleton
              width={48}
              height={28}
              borderRadius={20}
              className="mb-4"
            />

            {/* Title — large like the real one */}
            <Skeleton
              width="80%"
              height={64}
              className="mb-2 block"
              style={{ maxWidth: "500px" }}
            />
            <Skeleton
              width="50%"
              height={64}
              className="mb-4 block"
              style={{ maxWidth: "320px" }}
            />

            {/* Metadata pills row */}
            <div className="flex items-center gap-2 mb-4">
              <Skeleton width={60} height={20} borderRadius={4} />
              <Skeleton width={8} height={8} circle />
              <Skeleton width={45} height={20} borderRadius={4} />
              <Skeleton width={8} height={8} circle />
              <Skeleton width={70} height={20} borderRadius={4} />
              <Skeleton width={30} height={20} borderRadius={6} />
            </div>

            {/* Overview text */}
            <div className="max-w-3xl mb-7">
              <Skeleton width="100%" height={18} className="mb-1" />
              <Skeleton width="75%" height={18} />
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <Skeleton width={140} height={52} borderRadius={9999} />
              <Skeleton width={56} height={56} circle />
            </div>
          </div>
        </div>

        {/* Slide dots */}
        <div className="absolute inset-x-0 bottom-10 z-20 flex items-center justify-center gap-2 px-6 md:px-20">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton
              key={i}
              width={i === 1 ? 32 : 8}
              height={8}
              borderRadius={9999}
            />
          ))}
        </div>
      </div>
    </SkeletonTheme>
  );
}
