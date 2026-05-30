import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

function getAuthHeaders(req: NextRequest): Record<string, string> {
  const token = req.cookies.get("access_token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body.feature_id !== "string") {
    return NextResponse.json({ error: "feature_id is required" }, { status: 400 });
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/premium-features/wishlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders(request) },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[premium-features wishlist add]", err);
    return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
  }
}
