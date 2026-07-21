import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const unsentOnly = searchParams.get("unsentOnly") === "true";

    const res = await fetch(`${BACKEND_URL}/api/v1/community/notifications/geo?unsent_only=${unsentOnly}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to fetch geo notifications" }));
      return NextResponse.json({ success: false, error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({
      success: true,
      notifications: data.data || [],
      total: data.total || 0,
      unread_count: data.unread_count || 0,
    });
  } catch {
    return NextResponse.json({ success: false, notifications: [], error: "Failed to fetch geo notifications" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));

    const res = await fetch(`${BACKEND_URL}/api/v1/community/notifications/generate-geo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json({
      success: res.ok,
      notifications_created: data.notifications_created || 0,
      ...data,
    }, { status: res.status });
  } catch {
    return NextResponse.json({ success: false, error: "Backend unavailable" }, { status: 503 });
  }
}
