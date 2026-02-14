import { MediaCardDTO } from "./card";

export interface CastMemberDTO {
  id: number;
  name: string;
  character: string;
  profileUrl: string | null;
}

export interface VideoDTO {
  id: string; // YouTube ID
  name: string;
  site: "YouTube" | "Vimeo";
  type: "Trailer" | "Teaser" | "Clip";
}

export interface SeasonDTO {
  id: number;
  name: string;
  seasonNumber: number;
  episodeCount: number;
  posterUrl: string | null;
  airDate: string; // "2024"
}

export interface MediaDetailsDTO {
  // Core Info
  id: number;
  tmdbId: number;
  title: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  overview: string;

  // Pre-formatted Metadata
  tagline: string | null;
  rating: number;
  runtime: string; // "2h 15m"
  releaseDate: string; // "20 Feb 2024"
  status: string; // "Released"

  // Lists
  genres: string[]; // ["Action", "Drama"]
  production: string[]; // ["Marvel Studios"]

  // Financials (Pre-formatted)
  budget: string; // "$200M" or "N/A"
  revenue: string; // "$1.2B" or "N/A"

  // Relations
  cast: CastMemberDTO[];
  similar: MediaCardDTO[];
  trailer: VideoDTO | null;

  // TV Specific
  seasons?: SeasonDTO[];
}
