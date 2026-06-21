// ── Event Types ──────────────────────────────────────────────────────────────

export type EventType = "Physical" | "Virtual" | "Hybrid";

export type StreamingProvider = "Zoom" | "Google Meet" | "YouTube Live" | "Vimeo" | "RTMP";

export type EventCategory =
  | "Music"
  | "Tech"
  | "Art"
  | "Food"
  | "Cultural"
  | "Faith"
  | "Entertainment"
  | "Sports";

export type EventCountry = "Nigeria" | "Ghana" | "Kenya";

export type CommunityType = "campus" | "neighborhood" | "professional" | "cultural";

export type TicketType = "General" | "VIP";

export type AttendanceType = "physical" | "virtual";

export type Ticket = {
  type: TicketType;
  price: number;
  available: number;
  attendanceType?: AttendanceType;
};

export type TicketAvailability = {
  eventId: string;
  tickets: Ticket[];
};

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
  category: EventCategory;
  country: EventCountry;
  state?: string;
  city: string;
  image: string;
  eventType?: EventType;
  streamingConfig?: StreamingConfig;
  venue?: string;
  latitude?: number;
  longitude?: number;
  community?: string;
  communityType?: CommunityType;
  postEventMerchSales?: boolean;
  postEventCommunityAccess?: boolean;
  tickets?: {
    General?: { price: number; available: number };
    VIP?: { price: number; available: number };
  };
  organizerId?: string;
  ticketsSold?: number;
};

export type EventDraft = {
  type?: EventType;
  title?: string;
  description?: string;
  date?: string;
  category?: EventCategory;
  country?: EventCountry;
  state?: string;
  city?: string;
  image?: string;
  venue?: string;
  latitude?: number;
  longitude?: number;
  community?: string;
  communityType?: CommunityType;
  postEventCommunityAccess?: boolean;
  ticketSetup?: {
    generalPrice?: number;
    vipPrice?: number;
    generalQty?: number;
    vipQty?: number;
  };
  virtual?: {
    url?: string;
    provider?: StreamingProvider;
    accessControl?: "ticket-holders" | "public";
    enableReplay?: boolean;
  };
  merch?: {
    enabled?: boolean;
    postEventSales?: boolean;
    products?: Array<{
      name: string;
      description: string;
      price: number;
      category: string;
      stock: number;
      sizes?: string[];
      image: string;
      fulfillmentType?: "pickup" | "delivery" | "digital";
      pickupInstructions?: string;
      digitalDownloadUrl?: string;
    }>;
  };
  status?: "draft" | "published";
};

export type EventFilterParams = {
  q?: string;
  category?: EventCategory;
  country?: EventCountry;
  state?: string;
  city?: string;
  community?: string;
  communityType?: CommunityType;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
};

export type EventFilterResult = {
  data: Event[];
  page: number;
  pageCount: number;
  total: number;
};

export type CityStats = {
  upcomingEvents: number;
  totalEvents: number;
  totalAttendees: number;
  popularCategories: Array<{ category: string; count: number }>;
  trendingEvents: string[];
};

export type CommunityInfo = {
  name: string;
  type: CommunityType;
  count: number;
};
