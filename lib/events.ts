// Types only — no fake data. All event data comes from the backend API.

export type EventType = "Physical" | "Virtual" | "Hybrid";

export type StreamingProvider = "Zoom" | "Google Meet" | "YouTube Live" | "Vimeo" | "RTMP";

export type StreamingConfig = {
  provider: StreamingProvider;
  streamUrl: string;
  accessControl: "ticket-holders" | "public";
  recordingUrl?: string;
  enableReplay?: boolean;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  country: string;
  state?: string;
  city: string;
  image: string;
  eventType?: EventType;
  streamingConfig?: StreamingConfig;
  venue?: string;
  postEventMerchSales?: boolean;
  postEventCommunityAccess?: boolean;
  latitude?: number;
  longitude?: number;
  community?: string;
  communityType?: "campus" | "neighborhood" | "professional" | "cultural";
  tickets?: {
    General?: { price: number; available: number };
    VIP?: { price: number; available: number };
  };
  organizerName?: string;
  organizerId?: string;
  organizerVerified?: boolean;
  organizerAvatar?: string;
  organizerBio?: string;
  organizerEmail?: string;
  organizerFollowerCount?: number;
  organizerTotalEvents?: number;
  organizerTotalAttendees?: number;
};

// ---------------------------------------------------------------------------
// Stub exports — kept for backward compatibility with lib/store.ts and other
// legacy code. All real event data is fetched from the backend API.
// These functions return empty/null so they never surface fake data.
// ---------------------------------------------------------------------------

/** @deprecated Use the backend API instead */
export const events: Event[] = [];

/** @deprecated Use the backend API instead */
export function getEventById(_id: string): Event | null {
  return null;
}

/** @deprecated Use the backend API instead */
export function getEventBySlug(_slug: string): Event | null {
  return null;
}

/** @deprecated Use the backend API instead */
export function getAllEvents(): Event[] {
  return [];
}

/** @deprecated Use the backend API instead */
export function addEvent(input: Omit<Event, "id">): Event {
  return { id: `stub-${Date.now()}`, ...input };
}

/** @deprecated Use the backend API instead */
export function filterEvents(_params: Record<string, unknown>) {
  return { data: [] as Event[], page: 1, pageCount: 1, total: 0 };
}

/** @deprecated Use the backend API instead */
export function getEventSlug(event: { title: string; id: string }): string {
  return event.id;
}

/** @deprecated Use the backend API instead */
export function getCommunities(): Array<{ name: string; type: Event["communityType"]; count: number }> {
  return [];
}

/** @deprecated Use the backend API instead */
export function getEventsByCommunity(_community: string): Event[] {
  return [];
}

/** @deprecated Use the backend API instead */
export function getCommunityTypes(): Array<{ type: Event["communityType"]; count: number }> {
  return [];
}
