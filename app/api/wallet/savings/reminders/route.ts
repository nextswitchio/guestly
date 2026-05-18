import { NextRequest, NextResponse } from "next/server";
import {
  getReminders,
  generateRemindersForTarget,
  getSavingsTargets,
} from "@/lib/store";

/**
 * GET /api/wallet/savings/reminders
 * Get all reminders for the authenticated user
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
    const includeProcessed = req.nextUrl.searchParams.get("includeProcessed") === "true";
    const reminders = getReminders(userId, includeProcessed);

    return NextResponse.json({
      success: true,
      data: reminders,
    });
  } catch (error) {
    console.error("Error fetching reminders:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error instanceof Error ? error.message : "Failed to fetch reminders",
        },
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/wallet/savings/reminders
 * Generate reminders for all savings targets or a specific target
 */
export async function POST(req: NextRequest) {
  const userId = req.cookies.get("user_id")?.value;
  if (!userId) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { savingsTargetId } = body;

    let allReminders: any[] = [];

    if (savingsTargetId) {
      // Generate reminders for specific target
      const reminders = generateRemindersForTarget(userId, savingsTargetId);
      allReminders = reminders;
    } else {
      // Generate reminders for all targets
      const targets = getSavingsTargets(userId);
      for (const target of targets) {
        const reminders = generateRemindersForTarget(userId, target.id);
        allReminders.push(...reminders);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        generated: allReminders.length,
        reminders: allReminders,
      },
    });
  } catch (error) {
    console.error("Error generating reminders:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error instanceof Error ? error.message : "Failed to generate reminders",
        },
      },
      { status: 500 }
    );
  }
}
