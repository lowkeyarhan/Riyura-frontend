import { NextResponse } from "next/server";
import { getCachedData } from "@/src/lib/cache";
import { MediaGridItem } from "@/src/dto/ui/card";
import { TMDBBaseListItem, TMDBListResponse } from "@/src/dto/tmdb/common";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit");
  const maxItems = limit ? parseInt(limit) : 12;

  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing TMDB_API_KEY in environment variables" },
      { status: 500 },
    );
  }

  try {
    // Fetch both TV shows and movies with animation genre and Japanese language
    const [tvData, movieData] = await Promise.all([
      getCachedData(
        `anime:tv:discover`,
        async () => {
          const response = await fetch(
            `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&sort_by=popularity.desc&vote_count.gte=50&with_genres=16&with_original_language=ja&page=1`,
            {
              headers: { accept: "application/json" },
            },
          );
          if (!response.ok) throw new Error("Failed to fetch anime TV");
          return (await response.json()) as TMDBListResponse<TMDBBaseListItem>;
        },
        { ttl: 3600 },
      ),
      getCachedData(
        `anime:movie:discover`,
        async () => {
          const response = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&vote_count.gte=50&with_genres=16&with_original_language=ja&page=1`,
            {
              headers: { accept: "application/json" },
            },
          );
          if (!response.ok) throw new Error("Failed to fetch anime movies");
          return (await response.json()) as TMDBListResponse<TMDBBaseListItem>;
        },
        { ttl: 3600 },
      ),
    ]);

    // Combine results with media_type
    const tvResults = Array.isArray(tvData?.results)
      ? tvData.results.map((item) => ({ ...item, media_type: "tv" }))
      : [];
    const movieResults = Array.isArray(movieData?.results)
      ? movieData.results.map((item) => ({ ...item, media_type: "movie" }))
      : [];

    // Combine, sort, and map to MediaGridItem
    const allResults = [...tvResults, ...movieResults]
      .sort((a, b) => b.vote_average - a.vote_average)
      .filter((item) => item.poster_path); // Only items with posters

    const items: MediaGridItem[] = allResults
      .slice(0, maxItems)
      .map((anime) => ({
        id: anime.id,
        title: anime.title,
        name: anime.name,
        poster_path: anime.poster_path,
        vote_average: Number(anime.vote_average || 0),
        release_date: anime.release_date,
        first_air_date: anime.first_air_date,
        overview: anime.overview || "",
        media_type: (anime.media_type || "tv") as "movie" | "tv",
      }));

    return NextResponse.json({ results: items });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Something went wrong" },
      { status: 500 },
    );
  }
}
