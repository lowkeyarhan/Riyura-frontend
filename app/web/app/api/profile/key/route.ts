import { NextResponse } from "next/server";
import { backendClient } from "@/src/lib/axios";
import {
  getAuthHeader,
  handleBackendError,
  handleNonSuccessStatus,
  parseJsonBody,
  unauthorizedResponse,
} from "@/src/lib/server/routeUtils";

export const dynamic = "force-dynamic";

// GET /api/profile/key
export async function GET(request: Request) {
  const authHeader = getAuthHeader(request);
  if (!authHeader) return unauthorizedResponse();

  try {
    const response = await backendClient.get("/ai/key", {
      headers: { Authorization: authHeader },
      timeout: 8000,
      validateStatus: (s) => s < 500,
    });

    const err = handleNonSuccessStatus(
      response.status,
      response.data,
      "Failed to fetch API key status",
    );
    if (err) return err;

    return NextResponse.json({
      keyPreview: response.data.keyPreview ?? null,
      hasKey: Boolean(response.data.hasKey),
    });
  } catch (error) {
    return handleBackendError(error, "Failed to fetch API key status");
  }
}

// POST /api/profile/key
export async function POST(request: Request) {
  const authHeader = getAuthHeader(request);
  if (!authHeader) return unauthorizedResponse();

  const body = await parseJsonBody<{ apiKey?: string }>(request);
  if (body instanceof Response) return body;

  const { apiKey } = body;
  if (!apiKey || typeof apiKey !== "string" || !apiKey.trim()) {
    return NextResponse.json({ error: "apiKey is required" }, { status: 400 });
  }

  try {
    const response = await backendClient.post(
      "/ai/key",
      { apiKey: apiKey.trim() },
      {
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        timeout: 10000,
        validateStatus: (s) => s < 500,
      },
    );

    const err = handleNonSuccessStatus(
      response.status,
      response.data,
      "Failed to save API key",
      [200, 201],
    );
    if (err) return err;

    return NextResponse.json({
      keyPreview: response.data.keyPreview ?? null,
      hasKey: Boolean(response.data.hasKey),
    });
  } catch (error) {
    return handleBackendError(error, "Failed to save API key");
  }
}

// DELETE /api/profile/key
export async function DELETE(request: Request) {
  const authHeader = getAuthHeader(request);
  if (!authHeader) return unauthorizedResponse();

  try {
    const response = await backendClient.delete("/ai/key", {
      headers: { Authorization: authHeader },
      timeout: 10000,
      validateStatus: (s) => s < 500,
    });

    const err = handleNonSuccessStatus(
      response.status,
      response.data,
      "Failed to delete API key",
    );
    if (err) return err;

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleBackendError(error, "Failed to delete API key");
  }
}
