import { NextRequest, NextResponse } from "next/server";
import { addMoney } from "@/lib/store";

function userId(req: NextRequest) {
  const role = req.cookies.get("role")?.value;
  return role === "attendee" ? "attendee-user" : "organiser-user";
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const amount: number = body?.amount || 0;
  const paymentMethod: string = body?.method || body?.paymentMethod || "card";

  if (amount <= 0) {
    return NextResponse.json({ success: false, error: "Invalid amount" }, { status: 400 });
  }

  // Validate payment method specific fields
  if (paymentMethod === "card") {
    const cardDetails = body?.cardDetails || {};
    const { number: cardNumber, expiry: cardExpiry, cvv: cardCvv } = cardDetails;
    if (!cardNumber || !cardExpiry || !cardCvv) {
      return NextResponse.json(
        { success: false, error: "Missing card details" },
        { status: 400 }
      );
    }
    // In a real implementation, you would process the card payment here
    // For now, we'll simulate a successful payment
  } else if (paymentMethod === "mobile_money") {
    const { mobileProvider, phoneNumber } = body;
    if (!mobileProvider || !phoneNumber) {
      return NextResponse.json(
        { success: false, error: "Missing mobile money details" },
        { status: 400 }
      );
    }
    // In a real implementation, you would initiate mobile money payment here
    // For now, we'll simulate a successful payment
  } else if (paymentMethod === "bank_transfer") {
    // For bank transfer, we just provide instructions
    // In a real implementation, you would track the pending transfer
    // For now, we'll add the funds immediately for demo purposes
  }

  // Add funds to wallet
  const description = `Wallet top up via ${
    paymentMethod === "card"
      ? "card"
      : paymentMethod === "bank_transfer"
      ? "bank transfer"
      : "mobile money"
  }`;
  const balance = addMoney(userId(req), amount, description);

  return NextResponse.json({ success: true, balance });
}
