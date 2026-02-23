export interface TvDetailGenre {
  id: number;
  name: string;
}

export interface TvDetailProductionCompany {
  id?: number;
  name: string;
}

export interface TvDetailCast {
  character: string;
  original_name: string;
  profile_path: string | null;
}

export interface TvDetailCreatedBy {
  name: string;
}

export interface TvDetailNetwork {
  name: string;
}

export interface TvDetailSeason {
  air_date: string;
  episode_count: number;
  episodes: unknown | null;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
}

export interface TvDetailProp {
  adult: boolean;
  backdrop_path: string | null;
  budget: number | null;
  casts: TvDetailCast[];
  created_by: TvDetailCreatedBy[];
  first_air_date: string;
  genres: TvDetailGenre[];
  id: number;
  is_anime: boolean;
  name: string;
  networks: TvDetailNetwork[];
  origin_country: string[];
  original_language: string;
  overview: string;
  production_companies: TvDetailProductionCompany[];
  revenue: number | null;
  runtime: number;
  seasons: TvDetailSeason[];
  status: string;
  tagline: string;
  vote_average: number;
}
