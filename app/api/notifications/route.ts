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

  try {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/community/notifications?page=${page}&page_size=${page_size}`,
      { headers: getAuthHeaders(req) }
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ notifications: [], total: 0, unread_count: 0 });
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
