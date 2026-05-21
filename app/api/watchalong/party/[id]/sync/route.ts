import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/src/lib/axios";
import {
  getAuthHeader,
  unauthorizedResponse,
  handleBackendError,
} from "@/src/lib/server/routeUtils";

export const dynamic = "force-dynamic";

// GET /api/watchalong/party/[id]/sync
// Returns the current sync state (progress + streamUrl) for a party
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authHeader = getAuthHeader(request);
  if (!authHeader) return unauthorizedResponse();

  const { id } = await params;

  try {
    const response = await backendClient.get(`/watchalong/party/${id}/sync`, {
      timeout: 10000,
      headers: { Authorization: authHeader },
    });
    return NextResponse.json(response.data);
  } catch (error) {
    return handleBackendError(error, "Failed to sync party");
  }
}
