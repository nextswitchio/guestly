import { NextRequest, NextResponse } from "next/server";
import { checkAllEventsDeadlineReminders, clearOldReminders } from "@/lib/store";

/**
 * Check deadline reminders for all events
 * This endpoint should be called periodically (e.g., via cron job or scheduled task)
 * GET /api/reminders/check-all
 */
export async function GET(_req: NextRequest) {
  try {
    // Check all events for deadline reminders
    const results = checkAllEventsDeadlineReminders();
    
    // Clear old reminders (older than 30 days)
    const clearedCount = clearOldReminders();
    
    // Calculate totals
    const totalReminders = results.reduce((sum, r) => sum + r.reminders.total, 0);
    const totalTaskReminders = results.reduce((sum, r) => sum + r.reminders.taskReminders.length, 0);
    const totalMilestoneAlerts = results.reduce((sum, r) => sum + r.reminders.milestoneAlerts.length, 0);
    const totalBudgetReminders = results.reduce((sum, r) => sum + r.reminders.budgetReminders.length, 0);
    
    return NextResponse.json({
      success: true,
      data: {
        eventsChecked: results.length,
        totalReminders,
        breakdown: {
          taskReminders: totalTaskReminders,
          milestoneAlerts: totalMilestoneAlerts,
          budgetReminders: totalBudgetReminders,
        },
        clearedOldReminders: clearedCount,
        results: results.map(r => ({
          eventId: r.eventId,
          remindersCount: r.reminders.total,
        })),
      },
    });
  } catch (error) {
    console.error("Error checking all reminders:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to check reminders",
      },
      { status: 500 }
    );
  }
}

/**
 * Manually trigger reminder check (for testing)
 * POST /api/reminders/check-all
 */
export async function POST(req: NextRequest) {
  return GET(req);
}
