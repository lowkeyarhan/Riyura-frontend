import { NextResponse } from "next/server";
import { backendClient } from "@/src/lib/axios";
import {
  getAuthHeader,
  handleBackendError,
  handleNonSuccessStatus,
  unauthorizedResponse,
} from "@/src/lib/server/routeUtils";
import type { ProfileProp } from "@/src/props/profile/profile";

export const dynamic = "force-dynamic";

// GET /api/profile
// Returns the authenticated user's full profile.
export async function GET(request: Request) {
  const authHeader = getAuthHeader(request);
  if (!authHeader) return unauthorizedResponse();

  try {
    const response = await backendClient.get("/profile", {
      headers: { Authorization: authHeader },
      timeout: 10000,
      validateStatus: (s) => s < 500,
    });

    const err = handleNonSuccessStatus(
      response.status,
      response.data,
      "Failed to fetch profile",
    );
    if (err) return err;

    const data = response.data?.data as ProfileProp;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return handleBackendError(error, "Failed to fetch profile");
  }
}
