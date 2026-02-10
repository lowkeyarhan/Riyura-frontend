import { BannerItem } from "@/src/dto/banner";
import { MediaGridItem } from "@/src/dto/media-ui";

// DTOs for Home page and related components.

export interface HomeMediaSection {
  movie: { results: MediaGridItem[] };
  tv: { results: MediaGridItem[] };
  anime: { results: MediaGridItem[] };
}

// Used by `app/home/page.tsx` for client-side home data state.
export interface HomeInitialDataResponse {
  nowPlaying: HomeMediaSection;
  trending: HomeMediaSection;
  popular: HomeMediaSection;
  comingSoon: HomeMediaSection;
  bannerData: { items: BannerItem[] };
}
