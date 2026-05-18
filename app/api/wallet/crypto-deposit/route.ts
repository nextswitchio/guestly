import { NextRequest, NextResponse } from "next/server";
import { createCryptoDeposit, ensureWallet } from "@/lib/store";

function userId(req: NextRequest) {
  const role = req.cookies.get("role")?.value;
  return role === "attendee" ? "attendee-user" : "organiser-user";
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { cryptoType, address, amount, amountUSD } = body;

  // Validate inputs
  if (!cryptoType || !address || !amount || !amountUSD) {
    return NextResponse.json(
      { success: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

  if (!["usdt_trc20", "usdt_erc20", "bitcoin"].includes(cryptoType)) {
    return NextResponse.json(
      { success: false, error: "Invalid crypto type" },
      { status: 400 }
    );
  }

  if (amount <= 0 || amountUSD <= 0) {
    return NextResponse.json(
      { success: false, error: "Invalid amount" },
      { status: 400 }
    );
  }

  // Ensure user has a wallet
  const user = userId(req);
  ensureWallet(user);

  // Create deposit tracking record
  const deposit = createCryptoDeposit(user, cryptoType, address, amount, amountUSD);

  return NextResponse.json({
    success: true,
    deposit: {
      id: deposit.id,
      cryptoType: deposit.cryptoType,
      amount: deposit.amount,
      amountUSD: deposit.amountUSD,
      status: deposit.status,
      confirmations: deposit.confirmations,
      requiredConfirmations: deposit.requiredConfirmations,
      createdAt: deposit.createdAt,
    },
  });
}
