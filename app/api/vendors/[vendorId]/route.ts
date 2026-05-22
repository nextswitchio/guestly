import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";
import { fromBackendServiceProfile } from "@/lib/api/serviceProfiles";

type BackendVendor = Record<string, unknown>;

function toClientVendor(vendor: BackendVendor, serviceProfiles: Record<string, unknown>[]) {
  return {
    ...vendor,
    userId: vendor.user_id,
    contactEmail: vendor.contact_email,
    contactPhone: vendor.contact_phone,
    rateCard: vendor.rate_card,
    reviewCount: vendor.review_count,
    completedEvents: vendor.completed_events,
    createdAt: vendor.created_at,
    updatedAt: vendor.updated_at,
    serviceProfiles,
  };
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ vendorId: string }> }
) {
  try {
    const { vendorId } = await params;
    const res = await fetch(`${BACKEND_URL}/api/v1/vendors/${vendorId}`);

    if (!res.ok) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    const vendor = await res.json() as BackendVendor;
    const serviceProfilesRes = await fetch(`${BACKEND_URL}/api/v1/vendors/${vendorId}/services`);
    const serviceProfilesData = serviceProfilesRes.ok ? await serviceProfilesRes.json() : [];
    const serviceProfiles = Array.isArray(serviceProfilesData)
      ? serviceProfilesData.map(fromBackendServiceProfile)
      : [];
    const clientVendor = toClientVendor(vendor, serviceProfiles);

    return NextResponse.json({ success: true, vendor: clientVendor, data: { vendor: clientVendor } });
  } catch {
    return NextResponse.json({ error: "Failed to fetch vendor" }, { status: 500 });
  }
}
