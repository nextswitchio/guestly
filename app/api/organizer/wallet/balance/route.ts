import { NextRequest, NextResponse } from "next/server";
import { getOrganizerWallet } from "@/lib/store";

export async function GET(req: NextRequest) {
  const userId = req.cookies.get("user_id")?.value;
  const role = req.cookies.get("role")?.value;

  if (!userId || role !== "organiser") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const wallet = getOrganizerWallet(userId);
    
    return NextResponse.json({
      success: true,
      data: wallet,
    });
  } catch (error) {
    console.error("Error fetching organizer wallet:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch wallet balance" },
      { status: 500 }
    );
  }
}
