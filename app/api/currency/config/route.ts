import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/currency/config`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch currency config");
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({
      success: true,
      primaryCurrency: "NGN",
      currencies: {
        USD: { symbol: "$", name: "US Dollar", decimals: 2 },
        NGN: { symbol: "\u20A6", name: "Nigerian Naira", decimals: 0 },
        GHS: { symbol: "GH\u20B5", name: "Ghanaian Cedi", decimals: 2 },
        KES: { symbol: "KSh", name: "Kenyan Shilling", decimals: 0 },
        ZAR: { symbol: "R", name: "South African Rand", decimals: 2 },
        GBP: { symbol: "\u00A3", name: "British Pound", decimals: 2 },
        EUR: { symbol: "\u20AC", name: "Euro", decimals: 2 },
        XOF: { symbol: "CFA", name: "CFA Franc", decimals: 0 },
        RWF: { symbol: "FRw", name: "Rwandan Franc", decimals: 0 },
        UGX: { symbol: "USh", name: "Ugandan Shilling", decimals: 0 },
        TZS: { symbol: "TSh", name: "Tanzanian Shilling", decimals: 0 },
      },
      rates: {
        USD: 1,
        NGN: 1550,
        GHS: 15.5,
        KES: 145,
        ZAR: 18.5,
        GBP: 0.78,
        EUR: 0.92,
        XOF: 605,
        RWF: 1310,
        UGX: 3800,
        TZS: 2500,
      },
    });
  }
}
