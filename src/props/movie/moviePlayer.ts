export interface MoviePlayerProp {
  tmdbId: number;
  title: string;
  genres: string[];
  overview: string;
  is_anime: boolean;
  backdrop_path: string | null;
}
