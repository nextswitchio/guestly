import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const token = _request.cookies.get("access_token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/featured/requests/${id}/receipt`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const text = await response.text();
    let detail: string;
    try {
      const j = JSON.parse(text);
      detail = j.detail || j.message || text;
    } catch {
      detail = text || response.statusText;
    }
    if (!response.ok) return NextResponse.json({ error: detail }, { status: 400 });
    return NextResponse.json({ success: true, data: JSON.parse(text) });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to load receipt" }, { status: 502 });
  }
}
