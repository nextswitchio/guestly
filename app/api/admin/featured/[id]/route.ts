import { NextRequest, NextResponse } from "next/server";
import {
  getFeaturedPlacement,
  updateFeaturedPlacement,
  cancelFeaturedPlacement,
  deleteFeaturedPlacement,
} from "@/lib/store";

// GET /api/admin/featured/[id] - Get specific featured placement
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check admin authentication
    const userRole = request.cookies.get("role")?.value;
    if (userRole !== "admin") {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Admin access required" } },
        { status: 401 }
      );
    }

    const placement = getFeaturedPlacement(id);
    
    if (!placement) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Featured placement not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: placement });

  } catch (error) {
    console.error("Error in GET /api/admin/featured/[id]:", error);
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

// PUT /api/admin/featured/[id] - Update featured placement
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check admin authentication
    const userRole = request.cookies.get("role")?.value;
    if (userRole !== "admin") {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Admin access required" } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { position, startDate, endDate, sponsorshipFee, notes, status } = body;

    // Validate position if provided
    if (position !== undefined && (!Number.isInteger(position) || position < 1)) {
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

    // Validate dates if provided
    if (startDate !== undefined && !Number.isInteger(startDate)) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: "INVALID_REQUEST", 
            message: "Start date must be a timestamp" 
          } 
        },
        { status: 400 }
      );
    }

    if (endDate !== undefined && !Number.isInteger(endDate)) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: "INVALID_REQUEST", 
            message: "End date must be a timestamp" 
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

    // Validate status if provided
    if (status !== undefined && !['active', 'expired', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: "INVALID_REQUEST", 
            message: "Status must be 'active', 'expired', or 'cancelled'" 
          } 
        },
        { status: 400 }
      );
    }

    const updates: any = {};
    if (position !== undefined) updates.position = position;
    if (startDate !== undefined) updates.startDate = startDate;
    if (endDate !== undefined) updates.endDate = endDate;
    if (sponsorshipFee !== undefined) updates.sponsorshipFee = sponsorshipFee;
    if (notes !== undefined) updates.notes = notes;
    if (status !== undefined) updates.status = status;

    const updatedPlacement = updateFeaturedPlacement(id, updates);
    
    if (!updatedPlacement) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Featured placement not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedPlacement });

  } catch (error) {
    console.error("Error in PUT /api/admin/featured/[id]:", error);
    
    // Handle specific error types
    if (error instanceof Error) {
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

// DELETE /api/admin/featured/[id] - Delete featured placement
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check admin authentication
    const userRole = request.cookies.get("role")?.value;
    if (userRole !== "admin") {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Admin access required" } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'cancel') {
      // Cancel the placement instead of deleting
      const reason = searchParams.get('reason') || 'Cancelled by admin';
      const cancelledPlacement = cancelFeaturedPlacement(id, reason);
      
      if (!cancelledPlacement) {
        return NextResponse.json(
          { success: false, error: { code: "NOT_FOUND", message: "Featured placement not found" } },
          { status: 404 }
        );
      }

      return NextResponse.json({ 
        success: true, 
        data: cancelledPlacement,
        message: "Featured placement cancelled successfully"
      });
    }

    // Permanent deletion
    const deleted = deleteFeaturedPlacement(id);
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Featured placement not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Featured placement deleted successfully" 
    });

  } catch (error) {
    console.error("Error in DELETE /api/admin/featured/[id]:", error);
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