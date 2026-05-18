import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get('user_id')?.value;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const range = req.nextUrl.searchParams.get('range') || '30d';

    // Generate mock performance data based on range
    const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365;
    const clicksByDay = Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      clicks: Math.floor(Math.random() * 50) + 5,
    }));

    const conversionsByDay = clicksByDay.map(d => ({
      date: d.date,
      conversions: Math.floor(d.clicks * 0.1),
    }));

    const totalClicks = clicksByDay.reduce((sum, d) => sum + d.clicks, 0);
    const totalConversions = conversionsByDay.reduce((sum, d) => sum + d.conversions, 0);
    const totalRevenue = totalConversions * 5000;
    const totalCommission = Math.floor(totalRevenue * 0.1);

    return NextResponse.json({
      performance: {
        totalClicks,
        totalConversions,
        totalRevenue,
        totalCommission,
        conversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0,
        clicksByDay,
        conversionsByDay,
        topEvents: [
          { eventId: 'evt_1', eventName: 'Lagos Music Festival', clicks: 234, conversions: 23, revenue: 115000, commission: 11500 },
          { eventId: 'evt_2', eventName: 'Tech Conference 2026', clicks: 189, conversions: 18, revenue: 90000, commission: 9000 },
          { eventId: 'evt_3', eventName: 'Art Exhibition', clicks: 145, conversions: 14, revenue: 70000, commission: 7000 },
        ],
        topPlatforms: [
          { platform: 'Instagram', clicks: 320, conversions: 32 },
          { platform: 'Twitter', clicks: 210, conversions: 21 },
          { platform: 'WhatsApp', clicks: 150, conversions: 15 },
          { platform: 'Email', clicks: 80, conversions: 8 },
        ],
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch performance' }, { status: 500 });
  }
}
