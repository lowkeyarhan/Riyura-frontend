import { NextResponse } from "next/server";
import { MediaGridItem } from "@/src/dto/media-ui";

export const dynamic = "force-dynamic";

interface TMDBAnime {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: string;
}

interface TMDBResponse {
  results: TMDBAnime[];
}

export async function GET() {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing TMDB_API_KEY in environment variables" },
      { status: 500 },
    );
  }

  try {
    // Fetch both TV shows and movies with animation genre and Japanese language
    const [tvResponse, movieResponse] = await Promise.all([
      fetch(
        `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&sort_by=popularity.desc&vote_count.gte=50&with_genres=16&with_original_language=ja&page=1`,
        {
          headers: { accept: "application/json" },
          cache: "no-store",
        },
      ),
      fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&vote_count.gte=50&with_genres=16&with_original_language=ja&page=1`,
        {
          headers: { accept: "application/json" },
          cache: "no-store",
        },
      ),
    ]);

    if (!tvResponse.ok || !movieResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch anime" },
        { status: 500 },
      );
    }

    const tvData = (await tvResponse.json()) as TMDBResponse;
    const movieData = (await movieResponse.json()) as TMDBResponse;

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

    const items: MediaGridItem[] = allResults.slice(0, 12).map((anime) => ({
      id: anime.id,
      title: anime.title,
      name: anime.name,
      poster_path: anime.poster_path,
      vote_average: Number(anime.vote_average || 0),
      release_date: anime.release_date,
      first_air_date: anime.first_air_date,
      overview: anime.overview || "",
      media_type: anime.media_type || "tv",
    }));

    return NextResponse.json({ results: items });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Something went wrong" },
      { status: 500 },
    );
  }
}
