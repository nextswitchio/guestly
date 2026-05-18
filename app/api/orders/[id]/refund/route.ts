import { NextRequest, NextResponse } from "next/server";
import { refundOrder, getOrder } from "@/lib/store";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = id;
    const body = await req.json().catch(() => ({}));
    const reason = body?.reason;

    // Get order to verify it exists
    const order = getOrder(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // Process refund
    const result = refundOrder(orderId, reason);

    return NextResponse.json({
      success: true,
      data: {
        orderId: result.order.id,
        refundAmount: result.refundAmount,
        refundedAt: result.refundedAt,
        message: "Refund processed successfully. Funds have been added to your wallet."
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to process refund";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
