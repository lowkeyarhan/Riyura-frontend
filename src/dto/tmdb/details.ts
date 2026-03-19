import {
  TMDBCompany,
  TMDBCreatedBy,
  TMDBCreditsResponse,
  TMDBGenre,
  TMDBNetwork,
} from "./common";

// DTOs for TMDB details/season endpoints.
// Used by `app/api/details/[type]/[id]`, and the details/player pages.

export interface TMDBSimilarMovie {
  id: number;
  title?: string;
  poster_path: string | null;
  vote_average: number;
}

export interface TMDBSimilarTV {
  id: number;
  name?: string;
  poster_path: string | null;
  vote_average: number;
}

export interface TMDBSimilarResponse<T> {
  results: T[];
}

export interface TMDBSeasonSummary {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  episode_count: number;
  air_date: string;
}

// Raw TMDB response for /movie/{id}.
export interface TMDBMovieDetails {
  id: number;
  title: string;
  backdrop_path: string | null;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  runtime: number;
  tagline: string;
  overview: string;
  budget: number;
  revenue: number;
  genres: TMDBGenre[];
  production_companies: TMDBCompany[];
}

// API response we return from `/api/details/movie/[id]`.
export interface TMDBMovieDetailsResponse extends TMDBMovieDetails {
  credits?: TMDBCreditsResponse;
  similar?: TMDBSimilarResponse<TMDBSimilarMovie>;
}

// Raw TMDB response for /tv/{id}.
export interface TMDBTVShowDetails {
  id: number;
  name: string;
  backdrop_path: string | null;
  poster_path: string | null;
  first_air_date: string;
  last_air_date?: string;
  vote_average: number;
  number_of_seasons: number;
  number_of_episodes: number;
  episode_run_time: number[];
  tagline: string;
  overview: string;
  genres: TMDBGenre[];
  production_companies: TMDBCompany[];
  networks: TMDBNetwork[];
  created_by?: TMDBCreatedBy[];
  seasons: TMDBSeasonSummary[];
}

// API response we return from `/api/details/tv/[id]`.
export interface TMDBTVShowDetailsResponse extends TMDBTVShowDetails {
  credits?: TMDBCreditsResponse;
  similar?: TMDBSimilarResponse<TMDBSimilarTV>;
}

export interface TMDBEpisode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  still_path: string | null;
  air_date: string;
  runtime: number | null;
}

export interface TMDBSeasonDetailsResponse {
  id: number;
  name: string;
  season_number: number;
  episodes: TMDBEpisode[];
}
