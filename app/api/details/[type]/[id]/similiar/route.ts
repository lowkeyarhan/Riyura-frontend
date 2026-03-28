import axios from "axios";
import { NextResponse } from "next/server";
import { backendClient } from "@/src/lib/axios";
import { normalizeTmdbImageUrl } from "@/src/lib/tmdb-images";
import type { MediaCardProp } from "@/src/props/global/mediaCard";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ type: string; id: string }> },
) {
  try {
    const { type, id } = await params;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    if (type !== "movie" && type !== "tv") {
      return NextResponse.json(
        { error: "Invalid type. Use 'movie' or 'tv'" },
        { status: 400 },
      );
    }

    const backendPath =
      type === "tv"
        ? `/tv/details/${id}/similar`
        : `/movies/details/${id}/similar`;

    const response = await backendClient.get(backendPath, {
      timeout: 15000,
      validateStatus: (status) => status < 500,
    });

    if (response.status === 404) {
      return NextResponse.json([], { status: 200 });
    }

    if (response.status !== 200) {
      const message =
        typeof response.data === "object" && response.data?.error
          ? String(response.data.error)
          : "Failed to fetch similar movies";
      return NextResponse.json({ error: message }, { status: response.status });
    }

    const raw = response.data;

    // Backend returns either a flat array or a map of arrays — normalise to flat array
    let items: MediaCardProp[] = [];
    if (Array.isArray(raw)) {
      items = raw as MediaCardProp[];
    } else if (raw && typeof raw === "object") {
      items = Object.values(raw).flat() as MediaCardProp[];
    }

    const normalized = items.map((item) => ({
      ...item,
      poster_path: item.poster_path
        ? normalizeTmdbImageUrl(item.poster_path, "w500")
        : item.poster_path,
    }));

    return NextResponse.json(normalized);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 502;
      const message =
        status === 404
          ? "Not found"
          : status >= 500
            ? "Backend temporarily unavailable"
            : (error.response?.data?.error ?? "Failed to fetch similar movies");
      return NextResponse.json(
        { error: String(message) },
        { status: status >= 400 ? status : 502 },
      );
    }
    console.error("Error fetching similar movies:", error);
    return NextResponse.json(
      { error: "Failed to fetch similar movies" },
      { status: 500 },
    );
  }
}
