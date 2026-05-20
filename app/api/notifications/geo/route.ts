import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const unsentOnly = searchParams.get("unsentOnly") === "true";

    const res = await fetch(`${BACKEND_URL}/api/v1/community/notifications/geo?unsent_only=${unsentOnly}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to fetch geo notifications" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Failed to fetch geo notifications" }, { status: 500 });
  }
}
