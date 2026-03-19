import axios from "axios";
import { NextResponse } from "next/server";
import { backendClient } from "@/src/lib/axios";
import { normalizeTmdbImageUrl } from "@/src/lib/tmdb-images";
import { MediaType } from "@/src/props/global/mediaType";
import type { MediaCardProp } from "@/src/props/global/mediaCard";

export const dynamic = "force-dynamic";

function getAuthHeader(request: Request): string | null {
  const header = request.headers.get("Authorization");
  return header?.startsWith("Bearer ") ? header : null;
}

function normalizeItem(raw: Record<string, unknown>): MediaCardProp {
  return {
    tmdbId: Number(raw.tmdbId ?? 0),
    title: String(raw.title ?? ""),
    poster_path: normalizeTmdbImageUrl(
      raw.poster_path as string | null,
      "w500",
    ),
    year: String(raw.year ?? ""),
    media_type:
      raw.media_type === MediaType.TV ? MediaType.TV : MediaType.Movie,
  };
}

// ─── GET /api/profile/watchlist ──────────────────────────────────────────────
// With tmdbId & mediaType query params → check if item is in watchlist
// Without params → return full watchlist
export async function GET(request: Request) {
  const authHeader = getAuthHeader(request);
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const tmdbId = searchParams.get("tmdbId");
  const mediaType = searchParams.get("mediaType");

  // Check mode: ?tmdbId=&mediaType=
  if (tmdbId && mediaType) {
    try {
      const response = await backendClient.get("/watchlist/check", {
        params: { tmdbId, mediaType },
        headers: { Authorization: authHeader },
        timeout: 8000,
        validateStatus: (s) => s < 500,
      });

      if (response.status !== 200) {
        return NextResponse.json({ success: false, isInWatchlist: false });
      }

      const isInWatchlist = Boolean(response.data?.isInWatchlist);
      return NextResponse.json({ success: true, isInWatchlist });
    } catch {
      return NextResponse.json({ success: false, isInWatchlist: false });
    }
  }

  // List mode: return full watchlist
  try {
    const response = await backendClient.get("/watchlist", {
      headers: { Authorization: authHeader },
      timeout: 10000,
      validateStatus: (s) => s < 500,
    });

    if (response.status === 401) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (response.status !== 200) {
      return NextResponse.json(
        { error: response.data?.error ?? "Failed to fetch watchlist" },
        { status: response.status },
      );
    }

    const raw: unknown[] = Array.isArray(response.data?.data)
      ? response.data.data
      : Array.isArray(response.data)
        ? response.data
        : [];

    const data = raw.map((item) =>
      normalizeItem(item as Record<string, unknown>),
    );

    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 502;
      return NextResponse.json(
        { error: error.response?.data?.error ?? "Failed to fetch watchlist" },
        { status: status >= 400 ? status : 502 },
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// ─── POST /api/profile/watchlist ─────────────────────────────────────────────
export async function POST(request: Request) {
  const authHeader = getAuthHeader(request);
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { tmdb_id?: number; media_type?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { tmdb_id, media_type } = body;
  if (!tmdb_id || !media_type) {
    return NextResponse.json(
      { error: "tmdb_id and media_type are required" },
      { status: 400 },
    );
  }

  try {
    const response = await backendClient.post(
      "/watchlist",
      { tmdb_id, media_type },
      {
        headers: { Authorization: authHeader },
        timeout: 10000,
        validateStatus: (s) => s < 500,
      },
    );

    if (response.status === 401) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (response.status !== 200 && response.status !== 201) {
      return NextResponse.json(
        { error: response.data?.error ?? "Failed to add to watchlist" },
        { status: response.status },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 502;
      return NextResponse.json(
        { error: error.response?.data?.error ?? "Failed to add to watchlist" },
        { status: status >= 400 ? status : 502 },
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// ─── DELETE /api/profile/watchlist ───────────────────────────────────────────
export async function DELETE(request: Request) {
  const authHeader = getAuthHeader(request);
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { tmdb_id?: number; media_type?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { tmdb_id, media_type } = body;
  if (!tmdb_id || !media_type) {
    return NextResponse.json(
      { error: "tmdb_id and media_type are required" },
      { status: 400 },
    );
  }

  try {
    const response = await backendClient.delete("/watchlist", {
      data: { tmdb_id, media_type },
      headers: { Authorization: authHeader },
      timeout: 10000,
      validateStatus: (s) => s < 500,
    });

    if (response.status === 401) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (response.status !== 200) {
      return NextResponse.json(
        { error: response.data?.error ?? "Failed to remove from watchlist" },
        { status: response.status },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 502;
      return NextResponse.json(
        {
          error:
            error.response?.data?.error ?? "Failed to remove from watchlist",
        },
        { status: status >= 400 ? status : 502 },
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
