import { NextRequest, NextResponse } from "next/server";
import { inviteVendorToEvent, listEventVendors } from "@/lib/store";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = listEventVendors(id);
  return NextResponse.json({ ok: true, data });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const vendorUserId: string = body?.vendorUserId || "";
  if (!vendorUserId) {
    return NextResponse.json({ ok: false, error: "vendorUserId required" }, { status: 400 });
  }
  try {
    const link = inviteVendorToEvent(id, vendorUserId);
    return NextResponse.json({ ok: true, data: link });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 400 });
  }
}

