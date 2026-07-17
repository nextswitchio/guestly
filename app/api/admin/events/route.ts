import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

function getAuthHeaders(request: NextRequest): Record<string, string> {
  const headerAuth = request.headers.get("authorization") || request.headers.get("Authorization");
  if (headerAuth) return { Authorization: headerAuth };
  const token = request.cookies.get("access_token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { organizer_id, ...eventData } = body;

    const url = new URL(`${BACKEND_URL}/api/v1/admin/events`);
    if (organizer_id) url.searchParams.set("organizer_id", organizer_id);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        ...getAuthHeaders(request),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
      credentials: "include",
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to create event" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
