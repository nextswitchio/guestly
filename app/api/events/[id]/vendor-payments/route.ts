import { NextRequest, NextResponse } from "next/server";
import {
  getEventVendorPayments,
  getEventOrganizer,
} from "@/lib/store";
import { getEventById } from "@/lib/events";

/**
 * GET /api/events/[id]/vendor-payments
 * Get all vendor payment requests for an event (organizer only)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = req.cookies.get("user_id")?.value;
  const role = req.cookies.get("role")?.value;

  if (!userId || role !== "organiser") {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Organizer authentication required" } },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const event = getEventById(id);

    if (!event) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Event not found" } },
        { status: 404 }
      );
    }

    // Verify organizer owns this event
    const organizerId = getEventOrganizer(id);
    if (organizerId !== userId) {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Access denied" } },
        { status: 403 }
      );
    }

    const payments = getEventVendorPayments(id);

    // Calculate summary statistics
    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
    const paidAmount = payments.filter(p => p.status === "paid").reduce((sum, p) => sum + p.amount, 0);
    const pendingAmount = payments.filter(p => p.status === "pending" || p.status === "processing").reduce((sum, p) => sum + p.amount, 0);

    return NextResponse.json({
      success: true,
      data: {
        payments,
        summary: {
          totalAmount,
          paidAmount,
          pendingAmount,
          totalPayments: payments.length,
          paidPayments: payments.filter(p => p.status === "paid").length,
          pendingPayments: payments.filter(p => p.status === "pending" || p.status === "processing").length,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "FETCH_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
