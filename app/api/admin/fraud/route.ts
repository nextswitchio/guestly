import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "stats") {
      const res = await fetch(`${BACKEND_URL}/api/v1/admin/fraud/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.ok ? await res.json() : {};
      return NextResponse.json({ success: true, data });
    }

    if (action === "run-detection") {
      const res = await fetch(`${BACKEND_URL}/api/v1/admin/fraud/detect`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.ok ? await res.json() : {};
      return NextResponse.json({ success: true, data });
    }

    const status = searchParams.get("status") || undefined;
    const severity = searchParams.get("severity") || undefined;
    const type = searchParams.get("type") || undefined;
    const limit = searchParams.get("limit") || undefined;

    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (severity) params.set("severity", severity);
    if (type) params.set("type", type);
    if (limit) params.set("limit", limit);

    const res = await fetch(`${BACKEND_URL}/api/v1/admin/fraud?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to fetch alerts" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Failed to fetch fraud alerts" }, { status: 500 });
  }
}
