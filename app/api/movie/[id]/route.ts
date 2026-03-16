import axios from "axios";
import { NextResponse } from "next/server";
import { backendClient } from "@/src/lib/axios";
import { normalizeTmdbImageUrl } from "@/src/lib/tmdb-images";
import type { MovieDetailProp } from "@/src/props/movie/movieDetail";

export const dynamic = "force-dynamic";

/** Normalize backend movie details response for frontend consumption */
function normalizeMovieDetails(raw: Record<string, unknown>): MovieDetailProp {
  const casts =
    (raw.casts as Array<{
      character?: string;
      original_name?: string;
      profile_path?: string | null;
    }>) ?? [];
  const genres = (raw.genres as Array<{ id: number; name: string }>) ?? [];
  const production_companies =
    (raw.production_companies as Array<{ id: number; name: string }>) ?? [];

  return {
    id: Number(raw.id) ?? 0,
    title: String(raw.title ?? ""),
    overview: String(raw.overview ?? ""),
    backdrop_path: raw.backdrop_path
      ? normalizeTmdbImageUrl(String(raw.backdrop_path), "original")
      : null,
    poster_path: raw.poster_path
      ? normalizeTmdbImageUrl(String(raw.poster_path), "w500")
      : null,
    budget: Number(raw.budget) ?? 0,
    adult: Boolean(raw.adult),
    genres,
    production_companies,
    release_date: String(raw.release_date ?? ""),
    original_language: String(raw.original_language ?? ""),
    revenue: Number(raw.revenue) ?? 0,
    runtime: Number(raw.runtime) ?? 0,
    status: String(raw.status ?? ""),
    tagline: String(raw.tagline ?? ""),
    vote_average: Number(raw.vote_average) ?? 0,
    casts: casts.map((c) => ({
      character: String(c.character ?? ""),
      original_name: String(c.original_name ?? ""),
      profile_path: c.profile_path
        ? normalizeTmdbImageUrl(String(c.profile_path), "w500")
        : null,
    })),
    is_anime: Boolean(raw.is_anime),
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

    const data = response.data as Record<string, unknown>;
    const normalized = normalizeMovieDetails(data);

    return NextResponse.json(normalized);
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
