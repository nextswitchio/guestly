import { NextRequest, NextResponse } from "next/server";
import { getBenchmarkData, getAllBenchmarkData } from "@/lib/store";

/**
 * GET /api/analytics/benchmarks
 * Get benchmark data for category and city comparison
 * Query params: category (optional), city (optional)
 * If both provided, returns specific benchmark
 * If only one provided, returns all benchmarks for that filter
 * If neither provided, returns all benchmarks
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const city = searchParams.get("city");
    
    // If both category and city are provided, return specific benchmark
    if (category && city) {
      const benchmark = getBenchmarkData(category, city);
      
      if (!benchmark) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "NOT_FOUND",
              message: `No benchmark data found for category "${category}" in city "${city}"`,
            },
          },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: benchmark,
      });
    }
    
    // Otherwise, return filtered or all benchmarks
    let benchmarks = getAllBenchmarkData();
    
    // Filter by category if provided
    if (category) {
      benchmarks = benchmarks.filter(b => b.category === category);
    }
    
    // Filter by city if provided
    if (city) {
      benchmarks = benchmarks.filter(b => b.city === city);
    }
    
    return NextResponse.json({
      success: true,
      data: benchmarks,
    });
  } catch (error) {
    console.error("Error fetching benchmark data:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to fetch benchmark data",
        },
      },
      { status: 500 }
    );
  }
}
