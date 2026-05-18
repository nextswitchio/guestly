import { NextRequest, NextResponse } from "next/server";
import { createMerchOrder, orderRequiresShipping } from "@/lib/store";
import type { ShippingAddress } from "@/types/merchandise";

export async function POST(req: NextRequest) {
  try {
    const userId = req.cookies.get("user_id")?.value;
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { eventId, items, shippingAddress } = body;

    if (!eventId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Check if any items require shipping
    const needsShipping = orderRequiresShipping(items);
    
    if (needsShipping && !shippingAddress) {
      return NextResponse.json(
        { success: false, error: "Shipping address required for delivery items" },
        { status: 400 }
      );
    }

    // Validate shipping address if provided
    if (shippingAddress) {
      const requiredFields: (keyof ShippingAddress)[] = [
        "fullName",
        "addressLine1",
        "city",
        "state",
        "postalCode",
        "country",
        "phone",
      ];
      
      for (const field of requiredFields) {
        if (!shippingAddress[field]) {
          return NextResponse.json(
            { success: false, error: `Missing required field: ${field}` },
            { status: 400 }
          );
        }
      }
    }

    const order = createMerchOrder(userId, eventId, items, shippingAddress);

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
