// ============================================
// COMMON DTOs - Used by BOTH Backend and Frontend
// ============================================

// Media Types
export type MediaType = "movie" | "tv";

// ============================================
// MEDIA ITEM - Common DTO for all media cards/grids
// Used by: Home page, Explore, Search, etc.
// ============================================
export interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  media_type?: MediaType;
}

// ============================================
// WATCHLIST - Common DTOs
// ============================================

// Watchlist Item (Database + API Response)
export interface WatchlistItem {
  id: number;
  user_id?: string; // Optional for frontend
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

// Watchlist Add Request (POST body)
export interface WatchlistAddRequest {
  tmdb_id: number;
  title: string;
  media_type: MediaType;
  poster_path: string | null;
  release_date: string | null;
  vote: number | null;
  number_of_seasons?: number | null;
  number_of_episodes?: number | null;
}

// Watchlist Check Response
export interface WatchlistCheckResponse {
  exists: boolean;
}

// ============================================
// WATCH HISTORY - Common DTOs
// ============================================

// Watch History Item (Database + API Response)
export interface WatchHistoryItem {
  id: number;
  user_id?: string; // Optional for frontend
  tmdb_id: number;
  media_type: MediaType;
  stream_id: string;
  title: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  release_date: string | null;
  season_number?: number | null;
  episode_number?: number | null;
  episode_name?: string | null;
  episode_length?: number | null;
  duration_sec: number;
  watched_at: string;
}

// Watch History Add/Update Request (POST body)
export interface WatchHistoryAddRequest {
  tmdb_id: number;
  media_type: MediaType;
  stream_id: string;
  title: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  release_date: string | null;
  season_number?: number | null;
  episode_number?: number | null;
  episode_name?: string | null;
  episode_length?: number | null;
  duration_sec: number;
}

// ============================================
// PROFILE - Common DTOs
// ============================================

// Continue Watching Item
export interface ContinueWatchingItem {
  id: number;
  tmdbId: number;
  title: string;
  progress: number;
  image: string;
  type: string; // "Movie" or "S1 E2: Episode Name"
  year: number | null;
  remaining: string;
  mediaType: MediaType;
  seasonNumber?: number | null;
  episodeNumber?: number | null;
  streamId: string;
}

// Profile Stats
export interface ProfileStat {
  label: string;
  value: string;
}

// Profile Data (API Response)
export interface ProfileData {
  continueWatching: ContinueWatchingItem[];
  watchlist: WatchlistItem[];
  stats: ProfileStat[];
}
