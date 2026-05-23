import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const params = new URLSearchParams();

  const fields = ["q", "category", "country", "city", "event_type", "status", "community", "communityType", "startDate", "endDate", "sort", "page", "page_size", "pageSize"];
  fields.forEach((f) => {
    const val = searchParams.get(f);
    if (val) {
      // Normalize pageSize to page_size for backend
      const key = f === "pageSize" ? "page_size" : f;
      params.set(key, val);
    }
  });

  const query = params.toString();
  const url = `${BACKEND_URL}/api/v1/events/${query ? `?${query}` : ""}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ events: [], total: 0, page: 1, page_count: 1 }, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const body = await req.json().catch(() => ({}));

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/events/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
  }
}
