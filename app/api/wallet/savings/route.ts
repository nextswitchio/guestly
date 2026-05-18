import { NextRequest, NextResponse } from "next/server";
import { 
  createSavingsTarget, 
  getSavingsTargets, 
  updateSavingsTarget,
  deleteSavingsTarget 
} from "@/lib/store";

function getUserId(req: NextRequest): string {
  const userId = req.cookies.get("user_id")?.value;
  if (!userId) {
    const role = req.cookies.get("role")?.value;
    return role === "attendee" ? "attendee-user" : "organiser-user";
  }
  return userId;
}

// GET /api/wallet/savings - Get all savings targets for user
export async function GET(req: NextRequest) {
  try {
    const userId = getUserId(req);
    const targets = getSavingsTargets(userId);
    
    return NextResponse.json({
      success: true,
      data: targets,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "FETCH_ERROR",
          message: "Failed to fetch savings targets",
        },
      },
      { status: 500 }
    );
  }
}

// POST /api/wallet/savings - Create a new savings target
export async function POST(req: NextRequest) {
  try {
    const userId = getUserId(req);
    const body = await req.json();
    
    const { eventId, goalAmount, targetDate } = body;
    
    // Validate required fields
    if (!goalAmount || goalAmount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_INPUT",
            message: "Goal amount must be greater than 0",
          },
        },
        { status: 400 }
      );
    }
    
    // Create the savings target
    const target = createSavingsTarget(userId, {
      eventId,
      goalAmount,
      targetDate,
    });
    
    return NextResponse.json({
      success: true,
      data: target,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "CREATE_ERROR",
          message: "Failed to create savings target",
        },
      },
      { status: 500 }
    );
  }
}

// PATCH /api/wallet/savings - Update a savings target
export async function PATCH(req: NextRequest) {
  try {
    const userId = getUserId(req);
    const body = await req.json();
    
    const { targetId, goalAmount, targetDate } = body;
    
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
    
    const updates: Partial<{ goalAmount: number; targetDate?: string }> = {};
    if (goalAmount !== undefined) updates.goalAmount = goalAmount;
    if (targetDate !== undefined) updates.targetDate = targetDate;
    
    const target = updateSavingsTarget(userId, targetId, updates);
    
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
    
    return NextResponse.json({
      success: true,
      data: target,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UPDATE_ERROR",
          message: "Failed to update savings target",
        },
      },
      { status: 500 }
    );
  }
}

// DELETE /api/wallet/savings - Delete a savings target
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
    
    const deleted = deleteSavingsTarget(userId, targetId);
    
    if (!deleted) {
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
    
    return NextResponse.json({
      success: true,
      data: { deleted: true },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DELETE_ERROR",
          message: "Failed to delete savings target",
        },
      },
      { status: 500 }
    );
  }
}
