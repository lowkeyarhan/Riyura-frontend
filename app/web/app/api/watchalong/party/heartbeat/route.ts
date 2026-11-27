import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/src/lib/axios";
import {
  getAuthHeader,
  unauthorizedResponse,
  handleBackendError,
} from "@/src/lib/server/routeUtils";

export const dynamic = "force-dynamic";

// POST /api/watchalong/party/heartbeat?partyId=...
export async function POST(request: NextRequest) {
  const authHeader = getAuthHeader(request);
  if (!authHeader) return unauthorizedResponse();

  const partyId = request.nextUrl.searchParams.get("partyId");
  if (!partyId) {
    return NextResponse.json({ error: "Missing partyId" }, { status: 400 });
  }

  try {
    const response = await backendClient.post(
      `/watchalong/party/heartbeat?partyId=${partyId}`,
      {},
      { timeout: 8000, headers: { Authorization: authHeader } },
    );
    return NextResponse.json(response.data);
  } catch (error) {
    return handleBackendError(error, "Heartbeat failed");
  }
}
