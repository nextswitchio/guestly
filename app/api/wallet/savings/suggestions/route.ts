import { PartyPopper } from 'lucide-react';
import { NextRequest, NextResponse } from "next/server";
import { calculateSuggestedContribution, getSavingsTarget } from "@/lib/store";

/**
 * GET /api/wallet/savings/suggestions?targetId=xxx
 * Get suggested contribution amount for a savings target
 */
export async function GET(req: NextRequest) {
  const userId = req.cookies.get("user_id")?.value;
  if (!userId) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
      { status: 401 }
    );
  }

  try {
    const targetId = req.nextUrl.searchParams.get("targetId");
    
    if (!targetId) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "BAD_REQUEST", message: "targetId is required" },
        },
        { status: 400 }
      );
    }

    const target = getSavingsTarget(userId, targetId);
    if (!target) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "NOT_FOUND", message: "Savings target not found" },
        },
        { status: 404 }
      );
    }

    const suggestion = calculateSuggestedContribution(userId, targetId);

    if (!suggestion) {
      return NextResponse.json({
        success: true,
        data: {
          message: "You've already reached your savings goal! PartyPopper",
          goalReached: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...suggestion,
        goalReached: false,
        target: {
          id: target.id,
          goalAmount: target.goalAmount,
          currentAmount: target.currentAmount,
          remaining: target.goalAmount - target.currentAmount,
        },
      },
    });
  } catch (error) {
    console.error("Error calculating suggestion:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error instanceof Error ? error.message : "Failed to calculate suggestion",
        },
      },
      { status: 500 }
    );
  }
}
