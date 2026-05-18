import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/store";

// Simple in-memory cart storage
const userCarts: Record<string, any[]> = {};

export async function POST(req: NextRequest) {
  const userId = req.cookies.get("user_id")?.value;
  
  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { paymentMethod, shippingAddress } = body;
    
    const cart = userCarts[userId] || [];
    
    if (cart.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cart is empty" },
        { status: 400 }
      );
    }
    
    // Create a mock order for merchandise
    const orderId = Math.random().toString(36).substr(2, 9);
    const total = cart.length * 3000; // Mock total
    
    // Clear cart after checkout
    userCarts[userId] = [];
    
    return NextResponse.json({
      success: true,
      data: {
        orderId,
        total,
        status: 'paid',
        items: cart,
        shippingAddress
      }
    });
  } catch (error) {
    console.error('Error during checkout:', error);
    return NextResponse.json(
      { success: false, error: 'Checkout failed' },
      { status: 500 }
    );
  }
}