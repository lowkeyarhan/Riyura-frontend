import { MediaType } from "./mediaType";

export interface MediaCardProp {
  tmdbId: number;
  title: string;
  poster_path: string;
  year: string;
  media_type: MediaType;
}
