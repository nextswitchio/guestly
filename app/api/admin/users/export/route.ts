import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const backendUrl = new URL(`${BACKEND_URL}/api/v1/admin/users/export`);
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const role = searchParams.get("role");
    const status = searchParams.get("status");

    if (search) backendUrl.searchParams.set("search", search);
    if (role) backendUrl.searchParams.set("role", role);
    if (status) backendUrl.searchParams.set("status", status);

    const res = await fetch(backendUrl, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to export users" }, { status: res.status });
    }

    const csvContent = await res.text();

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=users_export_${new Date().toISOString().slice(0, 10)}.csv`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to export users" }, { status: 500 });
  }
}
