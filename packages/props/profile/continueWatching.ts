import { MediaType } from "../global/mediaType";

export interface ContinueWatchingItem {
  id: number;
  tmdbId: number;
  title: string;
  progress: number;
  image: string;
  type: string;
  year: number | null;
  remaining: string;
  mediaType: MediaType;
  seasonNumber?: number | null;
  episodeNumber?: number | null;
  streamId: string;
}
