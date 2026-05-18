import { NextRequest, NextResponse } from "next/server";
import { getVendorByUserId, getServiceProfile, updateServiceProfile, deleteServiceProfile } from "@/lib/store";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = req.cookies.get("user_id")?.value;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const vendor = getVendorByUserId(userId);
  if (!vendor) return NextResponse.json({ error: "Vendor not found" }, { status: 404 });

  const profile = getServiceProfile(id);
  if (!profile || profile.vendorId !== vendor.id) {
    return NextResponse.json({ error: "Service profile not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, profile });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = req.cookies.get("user_id")?.value;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const vendor = getVendorByUserId(userId);
  if (!vendor) return NextResponse.json({ error: "Vendor not found" }, { status: 404 });

  const body = await req.json();
  const profile = updateServiceProfile(id, body);
  if (!profile) {
    return NextResponse.json({ error: "Service profile not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, profile });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = req.cookies.get("user_id")?.value;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const vendor = getVendorByUserId(userId);
  if (!vendor) return NextResponse.json({ error: "Vendor not found" }, { status: 404 });

  const deleted = deleteServiceProfile(id);
  if (!deleted) {
    return NextResponse.json({ error: "Service profile not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = req.cookies.get("user_id")?.value;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const vendor = getVendorByUserId(userId);
  if (!vendor) return NextResponse.json({ error: "Vendor not found" }, { status: 404 });

  const body = await req.json();
  const profile = updateServiceProfile(id, body);
  if (!profile) {
    return NextResponse.json({ error: "Service profile not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, profile });
}
