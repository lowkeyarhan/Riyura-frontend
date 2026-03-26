import { NextResponse } from "next/server";
import { backendClient } from "@/src/lib/axios";
import {
  getAuthHeader,
  handleBackendError,
  handleNonSuccessStatus,
  parseJsonBody,
  unauthorizedResponse,
} from "@/src/lib/server/routeUtils";
import type { HistoryProp } from "@/src/props/profile/history";

export const dynamic = "force-dynamic";

// GET /api/profile/history
// Fetches paginated watch history. Uses ?page= (0-indexed).
export async function GET(request: Request) {
  const authHeader = getAuthHeader(request);
  if (!authHeader) return unauthorizedResponse();

  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") ?? "0";

  try {
    const response = await backendClient.get("/profile/history", {
      params: { page },
      headers: { Authorization: authHeader },
      timeout: 10000,
      validateStatus: (s) => s < 500,
    });

    const err = handleNonSuccessStatus(
      response.status,
      response.data,
      "Failed to fetch watch history",
    );
    if (err) return err;

    const items: HistoryProp[] = Array.isArray(response.data?.data)
      ? response.data.data
      : [];

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return handleBackendError(error, "Failed to fetch watch history");
  }
}

// POST /api/profile/history
// Saves watch progress. Called by the player on unmount.
export async function POST(request: Request) {
  const authHeader = getAuthHeader(request);
  if (!authHeader) return unauthorizedResponse();

  const body = await parseJsonBody<Partial<HistoryProp>>(request);
  if (body instanceof Response) return body;

  const {
    tmdbId,
    mediaType,
    providerId,
    durationSec,
    seasonNumber,
    episodeNumber,
  } = body;

  if (!tmdbId || !mediaType || !providerId) {
    return NextResponse.json(
      { error: "tmdbId, mediaType, and providerId are required" },
      { status: 400 },
    );
  }

  try {
    const response = await backendClient.post(
      "/profile/history",
      {
        tmdb_id: tmdbId,
        media_type: mediaType,
        stream_id: providerId,
        provider_id: providerId,
        duration_sec: durationSec ?? 0,
        season_number: seasonNumber ?? null,
        episode_number: episodeNumber ?? null,
      },
      {
        headers: { Authorization: authHeader },
        timeout: 10000,
        validateStatus: (s) => s < 500,
      },
    );

    const err = handleNonSuccessStatus(
      response.status,
      response.data,
      "Failed to save watch history",
      [200, 201],
    );
    if (err) return err;

    return NextResponse.json({
      success: true,
      message: "History saved successfully",
    });
  } catch (error) {
    return handleBackendError(error, "Failed to save watch history");
  }
}

// DELETE /api/profile/history
// Removes a watch history entry by tmdb_id + media_type.
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
    const response = await backendClient.request({
      url: "/profile/history",
      method: "DELETE",
      data: { tmdb_id, media_type },
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      timeout: 15000,
      validateStatus: (s) => s < 500,
    });

    const err = handleNonSuccessStatus(
      response.status,
      response.data,
      "Failed to delete watch history",
    );
    if (err) return err;

    return NextResponse.json({
      success: true,
      message: "History deleted successfully",
    });
  } catch (error) {
    return handleBackendError(error, "Failed to delete watch history");
  }
}
