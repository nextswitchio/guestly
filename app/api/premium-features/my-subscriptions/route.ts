import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

function getAuthHeaders(req: NextRequest): Record<string, string> {
  const token = req.cookies.get("access_token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const qs = searchParams.toString();
  
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/subscriptions/my${qs ? `?${qs}` : ""}`, {
      headers: getAuthHeaders(request),
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[premium-features my-subscriptions]", err);
    return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
  }
}
