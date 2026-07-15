import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

function authHeaders(request: NextRequest): Record<string, string> {
  const token = request.cookies.get("access_token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function GET(request: NextRequest) {
  // Validate token exists - backend will handle role validation via JWT
  const token = request.cookies.get("access_token")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);

  try {
    if (searchParams.get("stats") === "true") {
      const response = await fetch(`${BACKEND_URL}/api/v1/admin/affiliates/stats`, {
        headers: authHeaders(request),
        credentials: 'include',
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return NextResponse.json({ success: false, error: data }, { status: response.status });
      }

      return NextResponse.json({ success: true, data });
    }

    const backendParams = new URLSearchParams({
      page: searchParams.get("page") || "1",
      page_size: searchParams.get("limit") || "20",
    });

    const search = searchParams.get("search");
    const status = searchParams.get("status");
    if (search) backendParams.set("search", search);
    if (status && status !== "all") backendParams.set("status_filter", status);

    const response = await fetch(`${BACKEND_URL}/api/v1/admin/affiliates?${backendParams}`, {
      headers: authHeaders(request),
      credentials: 'include',
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json({ success: false, error: data }, { status: response.status });
    }

    return NextResponse.json({
      success: true,
      data: {
        affiliates: data.affiliates ?? [],
        pagination: {
          page: Number(data.page ?? backendParams.get("page") ?? 1),
          limit: Number(backendParams.get("page_size") ?? 20),
          total: Number(data.total ?? 0),
          totalPages: Number(data.page_count ?? 1),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching admin influencers:", error);
    return NextResponse.json(
      { success: false, error: { code: "BACKEND_ERROR", message: "Failed to fetch influencers" } },
      { status: 502 }
    );
  }
}
