// DTOs for reusable UI component props

// Used by `src/components/media/MediaGrid.tsx`
export type MediaType = "movies" | "tvshows" | "anime";

export interface MediaGridProps {
  mediaType: MediaType;
  currentPage: number;
  itemsPerPage: number;
  onTotalItemsChange: (total: number) => void;
  initialItems?: any[];
}

// Used by `src/components/media/MediaCard.tsx`
export type MediaCardType = "movie" | "tv" | "anime";

export interface MediaCardProps {
  title: string;
  posterUrl: string;
  year?: number;
  rating?: number | null;
  type: MediaCardType;
  seasons?: number;
  episodes?: number;
  onClick: () => void;
  onRemove?: (e: React.MouseEvent) => void;
}

// Used by `src/components/ui/Pagination.tsx`
export interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

// Used by `src/components/media/Banner.tsx`
export interface BannerProps {
  initialMovies?: any[];
}
