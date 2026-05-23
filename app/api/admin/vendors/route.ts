import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

function getAuthHeaders(request: NextRequest): Record<string, string> {
  const token = request.cookies.get("access_token")?.value;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function GET(request: NextRequest) {
  const role = request.cookies.get("role")?.value;
  const token = request.cookies.get("access_token")?.value;

  if (role !== "admin" || !token) {
    return NextResponse.json(
      { error: "Admin access required" },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "20";
  const search = searchParams.get("search");
  const category = searchParams.get("category");
  const status = searchParams.get("status");

  try {
    const backendParams = new URLSearchParams({
      page,
      page_size: limit,
      role: "vendor",
    });
    if (search) backendParams.set("search", search);
    if (status) backendParams.set("status", status);

    const response = await fetch(
      `${BACKEND_URL}/api/v1/admin/users?${backendParams}`,
      { headers: getAuthHeaders(request) }
    );
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Failed to fetch vendors" },
        { status: response.status }
      );
    }

    const users = (data.users || []).map((u: any) => ({
      id: u.id,
      userId: u.id,
      name: u.display_name || u.business_name || u.email,
      businessName: u.business_name,
      email: u.email,
      category: u.category || "Uncategorized",
      description: u.description || "",
      status: u.status || "pending",
      contactEmail: u.email,
      contactPhone: u.phone || "",
      city: u.city || "",
      rating: u.rating || 0,
      eventCount: u.events_created || u.events_attended || 0,
      completedEvents: u.completed_events || 0,
      totalRevenue: u.total_revenue || 0,
      subscription: u.subscription || null,
      createdAt: u.created_at,
      lastActivityAt: u.last_activity_at,
    }));

    return NextResponse.json({
      data: { vendors: users },
      vendors: users,
      totalPages: data.page_count || 1,
      pagination: {
        page: Number(data.page || page),
        pageSize: Number(limit),
        total: data.total || 0,
        totalPages: data.page_count || 1,
      },
    });
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return NextResponse.json(
      { error: "Failed to fetch vendors from database" },
      { status: 502 }
    );
  }
}
