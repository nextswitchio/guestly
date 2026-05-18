import { NextRequest, NextResponse } from "next/server";
import { cancelWithdrawalRequest } from "@/lib/store";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const userId = req.cookies.get("user_id")?.value;
  const role = req.cookies.get("role")?.value;

  if (!userId || role !== "organiser") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { requestId } = await params;
    const request = cancelWithdrawalRequest(requestId, userId);

    return NextResponse.json({
      success: true,
      data: request,
    });
  } catch (error: any) {
    console.error("Error cancelling withdrawal request:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to cancel withdrawal request" },
      { status: 400 }
    );
  }
}
