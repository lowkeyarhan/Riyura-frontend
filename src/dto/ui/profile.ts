import { MediaCardDTO, ContinueWatchingDTO, RecommendationDTO } from "./card";

export interface UserProfileDTO {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  stats: {
    totalMovies: number;
    totalEpisodes: number;
    joinedDate: string;
  };
}

export interface ProfileDashboardDTO {
  user: UserProfileDTO;
  continueWatching: ContinueWatchingDTO[];
  watchlist: MediaCardDTO[];
  recommendations: RecommendationDTO[];
}

// Watch History Item: Database record from Supabase watch_history table
export interface WatchHistoryItem {
  id: number;
  tmdb_id: number;
  media_type: "movie" | "tv";
  title: string;
  poster_path?: string | null;
  duration_sec?: number | null;
  episode_length?: number | null;
  season_number?: number | null;
  episode_number?: number | null;
}

// Watch History Record: Complete database schema for watch history
export interface WatchHistoryRecord {
  id?: number;
  user_id: string;
  tmdb_id: number;
  media_type: "movie" | "tv";
  stream_id: string;
  title: string;
  poster_path?: string | null;
  release_date?: string | null;
  season_number?: number | null;
  episode_number?: number | null;
  episode_name?: string | null;
  episode_length?: number | null;
  duration_sec: number;
  watched_at: string;
}

// Gemini AI Recommendation Item (from Gemini API response)
export interface GeminiRecommendationItem {
  title: string;
  type: "movie" | "tv" | "anime";
  reason: string;
  genre: string;
}

// Gemini Recommendation Response (enriched with TMDB data)
export interface GeminiRecommendationResponse {
  tmdb_id: number;
  title: string;
  media_type: "movie" | "tv";
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string | null;
  number_of_seasons: number | null;
  number_of_episodes: number | null;
  reason: string;
  genre: string;
}

// Watchlist Page Item: Used in the watchlist page for displaying watchlist items
export interface WatchlistPageItem {
  id: number;
  dbId: number;
  type: "movie" | "tv";
  title: string;
  poster: string;
  year?: number;
  rating?: number;
  seasons?: number;
  episodes?: number;
}

// Notification Item: Used in notification context
export interface NotificationItem {
  id: string;
  message: string;
  type: "success" | "error";
}

// Notification Context Type: Used in notification context provider
export interface NotificationContextType {
  notifications: NotificationItem[];
  addNotification: (message: string, type: "success" | "error") => void;
  removeNotification: (id: string) => void;
}
