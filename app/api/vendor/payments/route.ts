import { NextRequest, NextResponse } from "next/server";
import {
  createVendorPaymentRequest,
  getVendorPayments,
  getVendorPaymentStats,
  type VendorPayment,
} from "@/lib/store";

/**
 * GET /api/vendor/payments
 * Get all payment requests for the authenticated vendor
 */
export async function GET(req: NextRequest) {
  const vendorUserId = req.cookies.get("user_id")?.value;
  const role = req.cookies.get("role")?.value;

  if (!vendorUserId || role !== "vendor") {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Vendor authentication required" } },
      { status: 401 }
    );
  }

  try {
    const payments = getVendorPayments(vendorUserId);
    const stats = getVendorPaymentStats(vendorUserId);

    return NextResponse.json({
      success: true,
      data: {
        payments,
        stats,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "FETCH_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}

/**
 * POST /api/vendor/payments
 * Create a new payment request
 */
export async function POST(req: NextRequest) {
  const vendorUserId = req.cookies.get("user_id")?.value;
  const role = req.cookies.get("role")?.value;

  if (!vendorUserId || role !== "vendor") {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Vendor authentication required" } },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { eventId, amount, notes } = body;

    if (!eventId || !amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_INPUT", message: "Event ID and valid amount are required" } },
        { status: 400 }
      );
    }

    const payment = createVendorPaymentRequest(vendorUserId, eventId, amount, notes);

    return NextResponse.json({
      success: true,
      data: payment,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "CREATE_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
