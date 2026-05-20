import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/wallet/savings?event_id=${eventId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to fetch target" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    const target = (data.data || []).find((t: { event_id: string }) => t.event_id === eventId) || null;

    return NextResponse.json({ success: true, target });
  } catch {
    return NextResponse.json({ error: "Failed to fetch savings target" }, { status: 500 });
  }
}
