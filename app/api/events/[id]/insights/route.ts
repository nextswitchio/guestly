import { NextRequest, NextResponse } from "next/server";
import { getEventInsights, addEventInsight } from "@/lib/store";
import { getEventById } from "@/lib/events";

/**
 * GET /api/events/[id]/insights
 * Get AI-powered insights for an event
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    
    // Verify event exists
    const event = getEventById(eventId);
    if (!event) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Event not found" } },
        { status: 404 }
      );
    }
    
    // Get organizer ID for this event
    const { getEventOrganizer, generateEnhancedInsights } = await import("@/lib/store");
    const organizerId = getEventOrganizer(eventId);
    
    // Get existing insights for the event
    let insights = getEventInsights(eventId);
    
    // Check if we need to generate/update attendance prediction
    const existingPrediction = insights.find(i => i.type === 'attendance_prediction');
    const shouldGeneratePrediction = !existingPrediction || 
      (Date.now() - existingPrediction.createdAt > 24 * 60 * 60 * 1000); // Regenerate if older than 24 hours
    
    if (shouldGeneratePrediction) {
      // Generate new attendance prediction
      const { generateAttendancePrediction } = await import("@/lib/store");
      const newPrediction = generateAttendancePrediction(eventId);
      
      if (newPrediction) {
        // Remove old prediction and add new one
        insights = insights.filter(i => i.type !== 'attendance_prediction');
        insights.push(newPrediction);
      }
    }
    
    // Check if we need to generate/update revenue forecast
    const existingForecast = insights.find(i => i.type === 'revenue_forecast');
    const shouldGenerateForecast = !existingForecast || 
      (Date.now() - existingForecast.createdAt > 24 * 60 * 60 * 1000); // Regenerate if older than 24 hours
    
    if (shouldGenerateForecast) {
      // Generate new revenue forecast
      const { generateRevenueForecast } = await import("@/lib/store");
      const newForecast = generateRevenueForecast(eventId);
      
      if (newForecast) {
        // Remove old forecast and add new one
        insights = insights.filter(i => i.type !== 'revenue_forecast');
        insights.push(newForecast);
      }
    }
    
    // Check if we need to generate/update pricing recommendation
    const existingPricing = insights.find(i => i.type === 'pricing_recommendation');
    const shouldGeneratePricing = !existingPricing || 
      (Date.now() - existingPricing.createdAt > 24 * 60 * 60 * 1000); // Regenerate if older than 24 hours
    
    if (shouldGeneratePricing) {
      // Generate new pricing recommendation
      const { generatePricingRecommendation } = await import("@/lib/store");
      const newPricing = generatePricingRecommendation(eventId);
      
      if (newPricing) {
        // Remove old pricing recommendation and add new one
        insights = insights.filter(i => i.type !== 'pricing_recommendation');
        insights.push(newPricing);
      }
    }
    
    // Check if we need to generate/update timing suggestion
    const existingTiming = insights.find(i => i.type === 'timing_suggestion');
    const shouldGenerateTiming = !existingTiming || 
      (Date.now() - existingTiming.createdAt > 24 * 60 * 60 * 1000); // Regenerate if older than 24 hours
    
    if (shouldGenerateTiming) {
      // Generate new timing suggestion
      const { generateTimingSuggestion } = await import("@/lib/store");
      const newTiming = generateTimingSuggestion(eventId);
      
      if (newTiming) {
        // Remove old timing suggestion and add new one
        insights = insights.filter(i => i.type !== 'timing_suggestion');
        insights.push(newTiming);
      }
    }
    
    // Check if we need to generate/update promotion timing recommendation
    const existingPromotion = insights.find(i => i.type === 'promotion_timing');
    const shouldGeneratePromotion = !existingPromotion || 
      (Date.now() - existingPromotion.createdAt > 24 * 60 * 60 * 1000); // Regenerate if older than 24 hours
    
    if (shouldGeneratePromotion) {
      // Generate new promotion timing recommendation
      const { generatePromotionTimingRecommendation } = await import("@/lib/store");
      const newPromotion = generatePromotionTimingRecommendation(eventId);
      
      if (newPromotion) {
        // Remove old promotion timing and add new one
        insights = insights.filter(i => i.type !== 'promotion_timing');
        insights.push(newPromotion);
      }
    }
    
    // Check if we need to generate/update audience targeting insights
    const existingAudience = insights.find(i => i.type === 'audience_targeting');
    const shouldGenerateAudience = !existingAudience || 
      (Date.now() - existingAudience.createdAt > 24 * 60 * 60 * 1000); // Regenerate if older than 24 hours
    
    if (shouldGenerateAudience) {
      // Generate new audience targeting insights
      const { generateAudienceTargetingInsights } = await import("@/lib/store");
      const newAudience = generateAudienceTargetingInsights(eventId);
      
      if (newAudience) {
        // Remove old audience targeting and add new one
        insights = insights.filter(i => i.type !== 'audience_targeting');
        insights.push(newAudience);
      }
    }
    
    // Check if we need to generate/update city benchmark insights
    const existingCityBenchmark = insights.find(i => i.type === 'city_benchmark');
    const shouldGenerateCityBenchmark = !existingCityBenchmark || 
      (Date.now() - existingCityBenchmark.createdAt > 24 * 60 * 60 * 1000); // Regenerate if older than 24 hours
    
    if (shouldGenerateCityBenchmark) {
      // Generate new city benchmark insights
      const { generateCityBenchmarkInsights } = await import("@/lib/store");
      const newCityBenchmark = generateCityBenchmarkInsights(eventId);
      
      if (newCityBenchmark) {
        // Remove old city benchmark and add new one
        insights = insights.filter(i => i.type !== 'city_benchmark');
        insights.push(newCityBenchmark);
      }
    }
    
    // If organizer exists, add personalized insights based on their history
    if (organizerId) {
      const { generatePersonalizedInsights } = await import("@/lib/store");
      const personalizedInsights = generatePersonalizedInsights(eventId, organizerId);
      
      // Merge personalized insights (they have higher confidence)
      personalizedInsights.forEach(personalizedInsight => {
        const existingIndex = insights.findIndex(i => i.type === personalizedInsight.type);
        if (existingIndex >= 0) {
          // Replace if personalized has higher confidence
          if (personalizedInsight.confidence > insights[existingIndex].confidence) {
            insights[existingIndex] = personalizedInsight;
          }
        } else {
          // Add new personalized insight
          insights.push(personalizedInsight);
        }
      });
    }
    
    return NextResponse.json({
      success: true,
      data: insights,
    });
  } catch (error) {
    console.error("Error fetching event insights:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to fetch event insights",
        },
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/events/[id]/insights
 * Create a new insight for an event (admin/system function)
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    
    // Verify event exists
    const event = getEventById(eventId);
    if (!event) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Event not found" } },
        { status: 404 }
      );
    }
    
    const body = await req.json();
    const { type, title, description, confidence, data } = body;
    
    // Validate required fields
    if (!type || !title || !description || confidence === undefined || !data) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Missing required fields: type, title, description, confidence, data",
          },
        },
        { status: 400 }
      );
    }
    
    // Validate confidence is between 0 and 1
    if (confidence < 0 || confidence > 1) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Confidence must be between 0 and 1",
          },
        },
        { status: 400 }
      );
    }
    
    // Create the insight
    const insight = addEventInsight(eventId, type, title, description, confidence, data);
    
    return NextResponse.json({
      success: true,
      data: insight,
    });
  } catch (error) {
    console.error("Error creating event insight:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to create event insight",
        },
      },
      { status: 500 }
    );
  }
}
