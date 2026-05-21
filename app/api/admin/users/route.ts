import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

function getAuthHeaders(request: NextRequest): Record<string, string> {
  const token = request.cookies.get("access_token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function backendRole(role: string | null): string | null {
  if (!role) return null;
  return role === "organizer" ? "organiser" : role;
}

export async function GET(request: NextRequest) {
  const role = request.cookies.get("role")?.value;
  const token = request.cookies.get("access_token")?.value;

  if (role !== "admin" || !token) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Admin access required" } },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);

  try {
    if (searchParams.get("stats") === "true") {
      const response = await fetch(`${BACKEND_URL}/api/v1/admin/users/stats`, {
        headers: getAuthHeaders(request),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return NextResponse.json(
          { success: false, error: data },
          { status: response.status }
        );
      }

      return NextResponse.json({ success: true, data });
    }

    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || searchParams.get("page_size") || "20";
    const backendParams = new URLSearchParams({
      page,
      page_size: limit,
    });

    const search = searchParams.get("search");
    const roleFilter = backendRole(searchParams.get("role"));
    const statusFilter = searchParams.get("status");

    if (search) backendParams.set("search", search);
    if (roleFilter) backendParams.set("role", roleFilter);
    if (statusFilter) backendParams.set("status", statusFilter);

    const response = await fetch(`${BACKEND_URL}/api/v1/admin/users?${backendParams}`, {
      headers: getAuthHeaders(request),
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data },
        { status: response.status }
      );
    }

    const total = Number(data.total ?? 0);
    const pageSize = Number(limit);

    return NextResponse.json({
      success: true,
      data: {
        users: data.users ?? [],
        pagination: {
          page: Number(data.page ?? page),
          limit: pageSize,
          total,
          totalPages: Number(data.page_count ?? Math.max(1, Math.ceil(total / pageSize))),
          hasNext: Number(data.page ?? page) < Number(data.page_count ?? 1),
          hasPrev: Number(data.page ?? page) > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching admin users from backend:", error);
    return NextResponse.json(
      { success: false, error: { code: "BACKEND_ERROR", message: "Failed to fetch users from database" } },
      { status: 502 }
    );
  }
}
