import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

function getAuthHeaders(req: NextRequest): Record<string, string> {
  const token = req.cookies.get("access_token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = req.cookies.get("access_token")?.value;

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/events/${id}/metrics`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const data = await res.json();
    return NextResponse.json({ success: true, metrics: data }, { status: res.status });
  } catch {
    return NextResponse.json({ success: true, metrics: {} });
  }
}
