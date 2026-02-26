import { NextRequest, NextResponse } from "next/server";
import { updateVendorInviteStatus, listVendorInvitations } from "@/lib/store";

// This API lists and updates vendor invitations for the current vendor user
// GET: list invites for vendorUserId from cookie
// PATCH: update invite status with { eventId, status }

export async function GET(req: NextRequest) {
  const vendorUserId = req.cookies.get("user_id")?.value;
  if (!vendorUserId) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const data = listVendorInvitations(vendorUserId);
  return NextResponse.json({ ok: true, data });
}

export async function PATCH(req: NextRequest) {
  const vendorUserId = req.cookies.get("user_id")?.value;
  if (!vendorUserId) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const eventId: string = body?.eventId || "";
  const status: "invited" | "accepted" | "declined" = body?.status;
  if (!eventId || !status) return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  try {
    const link = updateVendorInviteStatus(eventId, vendorUserId, status);
    return NextResponse.json({ ok: true, data: link });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 400 });
  }
}
