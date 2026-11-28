import { Film, Tv, Sparkles } from "lucide-react";

export const EXPLORE_GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Music",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "War",
  "Western",
] as const;

export const EXPLORE_LANGUAGES = [
  { label: "All", value: "" },
  { label: "English", value: "en" },
  { label: "Japanese", value: "ja" },
  { label: "Spanish", value: "es" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Korean", value: "ko" },
  { label: "Hindi", value: "hi" },
  { label: "Portuguese", value: "pt" },
  { label: "Italian", value: "it" },
] as const;

export const EXPLORE_MEDIA_TYPES = [
  { label: "All", value: "all", icon: Sparkles },
  { label: "Movies", value: "movie", icon: Film },
  { label: "TV Shows", value: "tv", icon: Tv },
] as const;
