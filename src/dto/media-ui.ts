// DTOs used by frontend media UI components.

// Used by `src/components/media/MediaGrid.tsx` and legacy grid components.
export interface MediaGridItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  overview: string;
  media_type?: string;
}

// Used by `src/components/media/Banner.tsx`.
export interface BannerMovie {
  id: number;
  title?: string;
  name?: string;
  original_name?: string;
  overview: string;
  backdrop_path: string;
  genre_ids?: number[];
}
