import { NextRequest, NextResponse } from "next/server";
import { 
  addPromoCredit, 
  getPromoCredits, 
  getActivePromoCredits,
  getWallet 
} from "@/lib/store";

// GET /api/wallet/promo-credits - Get user's promo credits
export async function GET(req: NextRequest) {
  const userId = req.cookies.get("user_id")?.value;
  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const activeOnly = req.nextUrl.searchParams.get("active") === "true";
  const promoCredits = activeOnly 
    ? getActivePromoCredits(userId) 
    : getPromoCredits(userId);
  
  const wallet = getWallet(userId);

  return NextResponse.json({ 
    success: true, 
    promoCredits,
    totalPromoBalance: wallet?.promoBalance || 0
  });
}

// POST /api/wallet/promo-credits - Add promo credit (admin/campaign)
export async function POST(req: NextRequest) {
  const userId = req.cookies.get("user_id")?.value;
  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { targetUserId, amount, type, description, expiresAt } = body;

    if (!targetUserId || !amount || !type || !description) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Amount must be positive" },
        { status: 400 }
      );
    }

    const promoCredit = addPromoCredit(
      targetUserId,
      amount,
      type,
      description,
      expiresAt
    );

    return NextResponse.json({ 
      success: true, 
      promoCredit 
    });
  } catch (error) {
    console.error("Error adding promo credit:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add promo credit" },
      { status: 500 }
    );
  }
}
