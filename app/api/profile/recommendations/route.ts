import axios from "axios";
import { NextResponse } from "next/server";
import { backendClient } from "@/src/lib/axios";

export const dynamic = "force-dynamic";

function getAuthHeader(request: Request): string | null {
  const header = request.headers.get("Authorization");
  return header?.startsWith("Bearer ") ? header : null;
}

// ─── GET /api/profile/recommendations ────────────────────────────────────────
// Pass ?refresh=true to force regeneration; omit for cached DB results
export async function GET(request: Request) {
  const authHeader = getAuthHeader(request);
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const forceRefresh = searchParams.get("refresh") === "true";

  try {
    const response = await backendClient.get("/ai/recommendations", {
      params: forceRefresh ? { refresh: "true" } : undefined,
      headers: { Authorization: authHeader },
      timeout: 30000,
      validateStatus: (s) => s < 500,
    });

    if (response.status === 401) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (response.status !== 200) {
      return NextResponse.json(
        { error: response.data?.error ?? "Failed to fetch recommendations" },
        { status: response.status },
      );
    }

    return NextResponse.json({
      success: true,
      source: response.data.source ?? "api",
      recommendations: response.data.recommendations ?? [],
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 502;
      return NextResponse.json(
        {
          error:
            error.response?.data?.error ?? "Failed to fetch recommendations",
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
