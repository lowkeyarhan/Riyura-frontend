import { NextResponse } from "next/server";
import { backendClient } from "@/src/lib/axios";
import { normalizeTmdbImageUrl } from "@/src/lib/tmdb-images";
import { MediaType } from "@/src/props/global/mediaType";
import type { MediaCardProp } from "@/src/props/global/mediaCard";
import {
  getAuthHeader,
  handleBackendError,
  handleNonSuccessStatus,
  parseJsonBody,
  unauthorizedResponse,
} from "@/src/lib/server/routeUtils";

export const dynamic = "force-dynamic";

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

// GET /api/profile/watchlist
// With tmdbId & mediaType query params → check if item is in watchlist
// Without params → return full watchlist
export async function GET(request: Request) {
  const authHeader = getAuthHeader(request);
  if (!authHeader) return unauthorizedResponse();

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

      return NextResponse.json({
        success: true,
        isInWatchlist: Boolean(response.data?.isInWatchlist),
      });
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

    const err = handleNonSuccessStatus(
      response.status,
      response.data,
      "Failed to fetch watchlist",
    );
    if (err) return err;

    const raw: Record<string, unknown>[] = Array.isArray(response.data?.data)
      ? response.data.data
      : Array.isArray(response.data)
        ? response.data
        : [];

    return NextResponse.json({ success: true, data: raw.map(normalizeItem) });
  } catch (error) {
    return handleBackendError(error, "Failed to fetch watchlist");
  }
}

// POST /api/profile/watchlist
export async function POST(request: Request) {
  const authHeader = getAuthHeader(request);
  if (!authHeader) return unauthorizedResponse();

  const body = await parseJsonBody<{ tmdb_id?: number; media_type?: string }>(
    request,
  );
  if (body instanceof Response) return body;

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

    const err = handleNonSuccessStatus(
      response.status,
      response.data,
      "Failed to add to watchlist",
      [200, 201],
    );
    if (err) return err;

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleBackendError(error, "Failed to add to watchlist");
  }
}

// DELETE /api/profile/watchlist
export async function DELETE(request: Request) {
  const authHeader = getAuthHeader(request);
  if (!authHeader) return unauthorizedResponse();

  const body = await parseJsonBody<{ tmdb_id?: number; media_type?: string }>(
    request,
  );
  if (body instanceof Response) return body;

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

    const err = handleNonSuccessStatus(
      response.status,
      response.data,
      "Failed to remove from watchlist",
    );
    if (err) return err;

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleBackendError(error, "Failed to remove from watchlist");
  }
}
