import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
    const res = await fetch(`${BACKEND_URL}/api/v1/community/notifications/geo/${id}/sent`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Notification not found" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    return NextResponse.json({ success: true, data: { notificationId: id, sent: true } });
  } catch {
    return NextResponse.json({ error: "Failed to mark notification as sent" }, { status: 500 });
  }
}
