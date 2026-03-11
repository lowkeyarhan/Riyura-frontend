import { NextResponse } from "next/server";
import { TMDBCreditsResponse } from "@/src/dto/tmdb/common";
import {
  TMDBMovieDetails,
  TMDBSimilarMovie,
  TMDBSimilarResponse,
} from "@/src/dto/tmdb/details";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing TMDB_API_KEY in environment variables" },
      { status: 500 },
    );
  }

  try {
    const { id: movieId } = await params;

    // Fetch movie details, credits, and similar movies in parallel
    const [detailsResponse, creditsResponse, similarResponse] =
      await Promise.all([
        fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`,
        ),
        fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}&language=en-US`,
        ),
        fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${apiKey}&language=en-US&page=1`,
        ),
      ]);

    if (!detailsResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch movie details" },
        { status: 404 },
      );
    }

    const details = (await detailsResponse.json()) as TMDBMovieDetails;
    const credits = (await creditsResponse.json()) as TMDBCreditsResponse;
    const similar =
      (await similarResponse.json()) as TMDBSimilarResponse<TMDBSimilarMovie>;

    const movieData = {
      ...details,
      credits,
      similar,
    };

    return NextResponse.json(movieData);
  } catch (error) {
    console.error("Error fetching movie data:", error);
    return NextResponse.json(
      { error: "Failed to fetch movie data" },
      { status: 500 },
    );
  }
}
