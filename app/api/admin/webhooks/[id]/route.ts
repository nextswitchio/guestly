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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!requireAdmin(request)) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Admin access required" } },
      { status: 401 },
    );
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const res = await fetch(`${BACKEND_URL}/api/v1/admin/webhooks/${id}`, {
      method: "PUT",
      headers: authHeaders(request),
      body: JSON.stringify(body),
      credentials: "include",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "BACKEND_ERROR", message: "Failed to update webhook" } },
      { status: 502 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!requireAdmin(request)) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Admin access required" } },
      { status: 401 },
    );
  }

  const { id } = await params;

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/admin/webhooks/${id}`, {
      method: "DELETE",
      headers: authHeaders(request),
      credentials: "include",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "BACKEND_ERROR", message: "Failed to delete webhook" } },
      { status: 502 },
    );
  }
}
