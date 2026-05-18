import { NextRequest, NextResponse } from "next/server";
import { events } from "@/lib/events";

// Server-side distance calculation (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lng = parseFloat(searchParams.get("lng") || "0");
  const radius = parseFloat(searchParams.get("radius") || "10");
  
  if (!lat || !lng) {
    return NextResponse.json(
      { success: false, error: "Latitude and longitude required" },
      { status: 400 }
    );
  }
  
  try {
    // Filter events by distance
    const nearbyEvents = events
      .filter(event => {
        // For demo purposes, assume Lagos events are at 6.5244, 3.3792
        const eventLat = event.city === 'Lagos' ? 6.5244 : 
                         event.city === 'Abuja' ? 9.0765 :
                         event.city === 'Accra' ? 5.6037 : 
                         event.city === 'Nairobi' ? -1.2921 : 6.5244;
        const eventLng = event.city === 'Lagos' ? 3.3792 : 
                         event.city === 'Abuja' ? 7.3986 :
                         event.city === 'Accra' ? -0.1870 : 
                         event.city === 'Nairobi' ? 36.8219 : 3.3792;
        
        const distance = calculateDistance(lat, lng, eventLat, eventLng);
        return distance <= radius;
      })
      .map(event => {
        const eventLat = event.city === 'Lagos' ? 6.5244 : 
                         event.city === 'Abuja' ? 9.0765 :
                         event.city === 'Accra' ? 5.6037 : 
                         event.city === 'Nairobi' ? -1.2921 : 6.5244;
        const eventLng = event.city === 'Lagos' ? 3.3792 : 
                         event.city === 'Abuja' ? 7.3986 :
                         event.city === 'Accra' ? -0.1870 : 
                         event.city === 'Nairobi' ? 36.8219 : 3.3792;
        
        const distance = calculateDistance(lat, lng, eventLat, eventLng);
        
        return {
          ...event,
          distance: Math.round(distance * 10) / 10 // Round to 1 decimal place
        };
      })
      .sort((a, b) => a.distance - b.distance);
    
    return NextResponse.json({
      success: true,
      data: nearbyEvents
    });
  } catch (error) {
    console.error('Error fetching nearby events:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch nearby events' },
      { status: 500 }
    );
  }
}