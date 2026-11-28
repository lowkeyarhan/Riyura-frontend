import { MediaType } from "../global/mediaType";

export interface RecommendationProp {
  tmdbId: number;
  title: string;
  mediaType: MediaType;
  posterPath: string | null;
  year: number;
  reason: string;
}
