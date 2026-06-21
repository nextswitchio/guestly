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
  const period = searchParams.get("period") || "month";
  const exportReport = searchParams.get("export");
  const format = searchParams.get("format") || "csv";

  try {
    const backendParams = new URLSearchParams({ period });
    let backendPath = `${BACKEND_URL}/api/v1/admin/analytics`;

    if (exportReport) {
      backendPath = `${BACKEND_URL}/api/v1/admin/analytics/export`;
      backendParams.set("report", exportReport);
      backendParams.set("format", format);
    }

    const response = await fetch(`${backendPath}?${backendParams}`, {
      headers: authHeaders(request),
    });

    if (exportReport && format === "csv") {
      const content = await response.text();
      return new NextResponse(content, {
        status: response.status,
        headers: {
          "Content-Type": response.headers.get("Content-Type") || "text/csv",
          "Content-Disposition": response.headers.get("Content-Disposition") || `attachment; filename="guestly-${exportReport}-${period}.csv"`,
        },
      });
    }

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error fetching admin analytics:", error);
    return NextResponse.json(
      { success: false, error: { code: "BACKEND_ERROR", message: "Failed to fetch analytics" } },
      { status: 502 }
    );
  }
}
