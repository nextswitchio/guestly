import { NextRequest, NextResponse } from "next/server";
import { filterEvents } from "@/lib/events";
import { NEIGHBORHOODS, type City } from "@/features/geo/cities";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ city: string }> }
) {
  try {
    const { city } = await params;
    const decodedCity = decodeURIComponent(city) as City;
    
    // Get all events for the city
    const result = filterEvents({
      city: decodedCity,
      page: 1,
      pageSize: 1000, // Get all events
    });
    
    const neighborhoods = NEIGHBORHOODS[decodedCity];
    if (!neighborhoods) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_CITY",
            message: "City not found",
          },
        },
        { status: 404 }
      );
    }
    
    // Calculate event density by neighborhood
    const densityMap = new Map<string, number>();
    
    // Initialize all neighborhoods with 0
    neighborhoods.forEach((n) => {
      densityMap.set(n.name, 0);
    });
    
    // Distribute events across neighborhoods (simulated distribution)
    // In a real app, events would have actual neighborhood/location data
    result.data.forEach((event) => {
      // Randomly assign to a neighborhood for demonstration
      // In production, this would use actual event location data
      const randomNeighborhood = neighborhoods[Math.floor(Math.random() * neighborhoods.length)];
      const currentCount = densityMap.get(randomNeighborhood.name) || 0;
      densityMap.set(randomNeighborhood.name, currentCount + 1);
    });
    
    // Convert to heat map data
    const heatMapData = neighborhoods.map((n) => ({
      neighborhood: n.name,
      lat: n.lat,
      lon: n.lon,
      eventCount: densityMap.get(n.name) || 0,
    }));
    
    // Get trending neighborhoods (top 5)
    const trending = [...heatMapData]
      .filter((d) => d.eventCount > 0)
      .sort((a, b) => b.eventCount - a.eventCount)
      .slice(0, 5);
    
    return NextResponse.json({
      success: true,
      data: {
        heatMap: heatMapData,
        trending,
        totalEvents: result.data.length,
        activeNeighborhoods: heatMapData.filter((d) => d.eventCount > 0).length,
      },
    });
  } catch (error) {
    console.error("Error generating heat map:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "HEATMAP_ERROR",
          message: "Failed to generate heat map",
        },
      },
      { status: 500 }
    );
  }
}
