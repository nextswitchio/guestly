import { NextRequest, NextResponse } from "next/server";
import { filterEvents } from "@/lib/events";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const type = searchParams.get("type") || "events";
  
  try {
    if (type === "events") {
      const result = filterEvents({ q, page: 1, pageSize: 20 });
      
      return NextResponse.json({
        success: true,
        data: result.data,
        total: result.total
      });
    }
    
    return NextResponse.json({
      success: true,
      data: [],
      total: 0
    });
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    );
  }
}