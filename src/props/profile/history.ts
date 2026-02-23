import { MediaType } from "../global/mediaType";

export interface HistoryProp {
  tmdbId: number;
  title: string;
  backdropPath: string | null;
  mediaType: MediaType;
  providerId: string | null;
  durationSec: number | null;
  episodeLength: number | null;
  episodeName: string | null;
  episodeNumber: number | null;
  seasonNumber: number | null;
  isAnime: boolean | null;
  releaseYear: number | null;
}
