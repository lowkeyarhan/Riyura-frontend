import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/src/lib/axios";
import {
  getAuthHeader,
  unauthorizedResponse,
  handleBackendError,
  parseJsonBody,
} from "@/src/lib/server/routeUtils";

export const dynamic = "force-dynamic";

// POST /api/watchalong/party/create
export async function POST(request: NextRequest) {
  const authHeader = getAuthHeader(request);
  if (!authHeader) return unauthorizedResponse();

  const body = await parseJsonBody(request);
  if (body instanceof NextResponse) return body;

  try {
    const response = await backendClient.post(
      "/watchalong/party/create",
      body,
      {
        timeout: 15000,
        headers: { Authorization: authHeader },
      },
    );
    return NextResponse.json(response.data);
  } catch (error) {
    return handleBackendError(error, "Failed to create party");
  }
}
