import { MediaType } from "../global/mediaType";

export interface SearchProp {
  description: string;
  media_type: MediaType;
  original_language: string;
  poster_path: string;
  release_year: string;
  title: string;
  tmdbId: number;
}
