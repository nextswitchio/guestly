import { NextRequest, NextResponse } from "next/server";
import { pollCryptoDepositStatus, getCryptoDeposit } from "@/lib/store";

function userId(req: NextRequest) {
  const role = req.cookies.get("role")?.value;
  return role === "attendee" ? "attendee-user" : "organiser-user";
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ depositId: string }> }
) {
  const { depositId } = await params;

  if (!depositId) {
    return NextResponse.json(
      { success: false, error: "Deposit ID required" },
      { status: 400 }
    );
  }

  // Poll for status update
  const deposit = pollCryptoDepositStatus(depositId);

  if (!deposit) {
    return NextResponse.json(
      { success: false, error: "Deposit not found" },
      { status: 404 }
    );
  }

  // Verify the deposit belongs to the requesting user
  const user = userId(req);
  if (deposit.userId !== user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 403 }
    );
  }

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
      txHash: deposit.txHash,
      createdAt: deposit.createdAt,
      updatedAt: deposit.updatedAt,
      confirmedAt: deposit.confirmedAt,
    },
  });
}
