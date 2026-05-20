// ── API Response Types ───────────────────────────────────────────────────────

export type ApiSuccessResponse<T = unknown> = {
  success: true;
  data: T;
  total?: number;
  page?: number;
  pageCount?: number;
};

export type ApiErrorResponse = {
  success: false;
  error: string;
  details?: Record<string, string[]>;
};

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

export type PaginatedResponse<T> = {
  success: true;
  data: T[];
  total: number;
  page: number;
  pageCount: number;
};

// ── Search Types ─────────────────────────────────────────────────────────────

export type SearchType = "events" | "vendors" | "organisers" | "communities" | "merchandise";

export type SearchRequest = {
  q: string;
  type?: SearchType;
  page?: number;
  pageSize?: number;
};

export type SearchResult = {
  id: string;
  type: SearchType;
  title: string;
  description: string;
  image?: string;
  url: string;
};

export type SearchResponse = {
  success: boolean;
  data: SearchResult[];
  total: number;
};

// ── City API Types ───────────────────────────────────────────────────────────

export type CityStatsResponse = {
  success: boolean;
  data: {
    upcomingEvents: number;
    totalEvents: number;
    totalAttendees: number;
    popularCategories: Array<{ category: string; count: number }>;
    trendingEvents: string[];
  };
};

export type CityEventsResponse = {
  success: boolean;
  data: Array<{
    id: string;
    title: string;
    description: string;
    date: string;
    category: string;
    city: string;
    image: string;
  }>;
};

export type HeatmapPoint = {
  lat: number;
  lng: number;
  intensity: number;
};

export type HeatmapResponse = {
  success: boolean;
  data: HeatmapPoint[];
};

// ── Identity Verification Types ──────────────────────────────────────────────

export type IdentityStatus = "pending" | "submitted" | "under_review" | "approved" | "rejected";

export type IdentityDocument = {
  id: string;
  userId: string;
  documentType: "passport" | "drivers_license" | "national_id";
  documentFront: string;
  documentBack?: string;
  selfie: string;
  status: IdentityStatus;
  submittedAt: number;
  reviewedAt?: number;
  reviewedBy?: string;
  rejectionReason?: string;
};

// ── Content & Blog Types ─────────────────────────────────────────────────────

export type ContentStatus = "draft" | "published" | "archived";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  authorId: string;
  authorName: string;
  tags?: string[];
  status: ContentStatus;
  publishedAt?: number;
  createdAt: number;
  updatedAt: number;
};

// ── Referral Types ───────────────────────────────────────────────────────────

export type ReferralStats = {
  totalReferrals: number;
  successfulConversions: number;
  conversionRate: number;
  totalRewards: number;
  pendingRewards: number;
};

export type ReferralReward = {
  id: string;
  referrerId: string;
  referredUserId: string;
  rewardAmount: number;
  status: "pending" | "awarded" | "expired";
  createdAt: number;
  awardedAt?: number;
};

// ── Campaign Types ───────────────────────────────────────────────────────────

export type CampaignStatus = "draft" | "active" | "paused" | "completed" | "cancelled";

export type CampaignType =
  | "email"
  | "sms"
  | "push"
  | "social"
  | "referral"
  | "promo_code"
  | "influencer";

export type Campaign = {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  targetAudience: string[];
  budget?: number;
  spent?: number;
  startDate?: number;
  endDate?: number;
  createdAt: number;
  updatedAt: number;
};

export type CampaignMetrics = {
  campaignId: string;
  impressions: number;
  clicks: number;
  conversions: number;
  clickThroughRate: number;
  conversionRate: number;
  costPerClick: number;
  costPerConversion: number;
  roi: number;
};
