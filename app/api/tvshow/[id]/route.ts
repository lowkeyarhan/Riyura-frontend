import axios from "axios";
import { NextResponse } from "next/server";
import { backendClient } from "@/src/lib/axios";
import { normalizeTmdbImageUrl } from "@/src/lib/tmdb-images";
import type {
  TvDetailProp,
  TvDetailCast,
  TvDetailSeason,
  TvDetailGenre,
} from "@/src/props/tv/tvDetail";

export const dynamic = "force-dynamic";

type RawSeason = {
  air_date?: string;
  episode_count?: number;
  episodes?: unknown;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  season_number?: number;
};

/** Normalize backend TV show details response for frontend consumption */
function normalizeTvShowDetails(raw: Record<string, unknown>): TvDetailProp {
  const casts =
    (raw.casts as Array<{
      character?: string;
      original_name?: string;
      profile_path?: string | null;
    }>) ?? [];
  const genres = (raw.genres as TvDetailGenre[]) ?? [];
  const production_companies =
    (raw.production_companies as Array<{ id?: number; name: string }>) ?? [];
  const created_by = (raw.created_by as Array<{ name: string }>) ?? [];
  const networks = (raw.networks as Array<{ name: string }>) ?? [];
  const origin_country = (raw.origin_country as string[]) ?? [];
  const rawSeasons = (raw.seasons as RawSeason[]) ?? [];

  const seasons: TvDetailSeason[] = rawSeasons.map((s) => ({
    air_date: String(s.air_date ?? ""),
    episode_count: Number(s.episode_count) ?? 0,
    episodes: s.episodes ?? null,
    name: String(s.name ?? ""),
    overview: String(s.overview ?? ""),
    poster_path: s.poster_path
      ? normalizeTmdbImageUrl(String(s.poster_path), "w500")
      : null,
    season_number: Number(s.season_number) ?? 0,
  }));

  const validSeasons = seasons.filter((s) => s.season_number > 0);
  const number_of_seasons = validSeasons.length;
  const number_of_episodes = seasons.reduce(
    (sum, s) => sum + (s.episode_count ?? 0),
    0,
  );

  return {
    adult: Boolean(raw.adult),
    backdrop_path: raw.backdrop_path
      ? normalizeTmdbImageUrl(String(raw.backdrop_path), "original")
      : null,
    poster_path: raw.poster_path
      ? normalizeTmdbImageUrl(String(raw.poster_path), "w500")
      : null,
    budget: raw.budget != null ? Number(raw.budget) : null,
    casts: casts.map(
      (c): TvDetailCast => ({
        character: String(c.character ?? ""),
        original_name: String(c.original_name ?? ""),
        profile_path: c.profile_path
          ? normalizeTmdbImageUrl(String(c.profile_path), "w500")
          : null,
      }),
    ),
    created_by: created_by.map((c) => ({ name: String(c.name ?? "") })),
    first_air_date: String(raw.first_air_date ?? ""),
    genres,
    id: Number(raw.id) ?? 0,
    is_anime: Boolean(raw.is_anime),
    name: String(raw.name ?? ""),
    networks: networks.map((n) => ({ name: String(n.name ?? "") })),
    origin_country,
    original_language: String(raw.original_language ?? ""),
    overview: String(raw.overview ?? ""),
    production_companies: production_companies.map((p) => ({
      id: p.id,
      name: String(p.name ?? ""),
    })),
    revenue: raw.revenue != null ? Number(raw.revenue) : null,
    runtime: Number(raw.runtime) ?? 0,
    seasons,
    status: String(raw.status ?? ""),
    tagline: String(raw.tagline ?? ""),
    vote_average: Number(raw.vote_average) ?? 0,
    number_of_seasons,
    number_of_episodes,
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: tvShowId } = await params;

    if (!tvShowId) {
      return NextResponse.json(
        { error: "TV show ID is required" },
        { status: 400 },
      );
    }

    const response = await backendClient.get(`/tv/details/${tvShowId}`, {
      timeout: 15000,
      validateStatus: (status) => status < 500,
    });

    if (response.status === 404) {
      return NextResponse.json({ error: "TV show not found" }, { status: 404 });
    }

    if (response.status !== 200) {
      const message =
        typeof response.data === "object" && response.data?.error
          ? String(response.data.error)
          : "Failed to fetch TV show details";
      return NextResponse.json({ error: message }, { status: response.status });
    }

    const data = response.data as Record<string, unknown>;
    const normalized = normalizeTvShowDetails(data);

    return NextResponse.json(normalized);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 502;
      const message =
        status === 404
          ? "TV show not found"
          : status >= 500
            ? "Backend temporarily unavailable"
            : (error.response?.data?.error ??
              "Failed to fetch TV show details");
      return NextResponse.json(
        { error: String(message) },
        { status: status >= 400 ? status : 502 },
      );
    }
    console.error("Error fetching TV show data:", error);
    return NextResponse.json(
      { error: "Failed to fetch TV show data" },
      { status: 500 },
    );
  }
}
