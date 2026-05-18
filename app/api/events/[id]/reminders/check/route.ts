import { NextRequest, NextResponse } from "next/server";
import { checkAllDeadlineReminders } from "@/lib/store";

/**
 * Check and send deadline reminders for an event
 * GET /api/events/[id]/reminders/check
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    
    // Check all deadline reminders for this event
    const reminders = checkAllDeadlineReminders(eventId);
    
    return NextResponse.json({
      success: true,
      data: {
        eventId,
        taskReminders: reminders.taskReminders.length,
        milestoneAlerts: reminders.milestoneAlerts.length,
        budgetReminders: reminders.budgetReminders.length,
        total: reminders.total,
        notifications: [
          ...reminders.taskReminders,
          ...reminders.milestoneAlerts,
          ...reminders.budgetReminders,
        ],
      },
    });
  } catch (error) {
    console.error("Error checking reminders:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to check reminders",
      },
      { status: 500 }
    );
  }
}
