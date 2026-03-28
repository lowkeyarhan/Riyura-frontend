import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/src/lib/axios";
import type { ProviderProp } from "@/src/props/global/provider";

export const dynamic = "force-dynamic";

// POST /api/stream/movie
// Fetches the stream URLs for a movie
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const response = await backendClient.post(`/movies/stream`, body, {
      timeout: 15000,
      headers: { Authorization: authHeader },
    });

    const data = response.data as ProviderProp[];
    return NextResponse.json(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 502;
      return NextResponse.json(
        {
          error:
            error.response?.data?.error ?? "Failed to fetch movie stream URLs",
        },
        { status },
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch movie stream URLs" },
      { status: 500 },
    );
  }
}
