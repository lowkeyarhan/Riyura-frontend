import axios from "axios";
import { NextResponse } from "next/server";
import { backendClient } from "@/src/lib/axios";
import type { TvPlayerProp } from "@/src/props/tv/tvPlayer";

export const dynamic = "force-dynamic";

// GET /api/player/tv/[id]
// Fetches the TV player data for a TV show
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const response = await backendClient.get(`/tv/player/${id}`, {
      timeout: 15000,
    });

    const data = response.data as TvPlayerProp;
    return NextResponse.json(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 502;
      return NextResponse.json(
        {
          error:
            error.response?.data?.error ?? "Failed to fetch TV player data",
        },
        { status },
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch TV player data" },
      { status: 500 },
    );
  }
}
