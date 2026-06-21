import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

function authHeaders(req: NextRequest): Record<string, string> {
  const token = req.cookies.get("access_token")?.value;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function requireAdmin(request: NextRequest) {
  return request.cookies.get("role")?.value === "admin" && request.cookies.get("access_token")?.value;
}

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Admin access required" } },
      { status: 401 },
    );
  }

  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status") || "";

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/admin/withdrawals${status ? `?status_filter=${status}` : ""}`, {
      headers: authHeaders(req),
      cache: "no-store",
      credentials: 'include',
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "BACKEND_ERROR", message: "Withdrawals backend unavailable" } },
      { status: 502 },
    );
  }
}

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Admin access required" } },
      { status: 401 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const { withdrawalId, approved } = body;

  if (!withdrawalId) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: "Withdrawal ID required" } },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/admin/withdrawals/${withdrawalId}/process?approved=${approved}`,
      {
        method: "POST",
        headers: authHeaders(req),
        credentials: 'include',
      }
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "BACKEND_ERROR", message: "Backend unavailable" } },
      { status: 502 },
    );
  }
}
