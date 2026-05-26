import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

const DRAFT_COOKIE = "event_draft";

function getDraft(req: NextRequest): Record<string, any> {
  try {
    const raw = req.cookies.get(DRAFT_COOKIE)?.value;
    if (!raw) return {};
    return JSON.parse(decodeURIComponent(raw));
  } catch {
    return {};
  }
}

export async function POST(req: NextRequest) {
  const role = req.cookies.get("user_role")?.value || req.cookies.get("role")?.value;
  if (role !== "organiser") {
    return NextResponse.json({ ok: false, error: "Organizer access required" }, { status: 403 });
  }

  const token = req.cookies.get("access_token")?.value;
  if (!token) {
    return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
  }

  const draft = getDraft(req);

  // Validate required fields
  if (!draft.title?.toString().trim()) return NextResponse.json({ ok: false, error: "Event title is required" }, { status: 400 });
  if (!draft.description?.toString().trim()) return NextResponse.json({ ok: false, error: "Event description is required" }, { status: 400 });
  if (!draft.date) return NextResponse.json({ ok: false, error: "Event date is required" }, { status: 400 });
  if (!draft.category) return NextResponse.json({ ok: false, error: "Event category is required" }, { status: 400 });
  if (!draft.country) return NextResponse.json({ ok: false, error: "Country is required" }, { status: 400 });
  if (!draft.city?.toString().trim()) return NextResponse.json({ ok: false, error: "City is required" }, { status: 400 });

  // Build tickets array from draft ticketSetup
  const tickets: Array<{
    name: string;
    ticket_type: string;
    price: number;
    available: number;
    total: number;
    attendance_type?: string;
  }> = [];

  const ts = draft.ticketSetup as any;
  if (ts) {
    if (draft.type === "Hybrid") {
      if ((ts.generalPhysicalQty ?? 0) > 0) {
        tickets.push({ name: "General (In-Person)", ticket_type: "General", price: ts.generalPhysicalPrice ?? 0, available: ts.generalPhysicalQty, total: ts.generalPhysicalQty, attendance_type: "physical" });
      } else if ((ts.generalQty ?? 0) > 0) {
        tickets.push({ name: "General", ticket_type: "General", price: ts.generalPrice ?? 0, available: ts.generalQty, total: ts.generalQty, attendance_type: "physical" });
      }
      if ((ts.generalVirtualQty ?? 0) > 0) {
        tickets.push({ name: "General (Virtual)", ticket_type: "General", price: ts.generalVirtualPrice ?? 0, available: ts.generalVirtualQty, total: ts.generalVirtualQty, attendance_type: "virtual" });
      }
      if ((ts.vipPhysicalQty ?? 0) > 0) {
        tickets.push({ name: "VIP (In-Person)", ticket_type: "VIP", price: ts.vipPhysicalPrice ?? 0, available: ts.vipPhysicalQty, total: ts.vipPhysicalQty, attendance_type: "physical" });
      } else if ((ts.vipQty ?? 0) > 0) {
        tickets.push({ name: "VIP", ticket_type: "VIP", price: ts.vipPrice ?? 0, available: ts.vipQty, total: ts.vipQty, attendance_type: "physical" });
      }
      if ((ts.vipVirtualQty ?? 0) > 0) {
        tickets.push({ name: "VIP (Virtual)", ticket_type: "VIP", price: ts.vipVirtualPrice ?? 0, available: ts.vipVirtualQty, total: ts.vipVirtualQty, attendance_type: "virtual" });
      }
    } else {
      if ((ts.generalQty ?? 0) > 0) {
        tickets.push({ name: "General", ticket_type: "General", price: ts.generalPrice ?? 0, available: ts.generalQty, total: ts.generalQty });
      }
      if ((ts.vipQty ?? 0) > 0) {
        tickets.push({ name: "VIP", ticket_type: "VIP", price: ts.vipPrice ?? 0, available: ts.vipQty, total: ts.vipQty });
      }
    }
  }

  if (tickets.length === 0) {
    return NextResponse.json({ ok: false, error: "At least one ticket type with quantity is required" }, { status: 400 });
  }

  // Build streaming config
  let streaming_config = null;
  const virtual = draft.virtual as any;
  if ((draft.type === "Virtual" || draft.type === "Hybrid") && virtual?.url) {
    streaming_config = {
      provider: virtual.provider || "Zoom",
      stream_url: virtual.url,
      access_control: virtual.accessControl || "ticket-holders",
      enable_replay: virtual.enableReplay ?? false,
    };
  }

  // Map draft → EventCreate payload
  const payload = {
    title: draft.title.toString().trim(),
    description: draft.description.toString().trim(),
    event_type: draft.type === "Virtual" ? "Virtual" : draft.type === "Hybrid" ? "Hybrid" : "Physical",
    category: draft.category,
    date: new Date(draft.date as string).toISOString(),
    country: draft.country,
    state: draft.state || null,
    city: draft.city.toString().trim(),
    venue: draft.venue?.toString().trim() || null,
    latitude: draft.latitude ?? null,
    longitude: draft.longitude ?? null,
    image: draft.image || null,
    community: draft.community?.toString().trim() || null,
    community_type: draft.communityType || null,
    post_event_merch_sales: (draft.merch as any)?.postEventSales ?? false,
    post_event_community_access: draft.postEventCommunityAccess ?? true,
    streaming_config,
    tickets,
    tags: [],
  };

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/events/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const detail = data?.detail;
      const message = Array.isArray(detail)
        ? detail.map((e: any) => `${e.loc?.slice(-1)[0] ?? "field"}: ${e.msg}`).join(", ")
        : typeof detail === "string"
        ? detail
        : data?.error || "Failed to create event";
      return NextResponse.json({ ok: false, error: message }, { status: res.status });
    }

    // Clear the draft cookie on success
    const successRes = NextResponse.json({ ok: true, event: data });
    successRes.cookies.set(DRAFT_COOKIE, "", { maxAge: 0, path: "/" });
    return successRes;
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Backend unavailable" }, { status: 502 });
  }
}
