import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { BannerItem, BannerResponse } from "@/src/dto/ui/card";
import {
  TMDBListResponse,
  TMDBTrendingMovie,
  TMDBTrendingTV,
} from "@/src/dto/tmdb/lists";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

type TMDBBannerMovie = TMDBTrendingMovie & { adult?: boolean };
type TMDBBannerTV = TMDBTrendingTV & { adult?: boolean };

const toYear = (value?: string): string | undefined => {
  if (!value) return undefined;
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return undefined;
  return parsedDate.getFullYear().toString();
};

const mapMovieToBannerItem = (movie: TMDBBannerMovie): BannerItem => ({
  id: movie.id,
  title: movie.title,
  name: movie.name,
  original_name: movie.original_name,
  overview: movie.overview || "",
  backdrop_path: movie.backdrop_path || "",
  poster_path: movie.poster_path,
  genre_ids: movie.genre_ids || [],
  date: toYear(movie.release_date || movie.first_air_date),
  adult: movie.adult ?? false,
  vote_average: movie.vote_average ?? 0,
  contentType: "movie",
});

const mapTVToBannerItem = (tv: TMDBBannerTV): BannerItem => ({
  id: tv.id,
  title: tv.title,
  name: tv.name,
  original_name: tv.original_name,
  overview: tv.overview || "",
  backdrop_path: tv.backdrop_path || "",
  poster_path: tv.poster_path,
  genre_ids: tv.genre_ids || [],
  date: toYear(tv.first_air_date || tv.release_date),
  adult: tv.adult ?? false,
  vote_average: tv.vote_average ?? 0,
  contentType: "tv",
});

const shuffleItems = (items: BannerItem[]) => {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
};

export async function GET() {
  try {
    const [moviesResponse, tvResponse] = await Promise.all([
      fetch(`${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`, {
        headers: { accept: "application/json" },
        cache: "no-store",
      }),
      fetch(`${TMDB_BASE_URL}/trending/tv/week?api_key=${TMDB_API_KEY}`, {
        headers: { accept: "application/json" },
        cache: "no-store",
      }),
    ]);

    if (!moviesResponse.ok || !tvResponse.ok) {
      throw new Error("Failed to fetch trending content");
    }

    const [moviesData, tvData] = await Promise.all([
      moviesResponse.json() as Promise<TMDBListResponse<TMDBBannerMovie>>,
      tvResponse.json() as Promise<TMDBListResponse<TMDBBannerTV>>,
    ]);

    const topMovies = Array.isArray(moviesData.results)
      ? moviesData.results.slice(0, 3).map(mapMovieToBannerItem)
      : [];

    const topTV = Array.isArray(tvData.results)
      ? tvData.results.slice(0, 3).map(mapTVToBannerItem)
      : [];

    const items = [...topMovies, ...topTV];
    shuffleItems(items);

    const response: BannerResponse = { items };

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error) {
    console.error("Banner API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch banner content" },
      { status: 500 },
    );
  }
}
