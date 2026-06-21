import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

/**
 * GET /api/events/[id]/insights
 * Proxy to backend event analytics/insights
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = req.cookies.get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/events/${id}/metrics`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json({ success: false, error: data.detail || "Not found" }, { status: res.status });
    }
    return NextResponse.json({ success: true, data: data.data ?? data });
  } catch {
    return NextResponse.json({ success: false, error: "Backend unavailable" }, { status: 502 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return NextResponse.json({ success: false, error: "Not implemented" }, { status: 501 });
}
