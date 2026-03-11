"use client";

import React from "react";
import MediaCard from "@/src/components/media/MediaCard";
import type { MediaCardProp } from "@/src/props/global/mediaCard";

interface AnimeMediaGridProps {
  trending: MediaCardProp[];
  onCardClick: (item: MediaCardProp) => void;
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-5 md:mb-6">
      <h2
        className="text-2xl md:text-3xl font-bold text-white tracking-tight"
        style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
      >
        {title}
      </h2>
    </div>
  );
}

export default function AnimeMediaGrid({
  trending,
  onCardClick,
}: AnimeMediaGridProps) {
  return (
    <section className="mt-10 md:mt-12">
      <SectionHeader title="Trending Now" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-5 xl:grid-cols-6">
        {trending.map((item) => (
          <MediaCard
            key={`${item.tmdbId}-${item.media_type}-anime`}
            item={item}
            onClick={() => onCardClick(item)}
          />
        ))}
      </div>
    </section>
  );
}
