import { NextRequest, NextResponse } from "next/server";
import { getCityStats } from "@/lib/store";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ city: string }> }
) {
  try {
    const { city } = await params;
    const decodedCity = decodeURIComponent(city);
    
    const stats = getCityStats(decodedCity);
    
    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching city stats:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "FETCH_ERROR",
          message: "Failed to fetch city statistics",
        },
      },
      { status: 500 }
    );
  }
}
