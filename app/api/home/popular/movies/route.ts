import { NextResponse } from "next/server";
import { MediaGridItem } from "@/src/dto/media-ui";

export const dynamic = "force-dynamic";

interface TMDBMovie {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
}

interface TMDBResponse {
  results: TMDBMovie[];
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
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`,
      {
        headers: { accept: "application/json" },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch popular movies" },
        { status: response.status },
      );
    }

    const data = (await response.json()) as TMDBResponse;

    // Map to MediaGridItem and sanitize
    const items: MediaGridItem[] = Array.isArray(data?.results)
      ? data.results
          .filter((movie) => movie.poster_path) // Only items with posters
          .slice(0, 12) // Limit to 12 items
          .map((movie) => ({
            id: movie.id,
            title: movie.title,
            name: movie.name,
            poster_path: movie.poster_path,
            vote_average: Number(movie.vote_average || 0),
            release_date: movie.release_date,
            first_air_date: movie.first_air_date,
            overview: movie.overview || "",
            media_type: "movie",
          }))
      : [];

    return NextResponse.json({ results: items });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Something went wrong" },
      { status: 500 },
    );
  }
}
