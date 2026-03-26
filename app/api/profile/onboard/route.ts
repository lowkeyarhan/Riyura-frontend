import axios from "axios";
import { NextResponse } from "next/server";
import { backendClient } from "@/src/lib/axios";
import type { OnboardingProp } from "@/src/props/profile/onboarding";

export const dynamic = "force-dynamic";

function getAuthHeader(request: Request): string | null {
  const header = request.headers.get("Authorization");
  return header?.startsWith("Bearer ") ? header : null;
}

// GET /api/profile/onboard
// Returns the user's onboarding status and photo URL.
export async function GET(request: Request) {
  const authHeader = getAuthHeader(request);
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await backendClient.get("/profile/onboard", {
      headers: { Authorization: authHeader },
      timeout: 10000,
      validateStatus: (s) => s < 500,
    });

    if (response.status === 401) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (response.status !== 200) {
      return NextResponse.json(
        { error: response.data?.error ?? "Failed to fetch onboarding status" },
        { status: response.status },
      );
    }

    const data = response.data as OnboardingProp & { success: boolean };
    return NextResponse.json({
      success: true,
      onboarded: data.onboarded,
      photoUrl: data.photoUrl ?? null,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 502;
      return NextResponse.json(
        {
          error:
            error.response?.data?.error ?? "Failed to fetch onboarding status",
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

// PATCH /api/profile/onboard
// Marks the user as onboarded.
export async function PATCH(request: Request) {
  const authHeader = getAuthHeader(request);
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { onboarded?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  try {
    const response = await backendClient.patch(
      "/profile/onboard",
      { onboarded: body.onboarded ?? true },
      {
        headers: { Authorization: authHeader },
        timeout: 10000,
        validateStatus: (s) => s < 500,
      },
    );

    if (response.status === 401) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (response.status !== 200) {
      return NextResponse.json(
        { error: response.data?.error ?? "Failed to update onboarding status" },
        { status: response.status },
      );
    }

    const data = response.data?.data;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 502;
      return NextResponse.json(
        {
          error:
            error.response?.data?.error ?? "Failed to update onboarding status",
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
