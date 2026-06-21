// ── Analytics & Notification Types ───────────────────────────────────────────

export type InsightType =
  | "attendance_prediction"
  | "revenue_forecast"
  | "pricing_recommendation"
  | "timing_suggestion"
  | "promotion_timing"
  | "audience_targeting"
  | "city_benchmark";

export type EventInsight = {
  eventId: string;
  type: InsightType;
  title: string;
  description: string;
  confidence: number;
  data: Record<string, unknown>;
  createdAt: number;
};

export type EventMetrics = {
  eventId: string;
  views: number;
  saves: number;
  ticketsSold: number;
  revenue: number;
  conversionRate: number;
  averageOrderValue: number;
  refundRate: number;
  attendanceRate?: number;
  satisfactionScore?: number;
};

export type BenchmarkData = {
  category: string;
  city: string;
  averageTicketPrice: number;
  averageAttendance: number;
  averageRevenue: number;
  topPerformingDay: string;
  topPerformingTime: string;
};

export type OrganizerEventHistory = {
  eventId: string;
  organizerId: string;
  category: string;
  city: string;
  eventDate: string;
  ticketsSold: number;
  revenue: number;
  averageTicketPrice: number;
  conversionRate: number;
  attendanceRate?: number;
  completedAt: number;
};

export type GrowthTrend = "improving" | "stable" | "declining";

export type OrganizerPerformancePattern = {
  organizerId: string;
  totalEvents: number;
  categoriesHosted: Record<string, number>;
  citiesHosted: Record<string, number>;
  averageAttendance: number;
  averageRevenue: number;
  averageTicketPrice: number;
  bestPerformingCategory: string;
  bestPerformingCity: string;
  typicalPriceRange: { low: number; high: number };
  growthTrend: GrowthTrend;
  lastUpdated: number;
};

export type VirtualAnalytics = {
  eventId: string;
  peakAttendees: number;
  totalUniqueViewers: number;
  averageWatchTime: number;
  retentionRate: number;
  dropOffPoints: Array<{ timestamp: number; count: number }>;
  updatedAt: number;
};

// ── Notification Types ───────────────────────────────────────────────────────

export type NotificationType =
  | "follow_event"
  | "event_update"
  | "event_reminder"
  | "follow_user"
  | "vendor_invitation"
  | "vendor_response"
  | "task_deadline"
  | "milestone_alert"
  | "budget_review";

export type Notification = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  eventId?: string;
  fromUserId?: string;
  taskId?: string;
  budgetItemId?: string;
  read: boolean;
  createdAt: number;
};

export type NotificationPreferences = {
  userId: string;
  geoNotificationsEnabled: boolean;
  notificationRadius: number;
  categories: string[];
  minPrice?: number;
  maxPrice?: number;
  updatedAt: number;
};

export type UserLocation = {
  userId: string;
  latitude: number;
  longitude: number;
  city: string;
  lastUpdated: number;
};

export type GeoNotification = {
  id: string;
  userId: string;
  eventId: string;
  title: string;
  message: string;
  distance: number;
  sent: boolean;
  sentAt?: number;
  createdAt: number;
};

// ── User Profile & Social Types ──────────────────────────────────────────────

export type UserProfile = {
  userId: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  interests: string[];
  eventsAttended: string[];
  eventsOrganized: string[];
  followers: number;
  following: number;
  location?: {
    city: string;
    country: string;
  };
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  createdAt: number;
  updatedAt: number;
};

export type FollowType = "user" | "organizer";

export type Follow = {
  followerId: string;
  followingId: string;
  type: FollowType;
  createdAt: number;
};
