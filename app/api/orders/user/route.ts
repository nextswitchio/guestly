import { NextRequest, NextResponse } from "next/server";
import { getUserOrders } from "@/lib/store";

function getUserIdFromCookies(req: NextRequest) {
  return req.cookies.get("user_id")?.value || "attendee-user";
}

export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromCookies(req);
    const orders = getUserOrders(userId);
    
    return NextResponse.json({
      success: true,
      orders
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch orders";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
