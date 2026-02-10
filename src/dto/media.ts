// DTOs for media-related database operations and interactions

// Used by `src/lib/db/database.ts` for media type classification
export type MediaType = "movie" | "tv";

// Used by `src/lib/db/database.ts` for adding items to watchlist
export interface WatchlistPayload {
  tmdb_id: number;
  title: string;
  media_type: MediaType;
  poster_path: string | null;
  release_date: string | null;
  vote: number | null;
  number_of_seasons?: number | null;
  number_of_episodes?: number | null;
}

// Used by `src/lib/db/database.ts` for adding items to watch history
export interface WatchHistoryPayload {
  tmdb_id: number;
  title: string;
  media_type: MediaType;
  poster_path: string | null;
  release_date: string | null;
  duration_sec: number | null;
}

// Used by `src/lib/db/database.ts` return types for watchlist queries
export interface WatchlistItem {
  id: number;
  user_id: string;
  tmdb_id: number;
  title: string;
  media_type: MediaType;
  poster_path: string | null;
  release_date: string | null;
  vote: number | null;
  number_of_seasons: number | null;
  number_of_episodes: number | null;
  added_at: string;
}

// Used by `src/lib/db/database.ts` return types for watch history queries
export interface WatchHistoryItem {
  id: number;
  user_id: string;
  tmdb_id: number;
  title: string;
  media_type: MediaType;
  poster_path: string | null;
  release_date: string | null;
  duration_sec: number | null;
  watched_at: string;
}
