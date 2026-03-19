import { TMDBBaseListItem, TMDBListResponse } from "./common";

// DTOs for TMDB list/search/discover endpoints.
// Used by `app/api/trending`, `app/api/trending-tv`,
// `app/api/search`, and `app/api/explore`,
// plus `app/search/page.tsx` and `app/explore/page.tsx`.

export type { TMDBListResponse };

export type TMDBTrendingMovie = TMDBBaseListItem;
export type TMDBTrendingTV = TMDBBaseListItem;
export type TMDBTrendingAnime = TMDBBaseListItem;

export interface TMDBSearchResult extends TMDBBaseListItem {
  media_type: "movie" | "tv";
}

// TMDB multi-search can also return people.
// We keep `TMDBSearchResult` limited to movie/tv because the UI cards and details pages
// are media-only, and the backend can expand people into related media items.
export interface TMDBPersonSearchResult {
  id: number;
  media_type: "person";
  name: string;
  original_name?: string;
  profile_path?: string | null;
  known_for_department?: string;
  popularity?: number;
  known_for?: Array<
    TMDBBaseListItem & {
      media_type?: "movie" | "tv";
    }
  >;
}

export type TMDBMultiSearchResult = TMDBSearchResult | TMDBPersonSearchResult;

export type TMDBDiscoverItem = TMDBBaseListItem;
