// Common TMDB DTOs shared across list + details domains.

// Used by list endpoints in `app/api/*` and list UIs.
export interface TMDBListResponse<T> {
  results: T[];
  page?: number;
  total_pages?: number;
  total_results?: number;
  status_message?: string;
}

// Base shape for list items returned by TMDB endpoints.
export interface TMDBBaseListItem {
  id: number;
  title?: string;
  name?: string;
  original_name?: string;
  original_language?: string;
  overview?: string;
  backdrop_path?: string | null;
  poster_path: string | null;
  genre_ids?: number[];
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: "movie" | "tv";
}

// Used by details pages and API detail endpoints.
export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBCompany {
  id: number;
  name: string;
  logo_path?: string | null;
}

export interface TMDBNetwork {
  id: number;
  name: string;
  logo_path?: string | null;
}

export interface TMDBCreatedBy {
  id: number;
  name: string;
  profile_path?: string | null;
}

export interface TMDBCastMember {
  id: number;
  name: string;
  character?: string;
  profile_path?: string | null;
}

export interface TMDBCreditsResponse {
  cast: TMDBCastMember[];
}
