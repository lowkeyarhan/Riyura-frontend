import axios from "axios";
import { NextResponse } from "next/server";
import { backendClient } from "@/src/lib/axios";
import type { ProfileProp } from "@/src/props/profile/profile";

export const dynamic = "force-dynamic";

function getAuthHeader(request: Request): string | null {
  const header = request.headers.get("Authorization");
  return header?.startsWith("Bearer ") ? header : null;
}

// GET /api/profile
// Returns the authenticated user's full profile.
export async function GET(request: Request) {
  const authHeader = getAuthHeader(request);
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await backendClient.get("/profile", {
      headers: { Authorization: authHeader },
      timeout: 10000,
      validateStatus: (s) => s < 500,
    });

    if (response.status === 401) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (response.status !== 200) {
      return NextResponse.json(
        { error: response.data?.error ?? "Failed to fetch profile" },
        { status: response.status },
      );
    }

    const data = response.data?.data as ProfileProp;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 502;
      return NextResponse.json(
        { error: error.response?.data?.error ?? "Failed to fetch profile" },
        { status: status >= 400 ? status : 502 },
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
