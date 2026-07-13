import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

function getAuthHeaders(req: NextRequest): Record<string, string> {
  const token = req.cookies.get("access_token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = searchParams.get("page") || "1";
  const page_size = searchParams.get("page_size") || "20";
  const unreadOnly = searchParams.get("unreadOnly");

  const params = new URLSearchParams({ page, page_size });
  if (unreadOnly === "true") params.set("unread_only", "true");

  try {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/community/notifications?${params}`,
      { headers: getAuthHeaders(req) }
    );
    if (!res.ok) {
      return NextResponse.json(
        { success: false, notifications: [], data: [], total: 0, unread_count: 0 },
        { status: 200 }
      );
    }
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { success: false, notifications: [], data: [], total: 0, unread_count: 0 },
      { status: 200 }
    );
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const body = await req.json().catch(() => ({}));
  const { searchParams } = req.nextUrl;
  const action = searchParams.get("action");

  if (action === "read-all") {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/community/notifications/read-all`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    } catch {
      return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
    }
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
