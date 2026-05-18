import { NextRequest, NextResponse } from "next/server";
import { filterEvents, Event, addEvent } from "@/lib/events";
import { CacheHelpers } from "@/lib/cache";
import { createConditionalResponse, CacheConfigs } from "@/lib/middleware/cache";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || undefined;
  const category = (searchParams.get("category") || undefined) as Event["category"] | undefined;
  const city = (searchParams.get("city") || undefined) as Event["city"] | undefined;
  const community = searchParams.get("community") || undefined;
  const communityType = (searchParams.get("communityType") || undefined) as Event["communityType"] | undefined;
  const startDate = searchParams.get("startDate") || undefined;
  const endDate = searchParams.get("endDate") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "6", 10);
  
  // Create filters object for caching
  const filters = {
    q,
    category,
    city,
    community,
    communityType,
    startDate,
    endDate,
    page: page.toString(),
    pageSize: pageSize.toString(),
  };
  
  // Remove undefined values for consistent cache keys
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== undefined)
  );
  
  try {
    // Use cache helper for event listings
    const result = await CacheHelpers.cacheEventListings(
      cleanFilters,
      () => filterEvents({ q, category, city, community, communityType, startDate, endDate, page, pageSize })
    );
    
    const responseData = { success: true, data: result.data, total: result.total };
    
    // Return cached response with appropriate headers
    return createConditionalResponse(req, responseData, {
      ...CacheConfigs.eventListings,
      generateETag: true,
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const userId = req.cookies.get("user_id")?.value;
  const role = req.cookies.get("role")?.value;
  
  if (!userId || role !== "organiser") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const eventData = {
      ...body,
      organizerId: userId,
      createdAt: Date.now(),
      status: 'draft' as const
    };

    const event = addEvent(eventData);
    return NextResponse.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create event' },
      { status: 500 }
    );
  }
}

