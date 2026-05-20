import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const vendorRes = await fetch(`${BACKEND_URL}/api/v1/vendors/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!vendorRes.ok) {
      return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 });
    }

    const vendor = await vendorRes.json();

    const [invitationsRes, reviewsRes] = await Promise.all([
      fetch(`${BACKEND_URL}/api/v1/vendors/invitations`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${BACKEND_URL}/api/v1/vendors/${vendor.id}/reviews`, { headers: { Authorization: `Bearer ${token}` } }),
    ]);

    const invitations = invitationsRes.ok ? await invitationsRes.json() : [];
    const reviews = reviewsRes.ok ? await reviewsRes.json() : [];
    const acceptedInvitations = (invitations.data || invitations).filter((inv: { status: string }) => inv.status === "accepted");

    const conversionRate = invitations.length > 0 ? (acceptedInvitations.length / invitations.length) * 100 : 0;

    return NextResponse.json({
      profileViews: vendor.profile_views || 0,
      invitationsSent: invitations.length,
      invitationsAccepted: acceptedInvitations.length,
      conversionRate,
      eventsCompleted: vendor.completed_events || 0,
      averageRating: vendor.average_rating || 0,
      totalEarnings: vendor.total_earnings || 0,
      reviews,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
