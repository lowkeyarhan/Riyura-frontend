export interface HistorySaveRequest {
  tmdbId: number;
  mediaType: string;
  providerId?: string | null;
  durationSec?: number;
  seasonNumber?: number;
  episodeNumber?: number;
}

export interface HistoryDeleteRequest {
  tmdb_id: number;
  media_type: string;
}
