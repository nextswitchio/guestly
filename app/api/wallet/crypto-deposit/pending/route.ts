import { NextRequest, NextResponse } from "next/server";
import { getPendingCryptoDeposits } from "@/lib/store";

function userId(req: NextRequest) {
  const role = req.cookies.get("role")?.value;
  return role === "attendee" ? "attendee-user" : "organiser-user";
}

export async function GET(req: NextRequest) {
  const user = userId(req);
  const deposits = getPendingCryptoDeposits(user);

  return NextResponse.json({
    success: true,
    deposits: deposits.map((d) => ({
      id: d.id,
      cryptoType: d.cryptoType,
      amount: d.amount,
      amountUSD: d.amountUSD,
      status: d.status,
      confirmations: d.confirmations,
      requiredConfirmations: d.requiredConfirmations,
      txHash: d.txHash,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    })),
  });
}
