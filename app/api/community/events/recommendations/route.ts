import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const { searchParams } = req.nextUrl;
  const limit = searchParams.get("limit") || "20";

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/community/events/recommendations?limit=${limit}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ success: false, error: "Backend unavailable", data: [] }, { status: 503 });
  }
}
