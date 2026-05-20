import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

function getAuthHeaders(req: NextRequest): Record<string, string> {
  const token = req.cookies.get("access_token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/users/me`, {
      headers: getAuthHeaders(req),
    });
    const data = await res.json();
    return NextResponse.json({ success: true, profile: data }, { status: res.status });
  } catch {
    return NextResponse.json({ success: false, error: "Backend unavailable" }, { status: 503 });
  }
}

export async function PUT(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const body = await req.json().catch(() => ({}));

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/users/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
  }
}
