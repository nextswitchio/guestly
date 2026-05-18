import { NextRequest, NextResponse } from "next/server";
import { getVendorById, getVendorReviews } from "@/lib/store";

/**
 * GET /api/vendors/[vendorId]
 * Get vendor profile details with reviews
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ vendorId: string }> }
) {
  try {
    const { vendorId } = await params;
    
    const vendor = getVendorById(vendorId);
    if (!vendor) {
      return NextResponse.json(
        { success: false, error: "Vendor not found" },
        { status: 404 }
      );
    }

    const reviews = getVendorReviews(vendorId);

    return NextResponse.json({
      success: true,
      data: {
        vendor,
        reviews,
      },
    });
  } catch (error) {
    console.error("Error fetching vendor:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch vendor" },
      { status: 500 }
    );
  }
}
