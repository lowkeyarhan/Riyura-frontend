import {
  MediaCardDTO,
  BannerCardDTO,
  MediaGridItem,
  BannerResponse,
} from "./card";

export interface HomeDashboardDTO {
  heroBanner: BannerCardDTO[];

  sections: {
    nowPlayingMovies: MediaCardDTO[];
    nowPlayingTV: MediaCardDTO[];

    trendingMovies: MediaCardDTO[];
    trendingTV: MediaCardDTO[];
    trendingAnime: MediaCardDTO[];

    popularMovies: MediaCardDTO[];
    popularTV: MediaCardDTO[];

    upcomingMovies: MediaCardDTO[];
    upcomingTV: MediaCardDTO[];
  };
}

// Home Page Initial Data Response: Used for pre-fetching home page data
export interface HomeInitialDataResponse {
  nowPlaying: {
    movie: { results: MediaGridItem[] };
    tv: { results: MediaGridItem[] };
    anime: { results: MediaGridItem[] };
  };
  trending: {
    movie: { results: MediaGridItem[] };
    tv: { results: MediaGridItem[] };
    anime: { results: MediaGridItem[] };
  };
  popular: {
    movie: { results: MediaGridItem[] };
    tv: { results: MediaGridItem[] };
    anime: { results: MediaGridItem[] };
  };
  comingSoon: {
    movie: { results: MediaGridItem[] };
    tv: { results: MediaGridItem[] };
    anime: { results: MediaGridItem[] };
  };
  bannerData: BannerResponse;
}
