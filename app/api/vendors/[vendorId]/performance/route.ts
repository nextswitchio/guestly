import { NextRequest, NextResponse } from "next/server";
import { getVendorById, getVendorByUserId, getVendorPerformance } from "@/lib/store";

/**
 * GET /api/vendors/[vendorId]/performance
 * Get public performance metrics for a vendor
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ vendorId: string }> }
) {
  const { vendorId } = await params;

  // Try to find vendor by ID or userId
  let vendor = getVendorById(vendorId);
  if (!vendor) {
    vendor = getVendorByUserId(vendorId);
  }

  if (!vendor) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message: "Vendor not found" } },
      { status: 404 }
    );
  }

  try {
    // Get performance metrics
    const performance = getVendorPerformance(vendor.userId);

    // Return public performance data
    const publicPerformance = {
      completedEvents: performance.completedEvents,
      averageRating: performance.averageRating,
      reliabilityScore: performance.reliabilityScore,
      acceptanceRate: performance.acceptanceRate,
      // Don't expose sensitive metrics like response time to public
    };

    return NextResponse.json({
      success: true,
      data: publicPerformance,
    });
  } catch (error) {
    console.error("Error fetching vendor performance:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to fetch performance data" } },
      { status: 500 }
    );
  }
}
