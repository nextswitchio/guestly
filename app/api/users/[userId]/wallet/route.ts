import { NextRequest, NextResponse } from "next/server";
import { getWallet, listTransactions, getSavingsTargets, getPromoCredits } from "@/lib/store";
import { CacheHelpers } from "@/lib/cache";
import { createConditionalResponse, CacheConfigs } from "@/lib/middleware/cache";

function userId(req: NextRequest) {
  return req.cookies.get("user_id")?.value;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const requestingUserId = userId(req);
  const { userId: targetUserId } = await params;
  
  // Only allow users to access their own wallet
  if (!requestingUserId || requestingUserId !== targetUserId) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    // Cache wallet data with short TTL as it changes frequently
    const walletData = await CacheHelpers.cacheWalletData(
      targetUserId,
      () => {
        const wallet = getWallet(targetUserId);
        const transactions = listTransactions(targetUserId);
        const savingsTargets = getSavingsTargets(targetUserId);
        const promoCredits = getPromoCredits(targetUserId);
        
        return {
          wallet,
          transactions: transactions.slice(0, 20), // Last 20 transactions
          savingsTargets,
          promoCredits,
        };
      }
    );
    
    const responseData = { ok: true, ...walletData };
    
    // Return cached response with private cache headers and short TTL
    return createConditionalResponse(req, responseData, {
      ...CacheConfigs.walletData,
      generateETag: true,
    });
  } catch (error) {
    console.error('Error fetching wallet data:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch wallet data' },
      { status: 500 }
    );
  }
}