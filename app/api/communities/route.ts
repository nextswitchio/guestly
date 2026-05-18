import { NextRequest, NextResponse } from "next/server";
import { getCommunities, getCommunityTypes } from "@/lib/events";
import type { Event } from "@/lib/events";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const country = searchParams.get("country");
    const state = searchParams.get("state");
    const city = searchParams.get("city");
    
    // Validate country parameter if provided
    const validCountry = country && ["Nigeria", "Ghana", "Kenya"].includes(country) 
      ? (country as Event["country"]) 
      : undefined;
    
    const communities = getCommunities(
      validCountry,
      state || undefined,
      city || undefined
    );
    const communityTypes = getCommunityTypes(
      validCountry,
      state || undefined,
      city || undefined
    );
    
    return NextResponse.json({
      success: true,
      data: {
        communities,
        communityTypes,
      },
    });
  } catch (error) {
    console.error("Error fetching communities:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "FETCH_COMMUNITIES_ERROR",
          message: "Failed to fetch communities",
        },
      },
      { status: 500 }
    );
  }
}
