export type MediaType = "movie" | "tv";

export interface Movie {
  id: number;
  title?: string;
  name?: string;
  original_name?: string;
  overview: string;
  backdrop_path: string;
  poster_path?: string;
  genre_ids?: number[];
  release_date?: string;
  vote_average?: number;
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  backdrop_path: string;
  poster_path?: string;
  genre_ids?: number[];
  first_air_date?: string;
  vote_average?: number;
}

export interface MediaItem {
  id: number;
  tmdb_id: number;
  title: string;
  media_type: MediaType;
  poster_path: string | null;
  release_date: string | null;
}

export interface WatchlistItem extends MediaItem {
  user_id: string;
  vote: number | null;
  number_of_seasons: number | null;
  number_of_episodes: number | null;
  added_at: string;
}

export interface WatchHistoryItem extends MediaItem {
  user_id: string;
  duration_sec: number | null;
  stream_id?: string | null;
  season_number?: number | null;
  episode_number?: number | null;
  episode_name?: string | null;
  episode_length?: number | null;
  watched_at: string;
}
