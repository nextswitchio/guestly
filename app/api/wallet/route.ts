import { NextRequest, NextResponse } from "next/server";
import { getWallet, createWallet } from "@/lib/store";

export async function GET(req: NextRequest) {
  const userId = req.cookies.get("user_id")?.value;
  
  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    let wallet = getWallet(userId);
    
    // Create wallet if it doesn't exist
    if (!wallet) {
      wallet = createWallet(userId);
    }

    return NextResponse.json({
      success: true,
      data: wallet
    });
  } catch (error) {
    console.error('Error fetching wallet:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wallet' },
      { status: 500 }
    );
  }
}