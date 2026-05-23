import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = request.nextUrl;
  const params = new URLSearchParams({
    page: searchParams.get("page") || "1",
    page_size: searchParams.get("page_size") || searchParams.get("pageSize") || "100",
  });

  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/events/my?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ events: [], total: 0, page: 1, page_count: 1 }, { status: 200 });
  }
}
