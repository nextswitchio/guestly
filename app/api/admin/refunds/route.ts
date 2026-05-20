import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

function getAuthHeaders(req: NextRequest): Record<string, string> {
  const token = req.cookies.get("access_token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status") || "";

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/admin/withdrawals${status ? `?status_filter=${status}` : ""}`, {
      headers: getAuthHeaders(req),
    });
    const data = await res.json();
    return NextResponse.json({ success: true, refunds: data }, { status: res.status });
  } catch {
    return NextResponse.json({ success: true, refunds: [] });
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const body = await req.json().catch(() => ({}));
  const { withdrawalId, approved } = body;

  if (!withdrawalId) {
    return NextResponse.json({ error: "Withdrawal ID required" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/admin/withdrawals/${withdrawalId}/process?approved=${approved}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      }
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
  }
}
