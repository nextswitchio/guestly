import { NextRequest, NextResponse } from 'next/server';
import { generateSEOMetadata } from '@/lib/marketing';
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

    const metadata = generateSEOMetadata(eventId, {
      title: event.title,
      description: event.description,
      image: event.image,
      date: new Date(event.date).toISOString(),
      venue: event.venue || event.city,
      city: event.city,
      country: event.country,
    });

    return NextResponse.json(metadata);
  } catch (error) {
    console.error('Error generating SEO metadata:', error);
    return NextResponse.json(
      { error: 'Failed to generate SEO metadata' },
      { status: 500 }
    );
  }
}
