import { NextRequest, NextResponse } from "next/server";
import {
  getVendorPaymentById,
  updateVendorPaymentStatus,
  type VendorPayment,
} from "@/lib/store";

/**
 * GET /api/vendor/payments/[id]
 * Get a specific payment request
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = req.cookies.get("user_id")?.value;
  const role = req.cookies.get("role")?.value;

  if (!userId) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const payment = getVendorPaymentById(id);

    if (!payment) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Payment not found" } },
        { status: 404 }
      );
    }

    // Check authorization: vendor can see their own payments, organizer can see payments for their events
    if (role === "vendor" && payment.vendorUserId !== userId) {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Access denied" } },
        { status: 403 }
      );
    }

    if (role === "organiser" && payment.organizerUserId !== userId) {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Access denied" } },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: payment,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "FETCH_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/vendor/payments/[id]
 * Update payment status (organizer only)
 */
export async function PATCH(
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
    const payment = getVendorPaymentById(id);

    if (!payment) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Payment not found" } },
        { status: 404 }
      );
    }

    // Verify organizer owns this event
    if (payment.organizerUserId !== userId) {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Access denied" } },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { status, paymentMethod, transactionReference } = body;

    if (!status || !["pending", "processing", "paid", "cancelled"].includes(status)) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_INPUT", message: "Valid status is required" } },
        { status: 400 }
      );
    }

    const updatedPayment = updateVendorPaymentStatus(
      id,
      status,
      paymentMethod,
      transactionReference
    );

    return NextResponse.json({
      success: true,
      data: updatedPayment,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "UPDATE_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
