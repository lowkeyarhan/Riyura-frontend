import { MediaType } from "../global/mediaType";
import type { MediaCardProp } from "../global/mediaCard";

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

export interface SearchProp extends MediaCardProp {
  description?: string;
  original_language?: string;
  release_year?: string;
}
