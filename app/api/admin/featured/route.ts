import { NextRequest, NextResponse } from "next/server";
import {
  createFeaturedPlacement,
  getAllFeaturedPlacements,
  getFeaturedPlacementStats,
  calculateSponsorshipRevenue,
  expireOldPlacements,
  getAvailablePositions,
  getFeaturedEventsWithDetails,
  logAdminAction,
} from "@/lib/store";

// GET /api/admin/featured - Get all featured placements or stats
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const status = searchParams.get('status') as any;
    const position = searchParams.get('position');
    const createdBy = searchParams.get('createdBy');
    const activeOnly = searchParams.get('activeOnly') === 'true';

    // Check admin authentication
    const userRole = request.cookies.get("role")?.value;
    if (userRole !== "admin") {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Admin access required" } },
        { status: 401 }
      );
    }

    // Expire old placements first
    expireOldPlacements();

    if (action === 'stats') {
      const stats = getFeaturedPlacementStats();
      return NextResponse.json({ success: true, data: stats });
    }

    if (action === 'revenue') {
      const startDate = searchParams.get('startDate');
      const endDate = searchParams.get('endDate');
      
      const filters: any = {};
      if (startDate) filters.startDate = parseInt(startDate);
      if (endDate) filters.endDate = parseInt(endDate);
      if (position) filters.position = parseInt(position);
      
      const revenue = calculateSponsorshipRevenue(filters);
      return NextResponse.json({ success: true, data: revenue });
    }

    if (action === 'available-positions') {
      const startDate = searchParams.get('startDate');
      const endDate = searchParams.get('endDate');
      const maxPositions = searchParams.get('maxPositions');
      
      if (!startDate || !endDate) {
        return NextResponse.json(
          { success: false, error: { code: "INVALID_REQUEST", message: "Start date and end date are required" } },
          { status: 400 }
        );
      }
      
      const available = getAvailablePositions(
        parseInt(startDate),
        parseInt(endDate),
        maxPositions ? parseInt(maxPositions) : 10
      );
      return NextResponse.json({ success: true, data: available });
    }

    if (action === 'featured-events') {
      const featuredEvents = getFeaturedEventsWithDetails();
      return NextResponse.json({ success: true, data: featuredEvents });
    }

    // Get all placements with filters
    const filters: any = {};
    if (status) filters.status = status;
    if (position) filters.position = parseInt(position);
    if (createdBy) filters.createdBy = createdBy;
    if (activeOnly) filters.activeOnly = activeOnly;

    const placements = getAllFeaturedPlacements(filters);
    return NextResponse.json({ success: true, data: placements });

  } catch (error) {
    console.error("Error in GET /api/admin/featured:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: "INTERNAL_ERROR", 
          message: error instanceof Error ? error.message : "Internal server error" 
        } 
      },
      { status: 500 }
    );
  }
}

// POST /api/admin/featured - Create new featured placement
export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const userRole = request.cookies.get("role")?.value;
    const userId = request.cookies.get("user_id")?.value;
    const adminName = request.cookies.get("admin_name")?.value || "Admin User";
    
    if (userRole !== "admin" || !userId) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Admin access required" } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { eventId, position, startDate, endDate, sponsorshipFee, notes } = body;

    // Validate required fields
    if (!eventId || !position || !startDate || !endDate) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: "INVALID_REQUEST", 
            message: "Event ID, position, start date, and end date are required" 
          } 
        },
        { status: 400 }
      );
    }

    // Validate position is a positive integer
    if (!Number.isInteger(position) || position < 1) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: "INVALID_REQUEST", 
            message: "Position must be a positive integer" 
          } 
        },
        { status: 400 }
      );
    }

    // Validate dates are numbers
    if (!Number.isInteger(startDate) || !Number.isInteger(endDate)) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: "INVALID_REQUEST", 
            message: "Start date and end date must be timestamps" 
          } 
        },
        { status: 400 }
      );
    }

    // Validate sponsorship fee if provided
    if (sponsorshipFee !== undefined && (typeof sponsorshipFee !== 'number' || sponsorshipFee < 0)) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: "INVALID_REQUEST", 
            message: "Sponsorship fee must be a non-negative number" 
          } 
        },
        { status: 400 }
      );
    }

    const placement = createFeaturedPlacement(
      eventId,
      position,
      startDate,
      endDate,
      userId,
      sponsorshipFee,
      notes
    );

    // Log the featured placement creation
    logAdminAction(
      userId,
      adminName,
      'event_featured',
      'event',
      eventId,
      { 
        position,
        startDate,
        endDate,
        sponsorshipFee: sponsorshipFee || 0,
        duration: `${Math.ceil((endDate - startDate) / (24 * 60 * 60 * 1000))} days`
      },
      `Event ${eventId}`,
      request
    );

    return NextResponse.json({ success: true, data: placement }, { status: 201 });

  } catch (error) {
    console.error("Error in POST /api/admin/featured:", error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes("Event not found")) {
        return NextResponse.json(
          { success: false, error: { code: "EVENT_NOT_FOUND", message: error.message } },
          { status: 404 }
        );
      }
      if (error.message.includes("already occupied") || error.message.includes("Start date")) {
        return NextResponse.json(
          { success: false, error: { code: "CONFLICT", message: error.message } },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: "INTERNAL_ERROR", 
          message: error instanceof Error ? error.message : "Internal server error" 
        } 
      },
      { status: 500 }
    );
  }
}
