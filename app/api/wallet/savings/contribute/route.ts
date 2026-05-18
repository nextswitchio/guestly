import { NextRequest, NextResponse } from "next/server";
import { 
  addToSavingsTarget, 
  getSavingsTarget, 
  getWallet, 
  debitMoney,
  setupRecurringContribution,
  cancelRecurringContribution
} from "@/lib/store";

function getUserId(req: NextRequest): string {
  const userId = req.cookies.get("user_id")?.value;
  if (!userId) {
    const role = req.cookies.get("role")?.value;
    return role === "attendee" ? "attendee-user" : "organiser-user";
  }
  return userId;
}

// POST /api/wallet/savings/contribute - Add funds to a savings target (one-time or set up recurring)
export async function POST(req: NextRequest) {
  try {
    const userId = getUserId(req);
    const body = await req.json();
    
    const { targetId, amount, recurring, frequency } = body;
    
    // Validate inputs
    if (!targetId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_INPUT",
            message: "Target ID is required",
          },
        },
        { status: 400 }
      );
    }
    
    // Check if target exists
    const target = getSavingsTarget(userId, targetId);
    if (!target) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Savings target not found",
          },
        },
        { status: 404 }
      );
    }
    
    // Handle recurring contribution setup
    if (recurring) {
      if (!frequency || !['weekly', 'biweekly', 'monthly'].includes(frequency)) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "INVALID_INPUT",
              message: "Valid frequency is required for recurring contributions (weekly, biweekly, monthly)",
            },
          },
          { status: 400 }
        );
      }
      
      if (!amount || amount <= 0) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "INVALID_INPUT",
              message: "Amount must be greater than 0",
            },
          },
          { status: 400 }
        );
      }
      
      // Set up recurring contribution
      const updatedTarget = setupRecurringContribution(userId, targetId, amount, frequency);
      
      return NextResponse.json({
        success: true,
        data: updatedTarget,
        message: `Recurring contribution of $${amount} ${frequency} has been set up`,
      });
    }
    
    // Handle one-time contribution
    if (!amount || amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_INPUT",
            message: "Amount must be greater than 0",
          },
        },
        { status: 400 }
      );
    }
    
    // Check if user has sufficient wallet balance
    const wallet = getWallet(userId);
    if (!wallet || wallet.balance < amount) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INSUFFICIENT_FUNDS",
            message: "Insufficient wallet balance",
          },
        },
        { status: 400 }
      );
    }
    
    // Debit from wallet
    debitMoney(userId, amount, `Savings contribution to ${target.eventId ? 'event' : 'general'} savings`);
    
    // Add to savings target
    const updatedTarget = addToSavingsTarget(userId, targetId, amount);
    
    return NextResponse.json({
      success: true,
      data: updatedTarget,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "CONTRIBUTE_ERROR",
          message: "Failed to contribute to savings target",
        },
      },
      { status: 500 }
    );
  }
}

// DELETE /api/wallet/savings/contribute - Cancel recurring contributions
export async function DELETE(req: NextRequest) {
  try {
    const userId = getUserId(req);
    const { searchParams } = new URL(req.url);
    const targetId = searchParams.get("targetId");
    
    if (!targetId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_INPUT",
            message: "Target ID is required",
          },
        },
        { status: 400 }
      );
    }
    
    // Check if target exists
    const target = getSavingsTarget(userId, targetId);
    if (!target) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Savings target not found",
          },
        },
        { status: 404 }
      );
    }
    
    // Cancel recurring contribution
    const updatedTarget = cancelRecurringContribution(userId, targetId);
    
    return NextResponse.json({
      success: true,
      data: updatedTarget,
      message: "Recurring contribution has been cancelled",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "CANCEL_ERROR",
          message: "Failed to cancel recurring contribution",
        },
      },
      { status: 500 }
    );
  }
}
