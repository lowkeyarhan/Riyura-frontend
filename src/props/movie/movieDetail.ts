export interface MovieDetailGenre {
  id: number;
  name: string;
}

export interface MovieDetailProductionCompany {
  id: number;
  name: string;
}

export interface MovieDetailCast {
  character: string;
  original_name: string;
  profile_path: string | null;
}

export interface MovieDetailProp {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string | null;
  budget: number;
  adult: boolean;
  genres: MovieDetailGenre[];
  production_companies: MovieDetailProductionCompany[];
  release_date: string;
  original_language: string;
  revenue: number;
  runtime: number;
  status: string;
  tagline: string;
  vote_average: number;
  casts: MovieDetailCast[];
  is_anime: boolean;
}
