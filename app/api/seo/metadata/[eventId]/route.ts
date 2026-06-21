import { NextRequest, NextResponse } from 'next/server';
import { generateSEOMetadata } from '@/lib/marketing';

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

    const metadata = generateSEOMetadata(eventId, {
      title: event.title,
      description: event.description,
      image: event.image_url || event.image,
      date: new Date(event.start_date || event.date).toISOString(),
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
