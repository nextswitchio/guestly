import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

const DEFAULT_PRICES = { "1m": 4999, "3m": 12999, "6m": 23999, "12m": 44999 };

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/subscription-plans`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json(DEFAULT_PRICES);
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(DEFAULT_PRICES);
  }
}
