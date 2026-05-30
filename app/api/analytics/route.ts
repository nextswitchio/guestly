import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

// Color palette for charts
const CHART_COLORS = [
  "#3b82f6", // blue-500
  "#10b981", // green-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#8b5cf6", // violet-500
  "#06b6d4", // cyan-500
  "#eab308", // yellow-600
  "#ec4899", // pink-500
];

export async function GET(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const role = req.cookies.get("role")?.value;
  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range") || "30d";

  if (!token) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  // Organiser dashboard analytics
  if (role === "organiser") {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/events/my/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const backendData = await res.json();

      // Transform backend data to match frontend expectations
      // Dashboard expects: totalRevenue, ticketsSold, totalEvents, upcomingEvents, walletBalance, etc.
      const totalRevenue = backendData.totalRevenue || 0;
      const ticketsSold = backendData.ticketsSold || 0;  // Map to expected field name
      const totalEvents = backendData.totalEvents || 0;
      const upcomingEvents = backendData.upcomingEvents || 0;
      const walletBalance = backendData.walletBalance || 0;
      const totalSettled = backendData.totalSettled || 0;
      const pendingSettlement = backendData.pendingSettlement || 0;
      const recentOrders = backendData.recentOrders || [];
      const monthlyRevenueTrend = backendData.monthlyRevenueTrend || [];
      const recentEvents = backendData.recentEvents || [];
      
      // Additional data for analytics page (not used by dashboard)
      const totalViews = backendData.totalViews || 0;
      const totalSaves = backendData.totalSaves || 0;
      const overallConversionRate = backendData.overallConversionRate || 0;
      const categoryTickets = backendData.categoryTickets || [];
      const topEventsData = backendData.topEvents || [];

      // Transform top events to match expected format
      const topEvents = topEventsData.map((event: any) => ({
        name: event.name || event.title || "Unknown Event",
        sold: event.sold || 0,
        revenue: event.revenue || 0,
        views: event.views || 0,
      }));

      // Transform monthly revenue trend to match expected format
      const revenueByMonth = monthlyRevenueTrend.map((trend: any) => ({
        month: trend.label || "",
        revenue: trend.value || 0,
      }));

      // Transform category tickets to match expected format
      const ticketsByCategory = categoryTickets.map((cat: any, index: number) => ({
        category: cat.category || "Unknown",
        count: cat.count || 0,
        color: CHART_COLORS[index % CHART_COLORS.length],
      }));

      // Format data for dashboard page
      const formattedData = {
        totalRevenue,
        ticketsSold,  // Dashboard expects this field name
        totalEvents,
        upcomingEvents,
        walletBalance,
        totalSettled,
        pendingSettlement,
        recentOrders,
        monthlyRevenueTrend,
        recentEvents,
        // Additional fields for analytics page
        totalViews,
        conversionPct: overallConversionRate || 0,
        revenueChange: 0, // Placeholder - would need previous period data
        ticketsChange: 0, // Placeholder
        viewsChange: 0, // Placeholder
        conversionChange: 0, // Placeholder
        topEvents: topEvents.slice(0, 5),
        revenueByMonth,
        ticketsByCategory,
      };

      return NextResponse.json(formattedData, { status: res.status });
    } catch (error) {
      console.error("Analytics API error:", error);
      return NextResponse.json({ success: false, error: "Backend unavailable" }, { status: 502 });
    }
  }

  return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
}
