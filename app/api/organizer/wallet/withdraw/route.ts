import { NextRequest, NextResponse } from "next/server";
import { createWithdrawalRequest, getUserWithdrawalRequests } from "@/lib/store";
import type { WithdrawalMethod, BankDetails, CryptoWithdrawalDetails } from "@/lib/store";

export async function POST(req: NextRequest) {
  const userId = req.cookies.get("user_id")?.value;
  const role = req.cookies.get("role")?.value;

  if (!userId || role !== "organiser") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { amount, method, bankDetails, cryptoDetails, notes } = body;

    // Validate input
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid withdrawal amount" },
        { status: 400 }
      );
    }

    if (!method || (method !== "bank" && method !== "crypto")) {
      return NextResponse.json(
        { success: false, error: "Invalid withdrawal method" },
        { status: 400 }
      );
    }

    const request = createWithdrawalRequest(
      userId,
      amount,
      method as WithdrawalMethod,
      bankDetails as BankDetails | undefined,
      cryptoDetails as CryptoWithdrawalDetails | undefined,
      notes
    );

    return NextResponse.json({
      success: true,
      data: request,
    });
  } catch (error: any) {
    console.error("Error creating withdrawal request:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create withdrawal request" },
      { status: 400 }
    );
  }
}

export async function GET(req: NextRequest) {
  const userId = req.cookies.get("user_id")?.value;
  const role = req.cookies.get("role")?.value;

  if (!userId || role !== "organiser") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const requests = getUserWithdrawalRequests(userId);
    
    return NextResponse.json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error("Error fetching withdrawal requests:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch withdrawal requests" },
      { status: 500 }
    );
  }
}
