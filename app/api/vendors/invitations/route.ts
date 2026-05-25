import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const auth = { Authorization: `Bearer ${token}` };

    const res = await fetch(`${BACKEND_URL}/api/v1/vendors/invitations`, {
      headers: auth,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to fetch invitations" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const invitations: any[] = await res.json();

    // Enrich each invitation with event and organizer details
    const enriched = await Promise.all(
      invitations.map(async (inv: any) => {
        const enrichedInv = { ...inv };

        // Fetch event details
        if (inv.event_id) {
          try {
            const evRes = await fetch(`${BACKEND_URL}/api/v1/events/${inv.event_id}`, {
              headers: { ...auth, "Content-Type": "application/json" },
            });
            if (evRes.ok) {
              const evData = await evRes.json();
              const ev = evData.data ?? evData;
              enrichedInv.event = {
                id: ev.id,
                title: ev.title,
                date: ev.date,
                image: ev.image || ev.banner_image,
                venue: ev.venue,
                city: ev.city,
                state: ev.state,
                country: ev.country,
                category: ev.category,
                eventType: ev.event_type,
                description: ev.description,
              };
            }
          } catch { /* non-fatal */ }
        }

        // Fetch organizer details
        if (inv.organizer_id) {
          try {
            const orgRes = await fetch(`${BACKEND_URL}/api/v1/users/${inv.organizer_id}`, {
              headers: auth,
            });
            if (orgRes.ok) {
              const orgData = await orgRes.json();
              enrichedInv.organizer = {
                id: orgData.id,
                display_name: orgData.display_name,
                email: orgData.email,
                avatar: orgData.avatar,
                is_verified: orgData.is_verified ?? false,
                role: orgData.role,
              };
            }
          } catch { /* non-fatal */ }
        }

        return enrichedInv;
      })
    );

    return NextResponse.json({ success: true, data: enriched });
  } catch {
    return NextResponse.json({ error: "Failed to fetch invitations" }, { status: 500 });
  }
}
