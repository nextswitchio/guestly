import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

function getAuthHeaders(request: NextRequest): Record<string, string> {
  // Prefer Authorization header if provided (client may send token in header)
  const headerAuth = request.headers.get("authorization") || request.headers.get("Authorization");
  if (headerAuth) return { Authorization: headerAuth };

  const token = request.cookies.get("access_token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function backendRole(role: string | null): string | null {
  if (!role) return null;
  return role === "organizer" ? "organiser" : role;
}

export async function GET(request: NextRequest) {
  // Validate we have a token - backend will handle role validation via JWT
  const token = request.cookies.get("access_token")?.value ||
               request.headers.get("authorization") ||
               request.headers.get("Authorization");

  if (!token) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } },
      { status: 401 }
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

    let rawUsers = data.users ?? data.items ?? data.data ?? data.results ?? [];
    if (!Array.isArray(rawUsers) && rawUsers?.users) {
      rawUsers = rawUsers.users;
    } else if (!Array.isArray(rawUsers) && rawUsers?.items) {
      rawUsers = rawUsers.items;
    }
    const total = Number(data.total ?? data.total_count ?? data.count ?? rawUsers.length);
    const pageSize = Number(limit);

    const users = rawUsers.map((u: any) => ({
      id: u.id,
      email: u.email,
      displayName: u.display_name ?? u.displayName,
      role: u.role,
      status: u.status,
      createdAt: u.created_at ?? u.createdAt,
      lastActivityAt: u.last_activity_at ?? u.lastActivityAt,
      eventsCreated: u.events_created ?? u.eventsCreated,
      eventsAttended: u.events_attended ?? u.eventsAttended,
      totalSpent: u.total_spent ?? u.totalSpent,
      walletBalance: u.wallet_balance ?? u.walletBalance,
      profileCompleteness: u.profile_completeness ?? u.profileCompleteness,
      location: u.location
        ? { city: u.location.city, country: u.location.country }
        : undefined,
    }));

    if (!users.length) {
      console.warn("[admin/users] Backend returned empty users list. Raw response keys:", Object.keys(data));
    }

    return NextResponse.json({
      success: true,
      data: {
        users,
        pagination: {
          page: Number(data.page ?? data.page_number ?? data.current_page ?? page),
          limit: pageSize,
          total,
          totalPages: Number(data.page_count ?? data.total_pages ?? Math.max(1, Math.ceil(total / pageSize))),
          hasNext: Number(data.page ?? 1) < Number(data.page_count ?? data.total_pages ?? 1),
          hasPrev: Number(data.page ?? 1) > 1,
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
