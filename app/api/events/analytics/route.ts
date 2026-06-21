import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const role = req.cookies.get("role")?.value;

  if (!token || role !== "organiser") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/events/my/analytics`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json({ success: true, data }, { status: res.status });
  } catch {
    return NextResponse.json({ success: false, error: "Backend unavailable" }, { status: 502 });
  }
}
