import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

function getAuthHeaders(request: NextRequest): Record<string, string> {
  const headerAuth = request.headers.get("authorization") || request.headers.get("Authorization");
  if (headerAuth) return { Authorization: headerAuth };
  const token = request.cookies.get("access_token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const body = await request.json();

    const res = await fetch(`${BACKEND_URL}/api/v1/admin/users/bulk-update`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(request),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      credentials: "include",
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to bulk update users" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Failed to bulk update users" }, { status: 500 });
  }
}
