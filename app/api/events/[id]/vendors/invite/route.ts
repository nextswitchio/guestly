import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Only organizers can invite vendors" }, { status: 401 });
    }

    const { id: eventId } = await params;
    const body = await req.json();
    const vendor_user_id = body.vendor_user_id || body.vendorUserId;

    if (!vendor_user_id) {
      return NextResponse.json({ error: "vendor_user_id is required" }, { status: 400 });
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/events/${eventId}/vendors/invite`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ vendor_user_id }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to invite vendor" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Failed to invite vendor" }, { status: 500 });
  }
}
