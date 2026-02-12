"use client";

import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Footer from "@/src/components/layout/Footer";

export default function DetailsSkeleton() {
  return (
    <SkeletonTheme baseColor="#1a1d26" highlightColor="#2a2d36">
      <div>
        {/* Hero Backdrop Section */}
        <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
          {/* Backdrop shimmer */}
          <div className="absolute inset-0">
            <Skeleton
              height="100%"
              width="100%"
              borderRadius={0}
              containerClassName="block h-full w-full"
            />
          </div>

          {/* Gradient overlay matching actual page */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)",
            }}
          />

          {/* Hero content at bottom */}
          <div className="relative h-full flex flex-col justify-end px-4 md:px-16 lg:px-20 md:pb-12">
            <div className="max-w-3xl">
              {/* Title */}
              <Skeleton
                width="70%"
                height={48}
                className="mb-4"
                style={{ maxWidth: "600px" }}
              />

              {/* Tagline */}
              <Skeleton
                width="50%"
                height={20}
                className="mb-6"
                style={{ maxWidth: "400px" }}
              />

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <Skeleton width={120} height={48} borderRadius={9999} />
                <Skeleton width={140} height={48} borderRadius={9999} />
                <Skeleton width={48} height={48} circle />
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="relative px-4 md:px-16 py-8 md:py-16 space-y-8">
          {/* Overview & Info Grid */}
          <section className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Overview */}
              <div className="p-4 bg-[#3a404f60] md:bg-[#1518215f] border border-white/5 rounded-2xl">
                <Skeleton width={120} height={32} className="mb-4 md:mb-6" />
                <div className="space-y-2">
                  <Skeleton height={16} width="100%" />
                  <Skeleton height={16} width="95%" />
                  <Skeleton height={16} width="90%" />
                  <Skeleton height={16} width="85%" />
                </div>
              </div>

              {/* Info metadata */}
              <div className="p-4 bg-[#3a404f60] md:bg-[#1518215f] border border-white/5 rounded-2xl space-y-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <React.Fragment key={i}>
                    <div className="flex items-start justify-between gap-4">
                      <Skeleton width={100} height={16} />
                      <Skeleton width={120} height={16} />
                    </div>
                    {i < 6 && <div className="h-px bg-white/10" />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>

          {/* Cast Section */}
          <section className="p-4 bg-[#3a404f60] md:bg-[#1518215f] border border-white/5 rounded-2xl">
            <Skeleton width={80} height={32} className="mb-6" />

            {/* Mobile: Vertical List */}
            <div className="md:hidden space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton width={64} height={64} circle />
                  <div className="flex-1">
                    <Skeleton width="60%" height={18} className="mb-2" />
                    <Skeleton width="40%" height={14} />
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: Horizontal Scroll */}
            <div className="hidden md:block overflow-hidden">
              <div className="flex gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex-shrink-0 w-[180px]">
                    <Skeleton
                      height={270}
                      borderRadius={12}
                      containerClassName="block"
                      className="rounded-t-xl"
                    />
                    <div className="rounded-b-2xl p-4 space-y-2">
                      <Skeleton height={16} width="90%" />
                      <Skeleton height={14} width="70%" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Similar/More Like This Section */}
          <section>
            <Skeleton width={180} height={32} className="mb-6 md:mb-8" />
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="rounded-2xl overflow-hidden">
                  <Skeleton
                    height={240}
                    containerClassName="block aspect-[2/3]"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </SkeletonTheme>
  );
}
