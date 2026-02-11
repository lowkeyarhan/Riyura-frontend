// Media Types
export type MediaType = "movie" | "tv";

// Watchlist Database Item
export interface WatchlistDbItem {
  id: number;
  user_id: string;
  tmdb_id: number;
  media_type: MediaType;
  title: string;
  poster_path: string | null;
  release_date: string | null;
  vote: number | null;
  number_of_seasons?: number | null;
  number_of_episodes?: number | null;
  added_at: string;
}

// Watchlist Request (for adding items)
export interface WatchlistRequest {
  tmdb_id: number;
  title: string;
  media_type: MediaType;
  poster_path: string | null;
  release_date: string | null;
  vote: number | null;
  number_of_seasons?: number | null;
  number_of_episodes?: number | null;
}

// Watch History Database Item
export interface WatchHistoryDbItem {
  id: number;
  user_id: string;
  tmdb_id: number;
  media_type: MediaType;
  stream_id: string;
  title: string;
  poster_path: string | null;
  release_date: string | null;
  season_number?: number | null;
  episode_number?: number | null;
  episode_name?: string | null;
  episode_length?: number | null;
  duration_sec: number;
  watched_at: string;
}

// Watch History Request (for adding items)
export interface WatchHistoryRequest {
  tmdb_id: number;
  media_type: MediaType;
  stream_id: string;
  title: string;
  poster_path: string | null;
  release_date: string | null;
  season_number?: number | null;
  episode_number?: number | null;
  episode_name?: string | null;
  episode_length?: number | null;
  duration_sec: number;
}
