// DTOs for Watchlist page and related features

// Used by `app/watchlist/page.tsx` for watchlist item display
export interface WatchlistPageItem {
  id: number;
  dbId: number;
  type: "movie" | "tv";
  title: string;
  poster: string;
  year?: number;
  rating?: number;
  seasons?: number;
  episodes?: number;
}
