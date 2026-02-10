// DTOs for Banner component and API

// Used by `app/api/banner/route.ts` and `src/components/media/Banner.tsx`
export interface BannerItem {
  id: number;
  title?: string;
  name?: string;
  original_name?: string;
  overview: string;
  backdrop_path: string;
  poster_path?: string | null;
  genre_ids?: number[];
  date?: string;
  adult?: boolean;
  vote_average?: number;
  contentType: "movie" | "tv";
}

// Used by `app/api/banner/route.ts` for API response
export interface BannerResponse {
  items: BannerItem[];
}
