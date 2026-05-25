import { NextRequest, NextResponse } from 'next/server';
import { generateStructuredData } from '@/lib/marketing';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    // Fetch event from backend
    const response = await fetch(`${BACKEND_URL}/api/v1/events/${eventId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    const event = await response.json();

    const structuredData = generateStructuredData(eventId, {
      title: event.title,
      description: event.description,
      startDate: new Date(event.start_date || event.date).toISOString(),
      endDate: event.end_date ? new Date(event.end_date).toISOString() : undefined,
      venue: event.venue || event.city,
      address: event.address,
      city: event.city,
      region: event.state,
      country: event.country,
      images: [event.image_url || event.image],
      offers: event.tickets ? event.tickets.map((ticket: any) => ({
        name: ticket.name || ticket.type,
        price: ticket.price,
        currency: 'NGN',
        availability: ticket.quantity_available > 0 ? 'InStock' as const : 'SoldOut' as const,
        validFrom: new Date(event.start_date || event.date).toISOString(),
      })) : [],
      organizerName: event.organizer_name || 'Guestly',
      organizerUrl: undefined,
    });

    return NextResponse.json(structuredData);
  } catch (error) {
    console.error('Error generating structured data:', error);
    return NextResponse.json(
      { error: 'Failed to generate structured data' },
      { status: 500 }
    );
  }
}
