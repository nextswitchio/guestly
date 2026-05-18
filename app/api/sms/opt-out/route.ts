import { NextRequest, NextResponse } from "next/server";
import { addToSuppressionList } from "@/lib/marketing";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phoneNumber, reason } = body;

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Missing required field: phoneNumber" },
        { status: 400 }
      );
    }

    addToSuppressionList(phoneNumber, reason || "user_opt_out", "sms");

    return NextResponse.json({
      success: true,
      message: "Phone number added to suppression list",
    });
  } catch (error) {
    console.error("Error adding to suppression list:", error);
    return NextResponse.json(
      { error: "Failed to add to suppression list" },
      { status: 500 }
    );
  }
}
