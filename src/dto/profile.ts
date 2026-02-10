// DTOs for Profile page UI components and data structures

// Used by `app/profile/page.tsx` for continue watching cards
export interface ContinueWatchingItem {
  id: number;
  tmdbId: number;
  title: string;
  progress: number;
  image: string;
  type: string;
  year: number | null;
  remaining: string;
  mediaType: "movie" | "tv";
  seasonNumber?: number;
  episodeNumber?: number;
  streamId?: string;
}

// Used by `app/profile/page.tsx` for watchlist cards display
export interface ProfileWatchlistItem {
  id: number;
  tmdb_id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string | null;
  media_type: "movie" | "tv";
  number_of_seasons?: number;
}

// Used by `app/profile/page.tsx` for AI recommendations display
export interface ProfileRecommendationItem {
  tmdb_id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string | null;
  media_type: "movie" | "tv";
  number_of_seasons?: number;
}
