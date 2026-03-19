import axios from "axios";
import { NextResponse } from "next/server";
import { backendClient } from "@/src/lib/axios";

export const dynamic = "force-dynamic";

function getAuthHeader(request: Request): string | null {
  const header = request.headers.get("Authorization");
  return header?.startsWith("Bearer ") ? header : null;
}

// ─── GET /api/profile/key ─────────────────────────────────────────────────────
export async function GET(request: Request) {
  const authHeader = getAuthHeader(request);
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await backendClient.get("/ai/key", {
      headers: { Authorization: authHeader },
      timeout: 8000,
      validateStatus: (s) => s < 500,
    });

    if (response.status === 401) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (response.status !== 200) {
      return NextResponse.json(
        { error: response.data?.error ?? "Failed to fetch API key status" },
        { status: response.status },
      );
    }

    return NextResponse.json({
      keyPreview: response.data.keyPreview ?? null,
      hasKey: Boolean(response.data.hasKey),
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 502;
      return NextResponse.json(
        {
          error:
            error.response?.data?.error ?? "Failed to fetch API key status",
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

// ─── POST /api/profile/key ────────────────────────────────────────────────────
export async function POST(request: Request) {
  const authHeader = getAuthHeader(request);
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { apiKey?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

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

    if (response.status === 401) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (response.status !== 200 && response.status !== 201) {
      return NextResponse.json(
        { error: response.data?.error ?? "Failed to save API key" },
        { status: response.status },
      );
    }

    return NextResponse.json({
      keyPreview: response.data.keyPreview ?? null,
      hasKey: Boolean(response.data.hasKey),
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 502;
      return NextResponse.json(
        { error: error.response?.data?.error ?? "Failed to save API key" },
        { status: status >= 400 ? status : 502 },
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// ─── DELETE /api/profile/key ──────────────────────────────────────────────────
export async function DELETE(request: Request) {
  const authHeader = getAuthHeader(request);
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await backendClient.delete("/ai/key", {
      headers: { Authorization: authHeader },
      timeout: 10000,
      validateStatus: (s) => s < 500,
    });

    if (response.status === 401) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (response.status !== 200) {
      return NextResponse.json(
        { error: response.data?.error ?? "Failed to delete API key" },
        { status: response.status },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 502;
      return NextResponse.json(
        { error: error.response?.data?.error ?? "Failed to delete API key" },
        { status: status >= 400 ? status : 502 },
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
