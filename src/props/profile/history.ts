import { MediaType } from "../global/mediaType";

export interface HistoryProp {
  id: number;
  tmdbId: number;
  title: string;
  mediaType: MediaType;
  streamId: string;
  backdropPath: string | null;
  releaseDate: string | null;
  durationSec: number | null;
  seasonNumber: number | null;
  episodeNumber: number | null;
  episodeName: string | null;
  episodeLength: number | null;
  watchedAt: string;
  isAnime: boolean | null;
}
