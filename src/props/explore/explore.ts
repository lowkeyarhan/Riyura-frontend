import { MediaType } from "../global/mediaType";

export interface ExploreProp {
  tmdbId: number;
  title: string;
  mediaType: MediaType;
  releaseYear: string;
  originalLanguage: string;
  rating: number;
  description: string;
  posterPath: string;
}