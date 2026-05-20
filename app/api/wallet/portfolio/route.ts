import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

const CONVERSION_RATES = {
  USDT: 1.0,
  BTC: 95000,
};

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/wallet/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to fetch wallet" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const wallet = await res.json();
    const fiatBalance = wallet.balance || 0;
    const promoBalance = wallet.promo_balance || 0;
    const cryptoBalances = (wallet.crypto_balances || []).map((cb: { symbol: string; amount: number }) => ({
      symbol: cb.symbol,
      amount: cb.amount,
      usdValue: cb.amount * CONVERSION_RATES[cb.symbol as keyof typeof CONVERSION_RATES] || 0,
      conversionRate: CONVERSION_RATES[cb.symbol as keyof typeof CONVERSION_RATES] || 0,
    }));

    const cryptoTotalUsd = cryptoBalances.reduce((sum: number, cb: { usdValue: number }) => sum + cb.usdValue, 0);
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
  } catch {
    return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 });
  }
}
