import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.cookies.get("user_id")?.value;
  const role = req.cookies.get("role")?.value;
  
  if (!userId || role !== "organiser") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Mock analytics data
    const analytics = {
      totalEvents: 5,
      totalRevenue: 125000,
      totalTicketsSold: 250,
      averageTicketPrice: 500,
      conversionRate: 0.15,
      topPerformingEvent: {
        id: 'evt-1',
        title: 'Tech Conference Lagos',
        revenue: 50000
      },
      recentActivity: [
        { type: 'ticket_sale', amount: 5000, timestamp: Date.now() - 3600000 },
        { type: 'event_view', count: 25, timestamp: Date.now() - 7200000 }
      ]
    };
    
    return NextResponse.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}