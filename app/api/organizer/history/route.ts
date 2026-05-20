import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/events/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to fetch history" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({
      success: true,
      data: {
        history: data.events || [],
        pattern: {
          totalEvents: data.total || 0,
          avgAttendance: 0,
          avgRevenue: 0,
        },
        eventIds: (data.events || []).map((e: { id: string }) => e.id),
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch organizer history" }, { status: 500 });
  }
}
