import { NextRequest, NextResponse } from "next/server";
import { markReminderSent, processPendingReminders } from "@/lib/store";

/**
 * POST /api/wallet/savings/reminders/process
 * Mark reminders as sent or process all pending reminders
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
    const { reminderId, processAll } = body;

    if (processAll) {
      // Process all pending reminders across all users (admin function)
      const dueReminders = processPendingReminders();
      
      // Mark all due reminders as sent
      const processed = dueReminders.map(({ userId: uid, reminder }) => {
        markReminderSent(uid, reminder.id);
        return {
          userId: uid,
          reminderId: reminder.id,
          type: reminder.type,
          message: reminder.message,
        };
      });

      return NextResponse.json({
        success: true,
        data: {
          processed: processed.length,
          reminders: processed,
        },
      });
    }

    if (reminderId) {
      // Mark specific reminder as sent
      const reminder = markReminderSent(userId, reminderId);
      
      if (!reminder) {
        return NextResponse.json(
          {
            success: false,
            error: { code: "NOT_FOUND", message: "Reminder not found" },
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: reminder,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: { code: "BAD_REQUEST", message: "Either reminderId or processAll must be provided" },
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error processing reminders:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error instanceof Error ? error.message : "Failed to process reminders",
        },
      },
      { status: 500 }
    );
  }
}
