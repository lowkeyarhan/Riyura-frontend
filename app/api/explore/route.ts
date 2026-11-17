import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/src/lib/axios";
import { normalizeTmdbImageUrl } from "@/src/lib/tmdb-images";
import { MediaType } from "@/src/props/global/mediaType";
import type { MediaCardProp } from "@/src/props/global/mediaCard";

export const dynamic = "force-dynamic";

function normalizeExploreItem(item: Record<string, unknown>): MediaCardProp {
  const poster = (item.poster_path ?? item.posterPath) as string | null | undefined;
  const rawYear = String(
    item.year ?? item.releaseYear ?? item.release_date ?? item.first_air_date ?? "",
  );
  const year = rawYear.length >= 4 ? rawYear.slice(0, 4) : rawYear;
  const rawMediaType = (item.media_type ?? item.mediaType ?? "") as string;
  const media_type =
    rawMediaType.toLowerCase() === "tv" || rawMediaType === MediaType.TV
      ? MediaType.TV
      : MediaType.Movie;

  return {
    tmdbId: Number(item.tmdbId ?? item.id ?? 0),
    title: String(item.title ?? item.name ?? ""),
    poster_path: normalizeTmdbImageUrl(poster, "w500"),
    year,
    media_type,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get("page");
    const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
    const genres = searchParams.get("genres")?.trim() || undefined;
    const language = searchParams.get("language")?.trim() || undefined;

    const response = await backendClient.get("/explore", {
      params: {
        page,
        ...(genres ? { genres } : {}),
        ...(language ? { language } : {}),
      },
    });

    const data = response.data;
    const raw = Array.isArray(data?.results) ? data.results : [];
    const currentPage = typeof data?.page === "number" ? data.page : page;

    const results: MediaCardProp[] = raw.map(normalizeExploreItem);

    return NextResponse.json({ page: currentPage, results }, { status: 200 });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Explore backend error:",
        error.response?.status,
        typeof error.response?.data === "string"
          ? error.response.data.slice(0, 200)
          : error.message,
      );
      return NextResponse.json(
        { page: 1, results: [], error: "Failed to fetch explore results" },
        { status: 502 },
      );
    }
    console.error("/api/explore error", error);
    return NextResponse.json(
      { page: 1, results: [], error: "Unexpected error" },
      { status: 500 },
    );
  }
}
