import { NextRequest } from "next/server";
import { getAuthHeader } from "@/src/lib/server/routeUtils";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080/api";

// GET /api/watchalong/party/events?partyId=...
// Streams SSE from the backend to the client.
export async function GET(request: NextRequest) {
  const authHeader = getAuthHeader(request);
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const partyId = request.nextUrl.searchParams.get("partyId");
  if (!partyId) {
    return new Response(JSON.stringify({ error: "Missing partyId" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const backendBase = BACKEND_URL.replace(/\/$/, "");
  const backendUrl = `${backendBase}/watchalong/party/events?partyId=${encodeURIComponent(partyId)}`;

  try {
    const backendRes = await fetch(backendUrl, {
      headers: {
        Authorization: authHeader,
        Accept: "text/event-stream",
        "Cache-Control": "no-cache",
      },
      // @ts-expect-error – Node.js fetch extension for streaming
      duplex: "half",
    });

    if (!backendRes.ok || !backendRes.body) {
      return new Response(
        JSON.stringify({ error: "Backend SSE connection failed" }),
        {
          status: backendRes.status,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(backendRes.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: "SSE proxy failed" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
}
