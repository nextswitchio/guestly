import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: eventId } = await params;
    const res = await fetch(`${BACKEND_URL}/api/v1/events/${eventId}/vendors`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to fetch vendors" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    const invitations = Array.isArray(data) ? data : [];
    const enriched = await Promise.all(invitations.map(async (invitation: Record<string, any>) => {
      const vendorId = invitation.vendor_id || invitation.vendorId;
      if (!vendorId) return invitation;

      const vendorRes = await fetch(`${BACKEND_URL}/api/v1/vendors/${vendorId}`);
      const vendor = vendorRes.ok ? await vendorRes.json() : null;

      return {
        ...invitation,
        eventId: invitation.event_id || invitation.eventId,
        vendorUserId: vendor?.user_id || invitation.vendor_user_id || vendorId,
        profileId: vendor?.id || vendorId,
        category: vendor?.category || invitation.category,
        invitedAt: invitation.created_at ? Date.parse(invitation.created_at) : invitation.invitedAt,
      };
    }));

    return NextResponse.json({ success: true, data: enriched });
  } catch {
    return NextResponse.json({ error: "Failed to fetch event vendors" }, { status: 500 });
  }
}
