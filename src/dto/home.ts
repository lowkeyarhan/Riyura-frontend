// DTOs for Home page and related components

// Used by `app/home/HomeClient.tsx` for initial server-side data
export interface HomeInitialData {
  movies: { results: any[] };
  tvShows: { results: any[] };
  anime: { results: any[] };
  bannerData: { results: any[] };
}
