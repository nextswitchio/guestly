import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

function getAuthHeaders(request: NextRequest): Record<string, string> {
  const headerAuth = request.headers.get("authorization") || request.headers.get("Authorization");
  if (headerAuth) return { Authorization: headerAuth };
  const token = request.cookies.get("access_token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = request.cookies.get("access_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const res = await fetch(`${BACKEND_URL}/api/v1/admin/events/${id}`, {
      method: "PUT",
      headers: {
        ...getAuthHeaders(request),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      credentials: "include",
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to update event" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = request.cookies.get("access_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const { id } = await params;

    const res = await fetch(`${BACKEND_URL}/api/v1/admin/events/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(request),
      credentials: "include",
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to delete event" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
