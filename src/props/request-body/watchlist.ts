export interface WatchlistAddRequest {
  tmdb_id: number;
  media_type: string;
}

export interface WatchlistRemoveRequest {
  tmdb_id: number;
  media_type: string;
}
