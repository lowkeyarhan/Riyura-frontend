import axios from "axios";
import { NextResponse } from "next/server";
import { backendClient } from "@/src/lib/axios";
import { normalizeMediaCardPoster } from "@/src/lib/tmdb-images";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(
      20,
      Math.max(1, parseInt(searchParams.get("limit") ?? "12", 10) || 12),
    );
    const response = await backendClient.get("/movies/trending", {
      params: { limit },
    });
    const data = response.data;
    const raw = Array.isArray(data) ? data : (data?.results ?? []);
    const results = raw.map(normalizeMediaCardPoster);
    return NextResponse.json({ results });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Trending movies backend error:",
        error.response?.status,
        typeof error.response?.data === "string"
          ? error.response.data.slice(0, 200)
          : error.message,
      );
      return NextResponse.json(
        { error: "Failed to fetch trending movies" },
        { status: 502 },
      );
    }
    console.error("Trending movies API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending movies" },
      { status: 500 },
    );
  }
}
