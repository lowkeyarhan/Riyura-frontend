import { TMDBBaseListItem, TMDBListResponse } from "./common";

// DTOs for TMDB list/search/discover endpoints.
// Used by `app/api/trending`, `app/api/movies`, `app/api/trending-tv`,
// `app/api/trending-anime`, `app/api/search`, and `app/api/explore`,
// plus `app/search/page.tsx` and `app/explore/page.tsx`.

export type { TMDBListResponse };

export type TMDBTrendingMovie = TMDBBaseListItem;
export type TMDBTrendingTV = TMDBBaseListItem;
export type TMDBTrendingAnime = TMDBBaseListItem;

export interface TMDBSearchResult extends TMDBBaseListItem {
  media_type: "movie" | "tv";
}

export type TMDBDiscoverItem = TMDBBaseListItem;
