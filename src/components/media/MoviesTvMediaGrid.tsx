"use client";

import React from "react";
import Image from "next/image";
import MediaCard from "@/src/components/media/MediaCard";
import { MediaGridItem } from "@/src/dto/ui/card";

interface MoviesTvMediaGridProps {
  mediaType: "movie" | "tv";
  nowPlaying: MediaGridItem[];
  trending: MediaGridItem[];
  popular: MediaGridItem[];
  comingSoon: MediaGridItem[];
  onCardClick: (item: MediaGridItem) => void;
}

const POSTER_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w780";

const getTitle = (item: MediaGridItem) => item.title || item.name || "Untitled";

const getYearNumber = (item: MediaGridItem) => {
  const rawDate = item.release_date || item.first_air_date;
  if (!rawDate) return undefined;
  const date = new Date(rawDate);
  const year = date.getFullYear();
  return Number.isNaN(year) ? undefined : year;
};

const getYearText = (item: MediaGridItem) => {
  const year = getYearNumber(item);
  return year ? `${year}` : "N/A";
};

const getMediaLabel = (mediaType: MoviesTvMediaGridProps["mediaType"]) =>
  mediaType === "movie" ? "Movie" : "TV Show";

const getNowPlayingImageUrl = (item: MediaGridItem) => {
  if (item.poster_path) return `${BACKDROP_IMAGE_BASE_URL}${item.poster_path}`;
  return "/placeholder-image.jpg";
};

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-5 md:mb-6">
      <h2
        className="text-2xl md:text-3xl font-bold text-white tracking-tight"
        style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="mt-2 text-sm md:text-base text-white/60"
          style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

function NowPlayingCard({
  item,
  mediaType,
  onClick,
}: {
  item: MediaGridItem;
  mediaType: MoviesTvMediaGridProps["mediaType"];
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative min-w-[285px] sm:min-w-[330px] lg:min-w-[360px] aspect-[16/9] overflow-hidden rounded-xl border border-white/10 cursor-pointer hover:border-white/40 bg-black/40 text-left transition-all duration-300"
    >
      <Image
        src={getNowPlayingImageUrl(item)}
        alt={getTitle(item)}
        fill
        sizes="(max-width: 768px) 85vw, (max-width: 1280px) 40vw, 25vw"
        className="object-cover transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
        <p
          className="mt-2.5 truncate text-lg md:text-xl font-bold text-white"
          style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
        >
          {getTitle(item)}
        </p>
        <p className="mt-1 text-xs md:text-sm text-white/65">
          {getMediaLabel(mediaType)} • {getYearText(item)}
        </p>
      </div>
    </button>
  );
}

function GridSection({
  title,
  items,
  mediaType,
  onCardClick,
}: {
  title: string;
  items: MediaGridItem[];
  mediaType: MoviesTvMediaGridProps["mediaType"];
  onCardClick: (item: MediaGridItem) => void;
}) {
  return (
    <section className="mt-12 md:mt-16">
      <SectionHeader title={title} />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-5 xl:grid-cols-6">
        {items.map((item) => {
          const posterUrl = item.poster_path
            ? `${POSTER_IMAGE_BASE_URL}${item.poster_path}`
            : "/placeholder-image.jpg";

          return (
            <MediaCard
              key={`${item.id}-${mediaType}`}
              title={getTitle(item)}
              posterUrl={posterUrl}
              year={getYearNumber(item)}
              rating={item.vote_average}
              type={mediaType === "movie" ? "Movie" : "TV"}
              onClick={() => onCardClick(item)}
            />
          );
        })}
      </div>
    </section>
  );
}

export default function MoviesTvMediaGrid({
  mediaType,
  nowPlaying,
  trending,
  popular,
  comingSoon,
  onCardClick,
}: MoviesTvMediaGridProps) {
  return (
    <>
      <section className="mt-10 md:mt-12">
        <SectionHeader
          title="Now Playing"
          subtitle="Latest releases in theaters and on TV today"
        />
        <div className="flex gap-4 md:gap-5 overflow-x-auto pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {nowPlaying.map((item) => (
            <NowPlayingCard
              key={`${item.id}-${mediaType}`}
              item={item}
              mediaType={mediaType}
              onClick={() => onCardClick(item)}
            />
          ))}
        </div>
      </section>

      <GridSection
        title="Trending Now"
        items={trending}
        mediaType={mediaType}
        onCardClick={onCardClick}
      />
      <GridSection
        title="Most Popular"
        items={popular}
        mediaType={mediaType}
        onCardClick={onCardClick}
      />
      <GridSection
        title="Coming Soon"
        items={comingSoon}
        mediaType={mediaType}
        onCardClick={onCardClick}
      />
    </>
  );
}
