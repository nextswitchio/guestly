import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const params = new URLSearchParams();
  ["country", "city", "latitude", "longitude", "page_size", "pageSize"].forEach((key) => {
    const value = searchParams.get(key);
    if (!value) return;
    params.set(key === "pageSize" ? "page_size" : key, value);
  });

  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/events/featured/?${params}`, { cache: "no-store" });
    const data = await response.json();
    return NextResponse.json({ success: response.ok, events: data, data }, { status: response.status });
  } catch {
    return NextResponse.json({ success: false, events: [], data: [] }, { status: 200 });
  }
}
