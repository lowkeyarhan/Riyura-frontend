import { NextResponse } from "next/server";
import { backendClient } from "@/src/lib/axios";
import {
  getAuthHeader,
  handleBackendError,
  handleNonSuccessStatus,
  parseJsonBody,
  unauthorizedResponse,
} from "@/src/lib/server/routeUtils";
import type { OnboardingProp } from "@/src/props/profile/onboarding";

export const dynamic = "force-dynamic";

// GET /api/profile/onboard
// Returns the user's onboarding status and photo URL.
export async function GET(request: Request) {
  const authHeader = getAuthHeader(request);
  if (!authHeader) return unauthorizedResponse();

  try {
    const response = await backendClient.get("/profile/onboard", {
      headers: { Authorization: authHeader },
      timeout: 10000,
      validateStatus: (s) => s < 500,
    });

    const err = handleNonSuccessStatus(
      response.status,
      response.data,
      "Failed to fetch onboarding status",
    );
    if (err) return err;

    const data = response.data as OnboardingProp & { success: boolean };
    return NextResponse.json({
      success: true,
      onboarded: data.onboarded,
      photoUrl: data.photoUrl ?? null,
    });
  } catch (error) {
    return handleBackendError(error, "Failed to fetch onboarding status");
  }
}

// PATCH /api/profile/onboard
// Marks the user as onboarded.
export async function PATCH(request: Request) {
  const authHeader = getAuthHeader(request);
  if (!authHeader) return unauthorizedResponse();

  const body = await parseJsonBody<{ onboarded?: boolean }>(request);
  if (body instanceof Response) return body;

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

    const err = handleNonSuccessStatus(
      response.status,
      response.data,
      "Failed to update onboarding status",
    );
    if (err) return err;

    return NextResponse.json({ success: true, data: response.data?.data });
  } catch (error) {
    return handleBackendError(error, "Failed to update onboarding status");
  }
}
