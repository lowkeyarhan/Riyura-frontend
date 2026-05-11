export interface TvPlayerEpisode {
  air_date: string;
  episode_number: number;
  name: string;
  overview: string;
  still_path: string | null;
}

export interface TvPlayerSeason {
  air_date: string;
  episode_count: number;
  episodes: TvPlayerEpisode[] | null;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
}

export interface TvPlayerProp {
  genres: string[];
  is_anime: boolean;
  overview: string;
  seasons: TvPlayerSeason[];
  title: string;
  tmdbId: number;
  backdrop_path: string | null;
}
