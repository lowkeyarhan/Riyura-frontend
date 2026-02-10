// DTOs used by frontend media UI components.
// Used by home media grid components and API routes.
export interface MediaGridItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  overview: string;
  media_type?: string;
}

// Used by `src/components/media/Banner.tsx` continue watching overlay cards.
export interface ContinueWatchingOverlayItem {
  id: number;
  tmdbId: number;
  title: string;
  image: string;
  progress: number;
  meta: string;
  remaining: string;
  mediaType: "movie" | "tv";
  seasonNumber?: number;
  episodeNumber?: number;
}
