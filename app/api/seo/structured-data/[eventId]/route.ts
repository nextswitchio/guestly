import { NextRequest, NextResponse } from 'next/server';
import { generateStructuredData } from '@/lib/marketing';
import { getEventById } from '@/lib/events';

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

    const event = getEventById(eventId);

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    const structuredData = generateStructuredData(eventId, {
      title: event.title,
      description: event.description,
      startDate: new Date(event.date).toISOString(),
      endDate: undefined, // Event doesn't have endDate
      venue: event.venue || event.city,
      address: undefined, // Event doesn't have address
      city: event.city,
      region: event.state,
      country: event.country,
      images: [event.image],
      offers: event.tickets ? Object.entries(event.tickets).map(([name, ticket]) => ({
        name,
        price: ticket.price,
        currency: 'NGN',
        availability: ticket.available > 0 ? 'InStock' as const : 'SoldOut' as const,
        validFrom: new Date(event.date).toISOString(),
      })) : [],
      organizerName: 'Guestly', // Event doesn't have organizer field
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
