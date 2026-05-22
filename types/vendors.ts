// ── Vendor Types ─────────────────────────────────────────────────────────────

export type VendorCategory =
  | "Security"
  | "Sound"
  | "Catering"
  | "Decoration"
  | "Logistics"
  | "Photography";

export type VendorCity = "Lagos" | "Abuja" | "Accra" | "Nairobi";

export type VendorStatus = "pending" | "approved" | "rejected";

export type VendorSubscriptionPlan = "1m" | "3m" | "6m" | "12m";

export type VendorSubscription = {
  plan: VendorSubscriptionPlan;
  activatedAt: number;
  expiresAt: number;
};

export type VendorProfile = {
  id: string;
  userId: string;
  name: string;
  description: string;
  category: VendorCategory;
  portfolio: string[];
  rateCard: string;
  contactEmail: string;
  contactPhone: string;
  city?: VendorCity;
  rating?: number;
  reviewCount?: number;
  completedEvents?: number;
  services?: string[];
  pricing?: string;
  status: VendorStatus;
  subscription?: VendorSubscription;
};

export type PricingModel = "fixed" | "hourly" | "project" | "quote";

export type ServiceProfile = {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  category: VendorCategory;
  subcategory?: string;
  pricing: string;
  pricingModel: PricingModel;
  minBudget?: number;
  maxBudget?: number;
  bannerImage?: string;
  rateCardUrl?: string;
  portfolioUrl?: string;
  socialUrl?: string;
  images: string[];
  tags: string[];
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
};

export type VendorReview = {
  id: string;
  vendorId: string;
  eventId: string;
  eventName: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: number;
};

export type VendorInvitationStatus = "pending" | "accepted" | "declined";

export type VendorInvitation = {
  id: string;
  vendorId: string;
  eventId: string;
  organizerId: string;
  message: string;
  status: VendorInvitationStatus;
  createdAt: number;
  respondedAt?: number;
};

export type VendorAnalytics = {
  vendorId: string;
  totalInvitations: number;
  acceptedInvitations: number;
  completedEvents: number;
  totalRevenue: number;
  averageRating: number;
  reviewCount: number;
  responseRate: number;
  reliabilityScore: number;
};
