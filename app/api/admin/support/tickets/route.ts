import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

function authHeaders(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function requireAdmin(request: NextRequest) {
  return request.cookies.get("role")?.value === "admin" && request.cookies.get("access_token")?.value;
}

export async function GET(request: NextRequest) {
  if (!requireAdmin(request)) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Admin access required" } },
      { status: 401 },
    );
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/admin/support/tickets`, {
      headers: authHeaders(request),
      cache: "no-store",
    });
    if (res.status === 404) {
      return NextResponse.json({ success: true, data: [] });
    }
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "BACKEND_ERROR", message: "Support tickets backend unavailable" } },
      { status: 502 },
    );
  }
}

export async function POST(request: NextRequest) {
  if (!requireAdmin(request)) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Admin access required" } },
      { status: 401 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const { action, ticketId, message } = body;

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/admin/support/tickets`, {
      method: "POST",
      headers: authHeaders(request),
      body: JSON.stringify({ action, ticket_id: ticketId, message }),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "BACKEND_ERROR", message: "Backend unavailable" } },
      { status: 502 },
    );
  }
}
