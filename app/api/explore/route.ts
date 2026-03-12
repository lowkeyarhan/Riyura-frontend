import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/src/lib/axios";
import { normalizeTmdbImageUrl } from "@/src/lib/tmdb-images";
import type { ExploreProp } from "@/src/props/explore/explore";

export const dynamic = "force-dynamic";

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

    const results: ExploreProp[] = raw.map((item: Record<string, unknown>) => {
      const poster = item.posterPath ?? item.poster_path;
      return {
        tmdbId: Number(item.tmdbId ?? item.id ?? 0),
        title: String(item.title ?? ""),
        mediaType: (item.mediaType ??
          item.media_type ??
          "Movie") as ExploreProp["mediaType"],
        releaseYear: String(
          item.releaseYear ?? item.release_date ?? item.first_air_date ?? "",
        ),
        originalLanguage: String(
          item.originalLanguage ?? item.original_language ?? "",
        ),
        rating: Number(item.rating ?? item.vote_average ?? 0),
        description: String(item.description ?? item.overview ?? ""),
        posterPath: poster ? normalizeTmdbImageUrl(String(poster), "w500") : "",
      };
    });

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
