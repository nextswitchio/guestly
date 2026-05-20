import { NextRequest, NextResponse } from "next/server";
import { fetchBackendJson } from "@/lib/api/proxy";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ city: string }> }
) {
  try {
    const { city } = await params;
    const decodedCity = decodeURIComponent(city);
    const { data, status, ok } = await fetchBackendJson(
      req,
      `/api/v1/community/cities/${encodeURIComponent(decodedCity)}/stats`,
    );

    if (!ok) return NextResponse.json(data, { status });
    
    return NextResponse.json({
      success: true,
      data,
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
