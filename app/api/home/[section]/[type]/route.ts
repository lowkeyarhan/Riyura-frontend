import axios from "axios";
import { NextResponse } from "next/server";
import { backendClient } from "@/src/lib/axios";
import { normalizeMediaCardPoster } from "@/src/lib/tmdb-images";

export const dynamic = "force-dynamic";

const SECTION_PATHS: Record<string, { path: string; label: string }> = {
  "now-playing/movies": {
    path: "/movies/now-playing",
    label: "now playing movies",
  },
  "now-playing/tv": { path: "/tv/now-playing", label: "now playing TV" },
  "popular/movies": { path: "/movies/popular", label: "popular movies" },
  "popular/tv": { path: "/tv/popular", label: "popular TV" },
  "trending/movies": { path: "/movies/trending", label: "trending movies" },
  "trending/tv": { path: "/tv/trending", label: "trending TV" },
  "trending/anime": { path: "/anime/trending", label: "trending anime" },
  "upcoming/movies": { path: "/movies/upcoming", label: "upcoming movies" },
  "upcoming/tv": { path: "/tv/upcoming", label: "upcoming TV" },
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ section: string; type: string }> },
) {
  const { section, type } = await params;
  const target = SECTION_PATHS[`${section}/${type}`];

  if (!target) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(
    20,
    Math.max(1, parseInt(searchParams.get("limit") ?? "12", 10) || 12),
  );

  try {
    const response = await backendClient.get(target.path, { params: { limit } });
    const data = response.data;
    const raw = Array.isArray(data) ? data : (data?.results ?? []);
    const results = raw.map(normalizeMediaCardPoster);
    return NextResponse.json({ results });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `${target.label} backend error:`,
        error.response?.status,
        typeof error.response?.data === "string"
          ? error.response.data.slice(0, 200)
          : error.message,
      );
      return NextResponse.json(
        { error: `Failed to fetch ${target.label}` },
        { status: 502 },
      );
    }
    console.error(`${target.label} API error:`, error);
    return NextResponse.json(
      { error: `Failed to fetch ${target.label}` },
      { status: 500 },
    );
  }
}
