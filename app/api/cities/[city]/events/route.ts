import { NextRequest, NextResponse } from "next/server";
import { filterEvents } from "@/lib/events";
import type { Event } from "@/lib/events";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ city: string }> }
) {
  try {
    const { city } = await params;
    const decodedCity = decodeURIComponent(city);
    
    // Get query parameters for filtering
    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get("category") as Event["category"] | null;
    const community = searchParams.get("community") || undefined;
    const communityType = searchParams.get("communityType") as Event["communityType"] | null;
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;
    const q = searchParams.get("q") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    
    const result = filterEvents({
      city: decodedCity as Event["city"],
      category: category || undefined,
      community,
      communityType: communityType || undefined,
      startDate,
      endDate,
      q,
      page,
      pageSize,
    });
    
    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: {
        page: result.page,
        pageCount: result.pageCount,
        total: result.total,
      },
    });
  } catch (error) {
    console.error("Error fetching city events:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "FETCH_ERROR",
          message: "Failed to fetch city events",
        },
      },
      { status: 500 }
    );
  }
}
