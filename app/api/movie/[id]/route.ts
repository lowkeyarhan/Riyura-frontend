import axios from "axios";
import { NextResponse } from "next/server";
import { backendClient } from "@/src/lib/axios";
import { normalizeTmdbImageUrl } from "@/src/lib/tmdb-images";
import type { MovieDetailProp } from "@/src/props/movie/movieDetail";

export const dynamic = "force-dynamic";

/** Normalize image URLs only; backend response is already in MovieDetailProp shape */
function normalizeImageUrls(data: MovieDetailProp): MovieDetailProp {
  return {
    ...data,
    backdrop_path: data.backdrop_path
      ? normalizeTmdbImageUrl(data.backdrop_path, "original")
      : null,
    poster_path: data.poster_path
      ? normalizeTmdbImageUrl(data.poster_path, "w500")
      : null,
    casts: data.casts.map((c) => ({
      ...c,
      profile_path: c.profile_path
        ? normalizeTmdbImageUrl(c.profile_path, "w500")
        : null,
    })),
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: movieId } = await params;

    if (!movieId) {
      return NextResponse.json(
        { error: "Movie ID is required" },
        { status: 400 },
      );
    }

    const response = await backendClient.get(`/movies/details/${movieId}`, {
      timeout: 15000,
      validateStatus: (status) => status < 500,
    });

    if (response.status === 404) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    if (response.status !== 200) {
      const message =
        typeof response.data === "object" && response.data?.error
          ? String(response.data.error)
          : "Failed to fetch movie details";
      return NextResponse.json({ error: message }, { status: response.status });
    }

    const data = response.data as MovieDetailProp;
    return NextResponse.json(normalizeImageUrls(data));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 502;
      const message =
        status === 404
          ? "Movie not found"
          : status >= 500
            ? "Backend temporarily unavailable"
            : (error.response?.data?.error ?? "Failed to fetch movie details");
      return NextResponse.json(
        { error: String(message) },
        { status: status >= 400 ? status : 502 },
      );
    }
    console.error("Error fetching movie data:", error);
    return NextResponse.json(
      { error: "Failed to fetch movie data" },
      { status: 500 },
    );
  }
}
