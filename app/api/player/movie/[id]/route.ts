import axios from "axios";
import { NextResponse } from "next/server";
import { backendClient } from "@/src/lib/axios";
import type { MoviePlayerProp } from "@/src/props/movie/moviePlayer";
import { normalizeTmdbImageUrl } from "@/src/lib/tmdb-images";

export const dynamic = "force-dynamic";

// GET /api/player/movie/[id]
// Fetches the movie player data for a movie
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const response = await backendClient.get(`/movies/player/${id}`, {
      timeout: 15000,
    });

    const data = response.data as MoviePlayerProp;
    
    if (data && data.backdrop_path) {
      data.backdrop_path = normalizeTmdbImageUrl(data.backdrop_path);
    }
    
    return NextResponse.json(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 502;
      return NextResponse.json(
        {
          error:
            error.response?.data?.error ?? "Failed to fetch movie player data",
        },
        { status },
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch movie player data" },
      { status: 500 },
    );
  }
}
