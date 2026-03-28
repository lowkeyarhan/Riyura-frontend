import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/src/lib/axios";
import { normalizeTmdbImageUrl } from "@/src/lib/tmdb-images";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();
    const pageParam = searchParams.get("page");
    const page = Math.max(0, parseInt(pageParam ?? "0", 10) || 0);
    const sort_by = searchParams.get("sort_by") ?? undefined;

    if (!q || q.length === 0) {
      return NextResponse.json({ results: [] }, { status: 200 });
    }

    const response = await backendClient.get("/search", {
      params: { q, page, ...(sort_by ? { sort_by } : {}) },
    });

    const data = response.data;
    const raw = Array.isArray(data?.results) ? data.results : [];

    const results = raw.map((item: Record<string, unknown>) => {
      const poster = item.poster_path;
      return {
        ...item,
        poster_path: poster
          ? normalizeTmdbImageUrl(String(poster), "w500")
          : "",
      };
    });

    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Search backend error:",
        error.response?.status,
        typeof error.response?.data === "string"
          ? error.response.data.slice(0, 200)
          : error.message,
      );
      return NextResponse.json(
        { results: [], error: "Failed to fetch search results" },
        { status: 502 },
      );
    }
    console.error("/api/search error", error);
    return NextResponse.json(
      { results: [], error: "Unexpected error" },
      { status: 500 },
    );
  }
}
