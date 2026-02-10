// DTOs for Gemini AI recommendation system

// Used by `app/api/gemini/recommendations/route.ts` for AI response parsing
export interface GeminiRecommendationItem {
  title: string;
  type: "movie" | "tv" | "anime";
  reason: string;
  genre: string;
}

// Used by `app/api/gemini/recommendations/route.ts` for processed recommendations response
export interface GeminiRecommendationResponse {
  tmdb_id: number;
  title: string;
  media_type: "movie" | "tv";
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string | null;
  number_of_seasons: number | null;
  reason: string;
  genre: string;
}
