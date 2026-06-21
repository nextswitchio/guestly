import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string; ticketId: string }> }) {
  const { id: eventId, ticketId } = await params;
  const token = req.cookies.get("access_token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const res = await fetch(`${BACKEND_URL}/api/v1/events/${eventId}/tickets/${ticketId}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Failed to update ticket" }));
      return NextResponse.json({ error: err.detail }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string; ticketId: string }> }) {
  const { id: eventId, ticketId } = await params;
  const token = req.cookies.get("access_token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/events/${eventId}/tickets/${ticketId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Failed to delete ticket" }));
      return NextResponse.json({ error: err.detail }, { status: res.status });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete ticket" }, { status: 500 });
  }
}
