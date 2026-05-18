import { NextRequest, NextResponse } from "next/server";
import {
  getVendorByUserId,
  listVendorInvitations,
  getVendorReviews,
  isVendorActive,
  getVendorPerformance,
} from "@/lib/store";

/**
 * GET /api/vendor/analytics
 * Get analytics for premium vendors
 */
export async function GET(req: NextRequest) {
  const userId = req.cookies.get("user_id")?.value;

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const vendor = getVendorByUserId(userId);

  if (!vendor) {
    return NextResponse.json(
      { error: "Vendor profile not found" },
      { status: 404 }
    );
  }

  // Check if vendor has premium subscription
  const isPremium = isVendorActive(userId);

  if (!isPremium) {
    return NextResponse.json(
      { error: "Premium subscription required for analytics" },
      { status: 403 }
    );
  }

  // Get vendor performance metrics
  const performance = getVendorPerformance(userId);

  // Get vendor invitations
  const invitations = listVendorInvitations(userId);
  const acceptedInvitations = invitations.filter((inv) => inv.status === "accepted");

  // Get vendor reviews
  const reviews = getVendorReviews(vendor.id);

  // Calculate conversion rate
  const conversionRate = invitations.length > 0
    ? (acceptedInvitations.length / invitations.length) * 100
    : 0;

  // Mock profile views data (in a real app, this would be tracked)
  const profileViews = Math.floor(Math.random() * 500) + 100;
  const viewsThisMonth = Math.floor(Math.random() * 200) + 50;
  const viewsLastMonth = Math.floor(Math.random() * 150) + 40;

  // Mock earnings data (in a real app, this would be tracked from payments)
  const totalEarnings = acceptedInvitations.length * 50000; // ₦50,000 per event

  // Calculate top categories from accepted invitations
  const categoryCount: Record<string, number> = {};
  acceptedInvitations.forEach(() => {
    // In a real app, we'd get the event category
    const category = "Corporate"; // Mock category
    categoryCount[category] = (categoryCount[category] || 0) + 1;
  });

  const topCategories = Object.entries(categoryCount)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const analytics = {
    profileViews,
    invitationsSent: invitations.length,
    invitationsAccepted: acceptedInvitations.length,
    conversionRate,
    eventsCompleted: performance.completedEvents,
    averageRating: performance.averageRating,
    averageResponseTime: performance.averageResponseTime,
    reliabilityScore: performance.reliabilityScore,
    acceptanceRate: performance.acceptanceRate,
    totalEarnings,
    viewsThisMonth,
    viewsLastMonth,
    topCategories,
    performance, // Include full performance object
  };

  return NextResponse.json(analytics);
}
