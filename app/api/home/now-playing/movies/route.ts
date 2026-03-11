import { NextResponse } from "next/server";
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
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`,
      {
        headers: { accept: "application/json" },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch now playing movies: ${response.status}`,
      );
    }

    const data = (await response.json()) as TMDBListResponse<TMDBBaseListItem>;

    // Map to MediaGridItem and sanitize
    const items: MediaGridItem[] = Array.isArray(data?.results)
      ? data.results
          .filter((movie) => movie.poster_path) // Only items with posters
          .slice(0, maxItems) // Limit items
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
