"use client";

import React from "react";
import MediaCard from "@/src/components/media/MediaCard";
import { MediaGridItem } from "@/src/dto/ui/card";

interface AnimeMediaGridProps {
  trending: MediaGridItem[];
  onCardClick: (item: MediaGridItem) => void;
}

const POSTER_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const getTitle = (item: MediaGridItem) => item.title || item.name || "Untitled";

const getYearNumber = (item: MediaGridItem) => {
  const rawDate = item.release_date || item.first_air_date;
  if (!rawDate) return undefined;
  const date = new Date(rawDate);
  const year = date.getFullYear();
  return Number.isNaN(year) ? undefined : year;
};

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
        {trending.map((item) => {
          const posterUrl = item.poster_path
            ? `${POSTER_IMAGE_BASE_URL}${item.poster_path}`
            : "/placeholder-image.jpg";

          return (
            <MediaCard
              key={`${item.id}-anime`}
              title={getTitle(item)}
              posterUrl={posterUrl}
              year={getYearNumber(item)}
              rating={item.vote_average}
              type={item.media_type === "movie" ? "Movie" : "TV"}
              onClick={() => onCardClick(item)}
            />
          );
        })}
      </div>
    </section>
  );
}
