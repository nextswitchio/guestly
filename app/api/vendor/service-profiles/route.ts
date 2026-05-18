import { NextRequest, NextResponse } from "next/server";
import { getVendorByUserId, listServiceProfiles, addServiceProfile, getMaxServiceProfiles } from "@/lib/store";

export async function GET(req: NextRequest) {
  const userId = req.cookies.get("user_id")?.value;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const vendor = getVendorByUserId(userId);
  if (!vendor) return NextResponse.json({ error: "Vendor not found" }, { status: 404 });

  const profiles = listServiceProfiles(vendor.id);
  return NextResponse.json({ ok: true, profiles });
}

export async function POST(req: NextRequest) {
  const userId = req.cookies.get("user_id")?.value;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const vendor = getVendorByUserId(userId);
  if (!vendor) return NextResponse.json({ error: "Vendor not found" }, { status: 404 });

  const existing = listServiceProfiles(vendor.id);
  const max = getMaxServiceProfiles(vendor.subscription);
  if (existing.length >= max) {
    return NextResponse.json({ error: "Service profile limit reached. Upgrade your subscription." }, { status: 400 });
  }

  const body = await req.json();
  const profile = addServiceProfile(vendor.id, body);
  return NextResponse.json({ ok: true, profile }, { status: 201 });
}
