import { MediaType } from "../global/mediaType";

export enum SearchSortBy {
  POPULARITY_DESC = "POPULARITY_DESC",
  POPULARITY_ASC = "POPULARITY_ASC",
  RELEASE_DATE_DESC = "RELEASE_DATE_DESC",
  RELEASE_DATE_ASC = "RELEASE_DATE_ASC",
}

export const SEARCH_SORT_LABELS: Record<SearchSortBy, string> = {
  [SearchSortBy.POPULARITY_DESC]: "Most Popular",
  [SearchSortBy.POPULARITY_ASC]: "Least Popular",
  [SearchSortBy.RELEASE_DATE_DESC]: "Newest First",
  [SearchSortBy.RELEASE_DATE_ASC]: "Oldest First",
};

export interface SearchProp {
  description: string;
  media_type: MediaType;
  original_language: string;
  poster_path: string;
  release_year: string;
  title: string;
  tmdbId: number;
}
