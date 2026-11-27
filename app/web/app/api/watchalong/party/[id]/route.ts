import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/src/lib/axios";
import {
  getAuthHeader,
  unauthorizedResponse,
  handleBackendError,
} from "@/src/lib/server/routeUtils";

export const dynamic = "force-dynamic";

// GET /api/watchalong/party/[id]
// Returns the current party state
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authHeader = getAuthHeader(request);
  if (!authHeader) return unauthorizedResponse();

  const { id } = await params;

  try {
    const response = await backendClient.get(`/watchalong/party/${id}`, {
      timeout: 10000,
      headers: { Authorization: authHeader },
    });
    return NextResponse.json(response.data);
  } catch (error) {
    return handleBackendError(error, "Failed to fetch party state");
  }
}
