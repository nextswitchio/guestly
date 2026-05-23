import { slugify } from "./utils";

export type EventType = "Physical" | "Virtual" | "Hybrid";

export type StreamingProvider = "Zoom" | "Google Meet" | "YouTube Live" | "Vimeo" | "RTMP";

export type StreamingConfig = {
  provider: StreamingProvider;
  streamUrl: string;
  accessControl: "ticket-holders" | "public";
  recordingUrl?: string;
  enableReplay?: boolean;
};

// Import notification function from store
import { notifyFollowersOfNewEvent } from "./store";
import { updateSitemap } from "./marketing";
import { CacheInvalidationHooks } from "./cache-invalidation";

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  country: string;
  state?: string; // State/Region within country
  city: string; // Now a free-form string instead of enum
  image: string;
  eventType?: EventType;
  streamingConfig?: StreamingConfig;
  venue?: string;
  postEventMerchSales?: boolean; // Allow merch store to remain open after event
  postEventCommunityAccess?: boolean; // Keep discussion board active after event (default: true)
  latitude?: number; // Geo-coordinates for location-based features
  longitude?: number;
  community?: string; // Campus or community tag (e.g., "University of Lagos", "Tech Community", "Lekki Phase 1")
  communityType?: "campus" | "neighborhood" | "professional" | "cultural"; // Type of community
  tickets?: {
    General?: { price: number; available: number };
    VIP?: { price: number; available: number };
  };
};

export const events: Event[] = [
  {
    id: "evt-1",
    title: "Tech Summit 2026",
    description: "A gathering of innovators and startups.",
    date: "2026-03-12",
    category: "Tech",
    country: "Nigeria",
    state: "Lagos",
    city: "Lagos",
    image: "/globe.svg",
    eventType: "Hybrid",
    venue: "Eko Convention Centre",
    latitude: 6.4281,
    longitude: 3.4219,
    community: "Lagos Tech Community",
    communityType: "professional",
    tickets: {
      General: { price: 5000, available: 500 },
      VIP: { price: 15000, available: 100 },
    },
    streamingConfig: {
      provider: "YouTube Live",
      streamUrl: "https://youtube.com/live/tech-summit-2026",
      accessControl: "ticket-holders",
      enableReplay: true,
      recordingUrl: "https://youtube.com/watch?v=tech-summit-2026-replay",
    },
  },
  {
    id: "evt-2",
    title: "Music Fiesta",
    description: "Live performances by top artists.",
    date: "2026-04-05",
    category: "Music",
    country: "Nigeria",
    state: "FCT",
    city: "Abuja",
    image: "/vercel.svg",
    eventType: "Physical",
    venue: "Abuja Stadium",
    latitude: 9.0579,
    longitude: 7.4951,
    community: "Wuse District",
    communityType: "neighborhood",
    tickets: {
      General: { price: 3000, available: 1000 },
      VIP: { price: 10000, available: 200 },
    },
  },
  {
    id: "evt-3",
    title: "Art Expo",
    description: "Showcasing contemporary African art.",
    date: "2026-05-20",
    category: "Art",
    country: "Ghana",
    state: "Greater Accra",
    city: "Accra",
    image: "/next.svg",
    eventType: "Physical",
    venue: "National Museum of Ghana",
    latitude: 5.5600,
    longitude: -0.2057,
    community: "University of Ghana",
    communityType: "campus",
    tickets: {
      General: { price: 2000, available: 300 },
    },
  },
  {
    id: "evt-4",
    title: "Street Food Carnival",
    description: "Taste cuisines from across the region.",
    date: "2026-06-10",
    category: "Food",
    country: "Kenya",
    state: "Nairobi County",
    city: "Nairobi",
    image: "/window.svg",
    eventType: "Physical",
    venue: "Uhuru Park",
    latitude: -1.2833,
    longitude: 36.8167,
    community: "Westlands",
    communityType: "neighborhood",
    tickets: {
      General: { price: 1500, available: 2000 },
    },
  },
  {
    id: "evt-5",
    title: "DevConf",
    description: "Talks and workshops for developers.",
    date: "2026-03-25",
    category: "Tech",
    country: "Nigeria",
    state: "FCT",
    city: "Abuja",
    image: "/file.svg",
    eventType: "Virtual",
    latitude: 9.0765,
    longitude: 7.3986,
    community: "Abuja Tech Hub",
    communityType: "professional",
    tickets: {
      General: { price: 2500, available: 500 },
    },
    streamingConfig: {
      provider: "Zoom",
      streamUrl: "https://zoom.us/j/devconf2026",
      accessControl: "ticket-holders",
      enableReplay: true,
      recordingUrl: "https://zoom.us/rec/devconf2026-recording",
    },
  },
  {
    id: "evt-6",
    title: "Jazz Night",
    description: "An evening of soulful jazz.",
    date: "2026-03-18",
    category: "Entertainment",
    country: "Nigeria",
    state: "Lagos",
    city: "Lagos",
    image: "/vercel.svg",
    eventType: "Physical",
    venue: "Terra Kulture",
    latitude: 6.4474,
    longitude: 3.4700,
    community: "Victoria Island",
    communityType: "neighborhood",
    tickets: {
      General: { price: 4000, available: 150 },
      VIP: { price: 8000, available: 50 },
    },
  },
  {
    id: "evt-7",
    title: "African Heritage Festival",
    description: "Celebrating African culture, traditions, and heritage.",
    date: "2026-04-15",
    category: "Cultural",
    country: "Ghana",
    state: "Greater Accra",
    city: "Accra",
    image: "/next.svg",
    eventType: "Physical",
    venue: "Independence Square",
    latitude: 5.5500,
    longitude: -0.2100,
    community: "Osu",
    communityType: "neighborhood",
    tickets: {
      General: { price: 1500, available: 800 },
      VIP: { price: 5000, available: 100 },
    },
  },
  {
    id: "evt-8",
    title: "Faith Conference 2026",
    description: "Annual gathering for spiritual growth and fellowship.",
    date: "2026-05-10",
    category: "Faith",
    country: "Nigeria",
    state: "Lagos",
    city: "Lagos",
    image: "/window.svg",
    eventType: "Hybrid",
    venue: "National Stadium Lagos",
    latitude: 6.4698,
    longitude: 3.3792,
    community: "Surulere",
    communityType: "neighborhood",
    tickets: {
      General: { price: 2000, available: 5000 },
    },
    streamingConfig: {
      provider: "YouTube Live",
      streamUrl: "https://youtube.com/live/faith-conference-2026",
      accessControl: "public",
      enableReplay: true,
    },
  },
  {
    id: "evt-9",
    title: "Lagos Marathon",
    description: "Annual city-wide marathon event.",
    date: "2026-02-28",
    category: "Sports",
    country: "Nigeria",
    state: "Lagos",
    city: "Lagos",
    image: "/file.svg",
    eventType: "Physical",
    venue: "Tafawa Balewa Square",
    latitude: 6.4541,
    longitude: 3.3947,
    community: "Lagos Island",
    communityType: "neighborhood",
    tickets: {
      General: { price: 5000, available: 3000 },
    },
  },
];

export function filterEvents(params: {
  q?: string;
  category?: Event["category"];
  country?: Event["country"];
  state?: string;
  city?: string;
  community?: string;
  communityType?: Event["communityType"];
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}) {
  const q = params.q?.toLowerCase() || "";
  const category = params.category?.toLowerCase();
  const country = params.country?.toLowerCase();
  const state = params.state?.toLowerCase();
  const city = params.city?.toLowerCase();
  const community = params.community?.toLowerCase();
  const communityType = params.communityType?.toLowerCase();
  const startDate = params.startDate ? new Date(params.startDate) : null;
  const endDate = params.endDate ? new Date(params.endDate) : null;
  
  let list = events.filter((e) => {
    const matchQ = q
      ? e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)
      : true;
    const matchCat = category ? e.category.toLowerCase() === category : true;
    const matchCountry = country ? e.country.toLowerCase() === country : true;
    const matchState = state ? e.state?.toLowerCase() === state : true;
    const matchCity = city ? e.city.toLowerCase().includes(city) : true;
    const matchCommunity = community ? e.community?.toLowerCase().includes(community) : true;
    const matchCommunityType = communityType ? e.communityType?.toLowerCase() === communityType : true;
    
    // Date filtering
    let matchDate = true;
    if (startDate || endDate) {
      const eventDate = new Date(e.date);
      if (startDate && eventDate < startDate) {
        matchDate = false;
      }
      if (endDate && eventDate > endDate) {
        matchDate = false;
      }
    }
    
    return matchQ && matchCat && matchCountry && matchState && matchCity && matchCommunity && matchCommunityType && matchDate;
  });
  
  // Sort by date chronologically (earliest first)
  list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const page = params.page && params.page > 0 ? params.page : 1;
  const pageSize = params.pageSize && params.pageSize > 0 ? params.pageSize : 6;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const total = list.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  list = list.slice(start, end);
  return { data: list, page, pageCount, total };
}

export function getEventById(id: string) {
  return events.find((e) => e.id === id) || null;
}

export function getEventBySlug(slug: string) {
  return events.find((e) => slugify(e.title) === slug) || null;
}

export function getEventSlug(event: { title: string; id: string }) {
  return slugify(event.title);
}

function newId() {
  return `evt-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
}

export function addEvent(input: Omit<Event, "id">, organizerId?: string): Event {
  const e: Event = { id: newId(), ...input };
  events.push(e);
  
  // Notify followers if organizerId is provided
  if (organizerId) {
    try {
      notifyFollowersOfNewEvent(organizerId, e.id);
    } catch (error) {
      console.error("Error notifying followers:", error);
      // Don't fail event creation if notification fails
    }
  }
  
  // Update sitemap for SEO (Requirement 9.3)
  try {
    updateSitemap();
  } catch (error) {
    console.error("Error updating sitemap:", error);
    // Don't fail event creation if sitemap update fails
  }
  
  // Invalidate event caches
  CacheInvalidationHooks.onEventMutation(e.id, e.city);
  
  return e;
}

// Get all unique communities from events
export function getCommunities(country?: Event["country"], state?: string, city?: string): Array<{ name: string; type: Event["communityType"]; count: number }> {
  let filteredEvents = events;
  if (country) filteredEvents = filteredEvents.filter(e => e.country === country);
  if (state) filteredEvents = filteredEvents.filter(e => e.state === state);
  if (city) filteredEvents = filteredEvents.filter(e => e.city.toLowerCase().includes(city.toLowerCase()));
  
  const communityMap = new Map<string, { type: Event["communityType"]; count: number }>();
  
  filteredEvents.forEach(event => {
    if (event.community) {
      const existing = communityMap.get(event.community);
      if (existing) {
        existing.count++;
      } else {
        communityMap.set(event.community, { type: event.communityType, count: 1 });
      }
    }
  });
  
  return Array.from(communityMap.entries())
    .map(([name, data]) => ({ name, type: data.type, count: data.count }))
    .sort((a, b) => b.count - a.count);
}

// Get events by community
export function getEventsByCommunity(community: string): Event[] {
  return events.filter(e => e.community?.toLowerCase() === community.toLowerCase());
}

// Get community types with counts
export function getCommunityTypes(country?: Event["country"], state?: string, city?: string): Array<{ type: Event["communityType"]; count: number }> {
  let filteredEvents = events;
  if (country) filteredEvents = filteredEvents.filter(e => e.country === country);
  if (state) filteredEvents = filteredEvents.filter(e => e.state === state);
  if (city) filteredEvents = filteredEvents.filter(e => e.city.toLowerCase().includes(city.toLowerCase()));
  
  const typeMap = new Map<Event["communityType"], number>();
  
  filteredEvents.forEach(event => {
    if (event.communityType) {
      typeMap.set(event.communityType, (typeMap.get(event.communityType) || 0) + 1);
    }
  });
  
  return Array.from(typeMap.entries())
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);
}

// Get all events (used by admin functions)
export function getAllEvents(): Event[] {
  return events;
}
