import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Only vendors can respond to invitations" }, { status: 401 });
    }

    const { id: invitationId } = await params;
    const body = await req.json();
    const { status } = body;

    if (!status || !["accepted", "declined"].includes(status)) {
      return NextResponse.json({ error: "status must be 'accepted' or 'declined'" }, { status: 400 });
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/vendors/invitations/${invitationId}/respond`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to respond to invitation" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Failed to respond to invitation" }, { status: 500 });
  }
}
