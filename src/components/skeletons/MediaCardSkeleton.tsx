"use client";

import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const MediaCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-[#1a1d26]">
        <Skeleton
          height="100%"
          className="absolute inset-0"
          containerClassName="h-full block"
        />
      </div>
      <div className="space-y-2">
        <Skeleton width="85%" height={24} />
        <div className="flex items-center gap-3">
          <Skeleton width={40} height={16} />
          <Skeleton width={16} height={16} circle />
          <Skeleton width={60} height={16} />
        </div>
      </div>
    </div>
  );
};
