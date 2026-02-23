import { MediaType } from "../global/mediaType";

export interface BannerProp {
  tmdbId: number;
  title: string;
  overview: string;
  backdrop_path: string;
  contentType: MediaType;
  genres: string[];
  adult: string;
  year: string;
}
