import { NextRequest, NextResponse } from "next/server";
import { getWallet, addCryptoBalance } from "@/lib/store";

// Mock conversion rates - in production, these would come from a real API
const CONVERSION_RATES = {
  USDT: 1.0, // USDT is pegged to USD
  BTC: 95000, // Mock Bitcoin price in USD
};

export async function GET(req: NextRequest) {
  const userId = req.cookies.get("user_id")?.value;
  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  // Add demo crypto balances for demonstration (only if wallet exists and has no crypto yet)
  let wallet = getWallet(userId);
  if (wallet && (!wallet.cryptoBalances || wallet.cryptoBalances.length === 0)) {
    // Add some demo crypto balances for testing
    addCryptoBalance(userId, 'USDT', 150.50);
    addCryptoBalance(userId, 'BTC', 0.00125);
    wallet = getWallet(userId);
  }

  if (!wallet) {
    return NextResponse.json({ success: false, error: "Wallet not found" }, { status: 404 });
  }

  // Calculate crypto values in USD
  const cryptoBalances = (wallet.cryptoBalances || []).map(cb => ({
    symbol: cb.symbol,
    amount: cb.amount,
    usdValue: cb.amount * CONVERSION_RATES[cb.symbol],
    conversionRate: CONVERSION_RATES[cb.symbol],
  }));

  // Calculate total portfolio value
  const fiatBalance = wallet.balance;
  const promoBalance = wallet.promoBalance || 0;
  const cryptoTotalUsd = cryptoBalances.reduce((sum, cb) => sum + cb.usdValue, 0);
  const totalPortfolioValue = fiatBalance + cryptoTotalUsd;

  return NextResponse.json({
    success: true,
    data: {
      fiatBalance,
      promoBalance,
      cryptoBalances,
      totalPortfolioValue,
      conversionRates: CONVERSION_RATES,
    },
  });
}
