import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: notificationId } = await params;
    const token = req.cookies.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/community/notifications/${notificationId}/read`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to mark notification as read" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    return NextResponse.json({ message: "Notification marked as read" });
  } catch {
    return NextResponse.json({ error: "Failed to mark notification as read" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: notificationId } = await params;
    const token = req.cookies.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/community/notifications/${notificationId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to delete notification" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    return NextResponse.json({ message: "Notification deleted" });
  } catch {
    return NextResponse.json({ error: "Failed to delete notification" }, { status: 500 });
  }
}
