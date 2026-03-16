export const formatRuntime = (minutes: number): string => {
  if (!minutes || minutes <= 0) return "N/A";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

export const formatDate = (dateString: string): string =>
  new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const formatMoney = (value: number): string =>
  `$${(value / 1000000).toFixed(1)}M`;

import { MediaType } from "@/src/props/global/mediaType";

export const getDetailsPath = (tmdbId: number, mediaType: MediaType): string =>
  mediaType === MediaType.Movie
    ? `/details/movie/${tmdbId}`
    : `/details/tvshow/${tmdbId}`;
