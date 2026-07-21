import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const { searchParams } = req.nextUrl;
  const page = searchParams.get("page") || "1";
  const pageSize = searchParams.get("pageSize") || "20";

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/community/notifications/geo?page=${page}&page_size=${pageSize}`, {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    });
    const data = await res.json();
    return NextResponse.json({ success: res.ok, data: data, notifications: data.notifications || [], total: data.total || 0 }, { status: res.status });
  } catch {
    return NextResponse.json({ success: false, data: { notifications: [] }, notifications: [], total: 0 }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/community/notifications/generate-geo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const data = await res.json();
    return NextResponse.json({ success: res.ok, ...data }, { status: res.status });
  } catch {
    return NextResponse.json({ success: false, error: "Backend unavailable" }, { status: 503 });
  }
}
