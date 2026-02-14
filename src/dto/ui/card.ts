export type UIMediaType = "movie" | "tv" | "anime";

// Base DTO for all card types, used in various UI components like media grids, banners, and recommendations.
export interface MediaCardDTO {
  id: number;
  tmdbId: number;
  title: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  rating: number;
  year: string;
  mediaType: UIMediaType;
  overview: string;
}

// Banner Card DTO: Used in the homepage banner component, which has a more detailed layout than regular media cards.
export interface BannerCardDTO extends MediaCardDTO {
  genres: string[];
  maturityRating: "A" | "U/A" | "U";
  date: string;
}

// CONTINUE WATCHING CARD: Used in History/Profile
export interface ContinueWatchingDTO extends MediaCardDTO {
  progressPercentage: number;
  remainingTime: string;
  meta: string;
  playedSeconds: number;
}

// Continue Watching Overlay Item: Used in Banner carousel continue watching overlay
export interface ContinueWatchingOverlayItem {
  id: number;
  tmdbId: number;
  title: string;
  image: string;
  progress: number;
  meta: string;
  remaining: string;
  mediaType: "movie" | "tv";
  seasonNumber?: number;
  episodeNumber?: number;
  streamId?: string;
}

// RECOMMENDATION CARD: Used for AI Suggestions
export interface RecommendationDTO extends MediaCardDTO {
  reason: string;
  matchScore?: number;
}

// Media Grid Item: Used by home page and media grid components for list views
export interface MediaGridItem {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  media_type?: "movie" | "tv";
}

// Banner Item: Used for homepage banner carousel
export interface BannerItem {
  id: number;
  title?: string;
  name?: string;
  original_name?: string;
  overview: string;
  backdrop_path: string;
  poster_path: string | null;
  genre_ids: number[];
  date?: string;
  adult: boolean;
  vote_average: number;
  contentType: "movie" | "tv";
}

// Banner API Response
export interface BannerResponse {
  items: BannerItem[];
}
