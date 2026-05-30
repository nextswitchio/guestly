import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

function getAuthHeaders(req: NextRequest): Record<string, string> {
  const token = req.cookies.get("access_token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/features/${id}/purchase`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders(request) },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[premium-features purchase]", err);
    return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
  }
}
