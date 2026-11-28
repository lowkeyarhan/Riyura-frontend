import { MediaType } from "@riyura/props/global/mediaType";

export const getDetailsPath = (tmdbId: number, mediaType: MediaType): string =>
  mediaType === MediaType.Movie
    ? `/details/movie/${tmdbId}`
    : `/details/tvshow/${tmdbId}`;
