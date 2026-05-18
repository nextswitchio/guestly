import { NextRequest, NextResponse } from "next/server";
import { getVendorByUserId, getMaxServiceProfiles } from "@/lib/store";

export async function GET(req: NextRequest) {
  const userId = req.cookies.get("user_id")?.value;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const vendor = getVendorByUserId(userId);
  if (!vendor) return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 });

  return NextResponse.json({
    success: true,
    subscription: vendor.subscription || null,
    isPremium: !!vendor.subscription && vendor.subscription.expiresAt > Date.now(),
    maxServiceProfiles: getMaxServiceProfiles(vendor.subscription),
  });
}
