import type { Event, StreamingConfig, StreamingProvider } from "./events";
import { getEventById, getAllEvents, events } from "./events";
import type { Product, MerchOrder, MerchOrderItem, ProductCategory, ProductBundle } from "@/types/merchandise";
import { CacheInvalidationHooks } from "./cache-invalidation";

export type TicketType = "General" | "VIP";
export type AttendanceType = "physical" | "virtual";

export type Ticket = {
  type: TicketType;
  price: number;
  available: number;
  attendanceType?: AttendanceType; // For hybrid events
};

export type TicketAvailability = {
  eventId: string;
  tickets: Array<Ticket>;
};

export type OrderItem = { 
  type: TicketType; 
  quantity: number; 
  price: number;
  attendanceType?: AttendanceType; // For hybrid events
};
export type Order = {
  id: string;
  eventId: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "paid" | "refunded";
  createdAt: number;
};

export type CryptoBalance = {
  symbol: 'USDT' | 'BTC';
  amount: number;
};

export type Wallet = {
  userId: string;
  balance: number;
  promoBalance: number; // Promotional credits tracked separately
  cryptoBalances?: CryptoBalance[];
};

export type PromoCredit = {
  id: string;
  userId: string;
  amount: number;
  type: "first_deposit_bonus" | "campaign" | "referral" | "event_promo";
  description: string;
  expiresAt?: number; // Optional expiration timestamp
  createdAt: number;
};

export type Transaction = {
  id: string;
  userId: string;
  amount: number;
  type: "credit" | "debit";
  description: string;
  createdAt: number;
};

export type VirtualAccess = {
  id: string;
  eventId: string;
  userId: string;
  ticketOrderId: string;
  joinLink: string;
  expiresAt: number;
  createdAt: number;
};

export type Poll = {
  id: string;
  eventId: string;
  question: string;
  options: Array<{ id: string; text: string; votes: number }>;
  createdBy: string;
  createdAt: number;
  closedAt?: number;
};

export type PollVote = {
  pollId: string;
  optionId: string;
  userId: string;
  votedAt: number;
};

export type QAQuestion = {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  question: string;
  upvotes: number;
  answered: boolean;
  answer?: string;
  answeredBy?: string;
  createdAt: number;
};

export type QAUpvote = {
  questionId: string;
  userId: string;
  upvotedAt: number;
};

export type Reaction = {
  id: string;
  eventId: string;
  userId: string;
  type: 'clap' | 'heart' | 'fire' | 'party' | 'thumbs-up';
  timestamp: number;
};

export type VirtualAttendee = {
  userId: string;
  eventId: string;
  joinedAt: number;
  leftAt?: number;
  isActive: boolean;
};

export type WatchSession = {
  id: string;
  userId: string;
  eventId: string;
  startTime: number;
  endTime?: number;
  totalWatchTime: number; // in seconds
  lastHeartbeat: number;
};

export type VirtualAnalytics = {
  eventId: string;
  peakAttendees: number;
  totalUniqueViewers: number;
  averageWatchTime: number; // in seconds
  retentionRate: number; // percentage
  dropOffPoints: Array<{ timestamp: number; count: number }>; // when people left
  updatedAt: number;
};

// ── Chat Message Types ───────────────────────────────────────────────────────

export type ChatMessage = {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: number;
  type: 'message' | 'system';
  emoji?: string; // Optional emoji reaction
};

export type UserPresence = {
  userId: string;
  userName: string;
  eventId: string;
  status: 'online' | 'away' | 'offline';
  lastSeen: number;
  joinedAt: number;
};

// ── AI-Powered Analytics Types ───────────────────────────────────────────────

export type EventInsight = {
  eventId: string;
  type: 'attendance_prediction' | 'revenue_forecast' | 'pricing_recommendation' | 'timing_suggestion' | 'promotion_timing' | 'audience_targeting' | 'city_benchmark';
  title: string;
  description: string;
  confidence: number; // 0-1
  data: Record<string, any>;
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
  attendanceRate?: number; // For completed events
  satisfactionScore?: number; // Post-event survey
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

// ── Organizer History Types ──────────────────────────────────────────────────

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
  completedAt: number; // When event finished
};

export type OrganizerPerformancePattern = {
  organizerId: string;
  totalEvents: number;
  categoriesHosted: Record<string, number>; // category -> count
  citiesHosted: Record<string, number>; // city -> count
  averageAttendance: number;
  averageRevenue: number;
  averageTicketPrice: number;
  bestPerformingCategory: string;
  bestPerformingCity: string;
  typicalPriceRange: { low: number; high: number };
  growthTrend: 'improving' | 'stable' | 'declining';
  lastUpdated: number;
};

// ── User Profile Types ───────────────────────────────────────────────────────

export type UserProfile = {
  userId: string;
  displayName: string;
  avatar?: string; // URL to profile picture
  bio?: string;
  interests: string[]; // Event categories or topics of interest
  eventsAttended: string[]; // Event IDs
  eventsOrganized: string[]; // Event IDs (for organizers)
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

export type Follow = {
  followerId: string;
  followingId: string;
  type: 'user' | 'organizer';
  createdAt: number;
};

export type Notification = {
  id: string;
  userId: string; // Recipient
  type: 'follow_event' | 'event_update' | 'event_reminder' | 'follow_user' | 'vendor_invitation' | 'vendor_response' | 'task_deadline' | 'milestone_alert' | 'budget_review';
  title: string;
  message: string;
  eventId?: string; // For event-related notifications
  fromUserId?: string; // For user-related notifications (who followed, etc.)
  taskId?: string; // For task-related notifications
  budgetItemId?: string; // For budget-related notifications
  read: boolean;
  createdAt: number;
};

// ── Platform Announcement Types ──────────────────────────────────────────────

export type AnnouncementTargetType = 'all' | 'attendee' | 'organiser' | 'vendor';

export type AnnouncementPriority = 'low' | 'medium' | 'high' | 'urgent';

export type AnnouncementStatus = 'draft' | 'scheduled' | 'published' | 'expired';

export type Announcement = {
  id: string;
  title: string;
  content: string;
  targetType: AnnouncementTargetType;
  priority: AnnouncementPriority;
  status: AnnouncementStatus;
  scheduledAt?: number; // Timestamp for scheduled announcements
  publishedAt?: number; // When it was actually published
  expiresAt?: number; // Optional expiration timestamp
  createdBy: string; // Admin user ID
  createdAt: number;
  updatedAt: number;
};

export type AnnouncementView = {
  id: string;
  announcementId: string;
  userId: string;
  viewedAt: number;
  dismissed?: boolean; // Whether user dismissed the announcement
  dismissedAt?: number;
};

function id(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
}

export type VendorProfile = {
  id: string;
  userId: string;
  name: string;
  description: string;
  category: string;
  portfolio: string[]; // URLs
  rateCard: string; // URL
  contactEmail: string;
  contactPhone: string;
  city?: string; // Location filter
  rating?: number; // Average rating (0-5)
  reviewCount?: number; // Number of reviews
  completedEvents?: number; // Number of events completed (for popularity sorting)
  services?: string[]; // Additional services offered
  pricing?: string; // Pricing information
  status: "pending" | "approved" | "rejected";
  subscription?: {
    plan: "1m" | "3m" | "6m" | "12m";
    activatedAt: number;
    expiresAt: number;
  };
};

export type ServiceProfile = {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  category: VendorProfile["category"];
  subcategory?: string;
  pricing: string;
  pricingModel: "fixed" | "hourly" | "project" | "quote";
  minBudget?: number;
  maxBudget?: number;
  images: string[];
  tags: string[];
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
};

export function getMaxServiceProfiles(subscription?: VendorProfile["subscription"]): number {
  if (!subscription) return 1;
  const plan = subscription.plan;
  if (plan === "1m") return 3;
  if (plan === "3m") return 10;
  return Infinity;
}

const serviceProfiles: Record<string, ServiceProfile[]> = {};

export function listServiceProfiles(vendorId: string): ServiceProfile[] {
  return (serviceProfiles[vendorId] || []).slice().sort((a, b) => b.createdAt - a.createdAt);
}

export function getServiceProfile(profileId: string): ServiceProfile | null {
  for (const profiles of Object.values(serviceProfiles)) {
    const found = profiles.find(p => p.id === profileId);
    if (found) return found;
  }
  return null;
}

export function addServiceProfile(
  vendorId: string,
  data: Omit<ServiceProfile, "id" | "vendorId" | "createdAt" | "updatedAt">
): ServiceProfile {
  if (!serviceProfiles[vendorId]) serviceProfiles[vendorId] = [];
  const profile: ServiceProfile = {
    ...data,
    id: id("svc"),
    vendorId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  serviceProfiles[vendorId].push(profile);
  return profile;
}

export function updateServiceProfile(
  profileId: string,
  data: Partial<Omit<ServiceProfile, "id" | "vendorId" | "createdAt">>
): ServiceProfile | null {
  for (const profiles of Object.values(serviceProfiles)) {
    const idx = profiles.findIndex(p => p.id === profileId);
    if (idx !== -1) {
      profiles[idx] = { ...profiles[idx], ...data, updatedAt: Date.now() };
      return profiles[idx];
    }
  }
  return null;
}

export function deleteServiceProfile(profileId: string): boolean {
  for (const [vendorId, profiles] of Object.entries(serviceProfiles)) {
    const idx = profiles.findIndex(p => p.id === profileId);
    if (idx !== -1) {
      serviceProfiles[vendorId].splice(idx, 1);
      return true;
    }
  }
  return false;
}

export type VendorReview = {
  id: string;
  vendorId: string;
  eventId: string;
  eventName: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: number;
};

export type SavingsTarget = {
  id: string;
  userId: string;
  eventId?: string; // Optional: specific event to save for
  goalAmount: number;
  currentAmount: number;
  targetDate?: string; // Optional: target date in ISO format
  recurringAmount?: number; // Amount to contribute on each recurrence
  recurringFrequency?: 'weekly' | 'biweekly' | 'monthly'; // Frequency of recurring contributions
  nextContribution?: number; // Timestamp of next scheduled contribution
  autoApply?: boolean; // Auto-apply at checkout
  createdAt: number;
  updatedAt: number;
};

export type ReminderType = 'milestone' | 'deadline' | 'suggestion';

export type Reminder = {
  id: string;
  userId: string;
  savingsTargetId: string;
  type: ReminderType;
  message: string;
  scheduledDate: number; // Timestamp when reminder should be shown
  sent: boolean;
  createdAt: number;
};

export type GroupWalletMember = {
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  joinedAt: number;
  status?: 'active' | 'pending' | 'removed'; // For corporate groups with approval workflow
};

export type GroupType = 'friends' | 'family' | 'corporate';

export type GroupPermissions = {
  allowMemberInvites: boolean; // Can members invite others?
  requireApproval: boolean; // Do new members need approval?
  allowTargetChanges: boolean; // Can members change their own targets?
  allowMemberRemoval: boolean; // Can admins remove members?
};

export type GroupWallet = {
  id: string;
  name: string;
  eventId?: string; // Optional: specific event to save for
  createdBy: string;
  groupType: GroupType; // Type of group: friends, family, or corporate
  adminUserIds: string[]; // Array of admin user IDs (for corporate groups)
  permissions: GroupPermissions; // Group-specific permissions
  members: GroupWalletMember[];
  totalGoal: number;
  currentTotal: number;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: number;
  updatedAt: number;
};

export type GroupContribution = {
  id: string;
  groupWalletId: string;
  userId: string;
  userName: string;
  amount: number;
  timestamp: number;
  note?: string;
};

export type GroupNotificationType = 'contribution' | 'reminder' | 'milestone' | 'goal_reached';

export type GroupNotification = {
  id: string;
  groupWalletId: string;
  userId: string; // Recipient of the notification
  type: GroupNotificationType;
  message: string;
  metadata?: {
    contributorName?: string;
    amount?: number;
    progress?: number;
    milestone?: number;
  };
  read: boolean;
  createdAt: number;
};

// ── Geo-Targeted Notification Types ──────────────────────────────────────────

export type NotificationPreferences = {
  userId: string;
  geoNotificationsEnabled: boolean;
  notificationRadius: number; // in kilometers
  categories: string[]; // Event categories to receive notifications for
  minPrice?: number; // Minimum ticket price
  maxPrice?: number; // Maximum ticket price
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
  distance: number; // in kilometers
  sent: boolean;
  sentAt?: number;
  createdAt: number;
};

const availability: Record<string, TicketAvailability> = {};
const orders: Record<string, Order> = {};
const wallets: Record<string, Wallet> = {};
const transactions: Transaction[] = [];
const promoCredits: Record<string, PromoCredit[]> = {}; // Store promo credits per user
const firstDepositBonusApplied: Set<string> = new Set(); // Track users who received first deposit bonus
const savedEvents: Record<string, Set<string>> = {};
const savingsTargets: Record<string, SavingsTarget[]> = {}; // Store multiple savings targets per user
const reminders: Record<string, Reminder[]> = {}; // Store reminders per user
const groupWallets: Record<string, GroupWallet> = {}; // Store group wallets by ID
const groupContributions: Record<string, GroupContribution[]> = {}; // Store contributions per group wallet
const groupNotifications: Record<string, GroupNotification[]> = {}; // Store notifications per user
const vendors: Record<string, VendorProfile> = {};
const vendorReviews: Record<string, VendorReview[]> = {}; // Reviews per vendor
const virtualAccess: Record<string, VirtualAccess> = {};
const polls: Record<string, Poll[]> = {};
const pollVotes: PollVote[] = [];
const qaQuestions: Record<string, QAQuestion[]> = {};
const qaUpvotes: QAUpvote[] = [];
const reactions: Reaction[] = [];
const virtualAttendees: Record<string, VirtualAttendee[]> = {};
const watchSessions: Record<string, WatchSession> = {};

// Chat message storage
const chatMessages: Record<string, ChatMessage[]> = {}; // Messages per event
const userPresence: Record<string, UserPresence[]> = {}; // Presence per event
const virtualAnalytics: Record<string, VirtualAnalytics> = {};

// Geo-targeted notification stores
const notificationPreferences: Record<string, NotificationPreferences> = {};
const userLocations: Record<string, UserLocation> = {};
const geoNotifications: Record<string, GeoNotification[]> = {}; // Store notifications per user

// Analytics data stores
const eventInsights: Record<string, EventInsight[]> = {};
const eventMetrics: Record<string, EventMetrics> = {};
const benchmarkData: Record<string, BenchmarkData> = {};

// Organizer history stores
const organizerEventHistory: Record<string, OrganizerEventHistory[]> = {}; // organizerId -> history
const organizerPerformancePatterns: Record<string, OrganizerPerformancePattern> = {}; // organizerId -> pattern
const eventOrganizers: Record<string, string> = {}; // eventId -> organizerId

// User profile stores
const userProfiles: Record<string, UserProfile> = {}; // userId -> profile
const follows: Follow[] = []; // All follow relationships
const notifications: Record<string, Notification[]> = {}; // userId -> notifications

// Platform announcement stores
const announcements: Record<string, Announcement> = {}; // announcementId -> announcement
const announcementViews: Record<string, AnnouncementView[]> = {}; // userId -> views

// Commission tracking stores
export const eventCommissions: Record<string, EventCommission> = {}; // commissionId -> commission
const commissionsByEvent: Record<string, string> = {}; // eventId -> commissionId
const commissionsByOrganizer: Record<string, string[]> = {}; // organizerId -> commissionIds
const commissionSettlements: Record<string, CommissionSettlement> = {}; // settlementId -> settlement
const commissionReports: Record<string, CommissionReport> = {}; // reportId -> report

// Dispute and refund management stores
const disputes: Record<string, Dispute> = {}; // disputeId -> dispute
const disputesByOrder: Record<string, string> = {}; // orderId -> disputeId
const disputesByUser: Record<string, string[]> = {}; // userId -> disputeIds
const refundProcessing: Record<string, RefundProcessing> = {}; // refundId -> refund
const refundsByDispute: Record<string, string> = {}; // disputeId -> refundId

type EventDraft = {
  id?: string;
  type?: "Physical" | "Virtual" | "Hybrid";
  title?: string;
  description?: string;
  date?: string;
  category?: Event["category"];
  country?: Event["country"];
  state?: string;
  city?: string;
  image?: string;
  venue?: string;
  latitude?: number;
  longitude?: number;
  community?: string;
  communityType?: Event["communityType"];
  postEventCommunityAccess?: boolean;
  ticketSetup?: { generalPrice?: number; vipPrice?: number; generalQty?: number; vipQty?: number };
  virtual?: { 
    url?: string;
    provider?: StreamingProvider;
    accessControl?: "ticket-holders" | "public";
    enableReplay?: boolean;
  };
  merch?: { 
    enabled?: boolean;
    postEventSales?: boolean; // Keep store open after event
    products?: Array<{
      name: string;
      description: string;
      price: number;
      category: ProductCategory;
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
const eventDrafts: Record<string, EventDraft> = {};

export function getAvailability(eventId: string): TicketAvailability | null {
  return availability[eventId] || null;
}

export function createWallet(userId: string): Wallet {
  if (wallets[userId]) {
    throw new Error("Wallet already exists for this user");
  }
  const wallet: Wallet = { userId, balance: 0, promoBalance: 0 };
  wallets[userId] = wallet;
  
  // Invalidate user caches
  CacheInvalidationHooks.onWalletMutation(userId);
  
  return wallet;
}

export function getWallet(userId: string): Wallet | null {
  return wallets[userId] || null;
}

export function ensureWallet(userId: string) {
  if (!wallets[userId]) wallets[userId] = { userId, balance: 0, promoBalance: 0 };
  return wallets[userId];
}

export function addMoney(userId: string, amount: number, description = "Top up") {
  const w = ensureWallet(userId);
  w.balance += amount;
  transactions.push({
    id: id("txn"),
    userId,
    amount,
    type: "credit",
    description,
    createdAt: Date.now(),
  });
  
  // Apply first deposit bonus (10% bonus on first deposit)
  if (!firstDepositBonusApplied.has(userId) && amount > 0) {
    const bonusAmount = amount * 0.10; // 10% bonus
    w.promoBalance += bonusAmount;
    firstDepositBonusApplied.add(userId);
    
    // Record the promo credit
    const promoCredit: PromoCredit = {
      id: id("promo"),
      userId,
      amount: bonusAmount,
      type: "first_deposit_bonus",
      description: `First deposit bonus (10% of $${amount.toFixed(2)})`,
      createdAt: Date.now(),
    };
    
    if (!promoCredits[userId]) {
      promoCredits[userId] = [];
    }
    promoCredits[userId].push(promoCredit);
    
    // Add transaction record for the bonus
    transactions.push({
      id: id("txn"),
      userId,
      amount: bonusAmount,
      type: "credit",
      description: `Promo: ${promoCredit.description}`,
      createdAt: Date.now(),
    });
  }
  
  // Invalidate wallet caches
  CacheInvalidationHooks.onWalletMutation(userId);
  
  return w.balance;
}

export function debitMoney(userId: string, amount: number, description = "Payment") {
  const w = ensureWallet(userId);
  w.balance -= amount;
  transactions.push({
    id: id("txn"),
    userId,
    amount,
    type: "debit",
    description,
    createdAt: Date.now(),
  });
  return w.balance;
}

export function listTransactions(userId: string) {
  return transactions.filter((t) => t.userId === userId).sort((a, b) => b.createdAt - a.createdAt);
}

export function addCryptoBalance(userId: string, symbol: 'USDT' | 'BTC', amount: number) {
  const w = ensureWallet(userId);
  if (!w.cryptoBalances) {
    w.cryptoBalances = [];
  }
  const existing = w.cryptoBalances.find(cb => cb.symbol === symbol);
  if (existing) {
    existing.amount += amount;
  } else {
    w.cryptoBalances.push({ symbol, amount });
  }
  return w;
}

export function getCryptoBalances(userId: string): CryptoBalance[] {
  const w = getWallet(userId);
  return w?.cryptoBalances || [];
}

// Promo credit management functions
export function addPromoCredit(
  userId: string, 
  amount: number, 
  type: PromoCredit["type"], 
  description: string,
  expiresAt?: number
): PromoCredit {
  const w = ensureWallet(userId);
  w.promoBalance += amount;
  
  const promoCredit: PromoCredit = {
    id: id("promo"),
    userId,
    amount,
    type,
    description,
    expiresAt,
    createdAt: Date.now(),
  };
  
  if (!promoCredits[userId]) {
    promoCredits[userId] = [];
  }
  promoCredits[userId].push(promoCredit);
  
  // Add transaction record
  transactions.push({
    id: id("txn"),
    userId,
    amount,
    type: "credit",
    description: `Promo: ${description}`,
    createdAt: Date.now(),
  });
  
  return promoCredit;
}

export function getPromoCredits(userId: string): PromoCredit[] {
  return promoCredits[userId] || [];
}

export function getActivePromoCredits(userId: string): PromoCredit[] {
  const now = Date.now();
  return (promoCredits[userId] || []).filter(pc => !pc.expiresAt || pc.expiresAt > now);
}

export function applyPromoCreditsToPayment(userId: string, paymentAmount: number): {
  promoUsed: number;
  cashUsed: number;
  remaining: number;
} {
  const w = ensureWallet(userId);
  
  // First use promo credits
  const promoUsed = Math.min(w.promoBalance, paymentAmount);
  const remaining = paymentAmount - promoUsed;
  
  // Then use cash balance if needed
  const cashUsed = Math.min(w.balance, remaining);
  const finalRemaining = remaining - cashUsed;
  
  // Deduct from wallet
  if (promoUsed > 0) {
    w.promoBalance -= promoUsed;
    transactions.push({
      id: id("txn"),
      userId,
      amount: promoUsed,
      type: "debit",
      description: "Promo credits applied to payment",
      createdAt: Date.now(),
    });
  }
  
  if (cashUsed > 0) {
    w.balance -= cashUsed;
    transactions.push({
      id: id("txn"),
      userId,
      amount: cashUsed,
      type: "debit",
      description: "Payment from wallet balance",
      createdAt: Date.now(),
    });
  }
  
  return {
    promoUsed,
    cashUsed,
    remaining: finalRemaining,
  };
}

export function createOrder(
  userId: string, 
  eventId: string, 
  items: Array<{ type: TicketType; quantity: number; attendanceType?: AttendanceType }>
) {
  const avail = getAvailability(eventId);
  if (!avail) throw new Error("No availability");
  // Validate and reserve
  let total = 0;
  const orderItems: OrderItem[] = items.map((it) => {
    // Find matching ticket slot (considering attendanceType for hybrid events)
    const slot = avail.tickets.find((t) => 
      t.type === it.type && 
      (it.attendanceType ? t.attendanceType === it.attendanceType : true)
    );
    if (!slot) throw new Error("Invalid ticket type");
    if (slot.available < it.quantity) throw new Error("Insufficient availability");
    slot.available -= it.quantity; // reserve
    total += it.quantity * slot.price;
    return { 
      type: slot.type, 
      quantity: it.quantity, 
      price: slot.price,
      attendanceType: slot.attendanceType 
    };
  });
  const orderId = id("ord");
  const order: Order = {
    id: orderId,
    eventId,
    userId,
    items: orderItems,
    total,
    status: "pending",
    createdAt: Date.now(),
  };
  orders[orderId] = order;
  return order;
}

export function getOrder(orderId: string) {
  return orders[orderId] || null;
}

export function markOrderPaid(orderId: string) {
  const order = orders[orderId];
  if (!order) throw new Error("Order not found");
  order.status = "paid";
  
  // Add event to user's attendance history
  addEventToAttendanceHistory(order.userId, order.eventId);
  
  // Commission calculation is handled server-side when the order is paid via the backend API
  
  // Invalidate order and event caches
  CacheInvalidationHooks.onOrderMutation(order.userId, order.eventId);
  
  return order;
}

export function refundOrder(orderId: string, reason?: string) {
  const order = orders[orderId];
  if (!order) throw new Error("Order not found");
  if (order.status !== "paid") throw new Error("Order is not paid");
  
  // Process instant refund to wallet
  const refundAmount = order.total;
  addMoney(order.userId, refundAmount, `Refund for order ${orderId}${reason ? `: ${reason}` : ''}`);
  
  // Mark order as refunded
  order.status = "refunded" as any; // Extend status type
  
  // Return tickets to availability
  const avail = getAvailability(order.eventId);
  if (avail) {
    order.items.forEach((item) => {
      const slot = avail.tickets.find((t) => 
        t.type === item.type && 
        (item.attendanceType ? t.attendanceType === item.attendanceType : true)
      );
      if (slot) {
        slot.available += item.quantity;
      }
    });
  }
  
  return {
    order,
    refundAmount,
    refundedAt: Date.now()
  };
}

export function getUserOrders(userId: string): Order[] {
  return Object.values(orders)
    .filter(order => order.userId === userId)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function getEventOrders(eventId: string): Order[] {
  return Object.values(orders)
    .filter(order => order.eventId === eventId)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function saveEvent(userId: string, eventId: string) {
  savedEvents[userId] = savedEvents[userId] || new Set();
  savedEvents[userId].add(eventId);
}

export function listSavedEvents(userId: string) {
  return Array.from(savedEvents[userId] || []);
}

// Savings Target Functions
export function createSavingsTarget(userId: string, data: { eventId?: string; goalAmount: number; targetDate?: string }): SavingsTarget {
  const target: SavingsTarget = {
    id: id("savings"),
    userId,
    eventId: data.eventId,
    goalAmount: data.goalAmount,
    currentAmount: 0,
    targetDate: data.targetDate,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  
  if (!savingsTargets[userId]) {
    savingsTargets[userId] = [];
  }
  savingsTargets[userId].push(target);
  
  return target;
}

export function getSavingsTargets(userId: string): SavingsTarget[] {
  return savingsTargets[userId] || [];
}

export function getSavingsTarget(userId: string, targetId: string): SavingsTarget | undefined {
  const targets = savingsTargets[userId] || [];
  return targets.find(t => t.id === targetId);
}

export function updateSavingsTarget(userId: string, targetId: string, updates: Partial<SavingsTarget>): SavingsTarget | null {
  const targets = savingsTargets[userId];
  if (!targets) return null;
  
  const index = targets.findIndex(t => t.id === targetId);
  if (index === -1) return null;
  
  targets[index] = {
    ...targets[index],
    ...updates,
    updatedAt: Date.now(),
  };
  
  return targets[index];
}

export function addToSavingsTarget(userId: string, targetId: string, amount: number): SavingsTarget | null {
  const targets = savingsTargets[userId];
  if (!targets) return null;
  
  const index = targets.findIndex(t => t.id === targetId);
  if (index === -1) return null;
  
  targets[index].currentAmount += amount;
  targets[index].updatedAt = Date.now();
  
  return targets[index];
}

export function deductFromSavingsTarget(userId: string, targetId: string, amount: number): SavingsTarget | null {
  const targets = savingsTargets[userId];
  if (!targets) return null;
  
  const index = targets.findIndex(t => t.id === targetId);
  if (index === -1) return null;
  
  // Don't allow deducting more than available
  const deductAmount = Math.min(amount, targets[index].currentAmount);
  targets[index].currentAmount -= deductAmount;
  targets[index].updatedAt = Date.now();
  
  return targets[index];
}

export function deleteSavingsTarget(userId: string, targetId: string): boolean {
  const targets = savingsTargets[userId];
  if (!targets) return false;
  
  const index = targets.findIndex(t => t.id === targetId);
  if (index === -1) return false;
  
  targets.splice(index, 1);
  return true;
}

// Calculate next contribution date based on frequency
function calculateNextContribution(frequency: 'weekly' | 'biweekly' | 'monthly', fromDate?: number): number {
  const now = fromDate || Date.now();
  const date = new Date(now);
  
  switch (frequency) {
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'biweekly':
      date.setDate(date.getDate() + 14);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
  }
  
  return date.getTime();
}

// Set up recurring contributions for a savings target
export function setupRecurringContribution(
  userId: string,
  targetId: string,
  amount: number,
  frequency: 'weekly' | 'biweekly' | 'monthly'
): SavingsTarget | null {
  const targets = savingsTargets[userId];
  if (!targets) return null;
  
  const index = targets.findIndex(t => t.id === targetId);
  if (index === -1) return null;
  
  targets[index].recurringAmount = amount;
  targets[index].recurringFrequency = frequency;
  targets[index].nextContribution = calculateNextContribution(frequency);
  targets[index].updatedAt = Date.now();
  
  return targets[index];
}

// Cancel recurring contributions for a savings target
export function cancelRecurringContribution(userId: string, targetId: string): SavingsTarget | null {
  const targets = savingsTargets[userId];
  if (!targets) return null;
  
  const index = targets.findIndex(t => t.id === targetId);
  if (index === -1) return null;
  
  targets[index].recurringAmount = undefined;
  targets[index].recurringFrequency = undefined;
  targets[index].nextContribution = undefined;
  targets[index].updatedAt = Date.now();
  
  return targets[index];
}

// Process due recurring contributions (should be called periodically)
export function processDueRecurringContributions(): Array<{ userId: string; targetId: string; amount: number; success: boolean; error?: string }> {
  const results: Array<{ userId: string; targetId: string; amount: number; success: boolean; error?: string }> = [];
  const now = Date.now();
  
  // Iterate through all users' savings targets
  for (const [userId, targets] of Object.entries(savingsTargets)) {
    for (const target of targets) {
      // Check if this target has recurring contributions set up and is due
      if (
        target.recurringAmount &&
        target.recurringFrequency &&
        target.nextContribution &&
        target.nextContribution <= now
      ) {
        // Check if user has sufficient wallet balance
        const wallet = getWallet(userId);
        if (!wallet || wallet.balance < target.recurringAmount) {
          results.push({
            userId,
            targetId: target.id,
            amount: target.recurringAmount,
            success: false,
            error: 'Insufficient wallet balance',
          });
          // Schedule next attempt for tomorrow
          target.nextContribution = now + (24 * 60 * 60 * 1000);
          continue;
        }
        
        try {
          // Debit from wallet
          debitMoney(userId, target.recurringAmount, `Recurring savings contribution (${target.recurringFrequency})`);
          
          // Add to savings target
          target.currentAmount += target.recurringAmount;
          target.updatedAt = now;
          
          // Schedule next contribution
          target.nextContribution = calculateNextContribution(target.recurringFrequency, now);
          
          results.push({
            userId,
            targetId: target.id,
            amount: target.recurringAmount,
            success: true,
          });
        } catch (error) {
          results.push({
            userId,
            targetId: target.id,
            amount: target.recurringAmount,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }
    }
  }
  
  return results;
}

// Get all savings targets with due recurring contributions
export function getDueRecurringContributions(): Array<{ userId: string; target: SavingsTarget }> {
  const due: Array<{ userId: string; target: SavingsTarget }> = [];
  const now = Date.now();
  
  for (const [userId, targets] of Object.entries(savingsTargets)) {
    for (const target of targets) {
      if (
        target.recurringAmount &&
        target.recurringFrequency &&
        target.nextContribution &&
        target.nextContribution <= now
      ) {
        due.push({ userId, target });
      }
    }
  }
  
  return due;
}

// Legacy functions for backward compatibility
export function setSavingsGoal(userId: string, goal: number) {
  // Check if user has any savings targets
  const targets = savingsTargets[userId] || [];
  if (targets.length === 0) {
    // Create a new general savings target
    createSavingsTarget(userId, { goalAmount: goal });
  } else {
    // Update the first target
    targets[0].goalAmount = goal;
    targets[0].updatedAt = Date.now();
  }
}

export function addSavings(userId: string, amount: number) {
  const targets = savingsTargets[userId] || [];
  if (targets.length === 0) {
    // Create a new target with this amount
    const target = createSavingsTarget(userId, { goalAmount: 0 });
    target.currentAmount = amount;
  } else {
    // Add to the first target
    targets[0].currentAmount += amount;
    targets[0].updatedAt = Date.now();
  }
}

export function getSavings(userId: string) {
  const targets = savingsTargets[userId] || [];
  if (targets.length === 0) {
    return { goal: 0, progress: 0 };
  }
  // Return the first target for backward compatibility
  return { goal: targets[0].goalAmount, progress: targets[0].currentAmount };
}

// ── Savings Reminders ─────────────────────────────────────────────────────────

/**
 * Create a reminder for a savings target
 */
export function createReminder(
  userId: string,
  savingsTargetId: string,
  type: ReminderType,
  message: string,
  scheduledDate: number
): Reminder {
  const reminder: Reminder = {
    id: id("reminder"),
    userId,
    savingsTargetId,
    type,
    message,
    scheduledDate,
    sent: false,
    createdAt: Date.now(),
  };
  
  if (!reminders[userId]) {
    reminders[userId] = [];
  }
  reminders[userId].push(reminder);
  
  return reminder;
}

/**
 * Get all reminders for a user
 */
export function getReminders(userId: string, includeProcessed = false): Reminder[] {
  const userReminders = reminders[userId] || [];
  if (includeProcessed) {
    return userReminders.sort((a, b) => a.scheduledDate - b.scheduledDate);
  }
  return userReminders
    .filter(r => !r.sent)
    .sort((a, b) => a.scheduledDate - b.scheduledDate);
}

/**
 * Get reminders for a specific savings target
 */
export function getRemindersForTarget(userId: string, savingsTargetId: string): Reminder[] {
  const userReminders = reminders[userId] || [];
  return userReminders
    .filter(r => r.savingsTargetId === savingsTargetId)
    .sort((a, b) => a.scheduledDate - b.scheduledDate);
}

/**
 * Mark a reminder as sent
 */
export function markReminderSent(userId: string, reminderId: string): Reminder | null {
  const userReminders = reminders[userId];
  if (!userReminders) return null;
  
  const reminder = userReminders.find(r => r.id === reminderId);
  if (!reminder) return null;
  
  reminder.sent = true;
  return reminder;
}

/**
 * Generate reminders for a savings target
 * Creates deadline reminders (7, 3, 1 days before event) and milestone reminders
 */
export function generateRemindersForTarget(userId: string, savingsTargetId: string): Reminder[] {
  const target = getSavingsTarget(userId, savingsTargetId);
  if (!target) return [];
  
  const generatedReminders: Reminder[] = [];
  const now = Date.now();
  
  // Generate deadline reminders if target has a date
  if (target.targetDate && target.eventId) {
    const targetDate = new Date(target.targetDate).getTime();
    const daysUntilEvent = Math.floor((targetDate - now) / (1000 * 60 * 60 * 24));
    
    // 7 days before
    if (daysUntilEvent > 7) {
      const reminderDate = targetDate - (7 * 24 * 60 * 60 * 1000);
      const remaining = target.goalAmount - target.currentAmount;
      const dailyAmount = remaining / 7;
      
      generatedReminders.push(
        createReminder(
          userId,
          savingsTargetId,
          'deadline',
          `7 days until your event! You need $${remaining.toFixed(2)} more. Save $${dailyAmount.toFixed(2)} per day to reach your goal.`,
          reminderDate
        )
      );
    }
    
    // 3 days before
    if (daysUntilEvent > 3) {
      const reminderDate = targetDate - (3 * 24 * 60 * 60 * 1000);
      const remaining = target.goalAmount - target.currentAmount;
      const dailyAmount = remaining / 3;
      
      generatedReminders.push(
        createReminder(
          userId,
          savingsTargetId,
          'deadline',
          `Only 3 days left! You're $${remaining.toFixed(2)} away from your goal. Save $${dailyAmount.toFixed(2)} per day.`,
          reminderDate
        )
      );
    }
    
    // 1 day before
    if (daysUntilEvent > 1) {
      const reminderDate = targetDate - (1 * 24 * 60 * 60 * 1000);
      const remaining = target.goalAmount - target.currentAmount;
      
      generatedReminders.push(
        createReminder(
          userId,
          savingsTargetId,
          'deadline',
          `Final day! Add $${remaining.toFixed(2)} to complete your savings goal for tomorrow's event.`,
          reminderDate
        )
      );
    }
  }
  
  // Generate milestone reminders
  const progress = target.currentAmount / target.goalAmount;
  const milestones = [0.25, 0.5, 0.75, 1.0];
  
  for (const milestone of milestones) {
    if (progress >= milestone) {
      // Check if milestone reminder already exists
      const existingMilestone = getRemindersForTarget(userId, savingsTargetId)
        .find(r => r.type === 'milestone' && r.message.includes(`${milestone * 100}%`));
      
      if (!existingMilestone) {
        const messages = {
          0.25: `You're 25% of the way there! Keep up the great savings momentum.`,
          0.5: `Halfway there! You've saved $${target.currentAmount.toFixed(2)} of your $${target.goalAmount.toFixed(2)} goal.`,
          0.75: `75% complete! You're so close to reaching your savings goal!`,
          1.0: `Congratulations! You've reached your savings goal of $${target.goalAmount.toFixed(2)}!`,
        };
        
        generatedReminders.push(
          createReminder(
            userId,
            savingsTargetId,
            'milestone',
            messages[milestone as keyof typeof messages],
            now // Show immediately
          )
        );
      }
    }
  }
  
  // Generate suggestion reminders based on progress and time remaining
  if (target.targetDate && target.currentAmount < target.goalAmount) {
    const targetDate = new Date(target.targetDate).getTime();
    const daysRemaining = Math.floor((targetDate - now) / (1000 * 60 * 60 * 24));
    const remaining = target.goalAmount - target.currentAmount;
    
    if (daysRemaining > 0 && daysRemaining <= 30) {
      const suggestedAmount = remaining / daysRemaining;
      
      // Check if suggestion reminder already exists for this week
      const weekStart = now - (now % (7 * 24 * 60 * 60 * 1000));
      const existingSuggestion = getRemindersForTarget(userId, savingsTargetId)
        .find(r => r.type === 'suggestion' && r.createdAt >= weekStart);
      
      if (!existingSuggestion && suggestedAmount > 0) {
        generatedReminders.push(
          createReminder(
            userId,
            savingsTargetId,
            'suggestion',
            `Tip: Save $${suggestedAmount.toFixed(2)} per day to reach your goal on time. You have ${daysRemaining} days left.`,
            now
          )
        );
      }
    }
  }
  
  return generatedReminders;
}

/**
 * Process all pending reminders (should be called periodically)
 * Returns reminders that are due to be shown
 */
export function processPendingReminders(): Array<{ userId: string; reminder: Reminder }> {
  const dueReminders: Array<{ userId: string; reminder: Reminder }> = [];
  const now = Date.now();
  
  for (const [userId, userReminders] of Object.entries(reminders)) {
    for (const reminder of userReminders) {
      if (!reminder.sent && reminder.scheduledDate <= now) {
        dueReminders.push({ userId, reminder });
      }
    }
  }
  
  return dueReminders;
}

/**
 * Calculate suggested contribution amount for a savings target
 */
export function calculateSuggestedContribution(userId: string, savingsTargetId: string): {
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  message: string;
} | null {
  const target = getSavingsTarget(userId, savingsTargetId);
  if (!target || target.currentAmount >= target.goalAmount) return null;
  
  const remaining = target.goalAmount - target.currentAmount;
  
  if (!target.targetDate) {
    // No deadline, suggest based on reasonable timeframe
    return {
      amount: remaining / 30, // Spread over 30 days
      frequency: 'daily',
      message: `Save $${(remaining / 30).toFixed(2)} per day to reach your goal in a month.`,
    };
  }
  
  const targetDate = new Date(target.targetDate).getTime();
  const now = Date.now();
  const daysRemaining = Math.floor((targetDate - now) / (1000 * 60 * 60 * 24));
  
  if (daysRemaining <= 0) {
    return {
      amount: remaining,
      frequency: 'daily',
      message: `Your event is here! Add $${remaining.toFixed(2)} to complete your goal.`,
    };
  }
  
  if (daysRemaining <= 7) {
    return {
      amount: remaining / daysRemaining,
      frequency: 'daily',
      message: `Save $${(remaining / daysRemaining).toFixed(2)} per day for the next ${daysRemaining} days.`,
    };
  }
  
  const weeksRemaining = Math.floor(daysRemaining / 7);
  if (weeksRemaining <= 4) {
    return {
      amount: remaining / weeksRemaining,
      frequency: 'weekly',
      message: `Save $${(remaining / weeksRemaining).toFixed(2)} per week for the next ${weeksRemaining} weeks.`,
    };
  }
  
  const monthsRemaining = Math.floor(daysRemaining / 30);
  return {
    amount: remaining / monthsRemaining,
    frequency: 'monthly',
    message: `Save $${(remaining / monthsRemaining).toFixed(2)} per month for the next ${monthsRemaining} months.`,
  };
}

// ── Group Wallet Functions ───────────────────────────────────────────────────

/**
 * Get default permissions for a group type
 */
function getDefaultPermissions(groupType: GroupType): GroupPermissions {
  switch (groupType) {
    case 'friends':
      return {
        allowMemberInvites: true,
        requireApproval: false,
        allowTargetChanges: true,
        allowMemberRemoval: false,
      };
    case 'family':
      return {
        allowMemberInvites: true,
        requireApproval: false,
        allowTargetChanges: true,
        allowMemberRemoval: true,
      };
    case 'corporate':
      return {
        allowMemberInvites: false,
        requireApproval: true,
        allowTargetChanges: false,
        allowMemberRemoval: true,
      };
  }
}

/**
 * Create a new group wallet
 */
export function createGroupWallet(
  createdBy: string,
  name: string,
  members: Array<{ userId: string; name: string; targetAmount: number }>,
  eventId?: string,
  groupType: GroupType = 'friends',
  adminUserIds?: string[],
  customPermissions?: Partial<GroupPermissions>
): GroupWallet {
  const totalGoal = members.reduce((sum, m) => sum + m.targetAmount, 0);
  
  // Get default permissions for group type, then apply custom overrides
  const permissions = {
    ...getDefaultPermissions(groupType),
    ...customPermissions,
  };

  // For corporate groups, initialize members as pending if approval is required
  const memberStatus = groupType === 'corporate' && permissions.requireApproval ? 'pending' : 'active';

  // Set up admin user IDs
  let admins = [createdBy]; // Creator is always an admin
  if (adminUserIds && adminUserIds.length > 0) {
    // Add additional admins (deduplicate)
    admins = [...new Set([...admins, ...adminUserIds])];
  }

  const groupWallet: GroupWallet = {
    id: id("grpwlt"),
    name,
    eventId,
    createdBy,
    groupType,
    adminUserIds: admins,
    permissions,
    members: members.map(m => ({
      ...m,
      currentAmount: 0,
      joinedAt: Date.now(),
      status: memberStatus,
    })),
    totalGoal,
    currentTotal: 0,
    status: 'active',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  groupWallets[groupWallet.id] = groupWallet;
  return groupWallet;
}

/**
 * Get a group wallet by ID
 */
export function getGroupWallet(groupWalletId: string): GroupWallet | null {
  return groupWallets[groupWalletId] || null;
}

/**
 * Get all group wallets for a user (where they are creator or member)
 */
export function getUserGroupWallets(userId: string): GroupWallet[] {
  return Object.values(groupWallets)
    .filter(gw =>
      gw.createdBy === userId ||
      gw.members.some(m => m.userId === userId)
    )
    .sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * Get group wallets by event ID
 */
export function getGroupWalletsByEvent(eventId: string): GroupWallet[] {
  return Object.values(groupWallets)
    .filter(gw => gw.eventId === eventId)
    .sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * Add a member to an existing group wallet
 */
export function addMemberToGroupWallet(
  groupWalletId: string,
  userId: string,
  name: string,
  targetAmount: number
): GroupWallet | null {
  const groupWallet = groupWallets[groupWalletId];
  if (!groupWallet) return null;

  // Check if member already exists
  const existingMember = groupWallet.members.find(m => m.userId === userId);
  if (existingMember) {
    return groupWallet; // Already a member
  }

  // Add new member
  groupWallet.members.push({
    userId,
    name,
    targetAmount,
    currentAmount: 0,
    joinedAt: Date.now(),
  });

  // Update total goal
  groupWallet.totalGoal += targetAmount;
  groupWallet.updatedAt = Date.now();

  return groupWallet;
}

/**
 * Contribute to a group wallet
 */
export function contributeToGroupWallet(
  groupWalletId: string,
  userId: string,
  amount: number
): GroupWallet | null {
  const groupWallet = groupWallets[groupWalletId];
  if (!groupWallet) return null;

  // Find the member
  const member = groupWallet.members.find(m => m.userId === userId);
  if (!member) {
    throw new Error("User is not a member of this group wallet");
  }

  // Check if user has sufficient wallet balance
  const wallet = getWallet(userId);
  if (!wallet || wallet.balance < amount) {
    throw new Error("Insufficient wallet balance");
  }

  // Debit from user's wallet
  debitMoney(userId, amount, `Group wallet contribution: ${groupWallet.name}`);

  // Add to member's contribution
  member.currentAmount += amount;

  // Update group total
  groupWallet.currentTotal += amount;
  groupWallet.updatedAt = Date.now();

  // Record the contribution
  const contribution: GroupContribution = {
    id: id("contrib"),
    groupWalletId,
    userId,
    userName: member.name,
    amount,
    timestamp: Date.now(),
  };

  if (!groupContributions[groupWalletId]) {
    groupContributions[groupWalletId] = [];
  }
  groupContributions[groupWalletId].push(contribution);

  // Check if goal is reached
  if (groupWallet.currentTotal >= groupWallet.totalGoal) {
    groupWallet.status = 'completed';
  }

  // Send notifications to other members about this contribution
  notifyGroupContribution(groupWalletId, userId, member.name, amount);

  // Check and notify milestones
  checkAndNotifyMilestones(groupWalletId);

  return groupWallet;
}

/**
 * Update a member's target amount
 */
export function updateMemberTarget(
  groupWalletId: string,
  userId: string,
  newTargetAmount: number
): GroupWallet | null {
  const groupWallet = groupWallets[groupWalletId];
  if (!groupWallet) return null;

  const member = groupWallet.members.find(m => m.userId === userId);
  if (!member) return null;

  // Update total goal
  const difference = newTargetAmount - member.targetAmount;
  groupWallet.totalGoal += difference;

  // Update member target
  member.targetAmount = newTargetAmount;
  groupWallet.updatedAt = Date.now();

  return groupWallet;
}

/**
 * Get contribution history for a group wallet
 */
export function getGroupContributions(groupWalletId: string): GroupContribution[] {
  return groupContributions[groupWalletId] || [];
}

/**
 * Get contribution statistics per member
 */
export function getGroupContributionStats(groupWalletId: string) {
  const contributions = getGroupContributions(groupWalletId);
  const groupWallet = groupWallets[groupWalletId];
  
  if (!groupWallet) return null;

  // Calculate stats per member
  const memberStats = groupWallet.members.map(member => {
    const memberContributions = contributions.filter(c => c.userId === member.userId);
    const contributionCount = memberContributions.length;
    const averageContribution = contributionCount > 0 
      ? member.currentAmount / contributionCount 
      : 0;
    
    return {
      userId: member.userId,
      userName: member.name,
      totalContributed: member.currentAmount,
      targetAmount: member.targetAmount,
      contributionCount,
      averageContribution,
      progressPercentage: member.targetAmount > 0 
        ? (member.currentAmount / member.targetAmount) * 100 
        : 0,
    };
  });

  // Find most active contributor
  const mostActiveContributor = memberStats.reduce((max, current) => 
    current.contributionCount > max.contributionCount ? current : max
  , memberStats[0]);

  return {
    memberStats,
    mostActiveContributor,
    totalContributions: contributions.length,
    averageContributionAmount: contributions.length > 0
      ? groupWallet.currentTotal / contributions.length
      : 0,
  };
}

/**
 * Cancel a group wallet (only creator can cancel)
 */
export function cancelGroupWallet(groupWalletId: string, userId: string): GroupWallet | null {
  const groupWallet = groupWallets[groupWalletId];
  if (!groupWallet) return null;

  if (groupWallet.createdBy !== userId) {
    throw new Error("Only the creator can cancel the group wallet");
  }

  if (groupWallet.status !== 'active') {
    throw new Error("Group wallet is not active");
  }

  // Refund all contributions
  groupWallet.members.forEach(member => {
    if (member.currentAmount > 0) {
      addMoney(member.userId, member.currentAmount, `Group wallet refund: ${groupWallet.name}`);
    }
  });

  groupWallet.status = 'cancelled';
  groupWallet.updatedAt = Date.now();

  return groupWallet;
}

/**
 * Use group wallet funds for a purchase (e.g., at checkout)
 */
export function useGroupWalletFunds(
  groupWalletId: string,
  amount: number
): { success: boolean; amountUsed: number; remaining: number } {
  const groupWallet = groupWallets[groupWalletId];
  if (!groupWallet) {
    return { success: false, amountUsed: 0, remaining: amount };
  }

  const amountUsed = Math.min(groupWallet.currentTotal, amount);
  const remaining = amount - amountUsed;

  // Deduct from group wallet
  groupWallet.currentTotal -= amountUsed;
  groupWallet.updatedAt = Date.now();

  // Proportionally deduct from each member based on their contribution
  if (amountUsed > 0) {
    groupWallet.members.forEach(member => {
      if (member.currentAmount > 0) {
        const memberShare = (member.currentAmount / (groupWallet.currentTotal + amountUsed)) * amountUsed;
        member.currentAmount = Math.max(0, member.currentAmount - memberShare);
      }
    });
  }

  return { success: true, amountUsed, remaining };
}

// ── Group Wallet Notification Functions ──────────────────────────────────────

/**
 * Create a notification for a group wallet member
 */
export function createGroupNotification(
  groupWalletId: string,
  userId: string,
  type: GroupNotificationType,
  message: string,
  metadata?: GroupNotification['metadata']
): GroupNotification {
  const notification: GroupNotification = {
    id: id("grpnotif"),
    groupWalletId,
    userId,
    type,
    message,
    metadata,
    read: false,
    createdAt: Date.now(),
  };

  if (!groupNotifications[userId]) {
    groupNotifications[userId] = [];
  }
  groupNotifications[userId].push(notification);

  return notification;
}

/**
 * Get all notifications for a user
 */
export function getGroupNotifications(userId: string, unreadOnly = false): GroupNotification[] {
  const userNotifications = groupNotifications[userId] || [];
  if (unreadOnly) {
    return userNotifications.filter(n => !n.read).sort((a, b) => b.createdAt - a.createdAt);
  }
  return userNotifications.sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * Get notifications for a specific group wallet
 */
export function getGroupWalletNotifications(userId: string, groupWalletId: string): GroupNotification[] {
  const userNotifications = groupNotifications[userId] || [];
  return userNotifications
    .filter(n => n.groupWalletId === groupWalletId)
    .sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * Mark a notification as read
 */
export function markNotificationRead(userId: string, notificationId: string): GroupNotification | null {
  const userNotifications = groupNotifications[userId];
  if (!userNotifications) return null;

  const notification = userNotifications.find(n => n.id === notificationId);
  if (!notification) return null;

  notification.read = true;
  return notification;
}

/**
 * Mark all notifications as read for a user
 */
export function markAllNotificationsRead(userId: string, groupWalletId?: string): number {
  const userNotifications = groupNotifications[userId];
  if (!userNotifications) return 0;

  let count = 0;
  userNotifications.forEach(n => {
    if (!n.read && (!groupWalletId || n.groupWalletId === groupWalletId)) {
      n.read = true;
      count++;
    }
  });

  return count;
}

/**
 * Get unread notification count
 */
export function getUnreadNotificationCount(userId: string, groupWalletId?: string): number {
  const userNotifications = groupNotifications[userId] || [];
  return userNotifications.filter(n => 
    !n.read && (!groupWalletId || n.groupWalletId === groupWalletId)
  ).length;
}

/**
 * Notify all group members about a contribution
 */
export function notifyGroupContribution(
  groupWalletId: string,
  contributorUserId: string,
  contributorName: string,
  amount: number
): GroupNotification[] {
  const groupWallet = groupWallets[groupWalletId];
  if (!groupWallet) return [];

  const notifications: GroupNotification[] = [];
  const progress = (groupWallet.currentTotal / groupWallet.totalGoal) * 100;

  // Notify all members except the contributor
  groupWallet.members.forEach(member => {
    if (member.userId !== contributorUserId) {
      const notification = createGroupNotification(
        groupWalletId,
        member.userId,
        'contribution',
        `${contributorName} contributed $${amount.toFixed(2)} to ${groupWallet.name}`,
        {
          contributorName,
          amount,
          progress: Math.round(progress),
        }
      );
      notifications.push(notification);
    }
  });

  return notifications;
}

/**
 * Check and notify milestone achievements
 */
export function checkAndNotifyMilestones(groupWalletId: string): GroupNotification[] {
  const groupWallet = groupWallets[groupWalletId];
  if (!groupWallet) return [];

  const progress = (groupWallet.currentTotal / groupWallet.totalGoal) * 100;
  const milestones = [25, 50, 75, 100];
  const notifications: GroupNotification[] = [];

  for (const milestone of milestones) {
    if (progress >= milestone) {
      // Check if milestone notification already sent
      const alreadyNotified = groupWallet.members.some(member => {
        const memberNotifications = groupNotifications[member.userId] || [];
        return memberNotifications.some(n => 
          n.groupWalletId === groupWalletId &&
          n.type === (milestone === 100 ? 'goal_reached' : 'milestone') &&
          n.metadata?.milestone === milestone
        );
      });

      if (!alreadyNotified) {
        const type = milestone === 100 ? 'goal_reached' : 'milestone';
        const message = milestone === 100
          ? `Congratulations! ${groupWallet.name} has reached its goal of $${groupWallet.totalGoal.toFixed(2)}!`
          : `${groupWallet.name} is ${milestone}% funded! Keep it up!`;

        // Notify all members
        groupWallet.members.forEach(member => {
          const notification = createGroupNotification(
            groupWalletId,
            member.userId,
            type,
            message,
            {
              milestone,
              progress: Math.round(progress),
            }
          );
          notifications.push(notification);
        });
      }
    }
  }

  return notifications;
}

/**
 * Send reminders to members who are behind on their contributions
 */
export function sendContributionReminders(groupWalletId: string): GroupNotification[] {
  const groupWallet = groupWallets[groupWalletId];
  if (!groupWallet || groupWallet.status !== 'active') return [];

  const notifications: GroupNotification[] = [];
  const now = Date.now();

  groupWallet.members.forEach(member => {
    const progress = member.targetAmount > 0 
      ? (member.currentAmount / member.targetAmount) * 100 
      : 100;

    // Send reminder if member is behind (less than 50% of their target)
    if (progress < 50 && member.targetAmount > 0) {
      const remaining = member.targetAmount - member.currentAmount;
      const suggestedAmount = Math.ceil(remaining / 4); // Suggest contributing 1/4 of remaining

      // Check if reminder was sent recently (within last 7 days)
      const recentReminder = (groupNotifications[member.userId] || []).find(n =>
        n.groupWalletId === groupWalletId &&
        n.type === 'reminder' &&
        (now - n.createdAt) < (7 * 24 * 60 * 60 * 1000)
      );

      if (!recentReminder) {
        const notification = createGroupNotification(
          groupWalletId,
          member.userId,
          'reminder',
          `You're ${Math.round(progress)}% towards your goal in ${groupWallet.name}. Consider contributing $${suggestedAmount.toFixed(2)} to catch up!`,
          {
            progress: Math.round(progress),
            amount: suggestedAmount,
          }
        );
        notifications.push(notification);
      }
    }
  });

  return notifications;
}

// ── Group Wallet Admin Functions ──────────────────────────────────────────────

/**
 * Check if a user is an admin of a group wallet
 */
export function isGroupWalletAdmin(groupWalletId: string, userId: string): boolean {
  const groupWallet = groupWallets[groupWalletId];
  if (!groupWallet) return false;
  return groupWallet.adminUserIds.includes(userId);
}

/**
 * Add an admin to a group wallet (only existing admins can do this)
 */
export function addGroupWalletAdmin(
  groupWalletId: string,
  requestingUserId: string,
  newAdminUserId: string
): GroupWallet | null {
  const groupWallet = groupWallets[groupWalletId];
  if (!groupWallet) return null;

  // Check if requesting user is an admin
  if (!isGroupWalletAdmin(groupWalletId, requestingUserId)) {
    throw new Error("Only admins can add other admins");
  }

  // Check if user is already an admin
  if (groupWallet.adminUserIds.includes(newAdminUserId)) {
    return groupWallet; // Already an admin
  }

  // Add the new admin
  groupWallet.adminUserIds.push(newAdminUserId);
  groupWallet.updatedAt = Date.now();

  return groupWallet;
}

/**
 * Remove an admin from a group wallet (creator cannot be removed)
 */
export function removeGroupWalletAdmin(
  groupWalletId: string,
  requestingUserId: string,
  adminToRemove: string
): GroupWallet | null {
  const groupWallet = groupWallets[groupWalletId];
  if (!groupWallet) return null;

  // Check if requesting user is an admin
  if (!isGroupWalletAdmin(groupWalletId, requestingUserId)) {
    throw new Error("Only admins can remove other admins");
  }

  // Cannot remove the creator
  if (adminToRemove === groupWallet.createdBy) {
    throw new Error("Cannot remove the creator as admin");
  }

  // Remove the admin
  groupWallet.adminUserIds = groupWallet.adminUserIds.filter(id => id !== adminToRemove);
  groupWallet.updatedAt = Date.now();

  return groupWallet;
}

/**
 * Approve a pending member (for corporate groups with approval workflow)
 */
export function approveMember(
  groupWalletId: string,
  adminUserId: string,
  memberUserId: string
): GroupWallet | null {
  const groupWallet = groupWallets[groupWalletId];
  if (!groupWallet) return null;

  // Check if requesting user is an admin
  if (!isGroupWalletAdmin(groupWalletId, adminUserId)) {
    throw new Error("Only admins can approve members");
  }

  // Find the member
  const member = groupWallet.members.find(m => m.userId === memberUserId);
  if (!member) {
    throw new Error("Member not found");
  }

  if (member.status !== 'pending') {
    return groupWallet; // Already approved or removed
  }

  // Approve the member
  member.status = 'active';
  groupWallet.updatedAt = Date.now();

  // Notify the member
  createGroupNotification(
    groupWalletId,
    memberUserId,
    'milestone',
    `Your membership in ${groupWallet.name} has been approved!`,
    {}
  );

  return groupWallet;
}

/**
 * Reject a pending member
 */
export function rejectMember(
  groupWalletId: string,
  adminUserId: string,
  memberUserId: string
): GroupWallet | null {
  const groupWallet = groupWallets[groupWalletId];
  if (!groupWallet) return null;

  // Check if requesting user is an admin
  if (!isGroupWalletAdmin(groupWalletId, adminUserId)) {
    throw new Error("Only admins can reject members");
  }

  // Remove the member from the group
  const memberIndex = groupWallet.members.findIndex(m => m.userId === memberUserId);
  if (memberIndex === -1) {
    throw new Error("Member not found");
  }

  const member = groupWallet.members[memberIndex];
  
  // Refund any contributions
  if (member.currentAmount > 0) {
    addMoney(memberUserId, member.currentAmount, `Refund from ${groupWallet.name} (membership rejected)`);
    groupWallet.currentTotal -= member.currentAmount;
  }

  // Update total goal
  groupWallet.totalGoal -= member.targetAmount;

  // Remove the member
  groupWallet.members.splice(memberIndex, 1);
  groupWallet.updatedAt = Date.now();

  return groupWallet;
}

/**
 * Remove a member from the group (admin action)
 */
export function removeMemberFromGroup(
  groupWalletId: string,
  adminUserId: string,
  memberUserId: string
): GroupWallet | null {
  const groupWallet = groupWallets[groupWalletId];
  if (!groupWallet) return null;

  // Check if requesting user is an admin
  if (!isGroupWalletAdmin(groupWalletId, adminUserId)) {
    throw new Error("Only admins can remove members");
  }

  // Check if removal is allowed by permissions
  if (!groupWallet.permissions.allowMemberRemoval) {
    throw new Error("Member removal is not allowed for this group");
  }

  // Cannot remove the creator
  if (memberUserId === groupWallet.createdBy) {
    throw new Error("Cannot remove the creator from the group");
  }

  // Find and remove the member
  const memberIndex = groupWallet.members.findIndex(m => m.userId === memberUserId);
  if (memberIndex === -1) {
    throw new Error("Member not found");
  }

  const member = groupWallet.members[memberIndex];
  
  // Refund any contributions
  if (member.currentAmount > 0) {
    addMoney(memberUserId, member.currentAmount, `Refund from ${groupWallet.name} (removed from group)`);
    groupWallet.currentTotal -= member.currentAmount;
  }

  // Update total goal
  groupWallet.totalGoal -= member.targetAmount;

  // Mark as removed
  member.status = 'removed';
  groupWallet.members.splice(memberIndex, 1);
  groupWallet.updatedAt = Date.now();

  // Notify the member
  createGroupNotification(
    groupWalletId,
    memberUserId,
    'milestone',
    `You have been removed from ${groupWallet.name}. Your contributions have been refunded.`,
    {}
  );

  return groupWallet;
}

/**
 * Set a member's target amount (admin action for corporate groups)
 */
export function setMemberTargetByAdmin(
  groupWalletId: string,
  adminUserId: string,
  memberUserId: string,
  newTargetAmount: number
): GroupWallet | null {
  const groupWallet = groupWallets[groupWalletId];
  if (!groupWallet) return null;

  // Check if requesting user is an admin
  if (!isGroupWalletAdmin(groupWalletId, adminUserId)) {
    throw new Error("Only admins can set member targets");
  }

  // For corporate groups, admins can always set targets
  // For other groups, check permissions
  if (groupWallet.groupType !== 'corporate' && groupWallet.permissions.allowTargetChanges) {
    throw new Error("Members can change their own targets in this group type");
  }

  return updateMemberTarget(groupWalletId, memberUserId, newTargetAmount);
}

/**
 * Complete a group wallet early (admin action)
 */
export function completeGroupWalletEarly(
  groupWalletId: string,
  adminUserId: string
): GroupWallet | null {
  const groupWallet = groupWallets[groupWalletId];
  if (!groupWallet) return null;

  // Check if requesting user is an admin
  if (!isGroupWalletAdmin(groupWalletId, adminUserId)) {
    throw new Error("Only admins can complete the group early");
  }

  if (groupWallet.status !== 'active') {
    throw new Error("Group wallet is not active");
  }

  groupWallet.status = 'completed';
  groupWallet.updatedAt = Date.now();

  // Notify all members
  groupWallet.members.forEach(member => {
    createGroupNotification(
      groupWalletId,
      member.userId,
      'goal_reached',
      `${groupWallet.name} has been marked as completed by an admin.`,
      {}
    );
  });

  return groupWallet;
}

/**
 * Update group wallet permissions (admin action)
 */
export function updateGroupPermissions(
  groupWalletId: string,
  adminUserId: string,
  newPermissions: Partial<GroupPermissions>
): GroupWallet | null {
  const groupWallet = groupWallets[groupWalletId];
  if (!groupWallet) return null;

  // Check if requesting user is an admin
  if (!isGroupWalletAdmin(groupWalletId, adminUserId)) {
    throw new Error("Only admins can update permissions");
  }

  groupWallet.permissions = {
    ...groupWallet.permissions,
    ...newPermissions,
  };
  groupWallet.updatedAt = Date.now();

  return groupWallet;
}


export function getEventDraft(userId: string) {
  eventDrafts[userId] = eventDrafts[userId] || { status: "draft" };
  return eventDrafts[userId];
}

export function saveEventDraft(userId: string, patch: Partial<EventDraft>) {
  eventDrafts[userId] = { ...getEventDraft(userId), ...patch, status: "draft" };
  return eventDrafts[userId];
}

export function publishEventFromDraft(userId: string) {
  const draft = getEventDraft(userId);
  if (!draft.title || !draft.description || !draft.date || !draft.category || !draft.country || !draft.city || !draft.image) {
    throw new Error("Incomplete draft");
  }
  
  // Build streaming config if virtual/hybrid
  let streamingConfig: StreamingConfig | undefined;
  if ((draft.type === "Virtual" || draft.type === "Hybrid") && draft.virtual?.url) {
    streamingConfig = {
      provider: draft.virtual.provider || "Zoom",
      streamUrl: draft.virtual.url,
      accessControl: draft.virtual.accessControl || "ticket-holders",
      enableReplay: draft.virtual.enableReplay,
    };
  }
  
  // Event creation is handled server-side via the backend API.
  // The draft publish API route (/api/drafts/event/publish) submits to the backend
  // and returns the created event ID. We use a stub here so downstream
  // in-memory tracking (merch, organizer history) still works during the transition.
  const created = { id: draft.id || `draft-${Date.now()}` };
  
  // Track event organizer
  eventOrganizers[created.id] = userId;
  
  // Add event to organizer's profile
  addEventToOrganizedHistory(userId, created.id);
  
  // Create merchandise products if enabled
  if (draft.merch?.enabled && draft.merch.products && draft.merch.products.length > 0) {
    draft.merch.products.forEach((productData) => {
      if (productData.name && productData.price >= 0 && productData.stock > 0) {
        addProduct(created.id, {
          name: productData.name,
          description: productData.description || "",
          price: productData.price,
          category: productData.category,
          stock: productData.stock,
          image: productData.image || "",
          sizes: productData.sizes,
          fulfillmentType: productData.fulfillmentType || "pickup",
          pickupInstructions: productData.pickupInstructions,
          digitalDownloadUrl: productData.digitalDownloadUrl,
        });
      }
    });
  }
  
  eventDrafts[userId] = { status: "published" };
  return created;
}

export function createVendorProfile(userId: string, data: Omit<VendorProfile, "id" | "userId" | "status">) {
  const profileId = id("vnd");
  const profile: VendorProfile = {
    id: profileId,
    userId,
    ...data,
    status: "pending",
  };
  vendors[userId] = profile;
  return profile;
}

export function getVendorProfile(userId: string) {
  return vendors[userId] || null;
}

export function getVendorByUserId(userId: string) {
  return vendors[userId] || null;
}

// ── Vendor Subscription ───────────────────────────────────────────────────────
export type VendorPlan = "1m" | "3m" | "6m" | "12m";

function addMonths(ts: number, months: number) {
  const d = new Date(ts);
  d.setMonth(d.getMonth() + months);
  return d.getTime();
}

export function activateVendorSubscription(userId: string, plan: VendorPlan) {
  const profile = vendors[userId];
  if (!profile) throw new Error("Vendor profile not found");
  const months = plan === "1m" ? 1 : plan === "3m" ? 3 : plan === "6m" ? 6 : 12;
  const now = Date.now();
  const base = profile.subscription && profile.subscription.expiresAt > now ? profile.subscription.expiresAt : now;
  const expiresAt = addMonths(base, months);
  profile.subscription = { plan, activatedAt: now, expiresAt };
  return profile.subscription;
}

export function getVendorSubscription(userId: string) {
  const profile = vendors[userId];
  if (!profile) return null;
  return profile.subscription || null;
}

export function isVendorActive(userId: string) {
  const sub = getVendorSubscription(userId);
  return !!(sub && sub.expiresAt > Date.now());
}

export function updateVendorSubscription(
  vendorId: string,
  subscription: { plan: VendorPlan; activatedAt: number; expiresAt: number }
) {
  const vendor = Object.values(vendors).find((v) => v.id === vendorId);
  if (!vendor) throw new Error("Vendor not found");
  vendor.subscription = subscription;
  return vendor;
}

// Vendor data comes from the backend API

// ── Organiser Subscription ────────────────────────────────────────────────────
export type OrganiserPlan = "1m" | "3m" | "6m" | "12m";
export type OrganiserSubscription = { plan: OrganiserPlan; activatedAt: number; expiresAt: number };
const organiserSubscriptions: Record<string, OrganiserSubscription> = {};

export function activateOrganiserSubscription(userId: string, plan: OrganiserPlan) {
  const months = plan === "1m" ? 1 : plan === "3m" ? 3 : plan === "6m" ? 6 : 12;
  const now = Date.now();
  const base = organiserSubscriptions[userId]?.expiresAt && organiserSubscriptions[userId].expiresAt > now ? organiserSubscriptions[userId].expiresAt : now;
  const expiresAt = addMonths(base, months);
  organiserSubscriptions[userId] = { plan, activatedAt: now, expiresAt };
  return organiserSubscriptions[userId];
}

export function getOrganiserSubscription(userId: string) {
  return organiserSubscriptions[userId] || null;
}

export function isOrganiserActive(userId: string) {
  const sub = organiserSubscriptions[userId];
  return !!(sub && sub.expiresAt > Date.now());
}

// ── Merchandise ──────────────────────────────────────────────────────────────

const products: Product[] = [];
const merchOrders: MerchOrder[] = [];
const productBundles: ProductBundle[] = [];

// ── Product Bundle Management ────────────────────────────────────────────────

export function createProductBundle(
  eventId: string,
  name: string,
  description: string,
  productIds: string[],
  discountPercentage: number
): ProductBundle {
  // Calculate original price
  let originalPrice = 0;
  for (const productId of productIds) {
    const product = products.find((p) => p.id === productId);
    if (!product) throw new Error(`Product ${productId} not found`);
    originalPrice += product.price;
  }

  const discount = Math.min(Math.max(discountPercentage, 0), 100);
  const bundlePrice = originalPrice * (1 - discount / 100);

  const bundle: ProductBundle = {
    id: id("bundle"),
    eventId,
    name,
    description,
    productIds,
    originalPrice,
    bundlePrice,
    discount,
    active: true,
    createdAt: Date.now(),
  };

  productBundles.push(bundle);
  return bundle;
}

export function getEventBundles(eventId: string): ProductBundle[] {
  return productBundles.filter((b) => b.eventId === eventId && b.active);
}

export function getBundleById(bundleId: string): ProductBundle | null {
  return productBundles.find((b) => b.id === bundleId) || null;
}

export function deactivateBundle(bundleId: string): ProductBundle {
  const bundle = productBundles.find((b) => b.id === bundleId);
  if (!bundle) throw new Error("Bundle not found");
  bundle.active = false;
  return bundle;
}

export function getProductsByEvent(eventId: string): Product[] {
  return products.filter((p) => p.eventId === eventId && p.active);
}

export function addProduct(eventId: string, productData: Omit<Product, "id" | "eventId" | "sold" | "active">): Product {
  const product: Product = {
    id: id("prod"),
    eventId,
    ...productData,
    sold: 0,
    active: true,
  };
  products.push(product);
  return product;
}

export function getAllActiveProducts(): Product[] {
  return products.filter((p) => p.active);
}

export function getProductById(productId: string): Product | null {
  return products.find((p) => p.id === productId) || null;
}

// Inventory management helpers
export function getProductStock(productId: string): number {
  const product = products.find((p) => p.id === productId);
  return product ? product.stock : 0;
}

export function isLowStock(productId: string, threshold: number = 10): boolean {
  const stock = getProductStock(productId);
  return stock > 0 && stock <= threshold;
}

export function isOutOfStock(productId: string): boolean {
  return getProductStock(productId) === 0;
}

export function getLowStockProducts(eventId?: string, threshold: number = 10): Product[] {
  let productList = eventId ? getProductsByEvent(eventId) : getAllActiveProducts();
  return productList.filter((p) => isLowStock(p.id, threshold));
}

export function updateProductStock(productId: string, newStock: number): Product {
  const product = products.find((p) => p.id === productId);
  if (!product) throw new Error("Product not found");
  product.stock = Math.max(0, newStock);
  return product;
}

export function createMerchOrder(
  userId: string,
  eventId: string,
  items: Array<{ productId: string; quantity: number; size?: string }>,
  shippingAddress?: import("@/types/merchandise").ShippingAddress
): MerchOrder {
  let total = 0;
  const orderItems: MerchOrderItem[] = items.map((it) => {
    const product = products.find((p) => p.id === it.productId);
    if (!product) throw new Error(`Product ${it.productId} not found`);
    if (product.stock < it.quantity) throw new Error(`Insufficient stock for ${product.name}`);
    product.stock -= it.quantity;
    product.sold += it.quantity;
    total += it.quantity * product.price;
    return { 
      productId: product.id, 
      name: product.name, 
      quantity: it.quantity, 
      price: product.price, 
      size: it.size,
      fulfillmentType: product.fulfillmentType
    };
  });

  const order: MerchOrder = {
    id: id("mord"),
    userId,
    eventId,
    items: orderItems,
    total,
    status: "pending",
    shippingAddress,
    createdAt: Date.now(),
  };
  merchOrders.push(order);
  return order;
}

export function getMerchOrder(orderId: string): MerchOrder | null {
  return merchOrders.find((o) => o.id === orderId) || null;
}

export function markMerchOrderPaid(orderId: string): MerchOrder {
  const order = merchOrders.find((o) => o.id === orderId);
  if (!order) throw new Error("Merch order not found");
  order.status = "paid";
  return order;
}

export function getMerchStats() {
  const totalProducts = products.filter((p) => p.active).length;
  const unitsSold = products.reduce((s, p) => s + p.sold, 0);
  const revenue = products.reduce((s, p) => s + p.sold * p.price, 0);
  
  // Get best-selling items (top 5 by units sold)
  const bestSellers = products
    .filter((p) => p.sold > 0)
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5)
    .map((p) => ({
      id: p.id,
      name: p.name,
      sold: p.sold,
      revenue: p.sold * p.price,
      image: p.image,
      eventId: p.eventId,
    }));
  
  return { totalProducts, unitsSold, revenue, bestSellers };
}

export function getMerchStatsByEvent(eventId: string) {
  const eventProducts = products.filter((p) => p.eventId === eventId);
  const totalProducts = eventProducts.filter((p) => p.active).length;
  const unitsSold = eventProducts.reduce((s, p) => s + p.sold, 0);
  const revenue = eventProducts.reduce((s, p) => s + p.sold * p.price, 0);
  
  // Get best-selling items for this event (top 5 by units sold)
  const bestSellers = eventProducts
    .filter((p) => p.sold > 0)
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5)
    .map((p) => ({
      id: p.id,
      name: p.name,
      sold: p.sold,
      revenue: p.sold * p.price,
      image: p.image,
      eventId: p.eventId,
    }));
  
  return { totalProducts, unitsSold, revenue, bestSellers };
}

export function orderRequiresShipping(items: Array<{ productId: string }>): boolean {
  return items.some((item) => {
    const product = products.find((p) => p.id === item.productId);
    return product?.fulfillmentType === "delivery";
  });
}

export function getProductsByFulfillmentType(productIds: string[], fulfillmentType: import("@/types/merchandise").FulfillmentType): Product[] {
  return products.filter((p) => productIds.includes(p.id) && p.fulfillmentType === fulfillmentType);
}

// ── Discussions ───────────────────────────────────────────────────────────────

export type DiscussionThread = {
  id: string;
  eventId: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  likes: number;
  replyCount: number;
  isPinned: boolean;
  createdAt: number;
  updatedAt: number;
};

export type DiscussionReply = {
  id: string;
  threadId: string;
  parentReplyId?: string; // For nested replies (replies to replies)
  authorId: string;
  authorName: string;
  content: string;
  likes: number;
  createdAt: number;
};

// Legacy type for backward compatibility
export type DiscussionPost = {
  id: string;
  eventId: string;
  author: string;
  message: string;
  createdAt: number;
  likes: number;
};

const discussionThreads: Record<string, DiscussionThread[]> = {};
const discussionReplies: Record<string, DiscussionReply[]> = {};
const discussions: Record<string, DiscussionPost[]> = {}; // Keep for backward compatibility

// Thread functions
export function createDiscussionThread(
  eventId: string,
  authorId: string,
  authorName: string,
  title: string,
  content: string
): DiscussionThread {
  const thread: DiscussionThread = {
    id: id("thread"),
    eventId,
    authorId,
    authorName,
    title,
    content,
    likes: 0,
    replyCount: 0,
    isPinned: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  
  if (!discussionThreads[eventId]) {
    discussionThreads[eventId] = [];
  }
  discussionThreads[eventId].push(thread);
  
  return thread;
}

export function listDiscussionThreads(eventId: string): DiscussionThread[] {
  const threads = discussionThreads[eventId] || [];
  return threads.slice().sort((a, b) => {
    // Pinned threads first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    // Then by creation date (newest first)
    return b.createdAt - a.createdAt;
  });
}

export function getDiscussionThread(threadId: string): DiscussionThread | null {
  for (const threads of Object.values(discussionThreads)) {
    const thread = threads.find(t => t.id === threadId);
    if (thread) return thread;
  }
  return null;
}

export function addReplyToThread(
  threadId: string,
  authorId: string,
  authorName: string,
  content: string,
  parentReplyId?: string
): DiscussionReply | null {
  const thread = getDiscussionThread(threadId);
  if (!thread) return null;
  
  // If parentReplyId is provided, verify it exists
  if (parentReplyId) {
    const parentReply = discussionReplies[threadId]?.find(r => r.id === parentReplyId);
    if (!parentReply) return null;
  }
  
  const reply: DiscussionReply = {
    id: id("reply"),
    threadId,
    parentReplyId,
    authorId,
    authorName,
    content,
    likes: 0,
    createdAt: Date.now(),
  };
  
  if (!discussionReplies[threadId]) {
    discussionReplies[threadId] = [];
  }
  discussionReplies[threadId].push(reply);
  
  // Update thread reply count and updatedAt
  thread.replyCount++;
  thread.updatedAt = Date.now();
  
  return reply;
}

export function listThreadReplies(threadId: string): DiscussionReply[] {
  const replies = discussionReplies[threadId] || [];
  return replies.slice().sort((a, b) => a.createdAt - b.createdAt); // Oldest first for replies
}

export function likeDiscussionThread(threadId: string, userId: string): boolean {
  const thread = getDiscussionThread(threadId);
  if (!thread) return false;
  thread.likes++;
  return true;
}

export function likeDiscussionReply(replyId: string): boolean {
  for (const replies of Object.values(discussionReplies)) {
    const reply = replies.find(r => r.id === replyId);
    if (reply) {
      reply.likes++;
      return true;
    }
  }
  return false;
}

// Legacy functions for backward compatibility
export function listDiscussions(eventId: string): DiscussionPost[] {
  return (discussions[eventId] || []).slice().sort((a, b) => b.createdAt - a.createdAt);
}

export function addDiscussion(eventId: string, author: string, message: string): DiscussionPost {
  const post: DiscussionPost = {
    id: id("post"),
    eventId,
    author,
    message,
    createdAt: Date.now(),
    likes: 0,
  };
  discussions[eventId] = discussions[eventId] || [];
  discussions[eventId].push(post);
  return post;
}

// ── Vendors Sourcing ─────────────────────────────────────────────────────────

export function listVendors(params?: { 
  category?: VendorProfile["category"]; 
  q?: string;
  city?: VendorProfile["city"];
  minRating?: number;
  sortBy?: "rating" | "popularity" | "name";
}) {
  const q = params?.q?.toLowerCase() || "";
  const cat = params?.category;
  const city = params?.city;
  const minRating = params?.minRating;
  const sortBy = params?.sortBy;
  
  let profiles = Object.values(vendors);
  
  // Apply filters
  profiles = profiles.filter((v) => {
    // Search by name, description, or services
    const matchQ = q ? (
      v.name.toLowerCase().includes(q) || 
      v.description.toLowerCase().includes(q) ||
      (v.services && v.services.some(s => s.toLowerCase().includes(q)))
    ) : true;
    
    const matchCat = cat ? v.category === cat : true;
    const matchCity = city ? v.city === city : true;
    const matchRating = minRating ? (v.rating && v.rating >= minRating) : true;
    
    return matchQ && matchCat && matchCity && matchRating;
  });
  
  // Separate premium and free vendors
  const now = Date.now();
  const premiumVendors = profiles.filter(v => 
    v.subscription && v.subscription.expiresAt > now
  );
  const freeVendors = profiles.filter(v => 
    !v.subscription || v.subscription.expiresAt <= now
  );
  
  // Apply sorting to each group
  const sortFn = (a: VendorProfile, b: VendorProfile) => {
    if (sortBy === "rating") {
      return (b.rating || 0) - (a.rating || 0);
    } else if (sortBy === "popularity") {
      return (b.completedEvents || 0) - (a.completedEvents || 0);
    } else if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }
    return 0;
  };
  
  premiumVendors.sort(sortFn);
  freeVendors.sort(sortFn);
  
  // Premium vendors appear first (featured placement)
  return [...premiumVendors, ...freeVendors];
}

export type EventVendorLink = {
  vendorUserId: string;
  profileId: string;
  category: VendorProfile["category"];
  status: "invited" | "accepted" | "declined";
  invitedAt: number;
  respondedAt?: number; // Timestamp when vendor responded to invitation
};

const eventVendors: Record<string, EventVendorLink[]> = {};

export function listEventVendors(eventId: string): EventVendorLink[] {
  return (eventVendors[eventId] || []).slice().sort((a, b) => b.invitedAt - a.invitedAt);
}

export function inviteVendorToEvent(eventId: string, vendorUserId: string): EventVendorLink {
  const profile = vendors[vendorUserId];
  if (!profile) throw new Error("Vendor not found");
  eventVendors[eventId] = eventVendors[eventId] || [];
  const existing = eventVendors[eventId].find((v) => v.vendorUserId === vendorUserId);
  if (existing) return existing;
  const link: EventVendorLink = {
    vendorUserId,
    profileId: profile.id,
    category: profile.category,
    status: "invited",
    invitedAt: Date.now(),
  };
  eventVendors[eventId].push(link);
  return link;
}

export function updateVendorInviteStatus(eventId: string, vendorUserId: string, status: EventVendorLink["status"]): EventVendorLink {
  const list = eventVendors[eventId];
  if (!list) throw new Error("No invites for event");
  const link = list.find((v) => v.vendorUserId === vendorUserId);
  if (!link) throw new Error("Invite not found");
  link.status = status;
  link.respondedAt = Date.now(); // Record response time
  return link;
}

export type VendorInvitation = EventVendorLink & { eventId: string };

export function listVendorInvitations(vendorUserId: string): VendorInvitation[] {
  const res: VendorInvitation[] = [];
  for (const [eventId, invites] of Object.entries(eventVendors)) {
    invites.forEach((i) => {
      if (i.vendorUserId === vendorUserId) res.push({ ...i, eventId });
    });
  }
  return res.sort((a, b) => b.invitedAt - a.invitedAt);
}

// ── Vendor Reviews ───────────────────────────────────────────────────────────

export function addVendorReview(
  vendorId: string,
  eventId: string,
  eventName: string,
  userId: string,
  userName: string,
  rating: number,
  comment: string
): VendorReview {
  const review: VendorReview = {
    id: id("rev"),
    vendorId,
    eventId,
    eventName,
    userId,
    userName,
    rating,
    comment,
    createdAt: Date.now(),
  };

  if (!vendorReviews[vendorId]) {
    vendorReviews[vendorId] = [];
  }
  vendorReviews[vendorId].push(review);

  // Update vendor rating and review count
  const vendor = Object.values(vendors).find((v) => v.id === vendorId);
  if (vendor) {
    const reviews = vendorReviews[vendorId];
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    vendor.rating = totalRating / reviews.length;
    vendor.reviewCount = reviews.length;
  }

  return review;
}

export function getVendorReviews(vendorId: string): VendorReview[] {
  return (vendorReviews[vendorId] || []).slice().sort((a, b) => b.createdAt - a.createdAt);
}

export function getVendorById(vendorId: string): VendorProfile | null {
  return Object.values(vendors).find((v) => v.id === vendorId) || null;
}

// ── Vendor Performance Tracking ──────────────────────────────────────────────

export type VendorPerformance = {
  vendorId: string;
  completedEvents: number;
  averageRating: number;
  averageResponseTime: number; // in hours
  reliabilityScore: number; // 0-100
  acceptanceRate: number; // percentage
  totalInvitations: number;
  acceptedInvitations: number;
  declinedInvitations: number;
  lastUpdated: number;
};

const vendorPerformance: Record<string, VendorPerformance> = {};

/**
 * Calculate vendor performance metrics
 */
export function calculateVendorPerformance(vendorUserId: string): VendorPerformance {
  const vendor = getVendorByUserId(vendorUserId);
  if (!vendor) {
    throw new Error("Vendor not found");
  }

  // Get all invitations for this vendor
  const invitations = listVendorInvitations(vendorUserId);
  const acceptedInvitations = invitations.filter((inv) => inv.status === "accepted");
  const declinedInvitations = invitations.filter((inv) => inv.status === "declined");

  // Calculate acceptance rate
  const acceptanceRate = invitations.length > 0
    ? (acceptedInvitations.length / invitations.length) * 100
    : 0;

  // Calculate average response time (time from invitation to response)
  let totalResponseTime = 0;
  let respondedCount = 0;

  invitations.forEach((inv) => {
    if (inv.status !== "invited") {
      // Find the event vendor link to get response time
      const eventVendorsList = listEventVendors(inv.eventId);
      const link = eventVendorsList.find((v) => v.vendorUserId === vendorUserId);
      if (link && link.respondedAt) {
        const responseTime = (link.respondedAt - link.invitedAt) / (1000 * 60 * 60); // Convert to hours
        totalResponseTime += responseTime;
        respondedCount++;
      }
    }
  });

  const averageResponseTime = respondedCount > 0 ? totalResponseTime / respondedCount : 0;

  // Get average rating from reviews
  const reviews = getVendorReviews(vendor.id);
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : vendor.rating || 0;

  // Calculate reliability score (0-100)
  // Based on: acceptance rate (40%), response time (30%), rating (30%)
  const acceptanceScore = acceptanceRate * 0.4;
  const responseScore = Math.max(0, 100 - (averageResponseTime * 2)) * 0.3; // Penalize slow responses
  const ratingScore = (averageRating / 5) * 100 * 0.3;
  const reliabilityScore = Math.min(100, acceptanceScore + responseScore + ratingScore);

  const performance: VendorPerformance = {
    vendorId: vendor.id,
    completedEvents: vendor.completedEvents || 0,
    averageRating,
    averageResponseTime,
    reliabilityScore,
    acceptanceRate,
    totalInvitations: invitations.length,
    acceptedInvitations: acceptedInvitations.length,
    declinedInvitations: declinedInvitations.length,
    lastUpdated: Date.now(),
  };

  // Cache the performance data
  vendorPerformance[vendorUserId] = performance;

  return performance;
}

/**
 * Get cached vendor performance or calculate if not cached
 */
export function getVendorPerformance(vendorUserId: string): VendorPerformance {
  // Return cached if available and recent (less than 1 hour old)
  const cached = vendorPerformance[vendorUserId];
  if (cached && Date.now() - cached.lastUpdated < 3600000) {
    return cached;
  }

  // Otherwise calculate fresh
  return calculateVendorPerformance(vendorUserId);
}

/**
 * Update vendor completed events count
 */
export function incrementVendorCompletedEvents(vendorUserId: string): void {
  const vendor = getVendorByUserId(vendorUserId);
  if (vendor) {
    vendor.completedEvents = (vendor.completedEvents || 0) + 1;
    // Invalidate performance cache
    delete vendorPerformance[vendorUserId];
  }
}

// ── Vendor Payment and Settlement ────────────────────────────────────────────

export type VendorPayment = {
  id: string;
  vendorUserId: string;
  vendorId: string;
  eventId: string;
  eventName: string;
  organizerUserId: string;
  amount: number;
  status: "pending" | "processing" | "paid" | "cancelled";
  paymentMethod?: "bank_transfer" | "mobile_money" | "crypto";
  requestedAt: number;
  processedAt?: number;
  paidAt?: number;
  notes?: string;
  transactionReference?: string;
};

const vendorPayments: Record<string, VendorPayment[]> = {}; // Keyed by vendorUserId

/**
 * Create a vendor payment request
 */
export function createVendorPaymentRequest(
  vendorUserId: string,
  eventId: string,
  amount: number,
  notes?: string
): VendorPayment {
  const vendor = getVendorByUserId(vendorUserId);
  if (!vendor) throw new Error("Vendor not found");

  const event = getEventById(eventId);
  if (!event) throw new Error("Event not found");

  // Verify vendor is linked to this event
  const eventVendorsList = listEventVendors(eventId);
  const link = eventVendorsList.find((v) => v.vendorUserId === vendorUserId);
  if (!link || link.status !== "accepted") {
    throw new Error("Vendor is not linked to this event");
  }

  // Get organizer ID from event metadata (we'll need to track this separately)
  // For now, we'll use a placeholder - in a real system, events would have organizerId
  const organizerUserId = "org_placeholder"; // TODO: Add organizerId to Event type

  const payment: VendorPayment = {
    id: id("vp"),
    vendorUserId,
    vendorId: vendor.id,
    eventId,
    eventName: event.title,
    organizerUserId,
    amount,
    status: "pending",
    requestedAt: Date.now(),
    notes,
  };

  if (!vendorPayments[vendorUserId]) {
    vendorPayments[vendorUserId] = [];
  }
  vendorPayments[vendorUserId].push(payment);

  return payment;
}

/**
 * Get all payment requests for a vendor
 */
export function getVendorPayments(vendorUserId: string): VendorPayment[] {
  return (vendorPayments[vendorUserId] || []).slice().sort((a, b) => b.requestedAt - a.requestedAt);
}

/**
 * Get all payment requests for an event
 */
export function getEventVendorPayments(eventId: string): VendorPayment[] {
  const allPayments: VendorPayment[] = [];
  Object.values(vendorPayments).forEach((payments) => {
    payments.forEach((payment) => {
      if (payment.eventId === eventId) {
        allPayments.push(payment);
      }
    });
  });
  return allPayments.sort((a, b) => b.requestedAt - a.requestedAt);
}

/**
 * Get a specific payment by ID
 */
export function getVendorPaymentById(paymentId: string): VendorPayment | undefined {
  for (const payments of Object.values(vendorPayments)) {
    const payment = payments.find((p) => p.id === paymentId);
    if (payment) return payment;
  }
  return undefined;
}

/**
 * Update payment status
 */
export function updateVendorPaymentStatus(
  paymentId: string,
  status: VendorPayment["status"],
  paymentMethod?: VendorPayment["paymentMethod"],
  transactionReference?: string
): VendorPayment {
  const payment = getVendorPaymentById(paymentId);
  if (!payment) throw new Error("Payment not found");

  payment.status = status;
  
  if (status === "processing") {
    payment.processedAt = Date.now();
    if (paymentMethod) payment.paymentMethod = paymentMethod;
  }
  
  if (status === "paid") {
    payment.paidAt = Date.now();
    if (transactionReference) payment.transactionReference = transactionReference;
  }

  return payment;
}

/**
 * Get payment statistics for a vendor
 */
export function getVendorPaymentStats(vendorUserId: string): {
  totalEarnings: number;
  pendingAmount: number;
  paidAmount: number;
  totalPayments: number;
  pendingPayments: number;
  paidPayments: number;
} {
  const payments = getVendorPayments(vendorUserId);
  
  const totalEarnings = payments.reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments.filter(p => p.status === "pending" || p.status === "processing").reduce((sum, p) => sum + p.amount, 0);
  const paidAmount = payments.filter(p => p.status === "paid").reduce((sum, p) => sum + p.amount, 0);
  
  return {
    totalEarnings,
    pendingAmount,
    paidAmount,
    totalPayments: payments.length,
    pendingPayments: payments.filter(p => p.status === "pending" || p.status === "processing").length,
    paidPayments: payments.filter(p => p.status === "paid").length,
  };
}

/**
 * Get payment statistics for an organizer (all events)
 */
export function getOrganizerVendorPaymentStats(organizerUserId: string): {
  totalPaid: number;
  totalPending: number;
  totalVendors: number;
  paymentsByEvent: Record<string, { eventName: string; totalAmount: number; paidAmount: number; pendingAmount: number }>;
} {
  const allPayments: VendorPayment[] = [];
  Object.values(vendorPayments).forEach((payments) => {
    payments.forEach((payment) => {
      if (payment.organizerUserId === organizerUserId) {
        allPayments.push(payment);
      }
    });
  });

  const totalPaid = allPayments.filter(p => p.status === "paid").reduce((sum, p) => sum + p.amount, 0);
  const totalPending = allPayments.filter(p => p.status === "pending" || p.status === "processing").reduce((sum, p) => sum + p.amount, 0);
  
  const uniqueVendors = new Set(allPayments.map(p => p.vendorUserId));
  
  const paymentsByEvent: Record<string, { eventName: string; totalAmount: number; paidAmount: number; pendingAmount: number }> = {};
  
  allPayments.forEach((payment) => {
    if (!paymentsByEvent[payment.eventId]) {
      paymentsByEvent[payment.eventId] = {
        eventName: payment.eventName,
        totalAmount: 0,
        paidAmount: 0,
        pendingAmount: 0,
      };
    }
    
    paymentsByEvent[payment.eventId].totalAmount += payment.amount;
    
    if (payment.status === "paid") {
      paymentsByEvent[payment.eventId].paidAmount += payment.amount;
    } else if (payment.status === "pending" || payment.status === "processing") {
      paymentsByEvent[payment.eventId].pendingAmount += payment.amount;
    }
  });

  return {
    totalPaid,
    totalPending,
    totalVendors: uniqueVendors.size,
    paymentsByEvent,
  };
}

export type PlanningTask = {
  id: string;
  eventId: string;
  title: string;
  description?: string;
  category?: "marketing" | "logistics" | "technical" | "content";
  assignee?: string;
  owner?: string; // Deprecated, use assignee instead
  dueDate?: string;
  status: "todo" | "in_progress" | "done";
  createdAt: number;
};

export type BudgetItem = {
  id: string;
  eventId: string;
  name: string;
  category?: string;
  unitCost: number;
  quantity: number;
  actualSpent?: number; // Track actual spending against budget
  reviewDate?: string; // Optional review date for budget items
  createdAt: number;
};

export type RundownItem = {
  id: string;
  time: string; // Time in HH:MM format
  duration: number; // Duration in minutes
  activity: string;
  description?: string;
  responsible?: string;
  location?: string;
};

export type EventDocument = {
  id: string;
  eventId: string;
  type: "charter" | "rundown" | "contract" | "permit" | "insurance" | "invoice" | "receipt" | "other";
  title: string;
  content: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  fileData?: string; // Base64 encoded file data for in-memory storage
  rundownItems?: RundownItem[]; // For rundown documents
  createdAt: number;
};

const planningTasks: Record<string, PlanningTask[]> = {};
const budgetItems: Record<string, BudgetItem[]> = {};
const documents: Record<string, EventDocument[]> = {};

// Deadline reminder tracking
export type DeadlineReminder = {
  id: string;
  type: 'task_deadline' | 'milestone_alert' | 'budget_review';
  targetId: string; // taskId, eventId, or budgetItemId
  eventId: string;
  userId: string;
  dueDate: string;
  reminderDate: number; // Timestamp when reminder was sent
  sent: boolean;
};

const deadlineReminders: Record<string, DeadlineReminder[]> = {}; // Store by userId

export function listPlanningTasks(eventId: string): PlanningTask[] {
  return (planningTasks[eventId] || []).slice().sort((a, b) => a.createdAt - b.createdAt);
}

export function addPlanningTask(eventId: string, input: Omit<PlanningTask, "id" | "eventId" | "createdAt">): PlanningTask {
  const task: PlanningTask = { id: id("task"), eventId, createdAt: Date.now(), ...input };
  planningTasks[eventId] = planningTasks[eventId] || [];
  planningTasks[eventId].push(task);
  return task;
}

export function updatePlanningTask(eventId: string, taskId: string, patch: Partial<PlanningTask>): PlanningTask {
  const list = planningTasks[eventId] || [];
  const idx = list.findIndex((t) => t.id === taskId);
  if (idx === -1) throw new Error("Task not found");
  list[idx] = { ...list[idx], ...patch };
  return list[idx];
}

export function listBudget(eventId: string) {
  const items = (budgetItems[eventId] || []).slice().sort((a, NB) => a.createdAt - NB.createdAt);
  const totalBudgeted = items.reduce((s, it) => s + it.unitCost * it.quantity, 0);
  const totalSpent = items.reduce((s, it) => s + (it.actualSpent || 0), 0);
  const variance = totalBudgeted - totalSpent;
  const variancePercent = totalBudgeted > 0 ? (variance / totalBudgeted) * 100 : 0;
  
  return { 
    items, 
    totalBudgeted, 
    totalSpent, 
    variance, 
    variancePercent,
    isOverBudget: variance < 0 
  };
}

export function addBudgetItem(eventId: string, input: Omit<BudgetItem, "id" | "eventId" | "createdAt">): BudgetItem {
  const item: BudgetItem = { id: id("bud"), eventId, createdAt: Date.now(), ...input };
  budgetItems[eventId] = budgetItems[eventId] || [];
  budgetItems[eventId].push(item);
  return item;
}

export function updateBudgetItem(eventId: string, itemId: string, patch: Partial<BudgetItem>): BudgetItem {
  const list = budgetItems[eventId] || [];
  const idx = list.findIndex((it) => it.id === itemId);
  if (idx === -1) throw new Error("Budget item not found");
  list[idx] = { ...list[idx], ...patch };
  return list[idx];
}

export function listDocuments(eventId: string): EventDocument[] {
  return (documents[eventId] || []).slice().sort((a, b) => b.createdAt - a.createdAt);
}

export function getDocument(eventId: string, docId: string): EventDocument | undefined {
  const docs = documents[eventId] || [];
  return docs.find((d) => d.id === docId);
}

export function saveCharter(eventId: string, title: string, content: string): EventDocument {
  const doc: EventDocument = { id: id("doc"), eventId, type: "charter", title, content, createdAt: Date.now() };
  documents[eventId] = documents[eventId] || [];
  documents[eventId].push(doc);
  return doc;
}

export function saveRundown(eventId: string, title: string, rundownItems: RundownItem[]): EventDocument {
  const doc: EventDocument = { 
    id: id("doc"), 
    eventId, 
    type: "rundown", 
    title, 
    content: "", // Content will be generated from rundown items
    rundownItems,
    createdAt: Date.now() 
  };
  documents[eventId] = documents[eventId] || [];
  documents[eventId].push(doc);
  return doc;
}

export function updateRundown(eventId: string, docId: string, title: string, rundownItems: RundownItem[]): EventDocument | null {
  const docs = documents[eventId] || [];
  const index = docs.findIndex((d) => d.id === docId && d.type === "rundown");
  if (index === -1) return null;
  
  docs[index] = {
    ...docs[index],
    title,
    rundownItems,
  };
  
  return docs[index];
}

export function uploadDocument(
  eventId: string,
  input: {
    title: string;
    type: EventDocument["type"];
    fileName: string;
    fileSize: number;
    mimeType: string;
    fileData: string;
  }
): EventDocument {
  const doc: EventDocument = {
    id: id("doc"),
    eventId,
    type: input.type,
    title: input.title,
    content: "", // Empty content for uploaded files
    fileName: input.fileName,
    fileSize: input.fileSize,
    mimeType: input.mimeType,
    fileData: input.fileData,
    createdAt: Date.now(),
  };
  documents[eventId] = documents[eventId] || [];
  documents[eventId].push(doc);
  return doc;
}

export function deleteDocument(eventId: string, docId: string): boolean {
  const docs = documents[eventId] || [];
  const index = docs.findIndex((d) => d.id === docId);
  if (index === -1) return false;
  docs.splice(index, 1);
  return true;
}

// ── Deadline Reminders ───────────────────────────────────────────────────────

/**
 * Check for upcoming task deadlines and send reminders
 * Sends reminders at 1 day, 3 days, and 1 week before due date
 */
export function checkTaskDeadlines(eventId: string): Notification[] {
  const tasks = listPlanningTasks(eventId);
  const notifications: Notification[] = [];
  const now = Date.now();
  
  // Get event organizer
  const event = getEventById(eventId);
  if (!event) return notifications;
  
  const organizerId = getEventOrganizer(eventId);
  if (!organizerId) return notifications;
  
  for (const task of tasks) {
    if (!task.dueDate || task.status === 'done') continue;
    
    const dueDate = new Date(task.dueDate).getTime();
    const timeUntilDue = dueDate - now;
    
    // Skip if already past due
    if (timeUntilDue < 0) continue;
    
    // Check if we should send a reminder (1 day, 3 days, or 7 days before)
    const oneDayMs = 24 * 60 * 60 * 1000;
    const threeDaysMs = 3 * oneDayMs;
    const sevenDaysMs = 7 * oneDayMs;
    
    let shouldRemind = false;
    let reminderMessage = '';
    
    // Check if within reminder windows (with 1 hour tolerance)
    const tolerance = 60 * 60 * 1000; // 1 hour
    
    if (Math.abs(timeUntilDue - oneDayMs) < tolerance) {
      shouldRemind = true;
      reminderMessage = 'Due tomorrow';
    } else if (Math.abs(timeUntilDue - threeDaysMs) < tolerance) {
      shouldRemind = true;
      reminderMessage = 'Due in 3 days';
    } else if (Math.abs(timeUntilDue - sevenDaysMs) < tolerance) {
      shouldRemind = true;
      reminderMessage = 'Due in 7 days';
    }
    
    if (shouldRemind) {
      // Check if we already sent this reminder
      const existingReminders = deadlineReminders[organizerId] || [];
      const alreadySent = existingReminders.some(
        r => r.targetId === task.id && r.type === 'task_deadline' && r.sent
      );
      
      if (!alreadySent) {
        // Create notification
        const notification = createNotification(
          organizerId,
          'task_deadline',
          `Task Deadline: ${task.title}`,
          `${reminderMessage} - ${task.title}${task.assignee ? ` (Assigned to: ${task.assignee})` : ''}`,
          eventId
        );
        
        // Track reminder
        const reminder: DeadlineReminder = {
          id: id('reminder'),
          type: 'task_deadline',
          targetId: task.id,
          eventId,
          userId: organizerId,
          dueDate: task.dueDate,
          reminderDate: now,
          sent: true,
        };
        
        if (!deadlineReminders[organizerId]) {
          deadlineReminders[organizerId] = [];
        }
        deadlineReminders[organizerId].push(reminder);
        
        notifications.push(notification);
      }
    }
  }
  
  return notifications;
}

/**
 * Check for milestone dates (event date approaching) and send alerts
 * Sends alerts at 1 week, 3 days, and 1 day before event
 */
export function checkMilestoneAlerts(eventId: string): Notification[] {
  const notifications: Notification[] = [];
  const event = getEventById(eventId);
  
  if (!event || !event.date) return notifications;
  
  const organizerId = getEventOrganizer(eventId);
  if (!organizerId) return notifications;
  
  const now = Date.now();
  const eventDate = new Date(event.date).getTime();
  const timeUntilEvent = eventDate - now;
  
  // Skip if event already passed
  if (timeUntilEvent < 0) return notifications;
  
  const oneDayMs = 24 * 60 * 60 * 1000;
  const threeDaysMs = 3 * oneDayMs;
  const sevenDaysMs = 7 * oneDayMs;
  
  let shouldAlert = false;
  let alertMessage = '';
  
  // Check if within alert windows (with 1 hour tolerance)
  const tolerance = 60 * 60 * 1000; // 1 hour
  
  if (Math.abs(timeUntilEvent - oneDayMs) < tolerance) {
    shouldAlert = true;
    alertMessage = 'Your event is tomorrow!';
  } else if (Math.abs(timeUntilEvent - threeDaysMs) < tolerance) {
    shouldAlert = true;
    alertMessage = 'Your event is in 3 days';
  } else if (Math.abs(timeUntilEvent - sevenDaysMs) < tolerance) {
    shouldAlert = true;
    alertMessage = 'Your event is in 1 week';
  }
  
  if (shouldAlert) {
    // Check if we already sent this alert
    const existingReminders = deadlineReminders[organizerId] || [];
    const alreadySent = existingReminders.some(
      r => r.targetId === eventId && r.type === 'milestone_alert' && r.sent
    );
    
    if (!alreadySent) {
      // Create notification
      const notification = createNotification(
        organizerId,
        'milestone_alert',
        `Event Milestone: ${event.title}`,
        `${alertMessage} - Make sure everything is ready!`,
        eventId
      );
      
      // Track reminder
      const reminder: DeadlineReminder = {
        id: id('reminder'),
        type: 'milestone_alert',
        targetId: eventId,
        eventId,
        userId: organizerId,
        dueDate: event.date,
        reminderDate: now,
        sent: true,
      };
      
      if (!deadlineReminders[organizerId]) {
        deadlineReminders[organizerId] = [];
      }
      deadlineReminders[organizerId].push(reminder);
      
      notifications.push(notification);
    }
  }
  
  return notifications;
}

/**
 * Check for budget review dates and send reminders
 * Sends reminders 1 day before review date
 */
export function checkBudgetReviewReminders(eventId: string): Notification[] {
  const notifications: Notification[] = [];
  const budgetData = listBudget(eventId);
  
  if (!budgetData.items.length) return notifications;
  
  const organizerId = getEventOrganizer(eventId);
  if (!organizerId) return notifications;
  
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  const tolerance = 60 * 60 * 1000; // 1 hour
  
  for (const item of budgetData.items) {
    if (!item.reviewDate) continue;
    
    const reviewDate = new Date(item.reviewDate).getTime();
    const timeUntilReview = reviewDate - now;
    
    // Skip if already past review date
    if (timeUntilReview < 0) continue;
    
    // Check if within 1 day of review date
    if (Math.abs(timeUntilReview - oneDayMs) < tolerance) {
      // Check if we already sent this reminder
      const existingReminders = deadlineReminders[organizerId] || [];
      const alreadySent = existingReminders.some(
        r => r.targetId === item.id && r.type === 'budget_review' && r.sent
      );
      
      if (!alreadySent) {
        // Create notification
        const notification = createNotification(
          organizerId,
          'budget_review',
          `Budget Review: ${item.name}`,
          `Review scheduled for tomorrow - ${item.name} (Budgeted: ${item.unitCost * item.quantity})`,
          eventId
        );
        
        // Track reminder
        const reminder: DeadlineReminder = {
          id: id('reminder'),
          type: 'budget_review',
          targetId: item.id,
          eventId,
          userId: organizerId,
          dueDate: item.reviewDate,
          reminderDate: now,
          sent: true,
        };
        
        if (!deadlineReminders[organizerId]) {
          deadlineReminders[organizerId] = [];
        }
        deadlineReminders[organizerId].push(reminder);
        
        notifications.push(notification);
      }
    }
  }
  
  return notifications;
}

/**
 * Check all deadline reminders for an event
 * This is the main function to call periodically
 */
export function checkAllDeadlineReminders(eventId: string): {
  taskReminders: Notification[];
  milestoneAlerts: Notification[];
  budgetReminders: Notification[];
  total: number;
} {
  const taskReminders = checkTaskDeadlines(eventId);
  const milestoneAlerts = checkMilestoneAlerts(eventId);
  const budgetReminders = checkBudgetReviewReminders(eventId);
  
  return {
    taskReminders,
    milestoneAlerts,
    budgetReminders,
    total: taskReminders.length + milestoneAlerts.length + budgetReminders.length,
  };
}

/**
 * Check deadline reminders for all events
 * This should be called periodically (e.g., every hour)
 */
export function checkAllEventsDeadlineReminders(): {
  eventId: string;
  reminders: ReturnType<typeof checkAllDeadlineReminders>;
}[] {
  const results: {
    eventId: string;
    reminders: ReturnType<typeof checkAllDeadlineReminders>;
  }[] = [];
  
  // Get all events
  const allEvents = Object.values(events);
  
  for (const event of allEvents) {
    const reminders = checkAllDeadlineReminders(event.id);
    if (reminders.total > 0) {
      results.push({
        eventId: event.id,
        reminders,
      });
    }
  }
  
  return results;
}

/**
 * Get deadline reminders for a user
 */
export function getUserDeadlineReminders(userId: string): DeadlineReminder[] {
  return deadlineReminders[userId] || [];
}

/**
 * Clear old reminders (older than 30 days)
 */
export function clearOldReminders(): number {
  let cleared = 0;
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  
  for (const userId in deadlineReminders) {
    const userReminders = deadlineReminders[userId];
    const filtered = userReminders.filter(r => r.reminderDate > thirtyDaysAgo);
    cleared += userReminders.length - filtered.length;
    deadlineReminders[userId] = filtered;
  }
  
  return cleared;
}


// ── Virtual Access Control ──────────────────────────────────────────────────

/**
 * Calculate expiration time for virtual access
 * Access expires 24 hours after the event date
 */
function calculateAccessExpiration(eventDate: string): number {
  const eventTime = new Date(eventDate).getTime();
  // Add 24 hours (in milliseconds) to event date
  return eventTime + (24 * 60 * 60 * 1000);
}

/**
 * Generate unique virtual access for a ticket holder
 * @param eventId - The event ID
 * @param userId - The user ID
 * @param ticketOrderId - The ticket order ID
 * @param eventDate - The event date (ISO string)
 * @returns VirtualAccess object with unique join link
 */
export function generateVirtualAccess(
  eventId: string,
  userId: string,
  ticketOrderId: string,
  eventDate: string
): VirtualAccess {
  const accessId = id("vaccess");
  const joinLink = `${process.env.NEXT_PUBLIC_BASE_URL || "https://guestly.app"}/events/${eventId}/virtual?token=${accessId}`;
  
  const expiresAt = calculateAccessExpiration(eventDate);
  
  const access: VirtualAccess = {
    id: accessId,
    eventId,
    userId,
    ticketOrderId,
    joinLink,
    expiresAt,
    createdAt: Date.now(),
  };
  
  virtualAccess[accessId] = access;
  return access;
}

/**
 * Get virtual access by access ID (token)
 * Returns null if not found or expired
 */
export function getVirtualAccess(accessId: string): VirtualAccess | null {
  const access = virtualAccess[accessId];
  if (!access) return null;
  
  // Check if expired
  if (access.expiresAt < Date.now()) return null;
  
  return access;
}

/**
 * Get virtual access for a specific user and event
 * Returns null if not found or expired
 */
export function getUserVirtualAccess(userId: string, eventId: string): VirtualAccess | null {
  const userAccess = Object.values(virtualAccess).find(
    (a) => a.userId === userId && a.eventId === eventId && a.expiresAt > Date.now()
  );
  return userAccess || null;
}

/**
 * Check if user has a paid ticket for the event
 * @param userId - The user ID
 * @param eventId - The event ID
 * @returns The order ID if found, null otherwise
 */
export function getUserTicketOrder(userId: string, eventId: string): string | null {
  const userOrders = Object.values(orders).filter(
    (order) => order.userId === userId && order.eventId === eventId && order.status === "paid"
  );
  
  // Return the most recent paid order
  if (userOrders.length > 0) {
    const latestOrder = userOrders.sort((a, b) => b.createdAt - a.createdAt)[0];
    return latestOrder.id;
  }
  
  return null;
}

/**
 * Revoke virtual access (admin function)
 * @param accessId - The access ID to revoke
 * @returns true if revoked, false if not found
 */
export function revokeVirtualAccess(accessId: string): boolean {
  if (virtualAccess[accessId]) {
    delete virtualAccess[accessId];
    return true;
  }
  return false;
}

/**
 * List all virtual access for an event (admin/organizer function)
 * @param eventId - The event ID
 * @returns Array of VirtualAccess objects
 */
export function listEventVirtualAccess(eventId: string): VirtualAccess[] {
  return Object.values(virtualAccess)
    .filter((a) => a.eventId === eventId)
    .sort((a, b) => b.createdAt - a.createdAt);
}


// ── Polls ────────────────────────────────────────────────────────────────────

/**
 * Create a new poll for an event
 */
export function createPoll(eventId: string, createdBy: string, question: string, options: string[]): Poll {
  const poll: Poll = {
    id: id("poll"),
    eventId,
    question,
    options: options.map((text) => ({ id: id("opt"), text, votes: 0 })),
    createdBy,
    createdAt: Date.now(),
  };
  polls[eventId] = polls[eventId] || [];
  polls[eventId].push(poll);
  return poll;
}

/**
 * Get all polls for an event
 */
export function listPolls(eventId: string): Poll[] {
  return (polls[eventId] || []).slice().sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * Get a specific poll by ID
 */
export function getPoll(pollId: string): Poll | null {
  for (const eventPolls of Object.values(polls)) {
    const poll = eventPolls.find((p) => p.id === pollId);
    if (poll) return poll;
  }
  return null;
}

/**
 * Vote on a poll option
 * Returns updated poll or null if already voted
 */
export function votePoll(pollId: string, optionId: string, userId: string): Poll | null {
  // Check if user already voted
  const existingVote = pollVotes.find((v) => v.pollId === pollId && v.userId === userId);
  if (existingVote) return null;

  const poll = getPoll(pollId);
  if (!poll || poll.closedAt) return null;

  const option = poll.options.find((o) => o.id === optionId);
  if (!option) return null;

  // Record vote
  option.votes += 1;
  pollVotes.push({
    pollId,
    optionId,
    userId,
    votedAt: Date.now(),
  });

  return poll;
}

/**
 * Close a poll (no more votes allowed)
 */
export function closePoll(pollId: string): Poll | null {
  const poll = getPoll(pollId);
  if (!poll) return null;
  poll.closedAt = Date.now();
  return poll;
}

/**
 * Check if user has voted on a poll
 */
export function hasUserVoted(pollId: string, userId: string): boolean {
  return pollVotes.some((v) => v.pollId === pollId && v.userId === userId);
}

// ── Q&A ──────────────────────────────────────────────────────────────────────

/**
 * Submit a Q&A question
 */
export function submitQuestion(eventId: string, userId: string, userName: string, question: string): QAQuestion {
  const qa: QAQuestion = {
    id: id("qa"),
    eventId,
    userId,
    userName,
    question,
    upvotes: 0,
    answered: false,
    createdAt: Date.now(),
  };
  qaQuestions[eventId] = qaQuestions[eventId] || [];
  qaQuestions[eventId].push(qa);
  return qa;
}

/**
 * Get all Q&A questions for an event
 */
export function listQuestions(eventId: string): QAQuestion[] {
  return (qaQuestions[eventId] || []).slice().sort((a, b) => b.upvotes - a.upvotes || b.createdAt - a.createdAt);
}

/**
 * Get a specific question by ID
 */
export function getQuestion(questionId: string): QAQuestion | null {
  for (const eventQuestions of Object.values(qaQuestions)) {
    const question = eventQuestions.find((q) => q.id === questionId);
    if (question) return question;
  }
  return null;
}

/**
 * Upvote a question
 * Returns updated question or null if already upvoted
 */
export function upvoteQuestion(questionId: string, userId: string): QAQuestion | null {
  // Check if user already upvoted
  const existingUpvote = qaUpvotes.find((u) => u.questionId === questionId && u.userId === userId);
  if (existingUpvote) return null;

  const question = getQuestion(questionId);
  if (!question) return null;

  // Record upvote
  question.upvotes += 1;
  qaUpvotes.push({
    questionId,
    userId,
    upvotedAt: Date.now(),
  });

  return question;
}

/**
 * Answer a question (organizer/moderator only)
 */
export function answerQuestion(questionId: string, answer: string, answeredBy: string): QAQuestion | null {
  const question = getQuestion(questionId);
  if (!question) return null;

  question.answered = true;
  question.answer = answer;
  question.answeredBy = answeredBy;

  return question;
}

/**
 * Check if user has upvoted a question
 */
export function hasUserUpvoted(questionId: string, userId: string): boolean {
  return qaUpvotes.some((u) => u.questionId === questionId && u.userId === userId);
}

/**
 * Delete a question (moderator/organizer only)
 */
export function deleteQuestion(questionId: string): boolean {
  for (const eventId in qaQuestions) {
    const index = qaQuestions[eventId].findIndex((q) => q.id === questionId);
    if (index !== -1) {
      qaQuestions[eventId].splice(index, 1);
      // Also remove associated upvotes
      const upvoteIndices = qaUpvotes
        .map((u, i) => (u.questionId === questionId ? i : -1))
        .filter((i) => i !== -1)
        .reverse();
      upvoteIndices.forEach((i) => qaUpvotes.splice(i, 1));
      return true;
    }
  }
  return false;
}

// ── Reactions ────────────────────────────────────────────────────────────────

/**
 * Add a reaction to an event
 */
export function addReaction(eventId: string, userId: string, type: Reaction["type"]): Reaction {
  const reaction: Reaction = {
    id: id("react"),
    eventId,
    userId,
    type,
    timestamp: Date.now(),
  };
  reactions.push(reaction);
  return reaction;
}

/**
 * Get recent reactions for an event (last 100)
 */
export function listReactions(eventId: string, limit = 100): Reaction[] {
  return reactions
    .filter((r) => r.eventId === eventId)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
}

/**
 * Get reaction counts by type for an event
 */
export function getReactionCounts(eventId: string): Record<Reaction["type"], number> {
  const counts: Record<Reaction["type"], number> = {
    'clap': 0,
    'heart': 0,
    'fire': 0,
    'party': 0,
    'thumbs-up': 0,
  };

  reactions
    .filter((r) => r.eventId === eventId)
    .forEach((r) => {
      counts[r.type] += 1;
    });

  return counts;
}

// ── Chat Messages ────────────────────────────────────────────────────────────

/**
 * Add a chat message to an event
 */
export function addChatMessage(
  eventId: string,
  userId: string,
  userName: string,
  message: string,
  type: ChatMessage['type'] = 'message',
  emoji?: string
): ChatMessage {
  const chatMessage: ChatMessage = {
    id: id("msg"),
    eventId,
    userId,
    userName,
    message: message.trim(),
    timestamp: Date.now(),
    type,
    emoji,
  };

  if (!chatMessages[eventId]) {
    chatMessages[eventId] = [];
  }

  chatMessages[eventId].push(chatMessage);

  // Keep only last 500 messages per event to prevent memory issues
  if (chatMessages[eventId].length > 500) {
    chatMessages[eventId] = chatMessages[eventId].slice(-500);
  }

  return chatMessage;
}

/**
 * Get chat messages for an event
 */
export function getChatMessages(eventId: string, limit = 100): ChatMessage[] {
  if (!chatMessages[eventId]) {
    return [];
  }

  return chatMessages[eventId].slice(-limit);
}

/**
 * Clear old chat messages for an event (keep only recent ones)
 */
export function clearOldChatMessages(eventId: string, keepCount = 100): void {
  if (chatMessages[eventId] && chatMessages[eventId].length > keepCount) {
    chatMessages[eventId] = chatMessages[eventId].slice(-keepCount);
  }
}

// ── User Presence ────────────────────────────────────────────────────────────

/**
 * Update user presence for an event
 */
export function updateUserPresence(
  eventId: string,
  userId: string,
  userName: string,
  status: UserPresence['status']
): UserPresence {
  if (!userPresence[eventId]) {
    userPresence[eventId] = [];
  }

  // Find existing presence
  let presence = userPresence[eventId].find((p) => p.userId === userId);

  if (presence) {
    presence.status = status;
    presence.lastSeen = Date.now();
  } else {
    presence = {
      userId,
      userName,
      eventId,
      status,
      lastSeen: Date.now(),
      joinedAt: Date.now(),
    };
    userPresence[eventId].push(presence);
  }

  return presence;
}

/**
 * Get online users for an event
 */
export function getOnlineUsers(eventId: string): UserPresence[] {
  if (!userPresence[eventId]) {
    return [];
  }

  const now = Date.now();
  const fiveMinutesAgo = now - 5 * 60 * 1000;

  return userPresence[eventId].filter((p) => {
    // Consider user online if they were active in the last 5 minutes
    return p.status === 'online' && p.lastSeen > fiveMinutesAgo;
  });
}

/**
 * Remove user presence when they leave
 */
export function removeUserPresence(eventId: string, userId: string): void {
  if (userPresence[eventId]) {
    const presence = userPresence[eventId].find((p) => p.userId === userId);
    if (presence) {
      presence.status = 'offline';
      presence.lastSeen = Date.now();
    }
  }
}

/**
 * Clean up stale presence data (users inactive for more than 10 minutes)
 */
export function cleanupStalePresence(eventId: string): void {
  if (!userPresence[eventId]) {
    return;
  }

  const now = Date.now();
  const tenMinutesAgo = now - 10 * 60 * 1000;

  userPresence[eventId] = userPresence[eventId].filter((p) => {
    return p.lastSeen > tenMinutesAgo;
  });
}



// ── Virtual Analytics ────────────────────────────────────────────────────────

/**
 * Record when a user joins a virtual event
 */
export function joinVirtualEvent(eventId: string, userId: string): VirtualAttendee {
  const attendee: VirtualAttendee = {
    userId,
    eventId,
    joinedAt: Date.now(),
    isActive: true,
  };

  virtualAttendees[eventId] = virtualAttendees[eventId] || [];
  virtualAttendees[eventId].push(attendee);

  // Start a watch session
  const sessionId = id("session");
  watchSessions[sessionId] = {
    id: sessionId,
    userId,
    eventId,
    startTime: Date.now(),
    totalWatchTime: 0,
    lastHeartbeat: Date.now(),
  };

  // Update analytics
  updateVirtualAnalytics(eventId);

  return attendee;
}

/**
 * Record when a user leaves a virtual event
 */
export function leaveVirtualEvent(eventId: string, userId: string): void {
  const attendees = virtualAttendees[eventId] || [];
  const attendee = attendees.find((a) => a.userId === userId && a.isActive);

  if (attendee) {
    attendee.isActive = false;
    attendee.leftAt = Date.now();

    // End watch session
    const session = Object.values(watchSessions).find(
      (s) => s.userId === userId && s.eventId === eventId && !s.endTime
    );

    if (session) {
      session.endTime = Date.now();
      session.totalWatchTime = Math.floor((session.endTime - session.startTime) / 1000);
    }

    // Update analytics
    updateVirtualAnalytics(eventId);
  }
}

/**
 * Update heartbeat for active watch session (call every 30 seconds)
 */
export function updateWatchHeartbeat(eventId: string, userId: string): void {
  const session = Object.values(watchSessions).find(
    (s) => s.userId === userId && s.eventId === eventId && !s.endTime
  );

  if (session) {
    session.lastHeartbeat = Date.now();
    session.totalWatchTime = Math.floor((Date.now() - session.startTime) / 1000);
  }
}

/**
 * Get currently active attendees for an event
 */
export function getActiveAttendees(eventId: string): VirtualAttendee[] {
  const attendees = virtualAttendees[eventId] || [];
  const now = Date.now();
  const TIMEOUT = 60000; // 1 minute timeout

  return attendees.filter((a) => {
    if (!a.isActive) return false;

    // Check if session is still active (heartbeat within last minute)
    const session = Object.values(watchSessions).find(
      (s) => s.userId === a.userId && s.eventId === eventId && !s.endTime
    );

    return session && now - session.lastHeartbeat < TIMEOUT;
  });
}

/**
 * Get live attendee count
 */
export function getLiveAttendeeCount(eventId: string): number {
  return getActiveAttendees(eventId).length;
}

/**
 * Get all watch sessions for an event
 */
export function getWatchSessions(eventId: string): WatchSession[] {
  return Object.values(watchSessions).filter((s) => s.eventId === eventId);
}

/**
 * Calculate and update virtual analytics for an event
 */
function updateVirtualAnalytics(eventId: string): void {
  const attendees = virtualAttendees[eventId] || [];
  const sessions = getWatchSessions(eventId);

  if (attendees.length === 0) return;

  // Calculate metrics
  const currentActive = getActiveAttendees(eventId).length;
  const totalUnique = new Set(attendees.map((a) => a.userId)).size;

  // Peak attendees
  const existing = virtualAnalytics[eventId];
  const peakAttendees = Math.max(existing?.peakAttendees || 0, currentActive);

  // Average watch time
  const completedSessions = sessions.filter((s) => s.endTime);
  const totalWatchTime = completedSessions.reduce((sum, s) => sum + s.totalWatchTime, 0);
  const averageWatchTime = completedSessions.length > 0 ? totalWatchTime / completedSessions.length : 0;

  // Retention rate (percentage of people still watching vs total joined)
  const retentionRate = totalUnique > 0 ? (currentActive / totalUnique) * 100 : 0;

  // Drop-off points (when people left)
  const dropOffPoints = attendees
    .filter((a) => a.leftAt)
    .reduce((acc, a) => {
      const timestamp = Math.floor(a.leftAt! / 60000) * 60000; // Round to minute
      const existing = acc.find((p) => p.timestamp === timestamp);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({ timestamp, count: 1 });
      }
      return acc;
    }, [] as Array<{ timestamp: number; count: number }>)
    .sort((a, b) => a.timestamp - b.timestamp);

  virtualAnalytics[eventId] = {
    eventId,
    peakAttendees,
    totalUniqueViewers: totalUnique,
    averageWatchTime,
    retentionRate,
    dropOffPoints,
    updatedAt: Date.now(),
  };
}

/**
 * Get virtual analytics for an event
 */
export function getVirtualAnalytics(eventId: string): VirtualAnalytics | null {
  updateVirtualAnalytics(eventId); // Refresh before returning
  return virtualAnalytics[eventId] || null;
}

/**
 * Get user's watch time for an event
 */
export function getUserWatchTime(eventId: string, userId: string): number {
  const sessions = Object.values(watchSessions).filter(
    (s) => s.userId === userId && s.eventId === eventId
  );

  return sessions.reduce((sum, s) => sum + s.totalWatchTime, 0);
}

// ── Crypto Deposits ──────────────────────────────────────────────────────────

export type CryptoDepositStatus = "pending" | "confirming" | "confirmed" | "failed";

export type CryptoDeposit = {
  id: string;
  userId: string;
  cryptoType: "usdt_trc20" | "usdt_erc20" | "bitcoin";
  address: string;
  amount: number;
  amountUSD: number;
  txHash?: string;
  status: CryptoDepositStatus;
  confirmations: number;
  requiredConfirmations: number;
  createdAt: number;
  updatedAt: number;
  confirmedAt?: number;
};

const cryptoDeposits: Record<string, CryptoDeposit> = {};

// ── Organizer Wallet & Withdrawals ───────────────────────────────────────────

export type OrganizerWallet = {
  userId: string;
  balance: number; // Available balance for withdrawal
  pendingBalance: number; // Balance from recent sales (not yet available for withdrawal)
  totalEarnings: number; // Lifetime earnings
  totalWithdrawn: number; // Lifetime withdrawals
};

export type WithdrawalMethod = "bank" | "crypto";
export type WithdrawalStatus = "pending" | "processing" | "completed" | "failed" | "cancelled";

export type BankDetails = {
  accountName: string;
  accountNumber: string;
  bankName: string;
  bankCode?: string;
  swiftCode?: string;
};

export type CryptoWithdrawalDetails = {
  cryptoType: "usdt_trc20" | "usdt_erc20" | "bitcoin";
  address: string;
};

export type WithdrawalRequest = {
  id: string;
  userId: string;
  amount: number;
  method: WithdrawalMethod;
  bankDetails?: BankDetails;
  cryptoDetails?: CryptoWithdrawalDetails;
  status: WithdrawalStatus;
  notes?: string;
  adminNotes?: string;
  txHash?: string; // For crypto withdrawals
  createdAt: number;
  updatedAt: number;
  processedAt?: number;
  completedAt?: number;
};

const organizerWallets: Record<string, OrganizerWallet> = {};
const withdrawalRequests: Record<string, WithdrawalRequest> = {};

/**
 * Create a new crypto deposit tracking record
 */
export function createCryptoDeposit(
  userId: string,
  cryptoType: CryptoDeposit["cryptoType"],
  address: string,
  amount: number,
  amountUSD: number
): CryptoDeposit {
  const depositId = id("cdep");
  
  // Determine required confirmations based on crypto type
  const requiredConfirmations = cryptoType === "bitcoin" ? 3 : 12; // BTC needs 3, USDT needs 12
  
  const deposit: CryptoDeposit = {
    id: depositId,
    userId,
    cryptoType,
    address,
    amount,
    amountUSD,
    status: "pending",
    confirmations: 0,
    requiredConfirmations,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  
  cryptoDeposits[depositId] = deposit;
  return deposit;
}

/**
 * Get a crypto deposit by ID
 */
export function getCryptoDeposit(depositId: string): CryptoDeposit | null {
  return cryptoDeposits[depositId] || null;
}

/**
 * Get all crypto deposits for a user
 */
export function getUserCryptoDeposits(userId: string): CryptoDeposit[] {
  return Object.values(cryptoDeposits)
    .filter((d) => d.userId === userId)
    .sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * Get pending crypto deposits for a user
 */
export function getPendingCryptoDeposits(userId: string): CryptoDeposit[] {
  return Object.values(cryptoDeposits)
    .filter((d) => d.userId === userId && (d.status === "pending" || d.status === "confirming"))
    .sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * Simulate blockchain confirmation polling
 * In a real implementation, this would call actual blockchain APIs
 */
export function pollCryptoDepositStatus(depositId: string): CryptoDeposit | null {
  const deposit = cryptoDeposits[depositId];
  if (!deposit) return null;
  
  // Don't update if already confirmed or failed
  if (deposit.status === "confirmed" || deposit.status === "failed") {
    return deposit;
  }
  
  // Simulate blockchain confirmation progress
  // In production, this would call actual blockchain APIs (e.g., Tron/Ethereum/Bitcoin explorers)
  const now = Date.now();
  const timeSinceCreation = now - deposit.createdAt;
  
  // Simulate detection of transaction after 10 seconds
  if (timeSinceCreation > 10000 && deposit.status === "pending") {
    deposit.status = "confirming";
    deposit.txHash = `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    deposit.confirmations = 1;
    deposit.updatedAt = now;
  }
  
  // Simulate confirmation progress (1 confirmation every 30 seconds)
  if (deposit.status === "confirming" && timeSinceCreation > 10000) {
    const expectedConfirmations = Math.min(
      Math.floor((timeSinceCreation - 10000) / 30000) + 1,
      deposit.requiredConfirmations
    );
    
    if (expectedConfirmations > deposit.confirmations) {
      deposit.confirmations = expectedConfirmations;
      deposit.updatedAt = now;
      
      // Mark as confirmed when required confirmations reached
      if (deposit.confirmations >= deposit.requiredConfirmations) {
        deposit.status = "confirmed";
        deposit.confirmedAt = now;
        
        // Credit the user's wallet
        const symbol = deposit.cryptoType === "bitcoin" ? "BTC" : "USDT";
        addCryptoBalance(deposit.userId, symbol, deposit.amount);
        
        // Also add USD equivalent to main balance
        addMoney(deposit.userId, deposit.amountUSD, `Crypto deposit: ${deposit.amount} ${symbol}`);
      }
    }
  }
  
  return deposit;
}

/**
 * Manually update crypto deposit status (for testing or admin purposes)
 */
export function updateCryptoDepositStatus(
  depositId: string,
  status: CryptoDepositStatus,
  confirmations?: number,
  txHash?: string
): CryptoDeposit | null {
  const deposit = cryptoDeposits[depositId];
  if (!deposit) return null;
  
  deposit.status = status;
  deposit.updatedAt = Date.now();
  
  if (confirmations !== undefined) {
    deposit.confirmations = confirmations;
  }
  
  if (txHash) {
    deposit.txHash = txHash;
  }
  
  // Credit wallet if confirmed
  if (status === "confirmed" && !deposit.confirmedAt) {
    deposit.confirmedAt = Date.now();
    const symbol = deposit.cryptoType === "bitcoin" ? "BTC" : "USDT";
    addCryptoBalance(deposit.userId, symbol, deposit.amount);
    addMoney(deposit.userId, deposit.amountUSD, `Crypto deposit: ${deposit.amount} ${symbol}`);
  }
  
  return deposit;
}


// ── Organizer Wallet Functions ───────────────────────────────────────────────

/**
 * Get or create organizer wallet
 */
export function getOrganizerWallet(userId: string): OrganizerWallet {
  if (!organizerWallets[userId]) {
    organizerWallets[userId] = {
      userId,
      balance: 0,
      pendingBalance: 0,
      totalEarnings: 0,
      totalWithdrawn: 0,
    };
  }
  return organizerWallets[userId];
}

/**
 * Add earnings to organizer wallet (from ticket/merch sales)
 */
export function addOrganizerEarnings(userId: string, amount: number, description: string): OrganizerWallet {
  const wallet = getOrganizerWallet(userId);
  
  // Add to pending balance (simulating settlement period)
  wallet.pendingBalance += amount;
  wallet.totalEarnings += amount;
  
  // Add transaction record
  transactions.push({
    id: id("txn"),
    userId,
    amount,
    type: "credit",
    description: `Organizer: ${description}`,
    createdAt: Date.now(),
  });
  
  return wallet;
}

/**
 * Move pending balance to available balance (simulate settlement)
 */
export function settlePendingBalance(userId: string): OrganizerWallet {
  const wallet = getOrganizerWallet(userId);
  wallet.balance += wallet.pendingBalance;
  wallet.pendingBalance = 0;
  return wallet;
}

/**
 * Create a withdrawal request
 */
export function createWithdrawalRequest(
  userId: string,
  amount: number,
  method: WithdrawalMethod,
  bankDetails?: BankDetails,
  cryptoDetails?: CryptoWithdrawalDetails,
  notes?: string
): WithdrawalRequest {
  const wallet = getOrganizerWallet(userId);
  
  // Validate sufficient balance
  if (wallet.balance < amount) {
    throw new Error("Insufficient balance for withdrawal");
  }
  
  // Validate withdrawal details
  if (method === "bank" && !bankDetails) {
    throw new Error("Bank details required for bank withdrawal");
  }
  
  if (method === "crypto" && !cryptoDetails) {
    throw new Error("Crypto details required for crypto withdrawal");
  }
  
  // Minimum withdrawal amount
  if (amount < 10) {
    throw new Error("Minimum withdrawal amount is $10");
  }
  
  // Deduct from available balance
  wallet.balance -= amount;
  
  const requestId = id("wdraw");
  const request: WithdrawalRequest = {
    id: requestId,
    userId,
    amount,
    method,
    bankDetails,
    cryptoDetails,
    status: "pending",
    notes,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  
  withdrawalRequests[requestId] = request;
  
  // Add transaction record
  transactions.push({
    id: id("txn"),
    userId,
    amount,
    type: "debit",
    description: `Withdrawal request (${method})`,
    createdAt: Date.now(),
  });
  
  return request;
}

/**
 * Get a withdrawal request by ID
 */
export function getWithdrawalRequest(requestId: string): WithdrawalRequest | null {
  return withdrawalRequests[requestId] || null;
}

/**
 * Get all withdrawal requests for a user
 */
export function getUserWithdrawalRequests(userId: string): WithdrawalRequest[] {
  return Object.values(withdrawalRequests)
    .filter((r) => r.userId === userId)
    .sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * Get all pending withdrawal requests (admin function)
 */
export function getPendingWithdrawalRequests(): WithdrawalRequest[] {
  return Object.values(withdrawalRequests)
    .filter((r) => r.status === "pending" || r.status === "processing")
    .sort((a, b) => a.createdAt - b.createdAt);
}

/**
 * Update withdrawal request status (admin function)
 */
export function updateWithdrawalStatus(
  requestId: string,
  status: WithdrawalStatus,
  adminNotes?: string,
  txHash?: string
): WithdrawalRequest {
  const request = withdrawalRequests[requestId];
  if (!request) throw new Error("Withdrawal request not found");
  
  const previousStatus = request.status;
  request.status = status;
  request.updatedAt = Date.now();
  
  if (adminNotes) {
    request.adminNotes = adminNotes;
  }
  
  if (txHash) {
    request.txHash = txHash;
  }
  
  if (status === "processing" && previousStatus === "pending") {
    request.processedAt = Date.now();
  }
  
  if (status === "completed") {
    request.completedAt = Date.now();
    const wallet = getOrganizerWallet(request.userId);
    wallet.totalWithdrawn += request.amount;
  }
  
  // If failed or cancelled, refund to wallet
  if ((status === "failed" || status === "cancelled") && previousStatus !== "failed" && previousStatus !== "cancelled") {
    const wallet = getOrganizerWallet(request.userId);
    wallet.balance += request.amount;
    
    transactions.push({
      id: id("txn"),
      userId: request.userId,
      amount: request.amount,
      type: "credit",
      description: `Withdrawal ${status}: refund`,
      createdAt: Date.now(),
    });
  }
  
  return request;
}

/**
 * Cancel a withdrawal request (user function)
 */
export function cancelWithdrawalRequest(requestId: string, userId: string): WithdrawalRequest {
  const request = withdrawalRequests[requestId];
  if (!request) throw new Error("Withdrawal request not found");
  if (request.userId !== userId) throw new Error("Unauthorized");
  if (request.status !== "pending") throw new Error("Can only cancel pending requests");
  
  return updateWithdrawalStatus(requestId, "cancelled", "Cancelled by user");
}

// ── Analytics Functions ───────────────────────────────────────────────────────

/**
 * Create or update event insights
 */
export function addEventInsight(
  eventId: string,
  type: EventInsight['type'],
  title: string,
  description: string,
  confidence: number,
  data: Record<string, any>
): EventInsight {
  const insight: EventInsight = {
    eventId,
    type,
    title,
    description,
    confidence,
    data,
    createdAt: Date.now(),
  };
  
  if (!eventInsights[eventId]) {
    eventInsights[eventId] = [];
  }
  eventInsights[eventId].push(insight);
  
  return insight;
}

/**
 * Get all insights for an event
 */
export function getEventInsights(eventId: string): EventInsight[] {
  return eventInsights[eventId] || [];
}

/**
 * Get insights by type for an event
 */
export function getEventInsightsByType(eventId: string, type: EventInsight['type']): EventInsight[] {
  const insights = eventInsights[eventId] || [];
  return insights.filter(i => i.type === type);
}

/**
 * Generate attendance prediction for an event
 * Uses sales velocity and historical data from similar events
 */
export function generateAttendancePrediction(eventId: string): EventInsight | null {
  const event = getEventById(eventId);
  if (!event) return null;
  
  // Get all paid orders for this event
  const eventOrders = Object.values(orders).filter(
    o => o.eventId === eventId && o.status === 'paid'
  );
  
  if (eventOrders.length === 0) {
    // No sales yet, use benchmark data
    const benchmark = getBenchmarkData(event.category, event.city);
    if (!benchmark) {
      return addEventInsight(
        eventId,
        'attendance_prediction',
        'Insufficient Data for Prediction',
        'Not enough sales data yet. Start selling tickets to get predictions.',
        0.3,
        {
          predictedAttendance: 0,
          currentSales: 0,
          confidenceInterval: { low: 0, high: 0 },
          daysUntilEvent: calculateDaysUntilEvent(event.date),
        }
      );
    }
    
    // Use benchmark average with low confidence
    return addEventInsight(
      eventId,
      'attendance_prediction',
      'Predicted Attendance (Based on Market Data)',
      `Based on similar ${event.category} events in ${event.city}, we predict approximately ${Math.round(benchmark.averageAttendance)} attendees.`,
      0.4,
      {
        predictedAttendance: Math.round(benchmark.averageAttendance),
        currentSales: 0,
        confidenceInterval: {
          low: Math.round(benchmark.averageAttendance * 0.7),
          high: Math.round(benchmark.averageAttendance * 1.3),
        },
        daysUntilEvent: calculateDaysUntilEvent(event.date),
        basedOn: 'market_benchmark',
      }
    );
  }
  
  // Calculate current ticket sales
  const currentSales = eventOrders.reduce((total, order) => {
    return total + order.items.reduce((sum, item) => sum + item.quantity, 0);
  }, 0);
  
  // Calculate sales velocity (tickets per day)
  const firstOrderTime = Math.min(...eventOrders.map(o => o.createdAt));
  const daysSinceFirstSale = Math.max(1, (Date.now() - firstOrderTime) / (1000 * 60 * 60 * 24));
  const salesVelocity = currentSales / daysSinceFirstSale;
  
  // Calculate days until event
  const daysUntilEvent = calculateDaysUntilEvent(event.date);
  
  // Get historical data from similar events
  const benchmark = getBenchmarkData(event.category, event.city);
  
  // Calculate prediction based on velocity and historical data
  let predictedAttendance: number;
  let confidence: number;
  let basedOn: string;
  
  if (daysUntilEvent <= 0) {
    // Event has passed or is today
    predictedAttendance = currentSales;
    confidence = 1.0;
    basedOn = 'actual_sales';
  } else if (daysUntilEvent <= 3) {
    // Very close to event, high confidence in current sales
    const projectedFromVelocity = currentSales + (salesVelocity * daysUntilEvent * 0.5); // Reduced velocity near event
    predictedAttendance = Math.round(projectedFromVelocity);
    confidence = 0.85;
    basedOn = 'sales_velocity';
  } else if (benchmark) {
    // Use weighted average of velocity projection and benchmark
    const projectedFromVelocity = currentSales + (salesVelocity * daysUntilEvent * 0.7); // Assume 70% velocity continues
    const benchmarkAttendance = benchmark.averageAttendance;
    
    // Weight based on how much data we have
    const velocityWeight = Math.min(0.7, eventOrders.length / 20); // More orders = more weight on velocity
    const benchmarkWeight = 1 - velocityWeight;
    
    predictedAttendance = Math.round(
      (projectedFromVelocity * velocityWeight) + (benchmarkAttendance * benchmarkWeight)
    );
    confidence = 0.6 + (velocityWeight * 0.2); // 0.6 to 0.8 confidence
    basedOn = 'velocity_and_benchmark';
  } else {
    // Only velocity data available
    const projectedFromVelocity = currentSales + (salesVelocity * daysUntilEvent * 0.7);
    predictedAttendance = Math.round(projectedFromVelocity);
    confidence = 0.5;
    basedOn = 'sales_velocity';
  }
  
  // Calculate confidence interval (wider for lower confidence)
  const intervalWidth = 1 - confidence;
  const confidenceInterval = {
    low: Math.max(currentSales, Math.round(predictedAttendance * (1 - intervalWidth * 0.3))),
    high: Math.round(predictedAttendance * (1 + intervalWidth * 0.3)),
  };
  
  // Generate description
  const description = generatePredictionDescription(
    predictedAttendance,
    currentSales,
    daysUntilEvent,
    salesVelocity,
    confidence
  );
  
  return addEventInsight(
    eventId,
    'attendance_prediction',
    'Predicted Final Attendance',
    description,
    confidence,
    {
      predictedAttendance,
      currentSales,
      salesVelocity: Math.round(salesVelocity * 10) / 10,
      daysUntilEvent,
      confidenceInterval,
      basedOn,
      totalOrders: eventOrders.length,
    }
  );
}

/**
 * Helper: Calculate days until event
 */
function calculateDaysUntilEvent(eventDate: string): number {
  const eventTime = new Date(eventDate).getTime();
  const now = Date.now();
  return Math.ceil((eventTime - now) / (1000 * 60 * 60 * 24));
}

/**
 * Helper: Generate prediction description
 */
function generatePredictionDescription(
  predicted: number,
  current: number,
  daysLeft: number,
  velocity: number,
  confidence: number
): string {
  if (daysLeft <= 0) {
    return `Event has concluded with ${current} attendees.`;
  }
  
  if (current === 0) {
    return `Start selling tickets to get accurate predictions. Based on market data, similar events typically see around ${predicted} attendees.`;
  }
  
  const remaining = predicted - current;
  const velocityPerDay = Math.round(velocity * 10) / 10;
  
  if (confidence >= 0.8) {
    return `With ${current} tickets sold and ${daysLeft} days remaining, we predict ${predicted} total attendees. Current sales velocity: ${velocityPerDay} tickets/day.`;
  } else if (confidence >= 0.6) {
    return `Based on current sales (${current} tickets) and similar events in this market, we estimate ${predicted} total attendees. ${remaining} more tickets expected over the next ${daysLeft} days.`;
  } else {
    return `Early prediction based on ${current} tickets sold so far. Estimated final attendance: ${predicted}. Prediction will improve as more tickets are sold.`;
  }
}

/**
 * Generate revenue forecast for an event
 * Projects final revenue based on sales trends and historical data
 * Uses revenue velocity and benchmark data from similar events
 */
export function generateRevenueForecast(eventId: string): EventInsight | null {
  const event = getEventById(eventId);
  if (!event) return null;

  // Get all paid orders for this event
  const eventOrders = Object.values(orders).filter(
    o => o.eventId === eventId && o.status === 'paid'
  );

  if (eventOrders.length === 0) {
    // No sales yet, use benchmark data
    const benchmark = getBenchmarkData(event.category, event.city);
    if (!benchmark) {
      return addEventInsight(
        eventId,
        'revenue_forecast',
        'Insufficient Data for Revenue Forecast',
        'Not enough sales data yet. Start selling tickets to get revenue projections.',
        0.3,
        {
          forecastedRevenue: 0,
          currentRevenue: 0,
          bestCase: 0,
          worstCase: 0,
          daysUntilEvent: calculateDaysUntilEvent(event.date),
        }
      );
    }

    // Use benchmark average with low confidence
    const benchmarkRevenue = Math.round(benchmark.averageRevenue);
    return addEventInsight(
      eventId,
      'revenue_forecast',
      'Revenue Forecast (Based on Market Data)',
      `Based on similar ${event.category} events in ${event.city}, we forecast approximately $${benchmarkRevenue.toLocaleString()} in revenue.`,
      0.4,
      {
        forecastedRevenue: benchmarkRevenue,
        currentRevenue: 0,
        bestCase: Math.round(benchmarkRevenue * 1.3),
        worstCase: Math.round(benchmarkRevenue * 0.7),
        daysUntilEvent: calculateDaysUntilEvent(event.date),
        basedOn: 'market_benchmark',
      }
    );
  }

  // Calculate current revenue
  const currentRevenue = eventOrders.reduce((total, order) => {
    return total + order.total;
  }, 0);

  // Calculate revenue velocity (revenue per day)
  const firstOrderTime = Math.min(...eventOrders.map(o => o.createdAt));
  const daysSinceFirstSale = Math.max(1, (Date.now() - firstOrderTime) / (1000 * 60 * 60 * 24));
  const revenueVelocity = currentRevenue / daysSinceFirstSale;

  // Calculate days until event
  const daysUntilEvent = calculateDaysUntilEvent(event.date);

  // Get historical data from similar events
  const benchmark = getBenchmarkData(event.category, event.city);

  // Calculate forecast based on velocity and historical data
  let forecastedRevenue: number;
  let confidence: number;
  let basedOn: string;

  if (daysUntilEvent <= 0) {
    // Event has passed or is today
    forecastedRevenue = currentRevenue;
    confidence = 1.0;
    basedOn = 'actual_revenue';
  } else if (daysUntilEvent <= 3) {
    // Very close to event, high confidence in current revenue
    const projectedFromVelocity = currentRevenue + (revenueVelocity * daysUntilEvent * 0.5); // Reduced velocity near event
    forecastedRevenue = Math.round(projectedFromVelocity);
    confidence = 0.85;
    basedOn = 'revenue_velocity';
  } else if (benchmark) {
    // Use weighted average of velocity projection and benchmark
    const projectedFromVelocity = currentRevenue + (revenueVelocity * daysUntilEvent * 0.7); // Assume 70% velocity continues
    const benchmarkRevenue = benchmark.averageRevenue;

    // Weight based on how much data we have
    const velocityWeight = Math.min(0.7, eventOrders.length / 20); // More orders = more weight on velocity
    const benchmarkWeight = 1 - velocityWeight;

    forecastedRevenue = Math.round(
      (projectedFromVelocity * velocityWeight) + (benchmarkRevenue * benchmarkWeight)
    );
    confidence = 0.6 + (velocityWeight * 0.2); // 0.6 to 0.8 confidence
    basedOn = 'velocity_and_benchmark';
  } else {
    // Only velocity data available
    const projectedFromVelocity = currentRevenue + (revenueVelocity * daysUntilEvent * 0.7);
    forecastedRevenue = Math.round(projectedFromVelocity);
    confidence = 0.5;
    basedOn = 'revenue_velocity';
  }

  // Calculate best/worst case scenarios based on confidence intervals
  const intervalWidth = 1 - confidence;
  const bestCase = Math.round(forecastedRevenue * (1 + intervalWidth * 0.3));
  const worstCase = Math.max(currentRevenue, Math.round(forecastedRevenue * (1 - intervalWidth * 0.3)));

  // Generate description
  const description = generateRevenueForecastDescription(
    forecastedRevenue,
    currentRevenue,
    daysUntilEvent,
    revenueVelocity,
    confidence,
    bestCase,
    worstCase
  );

  return addEventInsight(
    eventId,
    'revenue_forecast',
    'Revenue Forecast',
    description,
    confidence,
    {
      forecastedRevenue,
      currentRevenue,
      revenueVelocity: Math.round(revenueVelocity * 100) / 100,
      daysUntilEvent,
      bestCase,
      worstCase,
      basedOn,
      totalOrders: eventOrders.length,
    }
  );
}

/**
 * Helper: Generate revenue forecast description
 */
function generateRevenueForecastDescription(
  forecasted: number,
  current: number,
  daysLeft: number,
  velocity: number,
  confidence: number,
  bestCase: number,
  worstCase: number
): string {
  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

  if (daysLeft <= 0) {
    return `Event has concluded with ${formatCurrency(current)} in revenue.`;
  }

  if (current === 0) {
    return `Start selling tickets to get accurate revenue forecasts. Based on market data, similar events typically generate around ${formatCurrency(forecasted)}.`;
  }

  const remaining = forecasted - current;
  const velocityPerDay = Math.round(velocity * 100) / 100;

  if (confidence >= 0.8) {
    return `With ${formatCurrency(current)} earned and ${daysLeft} days remaining, we forecast ${formatCurrency(forecasted)} total revenue. Current velocity: ${formatCurrency(velocityPerDay)}/day. Best case: ${formatCurrency(bestCase)}, Worst case: ${formatCurrency(worstCase)}.`;
  } else if (confidence >= 0.6) {
    return `Based on current revenue (${formatCurrency(current)}) and similar events in this market, we estimate ${formatCurrency(forecasted)} total revenue. Expected range: ${formatCurrency(worstCase)} - ${formatCurrency(bestCase)} over the next ${daysLeft} days.`;
  } else {
    return `Early forecast based on ${formatCurrency(current)} earned so far. Estimated final revenue: ${formatCurrency(forecasted)} (range: ${formatCurrency(worstCase)} - ${formatCurrency(bestCase)}). Forecast will improve as more tickets are sold.`;
  }
}


/**
 * Generate pricing recommendation for an event
 * Analyzes market data for similar events and suggests optimal ticket pricing
 * Considers city, category, and venue size if available
 */
export function generatePricingRecommendation(eventId: string): EventInsight | null {
  const event = getEventById(eventId);
  if (!event) return null;

  // Get benchmark data for similar events
  const benchmark = getBenchmarkData(event.category, event.city);
  
  if (!benchmark) {
    return addEventInsight(
      eventId,
      'pricing_recommendation',
      'Insufficient Market Data',
      'Not enough market data available for pricing recommendations in this category and city.',
      0.3,
      {
        suggestedPrice: 0,
        marketAverage: 0,
        priceRange: { low: 0, high: 0 },
      }
    );
  }

  // Get current event metrics to understand existing sales
  const metrics = getEventMetrics(eventId);
  const eventOrders = Object.values(orders).filter(
    o => o.eventId === eventId && o.status === 'paid'
  );

  // Calculate current average ticket price if sales exist
  let currentAveragePrice = 0;
  if (eventOrders.length > 0) {
    const totalRevenue = eventOrders.reduce((sum, order) => sum + order.total, 0);
    const totalTickets = eventOrders.reduce((sum, order) => {
      return sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
    }, 0);
    currentAveragePrice = totalTickets > 0 ? totalRevenue / totalTickets : 0;
  }

  // Base recommendation on market average
  let suggestedPrice = benchmark.averageTicketPrice;
  let confidence = 0.7;
  let reasoning: string[] = [];

  // Adjust for venue capacity if available (inferred from ticket availability)
  const availability = getAvailability(eventId);
  if (availability && availability.tickets) {
    const totalCapacity = availability.tickets.reduce((sum, ticket) => sum + ticket.available, 0);
    
    // Adjust pricing based on venue size relative to market average
    if (totalCapacity > benchmark.averageAttendance * 1.5) {
      // Large venue - suggest slightly lower price to fill capacity
      suggestedPrice = Math.round(benchmark.averageTicketPrice * 0.9);
      reasoning.push('Large venue capacity suggests competitive pricing to maximize attendance');
    } else if (totalCapacity < benchmark.averageAttendance * 0.6) {
      // Small venue - can charge premium for exclusivity
      suggestedPrice = Math.round(benchmark.averageTicketPrice * 1.15);
      reasoning.push('Limited capacity allows for premium pricing');
      confidence = 0.75;
    }
  }

  // Adjust based on city-specific factors
  const cityMultipliers: Record<string, number> = {
    'Lagos': 1.0,    // Baseline
    'Abuja': 0.95,   // Slightly lower
    'Accra': 0.85,   // Lower cost market
    'Nairobi': 0.9,  // Moderate
  };
  
  const cityMultiplier = cityMultipliers[event.city] || 1.0;
  if (cityMultiplier !== 1.0) {
    reasoning.push(`Adjusted for ${event.city} market conditions`);
  }

  // Adjust based on category-specific factors
  const categoryInsights: Record<string, string> = {
    'Music': 'Music events typically support higher pricing on weekends',
    'Tech': 'Tech events benefit from early-bird pricing strategies',
    'Art': 'Art events can use tiered pricing for different experiences',
    'Food': 'Food events perform well with bundle pricing (ticket + meal)',
  };

  if (categoryInsights[event.category]) {
    reasoning.push(categoryInsights[event.category]);
  }

  // Calculate price range (±20% of suggested price)
  const priceRange = {
    low: Math.round(suggestedPrice * 0.8),
    high: Math.round(suggestedPrice * 1.2),
  };

  // Calculate expected impact on sales
  let expectedImpact: {
    atSuggestedPrice: { attendance: number; revenue: number };
    atLowerPrice: { attendance: number; revenue: number };
    atHigherPrice: { attendance: number; revenue: number };
  };

  // Price elasticity assumptions (lower price = higher attendance)
  const baseAttendance = benchmark.averageAttendance;
  
  expectedImpact = {
    atSuggestedPrice: {
      attendance: Math.round(baseAttendance),
      revenue: Math.round(baseAttendance * suggestedPrice),
    },
    atLowerPrice: {
      attendance: Math.round(baseAttendance * 1.15), // 15% more attendees
      revenue: Math.round(baseAttendance * 1.15 * priceRange.low),
    },
    atHigherPrice: {
      attendance: Math.round(baseAttendance * 0.85), // 15% fewer attendees
      revenue: Math.round(baseAttendance * 0.85 * priceRange.high),
    },
  };

  // Generate description
  let description = `Based on ${benchmark.averageAttendance} similar ${event.category} events in ${event.city}, we recommend pricing tickets at ${suggestedPrice.toLocaleString()} (range: ${priceRange.low.toLocaleString()} - ${priceRange.high.toLocaleString()}). `;
  
  if (currentAveragePrice > 0) {
    const priceDiff = ((suggestedPrice - currentAveragePrice) / currentAveragePrice) * 100;
    if (Math.abs(priceDiff) > 10) {
      if (priceDiff > 0) {
        description += `Your current average price (${Math.round(currentAveragePrice).toLocaleString()}) is ${Math.abs(Math.round(priceDiff))}% below market average - consider raising prices. `;
      } else {
        description += `Your current average price (${Math.round(currentAveragePrice).toLocaleString()}) is ${Math.abs(Math.round(priceDiff))}% above market average - this may impact sales velocity. `;
      }
    } else {
      description += `Your current pricing is well-aligned with the market. `;
    }
  }

  // Add best revenue scenario
  const bestRevenueScenario = Math.max(
    expectedImpact.atSuggestedPrice.revenue,
    expectedImpact.atLowerPrice.revenue,
    expectedImpact.atHigherPrice.revenue
  );
  
  if (bestRevenueScenario === expectedImpact.atLowerPrice.revenue) {
    description += `Lower pricing (${priceRange.low.toLocaleString()}) may maximize revenue through higher attendance.`;
  } else if (bestRevenueScenario === expectedImpact.atHigherPrice.revenue) {
    description += `Premium pricing (${priceRange.high.toLocaleString()}) may maximize revenue despite lower attendance.`;
  } else {
    description += `Suggested pricing offers the best balance of attendance and revenue.`;
  }

  return addEventInsight(
    eventId,
    'pricing_recommendation',
    'Optimal Ticket Pricing Recommendation',
    description,
    confidence,
    {
      suggestedPrice,
      currentAveragePrice: Math.round(currentAveragePrice),
      marketAverage: benchmark.averageTicketPrice,
      priceRange,
      expectedImpact,
      reasoning,
      benchmarkData: {
        category: event.category,
        city: event.city,
        sampleSize: 'market_average',
      },
    }
  );
}

/**
 * Generate timing suggestion for an event
 * Analyzes best days and times by city and category
 * Considers category-specific patterns (e.g., Music on Saturday nights, Tech on weekday evenings)
 */
export function generateTimingSuggestion(eventId: string): EventInsight | null {
  const event = getEventById(eventId);
  if (!event) return null;

  // Get benchmark data for similar events
  const benchmark = getBenchmarkData(event.category, event.city);
  
  if (!benchmark) {
    return addEventInsight(
      eventId,
      'timing_suggestion',
      'Insufficient Market Data',
      'Not enough market data available for timing recommendations in this category and city.',
      0.3,
      {
        suggestedDay: '',
        suggestedTime: '',
        reasoning: [],
      }
    );
  }

  const suggestedDay = benchmark.topPerformingDay;
  const suggestedTime = benchmark.topPerformingTime;
  const confidence = 0.75;
  const reasoning: string[] = [];

  // Category-specific insights
  const categoryInsights: Record<string, string> = {
    'Music': 'Music events typically perform best on weekend evenings when people are free to enjoy nightlife',
    'Tech': 'Tech events work well on weekday evenings after work hours, allowing professionals to attend',
    'Cultural': 'Cultural events see strong attendance on weekend afternoons when families can participate',
    'Faith': 'Faith-based events traditionally perform best on Sunday mornings',
    'Sports': 'Sports events attract larger crowds on weekend afternoons',
    'Food': 'Food events benefit from weekend timing when people have leisure time to explore',
    'Art': 'Art events perform well on weekend afternoons and early evenings',
  };

  if (categoryInsights[event.category]) {
    reasoning.push(categoryInsights[event.category]);
  }

  // City-specific patterns
  const cityInsights: Record<string, string> = {
    'Lagos': 'Lagos audiences tend to arrive fashionably late - consider starting times 30-60 minutes later than other cities',
    'Abuja': 'Abuja has a more formal event culture with punctual attendance',
    'Accra': 'Accra events benefit from Friday evening slots as the weekend social scene kicks off early',
    'Nairobi': 'Nairobi audiences appreciate well-structured events with clear start times',
  };

  if (cityInsights[event.city]) {
    reasoning.push(cityInsights[event.city]);
  }

  // Time-of-day insights
  const hour = parseInt(suggestedTime.split(':')[0]);
  let timeOfDayInsight = '';
  
  if (hour >= 6 && hour < 12) {
    timeOfDayInsight = 'Morning events work well for faith-based and wellness activities';
  } else if (hour >= 12 && hour < 17) {
    timeOfDayInsight = 'Afternoon timing is ideal for family-friendly and cultural events';
  } else if (hour >= 17 && hour < 21) {
    timeOfDayInsight = 'Evening slots capture after-work crowds and create energetic atmospheres';
  } else {
    timeOfDayInsight = 'Late evening timing suits nightlife and entertainment events';
  }
  
  reasoning.push(timeOfDayInsight);

  // Day-of-week insights
  const dayInsights: Record<string, string> = {
    'Monday': 'Monday events require strong value propositions to overcome weekday fatigue',
    'Tuesday': 'Tuesday works for professional networking and educational events',
    'Wednesday': 'Mid-week timing balances accessibility with weekend competition',
    'Thursday': 'Thursday evening is popular for after-work social events',
    'Friday': 'Friday kicks off the weekend social calendar with high energy',
    'Saturday': 'Saturday is prime time for major events with maximum attendance potential',
    'Sunday': 'Sunday works well for community, faith, and family-oriented events',
  };

  if (dayInsights[suggestedDay]) {
    reasoning.push(dayInsights[suggestedDay]);
  }

  // Check if event is already scheduled
  const eventDate = new Date(event.date);
  const eventDay = eventDate.toLocaleDateString('en-US', { weekday: 'long' });
  const eventTime = eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  
  let description = `Based on ${benchmark.averageAttendance} similar ${event.category} events in ${event.city}, we recommend scheduling on ${suggestedDay} at ${suggestedTime}. `;
  
  // Compare with current event timing if scheduled
  if (eventDay && eventTime) {
    if (eventDay === suggestedDay) {
      description += `Your event is scheduled for ${eventDay}, which aligns with the optimal day. `;
      
      // Compare times (within 2 hours is considered aligned)
      const eventHour = parseInt(eventTime.split(':')[0]);
      const suggestedHour = parseInt(suggestedTime.split(':')[0]);
      const hourDiff = Math.abs(eventHour - suggestedHour);
      
      if (hourDiff <= 2) {
        description += `The timing (${eventTime}) is also well-aligned with peak performance hours.`;
      } else if (eventHour < suggestedHour) {
        description += `Consider starting later (around ${suggestedTime}) to capture peak attendance.`;
      } else {
        description += `Your later start time may work if targeting a specific audience segment.`;
      }
    } else {
      description += `Your event is scheduled for ${eventDay}. Consider ${suggestedDay} for potentially higher attendance based on market data.`;
    }
  } else {
    description += `This timing has historically driven the highest attendance and engagement for this event type.`;
  }

  return addEventInsight(
    eventId,
    'timing_suggestion',
    'Optimal Event Timing Recommendation',
    description,
    confidence,
    {
      suggestedDay,
      suggestedTime,
      currentDay: eventDay || 'Not scheduled',
      currentTime: eventTime || 'Not scheduled',
      reasoning,
      benchmarkData: {
        category: event.category,
        city: event.city,
        averageAttendance: benchmark.averageAttendance,
      },
    }
  );
}

/**
 * Generate promotion timing recommendations for an event
 * Analyzes days until event, sales velocity, and category patterns to suggest optimal promotion schedule
 */
export function generatePromotionTimingRecommendation(eventId: string): EventInsight | null {
  const event = getEventById(eventId);
  if (!event) return null;

  const daysUntilEvent = calculateDaysUntilEvent(event.date);
  const metrics = getEventMetrics(eventId);
  const benchmark = getBenchmarkData(event.category, event.city);
  
  // Calculate sales velocity (tickets sold per day)
  const availability = getAvailability(eventId);
  const ticketsSold = availability ? 
    availability.tickets.reduce((sum, ticket) => {
      // Assuming initial capacity was higher, we calculate sold tickets
      // In a real system, we'd track this separately
      return sum + (100 - ticket.available); // Simplified: assume 100 initial capacity per type
    }, 0) : 0;
  
  // Estimate days since event was created (simplified - using 30 days as default if no metrics)
  const daysSinceCreation = metrics ? Math.max(1, 30 - daysUntilEvent) : 30;
  const salesVelocity = ticketsSold / daysSinceCreation;

  const recommendations: Array<{
    timing: string;
    action: string;
    reason: string;
    priority: 'high' | 'medium' | 'low';
  }> = [];

  const reminders: Array<{
    when: string;
    message: string;
    audience: string;
  }> = [];

  const discounts: Array<{
    timing: string;
    type: string;
    suggestedDiscount: string;
    reason: string;
  }> = [];

  // ── Promotion Schedule Based on Days Until Event ──────────────────────────

  if (daysUntilEvent > 60) {
    // Early promotion phase (60+ days out)
    recommendations.push({
      timing: 'Now - 60 days before event',
      action: 'Launch early bird campaign',
      reason: 'Build early momentum and reward committed attendees',
      priority: 'high',
    });
    
    recommendations.push({
      timing: '45-60 days before',
      action: 'Announce event details and speakers/lineup',
      reason: 'Generate buzz and social media engagement',
      priority: 'medium',
    });

    discounts.push({
      timing: 'Now - 45 days before',
      type: 'Early Bird Discount',
      suggestedDiscount: '20-30%',
      reason: 'Incentivize early purchases and generate initial revenue',
    });
  } else if (daysUntilEvent > 30) {
    // Mid-promotion phase (30-60 days out)
    recommendations.push({
      timing: 'Now - 30 days before',
      action: 'Ramp up social media and email marketing',
      reason: 'Capture the main wave of ticket buyers',
      priority: 'high',
    });

    recommendations.push({
      timing: '30-45 days before',
      action: 'Partner with influencers and community leaders',
      reason: 'Expand reach through trusted voices',
      priority: 'medium',
    });

    if (salesVelocity < 5) {
      discounts.push({
        timing: 'Now - 21 days before',
        type: 'Mid-Campaign Boost',
        suggestedDiscount: '15-20%',
        reason: 'Sales velocity is below target - boost with limited-time offer',
      });
    }
  } else if (daysUntilEvent > 14) {
    // Late promotion phase (14-30 days out)
    recommendations.push({
      timing: 'Now - 14 days before',
      action: 'Send targeted reminders to interested users',
      reason: 'Convert browsers into buyers with urgency messaging',
      priority: 'high',
    });

    recommendations.push({
      timing: '14-21 days before',
      action: 'Highlight limited availability and FOMO messaging',
      reason: 'Create urgency as event approaches',
      priority: 'high',
    });

    if (salesVelocity < 3) {
      discounts.push({
        timing: 'Now - 10 days before',
        type: 'Flash Sale',
        suggestedDiscount: '15-25%',
        reason: 'Low sales velocity - create urgency with time-limited offer',
      });
    }
  } else if (daysUntilEvent > 7) {
    // Final push phase (7-14 days out)
    recommendations.push({
      timing: 'Now - 7 days before',
      action: 'Final push campaign across all channels',
      reason: 'Last chance to reach full capacity',
      priority: 'high',
    });

    recommendations.push({
      timing: '7-10 days before',
      action: 'Send personalized messages to past attendees',
      reason: 'Leverage existing relationships for last-minute sales',
      priority: 'medium',
    });

    const capacityUsed = availability ? 
      (ticketsSold / availability.tickets.reduce((sum, ticket) => sum + 100, 0)) : 0; // Simplified capacity calculation

    if (capacityUsed < 0.5) {
      discounts.push({
        timing: 'Now - 5 days before',
        type: 'Last Chance Discount',
        suggestedDiscount: '20-30%',
        reason: 'Less than 50% capacity filled - aggressive discount needed',
      });
    }
  } else if (daysUntilEvent > 1) {
    // Last minute phase (1-7 days out)
    recommendations.push({
      timing: 'Now - 24 hours before',
      action: 'Last-minute social media blitz',
      reason: 'Capture spontaneous attendees',
      priority: 'high',
    });

    recommendations.push({
      timing: '2-3 days before',
      action: 'Send "Event This Weekend" reminders',
      reason: 'Top-of-mind awareness for weekend planners',
      priority: 'high',
    });

    discounts.push({
      timing: 'Now - 24 hours before',
      type: 'Last Minute Deal',
      suggestedDiscount: '10-15%',
      reason: 'Fill remaining seats with last-minute buyers',
    });
  } else {
    // Event is today or tomorrow
    recommendations.push({
      timing: 'Now',
      action: 'Door sales and walk-up promotion',
      reason: 'Maximize attendance with on-site sales',
      priority: 'medium',
    });
  }

  // ── Reminder Schedule ──────────────────────────────────────────────────

  if (daysUntilEvent >= 7) {
    reminders.push({
      when: '7 days before event',
      message: 'Event is one week away! Finalize your plans.',
      audience: 'All ticket holders',
    });
  }

  if (daysUntilEvent >= 3) {
    reminders.push({
      when: '3 days before event',
      message: 'Event is in 3 days! Check event details and location.',
      audience: 'All ticket holders',
    });
  }

  if (daysUntilEvent >= 1) {
    reminders.push({
      when: '24 hours before event',
      message: 'Event is tomorrow! Get ready for an amazing experience.',
      audience: 'All ticket holders',
    });
  }

  reminders.push({
    when: '3 hours before event',
    message: 'Event starts soon! Head to the venue now.',
    audience: 'Physical attendees',
  });

  if (event.eventType === 'Virtual' || event.eventType === 'Hybrid') {
    reminders.push({
      when: '30 minutes before event',
      message: 'Event starting soon! Join the virtual lobby now.',
      audience: 'Virtual attendees',
    });
  }

  // ── Category-Specific Adjustments ──────────────────────────────────────

  const categoryAdjustments: Record<string, string> = {
    'Music': 'Music events benefit from artist/lineup reveals and playlist teasers in promotion',
    'Tech': 'Tech events should emphasize speaker credentials and learning outcomes',
    'Cultural': 'Cultural events perform well with community partnerships and cultural organization outreach',
    'Faith': 'Faith-based events benefit from word-of-mouth and community leader endorsements',
    'Sports': 'Sports events should highlight competition details and prize information',
    'Food': 'Food events benefit from menu previews and chef/vendor highlights',
    'Art': 'Art events should showcase featured artists and exhibition previews',
  };

  // ── City-Specific Behavior ────────────────────────────────────────────

  const cityBehavior: Record<string, string> = {
    'Lagos': 'Lagos audiences respond well to influencer marketing and last-minute promotions',
    'Abuja': 'Abuja audiences prefer formal announcements and professional networking angles',
    'Accra': 'Accra audiences engage heavily with social media campaigns and community events',
    'Nairobi': 'Nairobi audiences appreciate detailed event information and early planning',
  };

  // ── Build Description ──────────────────────────────────────────────────

  let description = `With ${daysUntilEvent} days until your event, `;
  
  if (daysUntilEvent > 60) {
    description += 'focus on building early momentum with early bird offers and initial announcements. ';
  } else if (daysUntilEvent > 30) {
    description += 'this is prime time for your main promotional push across all channels. ';
  } else if (daysUntilEvent > 14) {
    description += 'shift to urgency-based messaging and targeted reminders. ';
  } else if (daysUntilEvent > 7) {
    description += 'launch your final push campaign to maximize attendance. ';
  } else {
    description += 'focus on last-minute promotions and reminder communications. ';
  }

  if (salesVelocity > 0) {
    description += `Current sales velocity: ${salesVelocity.toFixed(1)} tickets/day. `;
  }

  if (benchmark) {
    description += `Based on ${benchmark.averageAttendance} similar ${event.category} events in ${event.city}, `;
    description += 'we recommend a strategic promotion schedule with targeted reminders and discount timing.';
  }

  const confidence = benchmark ? 0.8 : 0.6;

  return addEventInsight(
    eventId,
    'promotion_timing',
    'Promotion Timing Strategy',
    description,
    confidence,
    {
      daysUntilEvent,
      salesVelocity: salesVelocity.toFixed(2),
      ticketsSold,
      promotionSchedule: recommendations,
      reminderSchedule: reminders,
      discountRecommendations: discounts,
      categoryInsight: categoryAdjustments[event.category] || '',
      cityInsight: cityBehavior[event.city] || '',
      benchmarkData: benchmark ? {
        category: event.category,
        city: event.city,
        averageAttendance: benchmark.averageAttendance,
      } : null,
    }
  );
}

/**
 * Generate audience targeting insights for an event
 * Analyzes demographics of ticket buyers and suggests targeting parameters
 * Since detailed demographics aren't tracked, uses simplified inference based on:
 * - Event category (implies interest areas)
 * - City (location targeting)
 * - Purchase patterns (timing, ticket types)
 * - Similar event benchmarks
 */
export function generateAudienceTargetingInsights(eventId: string): EventInsight | null {
  const event = getEventById(eventId);
  if (!event) return null;

  // Get all paid orders for this event
  const eventOrders = Object.values(orders).filter(
    o => o.eventId === eventId && o.status === 'paid'
  );

  const benchmark = getBenchmarkData(event.category, event.city);
  const metrics = getEventMetrics(eventId);

  // ── Demographic Inference ──────────────────────────────────────────────

  // Infer demographics based on event category
  const categoryDemographics: Record<string, {
    primaryAge: string;
    interests: string[];
    platforms: string[];
    behavior: string;
  }> = {
    'Music': {
      primaryAge: '18-35',
      interests: ['Live Music', 'Entertainment', 'Nightlife', 'Social Events'],
      platforms: ['Instagram', 'TikTok', 'Twitter', 'WhatsApp'],
      behavior: 'Spontaneous buyers, respond to social proof and FOMO',
    },
    'Tech': {
      primaryAge: '25-45',
      interests: ['Technology', 'Innovation', 'Startups', 'Professional Development', 'Networking'],
      platforms: ['LinkedIn', 'Twitter', 'Tech Communities', 'Email'],
      behavior: 'Early planners, value learning outcomes and networking opportunities',
    },
    'Art': {
      primaryAge: '25-50',
      interests: ['Contemporary Art', 'Culture', 'Creative Industries', 'Design'],
      platforms: ['Instagram', 'Facebook', 'Art Communities', 'Email'],
      behavior: 'Culturally engaged, appreciate detailed event information',
    },
    'Food': {
      primaryAge: '25-45',
      interests: ['Culinary Experiences', 'Dining', 'Food Culture', 'Social Gatherings'],
      platforms: ['Instagram', 'Facebook', 'Food Blogs', 'WhatsApp'],
      behavior: 'Experience seekers, influenced by visual content and reviews',
    },
  };

  const demographics = categoryDemographics[event.category] || {
    primaryAge: '25-40',
    interests: ['Events', 'Entertainment', 'Social Activities'],
    platforms: ['Facebook', 'Instagram', 'WhatsApp'],
    behavior: 'General event attendees',
  };

  // ── Purchase Pattern Analysis ──────────────────────────────────────────

  const purchasePatterns: {
    earlyBuyers: number;
    lastMinuteBuyers: number;
    averageTicketsPerOrder: number;
    groupBuyers: number;
  } = {
    earlyBuyers: 0,
    lastMinuteBuyers: 0,
    averageTicketsPerOrder: 0,
    groupBuyers: 0,
  };

  if (eventOrders.length > 0) {
    const daysUntilEvent = calculateDaysUntilEvent(event.date);
    const totalDaysOfSales = Math.max(1, 60 - daysUntilEvent); // Assume 60 days sales period

    eventOrders.forEach(order => {
      const daysSinceOrder = (Date.now() - order.createdAt) / (1000 * 60 * 60 * 24);
      const daysBeforeEventWhenPurchased = daysUntilEvent + daysSinceOrder;

      // Categorize buyers
      if (daysBeforeEventWhenPurchased > 30) {
        purchasePatterns.earlyBuyers++;
      } else if (daysBeforeEventWhenPurchased < 7) {
        purchasePatterns.lastMinuteBuyers++;
      }

      // Calculate tickets per order
      const ticketsInOrder = order.items.reduce((sum, item) => sum + item.quantity, 0);
      purchasePatterns.averageTicketsPerOrder += ticketsInOrder;

      // Identify group buyers (3+ tickets)
      if (ticketsInOrder >= 3) {
        purchasePatterns.groupBuyers++;
      }
    });

    purchasePatterns.averageTicketsPerOrder = 
      purchasePatterns.averageTicketsPerOrder / eventOrders.length;
  }

  // ── Targeting Parameters ───────────────────────────────────────────────

  const targetingParameters: Array<{
    parameter: string;
    value: string;
    reason: string;
  }> = [];

  // Location targeting
  targetingParameters.push({
    parameter: 'Geographic Location',
    value: `${event.city} and surrounding areas (50km radius)`,
    reason: `Primary audience is local to ${event.city}`,
  });

  // Add neighboring cities for larger events
  const cityNeighbors: Record<string, string[]> = {
    'Lagos': ['Ibadan', 'Abeokuta'],
    'Abuja': ['Kaduna', 'Jos'],
    'Accra': ['Kumasi', 'Tema'],
    'Nairobi': ['Mombasa', 'Kisumu'],
  };

  if (benchmark && benchmark.averageAttendance > 500) {
    targetingParameters.push({
      parameter: 'Extended Geographic',
      value: `Include ${cityNeighbors[event.city]?.join(', ') || 'nearby cities'}`,
      reason: 'Large event capacity justifies broader geographic targeting',
    });
  }

  // Age targeting
  targetingParameters.push({
    parameter: 'Age Range',
    value: demographics.primaryAge,
    reason: `${event.category} events typically attract this age demographic`,
  });

  // Interest targeting
  targetingParameters.push({
    parameter: 'Interests',
    value: demographics.interests.join(', '),
    reason: 'Target users with relevant interests for higher conversion',
  });

  // Platform targeting
  targetingParameters.push({
    parameter: 'Marketing Channels',
    value: demographics.platforms.join(', '),
    reason: `${event.category} audiences are most active on these platforms`,
  });

  // Behavioral targeting
  if (purchasePatterns.earlyBuyers > purchasePatterns.lastMinuteBuyers) {
    targetingParameters.push({
      parameter: 'Timing Behavior',
      value: 'Early planners - target 30+ days before event',
      reason: 'Your audience tends to purchase tickets well in advance',
    });
  } else if (purchasePatterns.lastMinuteBuyers > purchasePatterns.earlyBuyers) {
    targetingParameters.push({
      parameter: 'Timing Behavior',
      value: 'Last-minute buyers - intensify marketing 7 days before',
      reason: 'Your audience tends to make spontaneous purchase decisions',
    });
  }

  if (purchasePatterns.averageTicketsPerOrder >= 2.5) {
    targetingParameters.push({
      parameter: 'Social Behavior',
      value: 'Group attendees - emphasize social experience',
      reason: `Average ${purchasePatterns.averageTicketsPerOrder.toFixed(1)} tickets per order indicates group attendance`,
    });
  }

  // Event type specific targeting
  if (event.eventType === 'Virtual' || event.eventType === 'Hybrid') {
    targetingParameters.push({
      parameter: 'Virtual Audience',
      value: 'Expand to national/international audience',
      reason: 'Virtual access removes geographic constraints',
    });
  }

  // ── Similar Event Audience Overlap ─────────────────────────────────────

  const similarEvents = events.filter((e: Event) => 
    e.id !== eventId &&
    e.category === event.category &&
    e.city === event.city
  );

  const audienceOverlap: Array<{
    eventTitle: string;
    overlapPercentage: string;
    insight: string;
  }> = [];

  similarEvents.slice(0, 3).forEach((similarEvent: Event) => {
    // Get orders for similar event
    const similarEventOrders = Object.values(orders).filter(
      o => o.eventId === similarEvent.id && o.status === 'paid'
    );

    // Calculate overlap (simplified - in reality would check actual user IDs)
    const overlapEstimate = Math.min(30, Math.random() * 40 + 10); // 10-50% overlap estimate

    audienceOverlap.push({
      eventTitle: similarEvent.title,
      overlapPercentage: `${overlapEstimate.toFixed(0)}%`,
      insight: `Target attendees of "${similarEvent.title}" - similar ${event.category} audience in ${event.city}`,
    });
  });

  // ── Lookalike Audience Recommendations ─────────────────────────────────

  const lookalikeRecommendations: string[] = [];

  if (eventOrders.length >= 10) {
    lookalikeRecommendations.push(
      `Create lookalike audience from ${eventOrders.length} existing ticket buyers`
    );
  }

  if (metrics && metrics.saves > 20) {
    lookalikeRecommendations.push(
      `Target users similar to ${metrics.saves} people who saved your event`
    );
  }

  if (benchmark) {
    lookalikeRecommendations.push(
      `Use benchmark data from ${benchmark.averageAttendance} similar ${event.category} events in ${event.city}`
    );
  }

  // Add category-specific lookalike suggestions
  if (event.category === 'Tech') {
    lookalikeRecommendations.push(
      'Target followers of tech influencers and startup communities'
    );
  } else if (event.category === 'Music') {
    lookalikeRecommendations.push(
      'Target fans of similar artists and music genres'
    );
  } else if (event.category === 'Art') {
    lookalikeRecommendations.push(
      'Target followers of galleries, artists, and cultural institutions'
    );
  } else if (event.category === 'Food') {
    lookalikeRecommendations.push(
      'Target food bloggers followers and restaurant enthusiasts'
    );
  }

  // ── Build Description ──────────────────────────────────────────────────

  let description = `Your ${event.category} event in ${event.city} attracts ${demographics.primaryAge} year-olds `;
  description += `interested in ${demographics.interests.slice(0, 2).join(' and ')}. `;

  if (eventOrders.length > 0) {
    description += `Current buyers show ${demographics.behavior.toLowerCase()}. `;
    
    if (purchasePatterns.averageTicketsPerOrder >= 2) {
      description += `Average ${purchasePatterns.averageTicketsPerOrder.toFixed(1)} tickets per order suggests group attendance. `;
    }
  }

  description += `Focus marketing on ${demographics.platforms.slice(0, 2).join(' and ')} `;
  description += `targeting ${event.city} and surrounding areas.`;

  if (similarEvents.length > 0) {
    description += ` Leverage audience overlap with similar ${event.category} events in ${event.city}.`;
  }

  const confidence = eventOrders.length >= 10 ? 0.75 : 
                     eventOrders.length >= 5 ? 0.65 : 
                     benchmark ? 0.55 : 0.45;

  return addEventInsight(
    eventId,
    'audience_targeting',
    'Audience Targeting Strategy',
    description,
    confidence,
    {
      demographics: {
        primaryAge: demographics.primaryAge,
        interests: demographics.interests,
        platforms: demographics.platforms,
        behavior: demographics.behavior,
      },
      targetingParameters,
      purchasePatterns: {
        totalOrders: eventOrders.length,
        earlyBuyers: purchasePatterns.earlyBuyers,
        lastMinuteBuyers: purchasePatterns.lastMinuteBuyers,
        averageTicketsPerOrder: purchasePatterns.averageTicketsPerOrder.toFixed(1),
        groupBuyerPercentage: eventOrders.length > 0 
          ? `${((purchasePatterns.groupBuyers / eventOrders.length) * 100).toFixed(0)}%`
          : '0%',
      },
      audienceOverlap: audienceOverlap.length > 0 ? audienceOverlap : null,
      lookalikeRecommendations,
      cityInsights: {
        city: event.city,
        similarEventsInCity: similarEvents.length,
        benchmarkAttendance: benchmark?.averageAttendance || null,
      },
    }
  );
}

/**
 * Generate city-specific benchmark insights
 * 
 * Calculates average metrics per city, shows city performance trends,
 * and compares organizer's events to city average
 * 
 * Requirements: 11.8
 */
export function generateCityBenchmarkInsights(eventId: string): EventInsight | null {
  const event = getEventById(eventId);
  if (!event) return null;

  const metrics = getEventMetrics(eventId);
  if (!metrics) return null;

  // Get all events in the same city
  const cityEvents = events.filter((e: Event) => e.city === event.city && e.id !== eventId);
  
  if (cityEvents.length === 0) {
    return addEventInsight(
      eventId,
      'city_benchmark',
      `${event.city} Market Insights`,
      `Your event is one of the first in ${event.city}. As more events are created, we'll provide city-specific benchmarks and trends.`,
      0.3,
      {
        city: event.city,
        totalEventsInCity: 1,
        insufficientData: true,
      }
    );
  }

  // ── Calculate City-Wide Metrics ────────────────────────────────────────

  const cityMetricsData = cityEvents
    .map((e: Event) => {
      const m = getEventMetrics(e.id);
      if (!m) return null;
      
      const eventOrders = Object.values(orders).filter(
        o => o.eventId === e.id && o.status === 'paid'
      );
      
      return {
        eventId: e.id,
        category: e.category,
        ticketsSold: m.ticketsSold,
        revenue: m.revenue,
        conversionRate: m.conversionRate,
        averageOrderValue: m.averageOrderValue,
        views: m.views,
        date: e.date,
      };
    })
    .filter((m): m is {
      eventId: string;
      category: "Music" | "Tech" | "Art" | "Food";
      ticketsSold: number;
      revenue: number;
      conversionRate: number;
      averageOrderValue: number;
      views: number;
      date: string;
    } => m !== null);

  if (cityMetricsData.length === 0) {
    return addEventInsight(
      eventId,
      'city_benchmark',
      `${event.city} Market Insights`,
      `Insufficient data available for ${event.city} benchmarks. We need more events with sales data to generate meaningful insights.`,
      0.3,
      {
        city: event.city,
        totalEventsInCity: cityEvents.length,
        insufficientData: true,
      }
    );
  }

  // Calculate city averages
  const cityAverages = {
    ticketsSold: cityMetricsData.reduce((sum, m) => sum + m.ticketsSold, 0) / cityMetricsData.length,
    revenue: cityMetricsData.reduce((sum, m) => sum + m.revenue, 0) / cityMetricsData.length,
    conversionRate: cityMetricsData.reduce((sum, m) => sum + m.conversionRate, 0) / cityMetricsData.length,
    averageOrderValue: cityMetricsData.reduce((sum, m) => sum + m.averageOrderValue, 0) / cityMetricsData.length,
    views: cityMetricsData.reduce((sum, m) => sum + m.views, 0) / cityMetricsData.length,
  };

  // ── Compare Event to City Average ──────────────────────────────────────

  const comparisons = [
    {
      metric: 'Ticket Sales',
      yourValue: metrics.ticketsSold,
      cityAverage: Math.round(cityAverages.ticketsSold),
      percentageDiff: ((metrics.ticketsSold - cityAverages.ticketsSold) / cityAverages.ticketsSold * 100),
      unit: 'tickets',
    },
    {
      metric: 'Revenue',
      yourValue: metrics.revenue,
      cityAverage: Math.round(cityAverages.revenue),
      percentageDiff: ((metrics.revenue - cityAverages.revenue) / cityAverages.revenue * 100),
      unit: 'NGN',
    },
    {
      metric: 'Conversion Rate',
      yourValue: metrics.conversionRate,
      cityAverage: parseFloat(cityAverages.conversionRate.toFixed(2)),
      percentageDiff: ((metrics.conversionRate - cityAverages.conversionRate) / cityAverages.conversionRate * 100),
      unit: '%',
    },
    {
      metric: 'Average Order Value',
      yourValue: metrics.averageOrderValue,
      cityAverage: Math.round(cityAverages.averageOrderValue),
      percentageDiff: ((metrics.averageOrderValue - cityAverages.averageOrderValue) / cityAverages.averageOrderValue * 100),
      unit: 'NGN',
    },
  ];

  // ── Category Performance in City ───────────────────────────────────────

  const categoryMetrics = cityMetricsData.filter(m => m.category === event.category);
  const categoryAverages = categoryMetrics.length > 0 ? {
    ticketsSold: categoryMetrics.reduce((sum, m) => sum + m.ticketsSold, 0) / categoryMetrics.length,
    revenue: categoryMetrics.reduce((sum, m) => sum + m.revenue, 0) / categoryMetrics.length,
  } : null;

  // ── City Performance Trends ────────────────────────────────────────────

  // Group events by month to show trends
  const monthlyData: Record<string, { count: number; totalRevenue: number; totalTickets: number }> = {};
  
  cityMetricsData.forEach(m => {
    const eventDate = new Date(m.date);
    const monthKey = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { count: 0, totalRevenue: 0, totalTickets: 0 };
    }
    
    monthlyData[monthKey].count++;
    monthlyData[monthKey].totalRevenue += m.revenue;
    monthlyData[monthKey].totalTickets += m.ticketsSold;
  });

  const trendData = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6) // Last 6 months
    .map(([month, data]) => ({
      month,
      eventCount: data.count,
      averageRevenue: Math.round(data.totalRevenue / data.count),
      averageTickets: Math.round(data.totalTickets / data.count),
    }));

  // ── Top Performing Categories in City ──────────────────────────────────

  const categoryPerformance: Record<string, { count: number; totalRevenue: number; avgTickets: number }> = {};
  
  cityMetricsData.forEach(m => {
    if (!categoryPerformance[m.category]) {
      categoryPerformance[m.category] = { count: 0, totalRevenue: 0, avgTickets: 0 };
    }
    categoryPerformance[m.category].count++;
    categoryPerformance[m.category].totalRevenue += m.revenue;
    categoryPerformance[m.category].avgTickets += m.ticketsSold;
  });

  const topCategories = Object.entries(categoryPerformance)
    .map(([category, data]) => ({
      category,
      eventCount: data.count,
      averageRevenue: Math.round(data.totalRevenue / data.count),
      averageTickets: Math.round(data.avgTickets / data.count),
    }))
    .sort((a, b) => b.averageRevenue - a.averageRevenue)
    .slice(0, 5);

  // ── Performance Ranking ────────────────────────────────────────────────

  const revenueRanking = [...cityMetricsData, { 
    eventId, 
    category: event.category,
    ticketsSold: metrics.ticketsSold,
    revenue: metrics.revenue,
    conversionRate: metrics.conversionRate,
    averageOrderValue: metrics.averageOrderValue,
    views: metrics.views,
    date: event.date,
  }]
    .sort((a, b) => b.revenue - a.revenue);
  
  const yourRank = revenueRanking.findIndex(e => e.eventId === eventId) + 1;
  const totalEvents = revenueRanking.length;
  const percentile = Math.round((1 - (yourRank - 1) / (totalEvents - 1)) * 100);

  // ── Build Description ──────────────────────────────────────────────────

  let description = `In ${event.city}, your event ranks #${yourRank} out of ${totalEvents} events (${percentile}th percentile). `;
  
  const strongMetrics = comparisons.filter(c => c.percentageDiff > 10);
  const weakMetrics = comparisons.filter(c => c.percentageDiff < -10);
  
  if (strongMetrics.length > 0) {
    description += `You're outperforming the city average in ${strongMetrics.map(m => m.metric).join(', ')}. `;
  }
  
  if (weakMetrics.length > 0) {
    description += `Focus on improving ${weakMetrics.map(m => m.metric).join(', ')} to match city standards. `;
  }
  
  if (categoryAverages) {
    const categoryComparison = ((metrics.revenue - categoryAverages.revenue) / categoryAverages.revenue * 100);
    if (categoryComparison > 0) {
      description += `Your ${event.category} event is performing ${Math.abs(categoryComparison).toFixed(0)}% above the ${event.category} category average in ${event.city}.`;
    } else {
      description += `The average ${event.category} event in ${event.city} generates ${Math.abs(categoryComparison).toFixed(0)}% more revenue.`;
    }
  }

  const confidence = cityMetricsData.length >= 10 ? 0.85 : 
                     cityMetricsData.length >= 5 ? 0.70 : 0.55;

  return addEventInsight(
    eventId,
    'city_benchmark',
    `${event.city} Market Performance`,
    description,
    confidence,
    {
      city: event.city,
      totalEventsInCity: cityEvents.length,
      eventsWithData: cityMetricsData.length,
      ranking: {
        position: yourRank,
        totalEvents,
        percentile,
      },
      cityAverages: {
        ticketsSold: Math.round(cityAverages.ticketsSold),
        revenue: Math.round(cityAverages.revenue),
        conversionRate: parseFloat(cityAverages.conversionRate.toFixed(2)),
        averageOrderValue: Math.round(cityAverages.averageOrderValue),
      },
      comparisons: comparisons.map(c => ({
        metric: c.metric,
        yourValue: c.unit === '%' ? parseFloat(c.yourValue.toFixed(2)) : Math.round(c.yourValue),
        cityAverage: c.cityAverage,
        percentageDiff: parseFloat(c.percentageDiff.toFixed(1)),
        performance: c.percentageDiff > 10 ? 'above' : c.percentageDiff < -10 ? 'below' : 'average',
        unit: c.unit,
      })),
      categoryPerformance: categoryAverages ? {
        category: event.category,
        averageTicketsSold: Math.round(categoryAverages.ticketsSold),
        averageRevenue: Math.round(categoryAverages.revenue),
        yourPerformance: {
          ticketsSold: metrics.ticketsSold,
          revenue: metrics.revenue,
        },
      } : null,
      trends: trendData.length > 0 ? {
        period: 'Last 6 months',
        data: trendData,
      } : null,
      topCategories,
    }
  );
}

/**
 * Create or update event metrics
 */
export function updateEventMetrics(eventId: string, metrics: Partial<EventMetrics>): EventMetrics {
  if (!eventMetrics[eventId]) {
    eventMetrics[eventId] = {
      eventId,
      views: 0,
      saves: 0,
      ticketsSold: 0,
      revenue: 0,
      conversionRate: 0,
      averageOrderValue: 0,
      refundRate: 0,
    };
  }
  
  eventMetrics[eventId] = {
    ...eventMetrics[eventId],
    ...metrics,
  };
  
  return eventMetrics[eventId];
}

/**
 * Get metrics for an event
 */
export function getEventMetrics(eventId: string): EventMetrics | null {
  return eventMetrics[eventId] || null;
}

/**
 * Increment event views
 */
export function incrementEventViews(eventId: string): void {
  if (!eventMetrics[eventId]) {
    updateEventMetrics(eventId, { views: 1 });
  } else {
    eventMetrics[eventId].views++;
  }
}

/**
 * Increment event saves
 */
export function incrementEventSaves(eventId: string): void {
  if (!eventMetrics[eventId]) {
    updateEventMetrics(eventId, { saves: 1 });
  } else {
    eventMetrics[eventId].saves++;
  }
}

/**
 * Update event sales metrics (called when order is paid)
 */
export function updateEventSalesMetrics(eventId: string, orderTotal: number, ticketCount: number): void {
  const metrics = eventMetrics[eventId] || updateEventMetrics(eventId, {});
  
  metrics.ticketsSold += ticketCount;
  metrics.revenue += orderTotal;
  
  // Calculate average order value
  const totalOrders = Object.values(orders).filter(o => o.eventId === eventId && o.status === 'paid').length;
  if (totalOrders > 0) {
    metrics.averageOrderValue = metrics.revenue / totalOrders;
  }
  
  // Calculate conversion rate (tickets sold / views)
  if (metrics.views > 0) {
    metrics.conversionRate = (metrics.ticketsSold / metrics.views) * 100;
  }
}

/**
 * Create or update benchmark data
 */
export function setBenchmarkData(
  category: string,
  city: string,
  data: Omit<BenchmarkData, 'category' | 'city'>
): BenchmarkData {
  const key = `${category}-${city}`;
  benchmarkData[key] = {
    category,
    city,
    ...data,
  };
  
  return benchmarkData[key];
}

/**
 * Get benchmark data for a category and city
 */
export function getBenchmarkData(category: string, city: string): BenchmarkData | null {
  const key = `${category}-${city}`;
  return benchmarkData[key] || null;
}

/**
 * Get all benchmark data
 */
export function getAllBenchmarkData(): BenchmarkData[] {
  return Object.values(benchmarkData);
}

/**
 * Performance comparison result type
 */
export type PerformanceComparison = {
  eventId: string;
  eventName: string;
  category: string;
  city: string;
  metrics: {
    ticketsSold: number;
    revenue: number;
    conversionRate: number;
    averageOrderValue: number;
    salesVelocity: number; // tickets per day
  };
  benchmarks: {
    averageTicketsSold: number;
    averageRevenue: number;
    averageConversionRate: number;
    averageOrderValue: number;
    averageSalesVelocity: number;
  };
  percentiles: {
    ticketsSold: number; // 0-100
    revenue: number;
    conversionRate: number;
    averageOrderValue: number;
    salesVelocity: number;
  };
  ranking: 'top_10' | 'top_25' | 'above_average' | 'average' | 'below_average';
  areasForImprovement: Array<{
    area: 'pricing' | 'promotion' | 'timing' | 'conversion' | 'sales_velocity';
    severity: 'high' | 'medium' | 'low';
    recommendation: string;
    impact: string;
  }>;
  strengths: string[];
};

/**
 * Generate event performance comparison
 * Compares event metrics against benchmark data for similar events
 * Calculates percentile ranking and identifies areas for improvement
 */
export function generatePerformanceComparison(eventId: string): PerformanceComparison | null {
  const event = getEventById(eventId);
  if (!event) return null;

  const metrics = getEventMetrics(eventId);
  if (!metrics) return null;

  const benchmark = getBenchmarkData(event.category, event.city);
  if (!benchmark) return null;

  // Helper to format currency
  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

  // Get all similar events for percentile calculation
  const allEvents = events; // Use the events array from lib/events.ts
  const similarEvents = allEvents.filter(
    (e: Event) => e.category === event.category && e.city === event.city && e.id !== eventId
  );

  // Calculate sales velocity (tickets per day since event creation)
  const eventOrders = Object.values(orders).filter(
    o => o.eventId === eventId && o.status === 'paid'
  );
  // Use a default creation time of 30 days ago if not available
  const eventCreationTime = Date.now() - (30 * 24 * 60 * 60 * 1000);
  const daysSinceCreation = Math.max(1, Math.floor((Date.now() - eventCreationTime) / (1000 * 60 * 60 * 24)));
  const salesVelocity = metrics.ticketsSold / daysSinceCreation;

  // Calculate average sales velocity for similar events
  const similarMetrics = similarEvents
    .map((e: Event) => {
      const m = getEventMetrics(e.id);
      if (!m) return null;
      const days = Math.max(1, Math.floor((Date.now() - eventCreationTime) / (1000 * 60 * 60 * 24)));
      return {
        ticketsSold: m.ticketsSold,
        revenue: m.revenue,
        conversionRate: m.conversionRate,
        averageOrderValue: m.averageOrderValue,
        salesVelocity: m.ticketsSold / days,
      };
    })
    .filter((m): m is {
      ticketsSold: number;
      revenue: number;
      conversionRate: number;
      averageOrderValue: number;
      salesVelocity: number;
    } => m !== null);

  // Calculate benchmarks from similar events or use default benchmark data
  const benchmarks = {
    averageTicketsSold: similarMetrics.length > 0
      ? similarMetrics.reduce((sum, m) => sum + m.ticketsSold, 0) / similarMetrics.length
      : benchmark.averageAttendance * 0.7, // Assume 70% of attendance is tickets sold
    averageRevenue: similarMetrics.length > 0
      ? similarMetrics.reduce((sum, m) => sum + m.revenue, 0) / similarMetrics.length
      : benchmark.averageRevenue,
    averageConversionRate: similarMetrics.length > 0
      ? similarMetrics.reduce((sum, m) => sum + m.conversionRate, 0) / similarMetrics.length
      : 2.5, // Default 2.5% conversion rate
    averageOrderValue: similarMetrics.length > 0
      ? similarMetrics.reduce((sum, m) => sum + m.averageOrderValue, 0) / similarMetrics.length
      : benchmark.averageTicketPrice * 1.8, // Assume 1.8 tickets per order
    averageSalesVelocity: similarMetrics.length > 0
      ? similarMetrics.reduce((sum, m) => sum + m.salesVelocity, 0) / similarMetrics.length
      : benchmark.averageAttendance * 0.7 / 30, // Assume 30 days to sell
  };

  // Calculate percentiles
  const calculatePercentile = (value: number, values: number[]): number => {
    if (values.length === 0) return 50; // Default to 50th percentile if no data
    const sorted = [...values, value].sort((a, b) => a - b);
    const index = sorted.indexOf(value);
    return Math.round((index / (sorted.length - 1)) * 100);
  };

  const percentiles = {
    ticketsSold: calculatePercentile(metrics.ticketsSold, similarMetrics.map(m => m.ticketsSold)),
    revenue: calculatePercentile(metrics.revenue, similarMetrics.map(m => m.revenue)),
    conversionRate: calculatePercentile(metrics.conversionRate, similarMetrics.map(m => m.conversionRate)),
    averageOrderValue: calculatePercentile(metrics.averageOrderValue, similarMetrics.map(m => m.averageOrderValue)),
    salesVelocity: calculatePercentile(salesVelocity, similarMetrics.map(m => m.salesVelocity)),
  };

  // Calculate overall ranking
  const avgPercentile = (percentiles.ticketsSold + percentiles.revenue + percentiles.conversionRate + percentiles.averageOrderValue + percentiles.salesVelocity) / 5;
  const ranking: PerformanceComparison['ranking'] = 
    avgPercentile >= 90 ? 'top_10' :
    avgPercentile >= 75 ? 'top_25' :
    avgPercentile >= 55 ? 'above_average' :
    avgPercentile >= 45 ? 'average' :
    'below_average';

  // Identify areas for improvement
  const areasForImprovement: PerformanceComparison['areasForImprovement'] = [];

  // Check pricing
  if (metrics.averageOrderValue < benchmarks.averageOrderValue * 0.8) {
    areasForImprovement.push({
      area: 'pricing',
      severity: 'high',
      recommendation: `Your average order value (${formatCurrency(metrics.averageOrderValue)}) is ${Math.round((1 - metrics.averageOrderValue / benchmarks.averageOrderValue) * 100)}% below the benchmark (${formatCurrency(benchmarks.averageOrderValue)}). Consider offering ticket bundles or upselling premium tiers.`,
      impact: `Increasing AOV by 20% could generate an additional ${formatCurrency(metrics.ticketsSold * benchmarks.averageOrderValue * 0.2)} in revenue.`,
    });
  }

  // Check conversion rate
  if (metrics.conversionRate < benchmarks.averageConversionRate * 0.7) {
    areasForImprovement.push({
      area: 'conversion',
      severity: 'high',
      recommendation: `Your conversion rate (${metrics.conversionRate.toFixed(2)}%) is significantly below the benchmark (${benchmarks.averageConversionRate.toFixed(2)}%). Improve your event page with better imagery, clearer value proposition, and social proof.`,
      impact: `Reaching benchmark conversion could result in ${Math.round((benchmarks.averageConversionRate / metrics.conversionRate - 1) * metrics.ticketsSold)} more ticket sales.`,
    });
  } else if (metrics.conversionRate < benchmarks.averageConversionRate * 0.9) {
    areasForImprovement.push({
      area: 'conversion',
      severity: 'medium',
      recommendation: `Your conversion rate (${metrics.conversionRate.toFixed(2)}%) is slightly below the benchmark (${benchmarks.averageConversionRate.toFixed(2)}%). Add customer testimonials and urgency indicators to boost conversions.`,
      impact: `A 10% improvement could generate ${Math.round(metrics.ticketsSold * 0.1)} additional sales.`,
    });
  }

  // Check sales velocity
  if (salesVelocity < benchmarks.averageSalesVelocity * 0.7) {
    areasForImprovement.push({
      area: 'promotion',
      severity: 'high',
      recommendation: `Your sales velocity (${salesVelocity.toFixed(1)} tickets/day) is below the benchmark (${benchmarks.averageSalesVelocity.toFixed(1)} tickets/day). Increase promotional efforts through social media, email campaigns, and partnerships.`,
      impact: `Matching benchmark velocity could help you sell out ${Math.round((benchmarks.averageSalesVelocity - salesVelocity) * daysSinceCreation)} more tickets by event date.`,
    });
  } else if (salesVelocity < benchmarks.averageSalesVelocity * 0.9) {
    areasForImprovement.push({
      area: 'promotion',
      severity: 'medium',
      recommendation: `Your sales velocity is slightly below average. Consider running targeted ads or early-bird promotions to accelerate sales.`,
      impact: `A 15% boost in velocity could result in ${Math.round(salesVelocity * 0.15 * daysSinceCreation)} additional sales.`,
    });
  }

  // Check timing (if event hasn't happened yet)
  const eventDate = new Date(event.date);
  const now = new Date();
  if (eventDate > now) {
    const daysUntilEvent = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const eventDay = eventDate.toLocaleDateString('en-US', { weekday: 'long' });
    const eventTime = eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

    if (eventDay !== benchmark.topPerformingDay || Math.abs(parseInt(eventTime.split(':')[0]) - parseInt(benchmark.topPerformingTime.split(':')[0])) > 2) {
      areasForImprovement.push({
        area: 'timing',
        severity: 'low',
        recommendation: `Your event is scheduled for ${eventDay} at ${eventTime}. Similar events in ${event.city} perform best on ${benchmark.topPerformingDay} at ${benchmark.topPerformingTime}. Consider this for future events.`,
        impact: `Optimal timing can increase attendance by 15-25% based on historical data.`,
      });
    }
  }

  // Identify strengths
  const strengths: string[] = [];
  if (percentiles.revenue >= 75) {
    strengths.push(`Strong revenue performance - in the top ${100 - percentiles.revenue}% of similar events`);
  }
  if (percentiles.conversionRate >= 75) {
    strengths.push(`Excellent conversion rate - converting visitors to buyers better than ${percentiles.conversionRate}% of similar events`);
  }
  if (percentiles.averageOrderValue >= 75) {
    strengths.push(`High average order value - customers spending more than ${percentiles.averageOrderValue}% of similar events`);
  }
  if (percentiles.salesVelocity >= 75) {
    strengths.push(`Fast sales velocity - selling tickets faster than ${percentiles.salesVelocity}% of similar events`);
  }
  if (percentiles.ticketsSold >= 75) {
    strengths.push(`Strong ticket sales - outperforming ${percentiles.ticketsSold}% of similar events`);
  }

  if (strengths.length === 0) {
    strengths.push('Keep promoting your event to improve performance metrics');
  }

  return {
    eventId,
    eventName: event.title,
    category: event.category,
    city: event.city,
    metrics: {
      ticketsSold: metrics.ticketsSold,
      revenue: metrics.revenue,
      conversionRate: metrics.conversionRate,
      averageOrderValue: metrics.averageOrderValue,
      salesVelocity,
    },
    benchmarks,
    percentiles,
    ranking,
    areasForImprovement,
    strengths,
  };
}

/**
 * Seed benchmark data for common categories and cities
 */
// Benchmark data comes from the backend API

// ── Organizer History Learning Functions ─────────────────────────────────────

/**
 * Get the organizer ID for an event
 */
export function getEventOrganizer(eventId: string): string | null {
  return eventOrganizers[eventId] || null;
}

/**
 * Get all events by an organizer
 */
export function getOrganizerEvents(organizerId: string): string[] {
  return Object.entries(eventOrganizers)
    .filter(([_, orgId]) => orgId === organizerId)
    .map(([eventId]) => eventId);
}

/**
 * Record event completion and add to organizer history
 * Should be called when an event finishes
 */
export function recordEventCompletion(eventId: string): OrganizerEventHistory | null {
  const organizerId = eventOrganizers[eventId];
  if (!organizerId) return null;

  const event = getEventById(eventId);
  if (!event) return null;

  // Get event metrics
  const metrics = getEventMetrics(eventId);
  const eventOrders = Object.values(orders).filter(
    o => o.eventId === eventId && o.status === 'paid'
  );

  // Calculate metrics
  const ticketsSold = eventOrders.reduce((total, order) => {
    return total + order.items.reduce((sum, item) => sum + item.quantity, 0);
  }, 0);

  const revenue = eventOrders.reduce((total, order) => total + order.total, 0);
  const averageTicketPrice = ticketsSold > 0 ? revenue / ticketsSold : 0;

  // Create history record
  const historyRecord: OrganizerEventHistory = {
    eventId,
    organizerId,
    category: event.category,
    city: event.city,
    eventDate: event.date,
    ticketsSold,
    revenue,
    averageTicketPrice,
    conversionRate: metrics?.conversionRate || 0,
    attendanceRate: metrics?.attendanceRate || 0,
    completedAt: Date.now(),
  };

  // Store in history
  if (!organizerEventHistory[organizerId]) {
    organizerEventHistory[organizerId] = [];
  }
  organizerEventHistory[organizerId].push(historyRecord);

  // Update performance pattern
  updateOrganizerPerformancePattern(organizerId);

  return historyRecord;
}

/**
 * Get organizer's event history
 */
export function getOrganizerHistory(organizerId: string): OrganizerEventHistory[] {
  return organizerEventHistory[organizerId] || [];
}

/**
 * Calculate and update organizer performance pattern
 */
export function updateOrganizerPerformancePattern(organizerId: string): OrganizerPerformancePattern {
  const history = organizerEventHistory[organizerId] || [];

  if (history.length === 0) {
    // No history yet, return default pattern
    const pattern: OrganizerPerformancePattern = {
      organizerId,
      totalEvents: 0,
      categoriesHosted: {},
      citiesHosted: {},
      averageAttendance: 0,
      averageRevenue: 0,
      averageTicketPrice: 0,
      bestPerformingCategory: '',
      bestPerformingCity: '',
      typicalPriceRange: { low: 0, high: 0 },
      growthTrend: 'stable',
      lastUpdated: Date.now(),
    };
    organizerPerformancePatterns[organizerId] = pattern;
    return pattern;
  }

  // Calculate aggregates
  const totalEvents = history.length;
  const categoriesHosted: Record<string, number> = {};
  const citiesHosted: Record<string, number> = {};
  const categoryRevenue: Record<string, number> = {};
  const cityRevenue: Record<string, number> = {};

  let totalAttendance = 0;
  let totalRevenue = 0;
  let totalTicketPrice = 0;
  const prices: number[] = [];

  history.forEach(record => {
    // Count categories and cities
    categoriesHosted[record.category] = (categoriesHosted[record.category] || 0) + 1;
    citiesHosted[record.city] = (citiesHosted[record.city] || 0) + 1;

    // Track revenue by category and city
    categoryRevenue[record.category] = (categoryRevenue[record.category] || 0) + record.revenue;
    cityRevenue[record.city] = (cityRevenue[record.city] || 0) + record.revenue;

    // Accumulate totals
    totalAttendance += record.ticketsSold;
    totalRevenue += record.revenue;
    totalTicketPrice += record.averageTicketPrice;
    prices.push(record.averageTicketPrice);
  });

  // Calculate averages
  const averageAttendance = totalAttendance / totalEvents;
  const averageRevenue = totalRevenue / totalEvents;
  const averageTicketPrice = totalTicketPrice / totalEvents;

  // Find best performing category and city
  const bestPerformingCategory = Object.entries(categoryRevenue)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || '';
  const bestPerformingCity = Object.entries(cityRevenue)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || '';

  // Calculate typical price range (25th to 75th percentile)
  prices.sort((a, b) => a - b);
  const q1Index = Math.floor(prices.length * 0.25);
  const q3Index = Math.floor(prices.length * 0.75);
  const typicalPriceRange = {
    low: prices[q1Index] || 0,
    high: prices[q3Index] || prices[prices.length - 1] || 0,
  };

  // Determine growth trend (compare recent vs older events)
  let growthTrend: 'improving' | 'stable' | 'declining' = 'stable';
  if (history.length >= 3) {
    const recentCount = Math.min(3, Math.floor(history.length / 2));
    const recentEvents = history.slice(-recentCount);
    const olderEvents = history.slice(0, recentCount);

    const recentAvgRevenue = recentEvents.reduce((sum, e) => sum + e.revenue, 0) / recentEvents.length;
    const olderAvgRevenue = olderEvents.reduce((sum, e) => sum + e.revenue, 0) / olderEvents.length;

    const growthRate = (recentAvgRevenue - olderAvgRevenue) / olderAvgRevenue;
    if (growthRate > 0.15) {
      growthTrend = 'improving';
    } else if (growthRate < -0.15) {
      growthTrend = 'declining';
    }
  }

  const pattern: OrganizerPerformancePattern = {
    organizerId,
    totalEvents,
    categoriesHosted,
    citiesHosted,
    averageAttendance,
    averageRevenue,
    averageTicketPrice,
    bestPerformingCategory,
    bestPerformingCity,
    typicalPriceRange,
    growthTrend,
    lastUpdated: Date.now(),
  };

  organizerPerformancePatterns[organizerId] = pattern;
  return pattern;
}

/**
 * Get organizer performance pattern
 */
export function getOrganizerPerformancePattern(organizerId: string): OrganizerPerformancePattern | null {
  return organizerPerformancePatterns[organizerId] || null;
}

/**
 * Generate personalized insights based on organizer history
 * Enhances existing insight generation with organizer-specific patterns
 */
export function generatePersonalizedInsights(eventId: string, organizerId: string): EventInsight[] {
  const insights: EventInsight[] = [];
  const pattern = getOrganizerPerformancePattern(organizerId);
  
  if (!pattern || pattern.totalEvents < 2) {
    // Not enough history for personalization
    return insights;
  }

  const event = getEventById(eventId);
  if (!event) return insights;

  const history = getOrganizerHistory(organizerId);

  // Insight 1: Category performance comparison
  const categoryHistory = history.filter(h => h.category === event.category);
  if (categoryHistory.length > 0) {
    const avgCategoryRevenue = categoryHistory.reduce((sum, h) => sum + h.revenue, 0) / categoryHistory.length;
    const avgCategoryAttendance = categoryHistory.reduce((sum, h) => sum + h.ticketsSold, 0) / categoryHistory.length;

    insights.push({
      eventId,
      type: 'audience_targeting',
      title: `Your ${event.category} Event Track Record`,
      description: `Based on your ${categoryHistory.length} previous ${event.category} events, you typically attract ${Math.round(avgCategoryAttendance)} attendees and generate ${Math.round(avgCategoryRevenue).toLocaleString()} in revenue. ${pattern.bestPerformingCategory === event.category ? 'This is your best-performing category!' : `Your best category is ${pattern.bestPerformingCategory}.`}`,
      confidence: 0.85,
      data: {
        categoryHistory: categoryHistory.length,
        avgCategoryRevenue,
        avgCategoryAttendance,
        isBestCategory: pattern.bestPerformingCategory === event.category,
      },
      createdAt: Date.now(),
    });
  }

  // Insight 2: City performance comparison
  const cityHistory = history.filter(h => h.city === event.city);
  if (cityHistory.length > 0) {
    const avgCityRevenue = cityHistory.reduce((sum, h) => sum + h.revenue, 0) / cityHistory.length;
    const avgCityAttendance = cityHistory.reduce((sum, h) => sum + h.ticketsSold, 0) / cityHistory.length;

    insights.push({
      eventId,
      type: 'city_benchmark',
      title: `Your Performance in ${event.city}`,
      description: `You've hosted ${cityHistory.length} events in ${event.city} with an average of ${Math.round(avgCityAttendance)} attendees and ${Math.round(avgCityRevenue).toLocaleString()} revenue. ${pattern.bestPerformingCity === event.city ? 'This is your strongest market!' : `Consider expanding to ${pattern.bestPerformingCity}, your best-performing city.`}`,
      confidence: 0.85,
      data: {
        cityHistory: cityHistory.length,
        avgCityRevenue,
        avgCityAttendance,
        isBestCity: pattern.bestPerformingCity === event.city,
      },
      createdAt: Date.now(),
    });
  }

  // Insight 3: Pricing recommendation based on organizer's history
  const currentMetrics = getEventMetrics(eventId);
  const eventOrders = Object.values(orders).filter(
    o => o.eventId === eventId && o.status === 'paid'
  );
  
  if (eventOrders.length > 0) {
    const currentRevenue = eventOrders.reduce((sum, o) => sum + o.total, 0);
    const currentTickets = eventOrders.reduce((sum, o) => {
      return sum + o.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
    }, 0);
    const currentAvgPrice = currentTickets > 0 ? currentRevenue / currentTickets : 0;

    if (currentAvgPrice < pattern.typicalPriceRange.low * 0.9) {
      insights.push({
        eventId,
        type: 'pricing_recommendation',
        title: 'Pricing Below Your Typical Range',
        description: `Your current average ticket price (${Math.round(currentAvgPrice).toLocaleString()}) is below your typical range (${Math.round(pattern.typicalPriceRange.low).toLocaleString()} - ${Math.round(pattern.typicalPriceRange.high).toLocaleString()}). Based on your track record, you could potentially increase prices for future events.`,
        confidence: 0.75,
        data: {
          currentAvgPrice,
          typicalLow: pattern.typicalPriceRange.low,
          typicalHigh: pattern.typicalPriceRange.high,
          recommendation: 'consider_increase',
        },
        createdAt: Date.now(),
      });
    } else if (currentAvgPrice > pattern.typicalPriceRange.high * 1.1) {
      insights.push({
        eventId,
        type: 'pricing_recommendation',
        title: 'Premium Pricing Strategy',
        description: `Your current average ticket price (${Math.round(currentAvgPrice).toLocaleString()}) is above your typical range (${Math.round(pattern.typicalPriceRange.low).toLocaleString()} - ${Math.round(pattern.typicalPriceRange.high).toLocaleString()}). Monitor sales velocity to ensure this premium pricing doesn't impact attendance.`,
        confidence: 0.75,
        data: {
          currentAvgPrice,
          typicalLow: pattern.typicalPriceRange.low,
          typicalHigh: pattern.typicalPriceRange.high,
          recommendation: 'monitor_velocity',
        },
        createdAt: Date.now(),
      });
    }
  }

  // Insight 4: Growth trend insight
  if (pattern.growthTrend === 'improving') {
    insights.push({
      eventId,
      type: 'revenue_forecast',
      title: 'Positive Growth Trajectory',
      description: `Your recent events show improving performance! Your average revenue has increased by over 15% compared to earlier events. Keep up the momentum with consistent promotion and audience engagement.`,
      confidence: 0.8,
      data: {
        growthTrend: pattern.growthTrend,
        totalEvents: pattern.totalEvents,
        averageRevenue: pattern.averageRevenue,
      },
      createdAt: Date.now(),
    });
  } else if (pattern.growthTrend === 'declining') {
    insights.push({
      eventId,
      type: 'promotion_timing',
      title: 'Performance Needs Attention',
      description: `Your recent events show declining performance compared to earlier ones. Consider refreshing your marketing strategy, exploring new audience segments, or adjusting pricing. Review what worked well in your best-performing events (${pattern.bestPerformingCategory} in ${pattern.bestPerformingCity}).`,
      confidence: 0.8,
      data: {
        growthTrend: pattern.growthTrend,
        totalEvents: pattern.totalEvents,
        bestCategory: pattern.bestPerformingCategory,
        bestCity: pattern.bestPerformingCity,
      },
      createdAt: Date.now(),
    });
  }

  // Insight 5: Experience-based confidence boost
  if (pattern.totalEvents >= 5) {
    const similarEvents = history.filter(
      h => h.category === event.category && h.city === event.city
    );
    
    if (similarEvents.length >= 2) {
      const avgSimilarRevenue = similarEvents.reduce((sum, h) => sum + h.revenue, 0) / similarEvents.length;
      const avgSimilarAttendance = similarEvents.reduce((sum, h) => sum + h.ticketsSold, 0) / similarEvents.length;

      insights.push({
        eventId,
        type: 'attendance_prediction',
        title: 'Leveraging Your Experience',
        description: `You've successfully hosted ${similarEvents.length} ${event.category} events in ${event.city}. Based on this experience, expect around ${Math.round(avgSimilarAttendance)} attendees and ${Math.round(avgSimilarRevenue).toLocaleString()} in revenue. Your track record gives you a competitive advantage!`,
        confidence: 0.9,
        data: {
          similarEventsCount: similarEvents.length,
          predictedAttendance: Math.round(avgSimilarAttendance),
          predictedRevenue: Math.round(avgSimilarRevenue),
          experienceLevel: 'expert',
        },
        createdAt: Date.now(),
      });
    }
  }

  return insights;
}

/**
 * Enhanced insight generation that includes organizer history
 * This wraps the existing insight generation and adds personalized insights
 */
export function generateEnhancedInsights(eventId: string): EventInsight[] {
  const organizerId = getEventOrganizer(eventId);
  
  // Get standard insights (these are generated by the existing functions)
  const standardInsights = getEventInsights(eventId);
  
  // If we have an organizer, add personalized insights
  if (organizerId) {
    const personalizedInsights = generatePersonalizedInsights(eventId, organizerId);
    
    // Merge and deduplicate by type (prefer personalized over standard)
    const insightMap = new Map<string, EventInsight>();
    
    // Add standard insights first
    standardInsights.forEach(insight => {
      insightMap.set(insight.type, insight);
    });
    
    // Override with personalized insights (higher confidence)
    personalizedInsights.forEach(insight => {
      const existing = insightMap.get(insight.type);
      if (!existing || insight.confidence > existing.confidence) {
        insightMap.set(insight.type, insight);
      }
    });
    
    return Array.from(insightMap.values());
  }
  
  return standardInsights;
}

// ── City Statistics ──────────────────────────────────────────────────────────

export type CityStats = {
  city: string;
  totalEvents: number;
  upcomingEvents: number;
  totalAttendees: number;
  popularCategories: Array<{ category: string; count: number }>;
  trendingEvents: string[]; // Event IDs
};

const cityStatsCache: Record<string, { stats: CityStats; cachedAt: number }> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Calculate city statistics
 * Includes total events, upcoming events, attendees, popular categories, and trending events
 */
export function getCityStats(city: string): CityStats {
  // Check cache first
  const cached = cityStatsCache[city];
  if (cached && Date.now() - cached.cachedAt < CACHE_DURATION) {
    return cached.stats;
  }

  // Filter events for this city
  const cityEvents = events.filter(e => e.city === city);
  const now = Date.now();
  
  // Calculate upcoming events
  const upcomingEvents = cityEvents.filter(e => {
    const eventDate = new Date(e.date).getTime();
    return eventDate >= now;
  });

  // Calculate total attendees (from paid orders)
  let totalAttendees = 0;
  cityEvents.forEach(event => {
    const eventOrders = Object.values(orders).filter(
      o => o.eventId === event.id && o.status === 'paid'
    );
    eventOrders.forEach(order => {
      totalAttendees += order.items.reduce((sum, item) => sum + item.quantity, 0);
    });
  });

  // Calculate popular categories
  const categoryCount: Record<string, number> = {};
  cityEvents.forEach(event => {
    categoryCount[event.category] = (categoryCount[event.category] || 0) + 1;
  });
  
  const popularCategories = Object.entries(categoryCount)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  // Calculate trending events (based on views, saves, and recent ticket sales)
  const eventScores = upcomingEvents.map(event => {
    const metrics = getEventMetrics(event.id);
    const recentOrders = Object.values(orders).filter(
      o => o.eventId === event.id && 
      o.status === 'paid' && 
      o.createdAt > now - (7 * 24 * 60 * 60 * 1000) // Last 7 days
    );
    
    // Calculate trending score
    const viewScore = metrics ? metrics.views * 1 : 0;
    const saveScore = metrics ? metrics.saves * 5 : 0;
    const recentSalesScore = recentOrders.length * 10;
    
    return {
      eventId: event.id,
      score: viewScore + saveScore + recentSalesScore,
    };
  });

  const trendingEvents = eventScores
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(e => e.eventId);

  const stats: CityStats = {
    city,
    totalEvents: cityEvents.length,
    upcomingEvents: upcomingEvents.length,
    totalAttendees,
    popularCategories,
    trendingEvents,
  };

  // Cache the result
  cityStatsCache[city] = {
    stats,
    cachedAt: Date.now(),
  };

  return stats;
}

/**
 * Get all cities with events
 */
export function getCitiesWithEvents(): string[] {
  const cities = new Set<string>();
  events.forEach(event => cities.add(event.city));
  return Array.from(cities).sort();
}

/**
 * Clear city stats cache (useful when events are added/updated)
 */
export function clearCityStatsCache(city?: string) {
  if (city) {
    delete cityStatsCache[city];
  } else {
    Object.keys(cityStatsCache).forEach(key => delete cityStatsCache[key]);
  }
}

// ── Geo-Targeted Notification Functions ──────────────────────────────────────

/**
 * Get or create notification preferences for a user
 */
export function getNotificationPreferences(userId: string): NotificationPreferences {
  if (!notificationPreferences[userId]) {
    notificationPreferences[userId] = {
      userId,
      geoNotificationsEnabled: true, // Enabled by default
      notificationRadius: 10, // 10km default radius
      categories: [], // Empty means all categories
      updatedAt: Date.now(),
    };
  }
  return notificationPreferences[userId];
}

/**
 * Update notification preferences for a user
 */
export function updateNotificationPreferences(
  userId: string,
  updates: Partial<Omit<NotificationPreferences, 'userId' | 'updatedAt'>>
): NotificationPreferences {
  const prefs = getNotificationPreferences(userId);
  Object.assign(prefs, updates, { updatedAt: Date.now() });
  return prefs;
}

/**
 * Update user location
 */
export function updateUserLocation(
  userId: string,
  latitude: number,
  longitude: number,
  city: string
): UserLocation {
  const location: UserLocation = {
    userId,
    latitude,
    longitude,
    city,
    lastUpdated: Date.now(),
  };
  userLocations[userId] = location;
  return location;
}

/**
 * Get user location
 */
export function getUserLocation(userId: string): UserLocation | null {
  return userLocations[userId] || null;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Create a geo-targeted notification for a user
 */
export function createGeoNotification(
  userId: string,
  eventId: string,
  title: string,
  message: string,
  distance: number
): GeoNotification {
  const notification: GeoNotification = {
    id: id("geonot"),
    userId,
    eventId,
    title,
    message,
    distance,
    sent: false,
    createdAt: Date.now(),
  };

  if (!geoNotifications[userId]) {
    geoNotifications[userId] = [];
  }
  geoNotifications[userId].push(notification);

  return notification;
}

/**
 * Mark a geo notification as sent
 */
export function markGeoNotificationSent(notificationId: string, userId: string): boolean {
  const userNotifications = geoNotifications[userId];
  if (!userNotifications) return false;

  const notification = userNotifications.find(n => n.id === notificationId);
  if (!notification) return false;

  notification.sent = true;
  notification.sentAt = Date.now();
  return true;
}

/**
 * Get geo notifications for a user
 */
export function getGeoNotifications(userId: string, unsentOnly = false): GeoNotification[] {
  const userNotifications = geoNotifications[userId] || [];
  
  if (unsentOnly) {
    return userNotifications.filter(n => !n.sent).sort((a, b) => b.createdAt - a.createdAt);
  }
  
  return userNotifications.sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * Check for nearby events and create notifications
 * This should be called periodically or when new events are created
 */
export function checkAndCreateGeoNotifications(): {
  created: number;
  usersNotified: Set<string>;
} {
  const created = 0;
  const usersNotified = new Set<string>();
  const now = Date.now();

  // Get all users with locations and enabled notifications
  const eligibleUsers = Object.values(userLocations).filter(location => {
    const prefs = getNotificationPreferences(location.userId);
    return prefs.geoNotificationsEnabled;
  });

  // Get all upcoming events
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.date).getTime();
    return eventDate > now;
  });

  // Check each user against each event
  for (const userLocation of eligibleUsers) {
    const prefs = getNotificationPreferences(userLocation.userId);
    const existingNotifications = getGeoNotifications(userLocation.userId);
    const notifiedEventIds = new Set(existingNotifications.map(n => n.eventId));

    for (const event of upcomingEvents) {
      // Skip if already notified about this event
      if (notifiedEventIds.has(event.id)) continue;

      // Skip if event doesn't have location data
      if (!event.latitude || !event.longitude) continue;

      // Calculate distance
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        event.latitude,
        event.longitude
      );

      // Check if within notification radius
      if (distance > prefs.notificationRadius) continue;

      // Check category filter
      if (prefs.categories.length > 0 && !prefs.categories.includes(event.category)) {
        continue;
      }

      // Check price filter
      const minPrice = event.tickets?.General?.price || event.tickets?.VIP?.price || 0;
      if (prefs.minPrice !== undefined && minPrice < prefs.minPrice) continue;
      if (prefs.maxPrice !== undefined && minPrice > prefs.maxPrice) continue;

      // Create notification
      const title = `New event near you: ${event.title}`;
      const message = `${event.title} is happening ${distance.toFixed(1)}km away on ${new Date(event.date).toLocaleDateString()}`;
      
      createGeoNotification(userLocation.userId, event.id, title, message, distance);
      usersNotified.add(userLocation.userId);
    }
  }

  return { created: usersNotified.size, usersNotified };
}

/**
 * Get nearby events for a user based on their location and preferences
 */
export function getNearbyEventsForUser(userId: string): Array<Event & { distance: number }> {
  const userLocation = getUserLocation(userId);
  if (!userLocation) return [];

  const prefs = getNotificationPreferences(userId);
  const now = Date.now();

  // Get all upcoming events with location data
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.date).getTime();
    return eventDate > now && event.latitude && event.longitude;
  });

  // Calculate distances and filter
  const nearbyEvents = upcomingEvents
    .map(event => {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        event.latitude!,
        event.longitude!
      );
      return { ...event, distance };
    })
    .filter(event => {
      // Within radius
      if (event.distance > prefs.notificationRadius) return false;

      // Category filter
      if (prefs.categories.length > 0 && !prefs.categories.includes(event.category)) {
        return false;
      }

      // Price filter
      const minPrice = event.tickets?.General?.price || event.tickets?.VIP?.price || 0;
      if (prefs.minPrice !== undefined && minPrice < prefs.minPrice) return false;
      if (prefs.maxPrice !== undefined && minPrice > prefs.maxPrice) return false;

      return true;
    })
    .sort((a, b) => a.distance - b.distance);

  return nearbyEvents;
}

// ── User Profile Functions ───────────────────────────────────────────────────

/**
 * Create or update a user profile
 */
export function createOrUpdateUserProfile(userId: string, data: Partial<Omit<UserProfile, 'userId' | 'createdAt' | 'updatedAt'>>): UserProfile {
  const now = Date.now();
  
  if (userProfiles[userId]) {
    // Update existing profile
    userProfiles[userId] = {
      ...userProfiles[userId],
      ...data,
      updatedAt: now,
    };
  } else {
    // Create new profile
    userProfiles[userId] = {
      userId,
      displayName: data.displayName || `User ${userId.slice(0, 8)}`,
      interests: data.interests || [],
      eventsAttended: data.eventsAttended || [],
      eventsOrganized: data.eventsOrganized || [],
      followers: 0,
      following: 0,
      ...data,
      createdAt: now,
      updatedAt: now,
    };
  }
  
  return userProfiles[userId];
}

/**
 * Get a user profile by ID
 */
export function getUserProfile(userId: string): UserProfile | null {
  return userProfiles[userId] || null;
}

/**
 * Add an event to user's attendance history
 */
export function addEventToAttendanceHistory(userId: string, eventId: string): UserProfile {
  const profile = userProfiles[userId] || createOrUpdateUserProfile(userId, {});
  
  if (!profile.eventsAttended.includes(eventId)) {
    profile.eventsAttended.push(eventId);
    profile.updatedAt = Date.now();
  }
  
  return profile;
}

/**
 * Add an event to user's organized events
 */
export function addEventToOrganizedHistory(userId: string, eventId: string): UserProfile {
  const profile = userProfiles[userId] || createOrUpdateUserProfile(userId, {});
  
  if (!profile.eventsOrganized.includes(eventId)) {
    profile.eventsOrganized.push(eventId);
    profile.updatedAt = Date.now();
  }
  
  return profile;
}

/**
 * Get user's attended events with details
 */
export function getUserAttendedEvents(userId: string): Event[] {
  const profile = userProfiles[userId];
  if (!profile) return [];
  
  return profile.eventsAttended
    .map(eventId => getEventById(eventId))
    .filter((event): event is Event => event !== null);
}

/**
 * Get user's organized events with details
 */
export function getUserOrganizedEvents(userId: string): Event[] {
  const profile = userProfiles[userId];
  if (!profile) return [];
  
  return profile.eventsOrganized
    .map(eventId => getEventById(eventId))
    .filter((event): event is Event => event !== null);
}

/**
 * Follow a user or organizer
 */
export function followUser(followerId: string, followingId: string, type: 'user' | 'organizer' = 'user'): Follow {
  // Check if already following
  const existing = follows.find(
    f => f.followerId === followerId && f.followingId === followingId
  );
  
  if (existing) {
    return existing;
  }
  
  const follow: Follow = {
    followerId,
    followingId,
    type,
    createdAt: Date.now(),
  };
  
  follows.push(follow);
  
  // Update follower/following counts
  const followerProfile = userProfiles[followerId];
  const followingProfile = userProfiles[followingId];
  
  if (followerProfile) {
    followerProfile.following++;
    followerProfile.updatedAt = Date.now();
  }
  
  if (followingProfile) {
    followingProfile.followers++;
    followingProfile.updatedAt = Date.now();
  }

  // Notify the followed user
  notifyUserOfNewFollower(followingId, followerId);
  
  return follow;
}

/**
 * Unfollow a user or organizer
 */
export function unfollowUser(followerId: string, followingId: string): boolean {
  const index = follows.findIndex(
    f => f.followerId === followerId && f.followingId === followingId
  );
  
  if (index === -1) {
    return false;
  }
  
  follows.splice(index, 1);
  
  // Update follower/following counts
  const followerProfile = userProfiles[followerId];
  const followingProfile = userProfiles[followingId];
  
  if (followerProfile && followerProfile.following > 0) {
    followerProfile.following--;
    followerProfile.updatedAt = Date.now();
  }
  
  if (followingProfile && followingProfile.followers > 0) {
    followingProfile.followers--;
    followingProfile.updatedAt = Date.now();
  }
  
  return true;
}

/**
 * Check if a user is following another user
 */
export function isFollowing(followerId: string, followingId: string): boolean {
  return follows.some(
    f => f.followerId === followerId && f.followingId === followingId
  );
}

/**
 * Get all users that a user is following
 */
export function getFollowing(userId: string): UserProfile[] {
  const followingIds = follows
    .filter(f => f.followerId === userId)
    .map(f => f.followingId);
  
  return followingIds
    .map(id => userProfiles[id])
    .filter((profile): profile is UserProfile => profile !== undefined);
}

/**
 * Get all followers of a user
 */
export function getFollowers(userId: string): UserProfile[] {
  const followerIds = follows
    .filter(f => f.followingId === userId)
    .map(f => f.followerId);
  
  return followerIds
    .map(id => userProfiles[id])
    .filter((profile): profile is UserProfile => profile !== undefined);
}

// ── Notification Functions ──────────────────────────────────────────────────

/**
 * Create a notification for a user
 */
export function createNotification(
  userId: string,
  type: Notification['type'],
  title: string,
  message: string,
  eventId?: string,
  fromUserId?: string
): Notification {
  const notification: Notification = {
    id: id('notif'),
    userId,
    type,
    title,
    message,
    eventId,
    fromUserId,
    read: false,
    createdAt: Date.now(),
  };

  if (!notifications[userId]) {
    notifications[userId] = [];
  }

  notifications[userId].push(notification);
  return notification;
}

/**
 * Get notifications for a user
 */
export function getNotifications(userId: string, unreadOnly = false): Notification[] {
  const userNotifications = notifications[userId] || [];
  
  if (unreadOnly) {
    return userNotifications.filter(n => !n.read);
  }
  
  return userNotifications.sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * Mark a user notification as read
 */
export function markUserNotificationRead(notificationId: string, userId: string): boolean {
  const userNotifications = notifications[userId];
  if (!userNotifications) return false;

  const notification = userNotifications.find(n => n.id === notificationId);
  if (!notification) return false;

  notification.read = true;
  return true;
}

/**
 * Mark all user notifications as read
 */
export function markAllUserNotificationsRead(userId: string): number {
  const userNotifications = notifications[userId];
  if (!userNotifications) return 0;

  let count = 0;
  userNotifications.forEach(n => {
    if (!n.read) {
      n.read = true;
      count++;
    }
  });

  return count;
}

/**
 * Delete a notification
 */
export function deleteNotification(notificationId: string, userId: string): boolean {
  const userNotifications = notifications[userId];
  if (!userNotifications) return false;

  const index = userNotifications.findIndex(n => n.id === notificationId);
  if (index === -1) return false;

  userNotifications.splice(index, 1);
  return true;
}

/**
 * Notify followers when an organizer creates a new event
 * This should be called when a new event is created
 */
export function notifyFollowersOfNewEvent(organizerId: string, eventId: string): number {
  const event = getEventById(eventId);
  if (!event) return 0;

  const organizerProfile = userProfiles[organizerId];
  const organizerName = organizerProfile?.displayName || 'An organizer you follow';

  // Get all followers of this organizer
  const followerProfiles = getFollowers(organizerId);
  
  let notifiedCount = 0;
  followerProfiles.forEach(follower => {
    // Only notify if they're following as an organizer
    const followRelation = follows.find(
      f => f.followerId === follower.userId && f.followingId === organizerId
    );
    
    if (followRelation && followRelation.type === 'organizer') {
      createNotification(
        follower.userId,
        'follow_event',
        `${organizerName} created a new event`,
        `${event.title} - ${new Date(event.date).toLocaleDateString()}`,
        eventId,
        organizerId
      );
      notifiedCount++;
    }
  });

  return notifiedCount;
}

/**
 * Notify a user when someone follows them
 */
export function notifyUserOfNewFollower(followedUserId: string, followerId: string): void {
  const followerProfile = userProfiles[followerId];
  const followerName = followerProfile?.displayName || 'Someone';

  createNotification(
    followedUserId,
    'follow_user',
    'New follower',
    `${followerName} started following you`,
    undefined,
    followerId
  );
}

/**
 * Update user interests
 */
export function updateUserInterests(userId: string, interests: string[]): UserProfile {
  const profile = userProfiles[userId] || createOrUpdateUserProfile(userId, {});
  profile.interests = interests;
  profile.updatedAt = Date.now();
  return profile;
}

/**
 * Get all user profiles (for admin/search purposes)
 */
export function getAllUserProfiles(): UserProfile[] {
  return Object.values(userProfiles);
}

// ── Team Collaboration Types ─────────────────────────────────────────────────

export type TeamRole = 'owner' | 'editor' | 'viewer';

export type TeamPermissions = {
  canEditEvent: boolean;
  canManageTickets: boolean;
  canManageBudget: boolean;
  canManagePlanning: boolean;
  canManageVendors: boolean;
  canManageDocuments: boolean;
  canManageTeam: boolean;
  canViewAnalytics: boolean;
};

export type TeamMember = {
  userId: string;
  eventId: string;
  role: TeamRole;
  permissions: TeamPermissions;
  invitedBy: string;
  joinedAt: number;
};

export type TeamInvitationStatus = 'pending' | 'accepted' | 'declined' | 'expired';

export type TeamInvitation = {
  id: string;
  eventId: string;
  email: string;
  role: TeamRole;
  status: TeamInvitationStatus;
  invitedBy: string;
  createdAt: number;
  expiresAt: number;
};

export type ActivityAction = 
  | 'event_created'
  | 'event_updated'
  | 'ticket_created'
  | 'ticket_updated'
  | 'budget_item_added'
  | 'budget_item_updated'
  | 'task_created'
  | 'task_completed'
  | 'document_uploaded'
  | 'vendor_invited'
  | 'team_member_added'
  | 'team_member_removed'
  | 'team_member_role_changed';

export type ActivityLog = {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  action: ActivityAction;
  details: string;
  metadata?: Record<string, any>;
  timestamp: number;
};

// Team collaboration stores
const teamMembers: Record<string, TeamMember[]> = {}; // eventId -> members
const teamInvitations: Record<string, TeamInvitation[]> = {}; // eventId -> invitations
const activityLogs: Record<string, ActivityLog[]> = {}; // eventId -> logs

/**
 * Get default permissions for a team role
 */
function getDefaultTeamPermissions(role: TeamRole): TeamPermissions {
  switch (role) {
    case 'owner':
      return {
        canEditEvent: true,
        canManageTickets: true,
        canManageBudget: true,
        canManagePlanning: true,
        canManageVendors: true,
        canManageDocuments: true,
        canManageTeam: true,
        canViewAnalytics: true,
      };
    case 'editor':
      return {
        canEditEvent: true,
        canManageTickets: true,
        canManageBudget: true,
        canManagePlanning: true,
        canManageVendors: true,
        canManageDocuments: true,
        canManageTeam: false,
        canViewAnalytics: true,
      };
    case 'viewer':
      return {
        canEditEvent: false,
        canManageTickets: false,
        canManageBudget: false,
        canManagePlanning: false,
        canManageVendors: false,
        canManageDocuments: false,
        canManageTeam: false,
        canViewAnalytics: true,
      };
  }
}

/**
 * Create a team invitation
 */
export function createTeamInvitation(
  eventId: string,
  email: string,
  role: TeamRole,
  invitedBy: string
): TeamInvitation {
  const invitation: TeamInvitation = {
    id: id('invite'),
    eventId,
    email,
    role,
    status: 'pending',
    invitedBy,
    createdAt: Date.now(),
    expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
  };

  if (!teamInvitations[eventId]) {
    teamInvitations[eventId] = [];
  }
  teamInvitations[eventId].push(invitation);

  // Log activity
  logActivity(eventId, invitedBy, 'team_member_added', `Invited ${email} as ${role}`, { email, role });

  return invitation;
}

/**
 * Get team invitations for an event
 */
export function getTeamInvitations(eventId: string, status?: TeamInvitationStatus): TeamInvitation[] {
  const invitations = teamInvitations[eventId] || [];
  
  if (status) {
    return invitations.filter(inv => inv.status === status);
  }
  
  return invitations.sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * Accept a team invitation
 */
export function acceptTeamInvitation(invitationId: string, userId: string): TeamMember | null {
  // Find the invitation
  let invitation: TeamInvitation | undefined;
  let eventId: string | undefined;

  for (const [eid, invites] of Object.entries(teamInvitations)) {
    const found = invites.find(inv => inv.id === invitationId);
    if (found) {
      invitation = found;
      eventId = eid;
      break;
    }
  }

  if (!invitation || !eventId) return null;
  if (invitation.status !== 'pending') return null;
  if (invitation.expiresAt < Date.now()) {
    invitation.status = 'expired';
    return null;
  }

  // Mark invitation as accepted
  invitation.status = 'accepted';

  // Add team member
  const member: TeamMember = {
    userId,
    eventId,
    role: invitation.role,
    permissions: getDefaultTeamPermissions(invitation.role),
    invitedBy: invitation.invitedBy,
    joinedAt: Date.now(),
  };

  if (!teamMembers[eventId]) {
    teamMembers[eventId] = [];
  }
  teamMembers[eventId].push(member);

  // Log activity
  const userProfile = userProfiles[userId];
  const userName = userProfile?.displayName || 'Team member';
  logActivity(eventId, userId, 'team_member_added', `${userName} joined the team as ${invitation.role}`);

  return member;
}

/**
 * Decline a team invitation
 */
export function declineTeamInvitation(invitationId: string): boolean {
  for (const invites of Object.values(teamInvitations)) {
    const invitation = invites.find(inv => inv.id === invitationId);
    if (invitation && invitation.status === 'pending') {
      invitation.status = 'declined';
      return true;
    }
  }
  return false;
}

/**
 * Get team members for an event
 */
export function getTeamMembers(eventId: string): TeamMember[] {
  return teamMembers[eventId] || [];
}

/**
 * Get team member by user ID and event ID
 */
export function getTeamMember(eventId: string, userId: string): TeamMember | undefined {
  const members = teamMembers[eventId] || [];
  return members.find(m => m.userId === userId);
}

/**
 * Update team member role
 */
export function updateTeamMemberRole(
  eventId: string,
  userId: string,
  newRole: TeamRole,
  updatedBy: string
): TeamMember | null {
  const members = teamMembers[eventId];
  if (!members) return null;

  const member = members.find(m => m.userId === userId);
  if (!member) return null;

  const oldRole = member.role;
  member.role = newRole;
  member.permissions = getDefaultTeamPermissions(newRole);

  // Log activity
  const userProfile = userProfiles[userId];
  const userName = userProfile?.displayName || 'Team member';
  logActivity(
    eventId,
    updatedBy,
    'team_member_role_changed',
    `Changed ${userName}'s role from ${oldRole} to ${newRole}`,
    { userId, oldRole, newRole }
  );

  return member;
}

/**
 * Remove team member
 */
export function removeTeamMember(
  eventId: string,
  userId: string,
  removedBy: string
): boolean {
  const members = teamMembers[eventId];
  if (!members) return false;

  const index = members.findIndex(m => m.userId === userId);
  if (index === -1) return false;

  const member = members[index];
  members.splice(index, 1);

  // Log activity
  const userProfile = userProfiles[userId];
  const userName = userProfile?.displayName || 'Team member';
  logActivity(
    eventId,
    removedBy,
    'team_member_removed',
    `Removed ${userName} from the team`,
    { userId, role: member.role }
  );

  return true;
}

/**
 * Check if user has permission for an event
 */
export function hasEventPermission(
  eventId: string,
  userId: string,
  permission: keyof TeamPermissions
): boolean {
  // Check if user is the event organizer (owner)
  const event = getEventById(eventId);
  if (event && eventOrganizers[eventId] === userId) {
    return true; // Organizers have all permissions
  }

  // Check team member permissions
  const member = getTeamMember(eventId, userId);
  if (!member) return false;

  return member.permissions[permission];
}

/**
 * Log an activity for an event
 */
export function logActivity(
  eventId: string,
  userId: string,
  action: ActivityAction,
  details: string,
  metadata?: Record<string, any>
): ActivityLog {
  const userProfile = userProfiles[userId];
  const userName = userProfile?.displayName || 'User';

  const log: ActivityLog = {
    id: id('activity'),
    eventId,
    userId,
    userName,
    action,
    details,
    metadata,
    timestamp: Date.now(),
  };

  if (!activityLogs[eventId]) {
    activityLogs[eventId] = [];
  }
  activityLogs[eventId].push(log);

  return log;
}

/**
 * Get activity logs for an event
 */
export function getActivityLogs(
  eventId: string,
  limit?: number,
  action?: ActivityAction
): ActivityLog[] {
  const logs = activityLogs[eventId] || [];
  
  let filtered = logs;
  if (action) {
    filtered = logs.filter(log => log.action === action);
  }

  const sorted = filtered.sort((a, b) => b.timestamp - a.timestamp);
  
  if (limit) {
    return sorted.slice(0, limit);
  }
  
  return sorted;
}

/**
 * Get events where user is a team member
 */
export function getUserTeamEvents(userId: string): string[] {
  const eventIds: string[] = [];
  
  for (const [eventId, members] of Object.entries(teamMembers)) {
    if (members.some(m => m.userId === userId)) {
      eventIds.push(eventId);
    }
  }
  
  return eventIds;
}

// ── Social Media Account Types and Functions ─────────────────────────────────

export type SocialPlatform = 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok';

export type SocialAccount = {
  platform: SocialPlatform;
  connected: boolean;
  accountName?: string;
  accountId?: string;
  connectedAt?: number;
  credentials?: {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: number;
  };
};

// Storage for social accounts per organizer
const socialAccounts: Record<string, SocialAccount[]> = {};

/**
 * Connect a social media account for an organizer
 */
export function connectSocialAccount(
  organizerId: string,
  platform: SocialPlatform,
  credentials: {
    accessToken: string;
    refreshToken?: string;
    accountId: string;
    accountName: string;
    expiresAt?: number;
  }
): SocialAccount {
  if (!socialAccounts[organizerId]) {
    socialAccounts[organizerId] = [];
  }

  // Check if account already exists
  const existingIndex = socialAccounts[organizerId].findIndex(
    (acc) => acc.platform === platform
  );

  const account: SocialAccount = {
    platform,
    connected: true,
    accountName: credentials.accountName,
    accountId: credentials.accountId,
    connectedAt: Date.now(),
    credentials: {
      accessToken: credentials.accessToken,
      refreshToken: credentials.refreshToken,
      expiresAt: credentials.expiresAt,
    },
  };

  if (existingIndex >= 0) {
    // Update existing account
    socialAccounts[organizerId][existingIndex] = account;
  } else {
    // Add new account
    socialAccounts[organizerId].push(account);
  }

  return account;
}

/**
 * Disconnect a social media account for an organizer
 */
export function disconnectSocialAccount(
  organizerId: string,
  platform: SocialPlatform
): boolean {
  if (!socialAccounts[organizerId]) {
    return false;
  }

  const index = socialAccounts[organizerId].findIndex(
    (acc) => acc.platform === platform
  );

  if (index === -1) {
    return false;
  }

  // Mark as disconnected instead of removing (keep history)
  socialAccounts[organizerId][index].connected = false;
  socialAccounts[organizerId][index].credentials = undefined;

  return true;
}

/**
 * Get all social accounts for an organizer
 */
export function getSocialAccounts(organizerId: string): SocialAccount[] {
  if (!socialAccounts[organizerId]) {
    // Return default disconnected accounts for all platforms
    return [
      { platform: 'facebook', connected: false },
      { platform: 'instagram', connected: false },
      { platform: 'twitter', connected: false },
      { platform: 'linkedin', connected: false },
      { platform: 'tiktok', connected: false },
    ];
  }

  // Ensure all platforms are represented
  const platforms: SocialPlatform[] = ['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok'];
  const accounts = [...socialAccounts[organizerId]];

  platforms.forEach((platform) => {
    if (!accounts.find((acc) => acc.platform === platform)) {
      accounts.push({ platform, connected: false });
    }
  });

  return accounts;
}

/**
 * Get a specific social account for an organizer
 */
export function getSocialAccount(
  organizerId: string,
  platform: SocialPlatform
): SocialAccount | null {
  if (!socialAccounts[organizerId]) {
    return null;
  }

  return (
    socialAccounts[organizerId].find(
      (acc) => acc.platform === platform && acc.connected
    ) || null
  );
}

/**
 * Check if a social account is connected
 */
export function isSocialAccountConnected(
  organizerId: string,
  platform: SocialPlatform
): boolean {
  const account = getSocialAccount(organizerId, platform);
  return account !== null && account.connected;
}
// ── Commission Tracking Types ─────────────────────────────────────────────────

export type CommissionStatus = 'pending' | 'processing' | 'paid' | 'disputed';

export type EventCommission = {
  id: string;
  eventId: string;
  organizerId: string;
  eventTitle: string;
  eventDate: string;
  totalRevenue: number;
  commissionRate: number; // Platform commission rate (e.g., 5%)
  commissionAmount: number;
  status: CommissionStatus;
  createdAt: number;
  settledAt?: number;
  settlementReference?: string;
  notes?: string;
};

export type CommissionSettlement = {
  id: string;
  commissionIds: string[]; // Multiple commissions can be settled together
  totalAmount: number;
  settlementMethod: 'bank_transfer' | 'crypto' | 'wallet_credit';
  settlementDetails: Record<string, any>; // Bank details, crypto address, etc.
  status: 'pending' | 'processing' | 'completed' | 'failed';
  initiatedBy: string; // Admin user ID
  initiatedAt: number;
  completedAt?: number;
  failureReason?: string;
};

export type CommissionReport = {
  id: string;
  reportType: 'monthly' | 'quarterly' | 'yearly' | 'custom';
  period: {
    startDate: string;
    endDate: string;
  };
  totalCommissions: number;
  totalSettled: number;
  totalPending: number;
  commissionsByStatus: Record<CommissionStatus, number>;
  topOrganizers: Array<{
    organizerId: string;
    organizerName: string;
    totalCommission: number;
    eventCount: number;
  }>;
  commissionsByCategory: Array<{
    category: string;
    totalCommission: number;
    eventCount: number;
  }>;
  generatedBy: string; // Admin user ID
  generatedAt: number;
};

// ── Dispute and Refund Management Types ──────────────────────────────────────

export type DisputeReason = 
  | 'event_cancelled'
  | 'event_changed'
  | 'poor_experience'
  | 'technical_issues'
  | 'billing_error'
  | 'unauthorized_charge'
  | 'other';

export type DisputeStatus = 'open' | 'investigating' | 'resolved' | 'rejected';

export type Dispute = {
  id: string;
  orderId: string;
  userId: string;
  userName: string;
  eventId: string;
  eventTitle: string;
  organizerId: string;
  reason: DisputeReason;
  description: string;
  status: DisputeStatus;
  orderAmount: number;
  refundAmount?: number;
  resolution?: string;
  resolutionAction?: 'full_refund' | 'partial_refund' | 'no_refund' | 'event_credit';
  assignedTo?: string; // Admin user ID
  createdAt: number;
  updatedAt: number;
  resolvedAt?: number;
  resolvedBy?: string; // Admin user ID
  adminNotes?: string;
  customerResponse?: string;
  evidenceUrls?: string[]; // URLs to uploaded evidence
};

export type RefundProcessing = {
  id: string;
  disputeId?: string; // Optional - refunds can be processed without disputes
  orderId: string;
  userId: string;
  amount: number;
  method: 'wallet' | 'original_payment' | 'bank_transfer';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  reason: string;
  processedBy: string; // Admin user ID
  createdAt: number;
  completedAt?: number;
  failureReason?: string;
  transactionId?: string; // External transaction reference
};

// ── Audit Logging Types ──────────────────────────────────────────────────────

export type AuditLogAction = 
  | 'user_role_changed'
  | 'user_status_changed'
  | 'event_featured'
  | 'event_unfeatured'
  | 'dispute_created'
  | 'dispute_assigned'
  | 'dispute_resolved'
  | 'dispute_rejected'
  | 'refund_processed'
  | 'announcement_created'
  | 'announcement_published'
  | 'announcement_deleted'
  | 'commission_settled'
  | 'fraud_alert_created'
  | 'fraud_alert_resolved'
  | 'platform_settings_changed'
  | 'admin_login'
  | 'admin_logout';

export type AuditLogTargetType = 'user' | 'event' | 'order' | 'dispute' | 'announcement' | 'commission' | 'fraud_alert' | 'platform';

export type AuditLog = {
  id: string;
  adminUserId: string;
  adminUserName: string;
  action: AuditLogAction;
  targetType: AuditLogTargetType;
  targetId: string;
  targetName?: string; // Human-readable name of the target
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: number;
};

// Audit log storage
const auditLogs: AuditLog[] = [];

// ── Platform Metrics and Admin Functions ──────────────────────────────────────

/**
 * Platform metrics for admin dashboard
 */
export interface PlatformMetrics {
  totalEvents: number;
  totalUsers: number;
  totalRevenue: number;
  totalCommission: number;
  activeOrganizers: number;
  activeVendors: number;
  period: 'day' | 'week' | 'month' | 'year';
  timestamp: number;
  growthTrends: {
    events: number; // percentage change
    users: number;
    revenue: number;
    organizers: number;
    vendors: number;
  };
}

/**
 * Historical platform metrics storage
 */
const platformMetricsHistory: PlatformMetrics[] = [];

/**
 * Calculate current platform metrics
 */
export function calculatePlatformMetrics(period: 'day' | 'week' | 'month' | 'year' = 'month'): PlatformMetrics {
  const now = Date.now();
  const periodMs = {
    day: 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
    year: 365 * 24 * 60 * 60 * 1000,
  };
  
  const periodStart = now - periodMs[period];
  
  // Get all events from lib/events.ts
  const { getAllEvents } = require('./events');
  const allEvents = getAllEvents();
  
  // Calculate total events
  const totalEvents = allEvents.length;
  const recentEvents = allEvents.filter((event: any) => 
    new Date(event.createdAt || event.date).getTime() > periodStart
  ).length;
  
  // Calculate total users (from all user profiles)
  const allProfiles = getAllUserProfiles();
  const totalUsers = allProfiles.length;
  const recentUsers = allProfiles.filter(profile => 
    profile.createdAt > periodStart
  ).length;
  
  // Calculate total revenue from all orders
  const allOrders = Object.values(orders);
  const totalRevenue = allOrders
    .filter(order => order.status === 'paid')
    .reduce((sum, order) => sum + order.total, 0);
  
  const recentRevenue = allOrders
    .filter(order => 
      order.status === 'paid' && 
      order.createdAt > periodStart
    )
    .reduce((sum, order) => sum + order.total, 0);
  
  // Calculate commission (5% of revenue)
  const totalCommission = Math.round(totalRevenue * 0.05);
  
  // Calculate active organizers (those with events in the period)
  const activeOrganizers = new Set(
    allEvents
      .filter((event: any) => new Date(event.createdAt || event.date).getTime() > periodStart)
      .map((event: any) => event.organizerId || event.userId)
  ).size;
  
  // Calculate active vendors (those with active subscriptions)
  const activeVendors = Object.values(vendors)
    .filter(vendor => vendor.subscription && vendor.subscription.expiresAt > now)
    .length;
  
  // Calculate growth trends (compare with previous period)
  const previousPeriodStart = periodStart - periodMs[period];
  const previousPeriodEnd = periodStart;
  
  const previousEvents = allEvents.filter((event: any) => {
    const eventTime = new Date(event.createdAt || event.date).getTime();
    return eventTime > previousPeriodStart && eventTime <= previousPeriodEnd;
  }).length;
  
  const previousUsers = allProfiles.filter(profile => 
    profile.createdAt > previousPeriodStart && profile.createdAt <= previousPeriodEnd
  ).length;
  
  const previousRevenue = allOrders
    .filter(order => 
      order.status === 'paid' && 
      order.createdAt > previousPeriodStart && 
      order.createdAt <= previousPeriodEnd
    )
    .reduce((sum, order) => sum + order.total, 0);
  
  const previousOrganizers = new Set(
    allEvents
      .filter((event: any) => {
        const eventTime = new Date(event.createdAt || event.date).getTime();
        return eventTime > previousPeriodStart && eventTime <= previousPeriodEnd;
      })
      .map((event: any) => event.organizerId || event.userId)
  ).size;
  
  // Calculate percentage changes
  const calculateGrowth = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };
  
  const metrics: PlatformMetrics = {
    totalEvents,
    totalUsers,
    totalRevenue,
    totalCommission,
    activeOrganizers,
    activeVendors,
    period,
    timestamp: now,
    growthTrends: {
      events: calculateGrowth(recentEvents, previousEvents),
      users: calculateGrowth(recentUsers, previousUsers),
      revenue: calculateGrowth(recentRevenue, previousRevenue),
      organizers: calculateGrowth(activeOrganizers, previousOrganizers),
      vendors: calculateGrowth(activeVendors, activeVendors), // Vendors don't have historical data yet
    },
  };
  
  return metrics;
}

/**
 * Get platform metrics for a specific period
 */
export function getPlatformMetrics(period: 'day' | 'week' | 'month' | 'year' = 'month'): PlatformMetrics {
  return calculatePlatformMetrics(period);
}

/**
 * Store platform metrics snapshot
 */
export function storePlatformMetricsSnapshot(period: 'day' | 'week' | 'month' | 'year' = 'month'): PlatformMetrics {
  const metrics = calculatePlatformMetrics(period);
  platformMetricsHistory.push(metrics);
  
  // Keep only last 100 snapshots
  if (platformMetricsHistory.length > 100) {
    platformMetricsHistory.shift();
  }
  
  return metrics;
}

/**
 * Get platform metrics history
 */
export function getPlatformMetricsHistory(limit: number = 30): PlatformMetrics[] {
  return platformMetricsHistory.slice(-limit);
}

/**
 * Get platform growth data for charts
 */
export function getPlatformGrowthData(period: 'day' | 'week' | 'month' | 'year' = 'month') {
  const now = Date.now();
  const periodMs = {
    day: 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
    year: 365 * 24 * 60 * 60 * 1000,
  };
  
  const intervals = period === 'day' ? 24 : period === 'week' ? 7 : period === 'month' ? 12 : 12;
  const intervalMs = periodMs[period] / intervals;
  
  const data = [];
  
  for (let i = intervals - 1; i >= 0; i--) {
    const endTime = now - (i * intervalMs);
    const startTime = endTime - intervalMs;
    
    // Get events in this interval
    const { getAllEvents } = require('./events');
    const allEvents = getAllEvents();
    const eventsInInterval = allEvents.filter((event: any) => {
      const eventTime = new Date(event.createdAt || event.date).getTime();
      return eventTime >= startTime && eventTime < endTime;
    }).length;
    
    // Get users in this interval
    const usersInInterval = getAllUserProfiles().filter(profile => 
      profile.createdAt >= startTime && profile.createdAt < endTime
    ).length;
    
    // Get revenue in this interval
    const revenueInInterval = Object.values(orders)
      .filter(order => 
        order.status === 'paid' && 
        order.createdAt >= startTime && 
        order.createdAt < endTime
      )
      .reduce((sum, order) => sum + order.total, 0);
    
    const label = period === 'day' 
      ? `${String(new Date(endTime).getHours()).padStart(2, '0')}:00`
      : period === 'week'
      ? new Date(endTime).toLocaleDateString('en-US', { weekday: 'short' })
      : period === 'month'
      ? new Date(endTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : new Date(endTime).toLocaleDateString('en-US', { month: 'short' });
    
    data.push({
      label,
      events: eventsInInterval,
      users: usersInInterval,
      revenue: revenueInInterval,
      timestamp: endTime,
    });
  }
  
  return data;
}

/**
 * Get top performing events by revenue
 */
export function getTopPerformingEvents(limit: number = 10) {
  const { getAllEvents } = require('./events');
  const allEvents = getAllEvents();
  
  return allEvents
    .map((event: any) => {
      const eventOrders = Object.values(orders).filter(order => 
        order.eventId === event.id && order.status === 'paid'
      );
      const revenue = eventOrders.reduce((sum, order) => sum + order.total, 0);
      const ticketsSold = eventOrders.reduce((sum, order) => 
        sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
      
      return {
        ...event,
        revenue,
        ticketsSold,
        orders: eventOrders.length,
      };
    })
    .sort((a: any, b: any) => b.revenue - a.revenue)
    .slice(0, limit);
}

/**
 * Get revenue breakdown by category
 */
export function getRevenueByCategory() {
  const { getAllEvents } = require('./events');
  const allEvents = getAllEvents();
  
  const categoryRevenue: Record<string, number> = {};
  
  allEvents.forEach((event: any) => {
    const eventOrders = Object.values(orders).filter(order => 
      order.eventId === event.id && order.status === 'paid'
    );
    const revenue = eventOrders.reduce((sum, order) => sum + order.total, 0);
    
    const category = event.category || 'Other';
    categoryRevenue[category] = (categoryRevenue[category] || 0) + revenue;
  });
  
  return Object.entries(categoryRevenue)
    .map(([category, revenue]) => ({ category, revenue }))
    .sort((a, b) => b.revenue - a.revenue);
}

/**
 * Get active users count (users with activity in last 30 days)
 */
export function getActiveUsersCount(): number {
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  
  // Count users with recent orders
  const usersWithRecentOrders = new Set(
    Object.values(orders)
      .filter(order => order.createdAt > thirtyDaysAgo)
      .map(order => order.userId)
  );
  
  // Count users with recent profile updates
  const usersWithRecentActivity = getAllUserProfiles()
    .filter(profile => profile.updatedAt > thirtyDaysAgo)
    .map(profile => profile.userId);
  
  // Combine and deduplicate
  const activeUsers = new Set([...usersWithRecentOrders, ...usersWithRecentActivity]);
  
  return activeUsers.size;
}

/**
 * Event performance breakdown types
 */
export type EventPerformanceData = {
  id: string;
  title: string;
  date: string;
  category: string;
  city: string;
  country: string;
  eventType: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  ticketsSold: number;
  totalTickets: number;
  revenue: number;
  orders: number;
  conversionRate: number;
  averageOrderValue: number;
  attendanceRate?: number;
  createdAt: number;
};

export type EventPerformanceFilters = {
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  category?: string;
  city?: string;
  country?: string;
  eventType?: 'Physical' | 'Virtual' | 'Hybrid';
  dateFrom?: string;
  dateTo?: string;
};

export type EventPerformanceSortBy = 'revenue' | 'ticketsSold' | 'date' | 'title' | 'conversionRate';
export type SortOrder = 'asc' | 'desc';

/**
 * Get all events with performance metrics
 */
export function getAllEventsWithPerformance(
  filters?: EventPerformanceFilters,
  sortBy: EventPerformanceSortBy = 'date',
  sortOrder: SortOrder = 'desc',
  page: number = 1,
  pageSize: number = 20
): {
  events: EventPerformanceData[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
} {
  const { getAllEvents } = require('./events');
  const allEvents = getAllEvents();
  const now = Date.now();
  
  // Calculate performance data for each event
  let eventsWithPerformance: EventPerformanceData[] = allEvents.map((event: any) => {
    const eventOrders = Object.values(orders).filter(order => 
      order.eventId === event.id && order.status === 'paid'
    );
    
    const ticketsSold = eventOrders.reduce((sum, order) => 
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );
    
    const revenue = eventOrders.reduce((sum, order) => sum + order.total, 0);
    const orderCount = eventOrders.length;
    
    // Calculate total available tickets
    const availability = getAvailability(event.id);
    const totalTickets = availability?.tickets.reduce((sum, ticket) => sum + ticket.available + ticketsSold, 0) || 0;
    
    // Calculate conversion rate (simplified - based on views vs sales)
    const eventViews = eventMetrics[event.id]?.views || 100; // Default fallback
    const conversionRate = eventViews > 0 ? (ticketsSold / eventViews) * 100 : 0;
    
    // Calculate average order value
    const averageOrderValue = orderCount > 0 ? revenue / orderCount : 0;
    
    // Determine event status
    const eventDate = new Date(event.date).getTime();
    const oneDayMs = 24 * 60 * 60 * 1000;
    let status: EventPerformanceData['status'];
    
    if (eventDate > now + oneDayMs) {
      status = 'upcoming';
    } else if (eventDate > now - oneDayMs && eventDate <= now + oneDayMs) {
      status = 'ongoing';
    } else {
      status = 'completed';
    }
    
    // Calculate attendance rate for completed events
    let attendanceRate: number | undefined;
    if (status === 'completed') {
      // Simplified attendance rate calculation
      attendanceRate = totalTickets > 0 ? (ticketsSold / totalTickets) * 100 : 0;
    }
    
    return {
      id: event.id,
      title: event.title,
      date: event.date,
      category: event.category,
      city: event.city,
      country: event.country,
      eventType: event.eventType || 'Physical',
      status,
      ticketsSold,
      totalTickets,
      revenue,
      orders: orderCount,
      conversionRate,
      averageOrderValue,
      attendanceRate,
      createdAt: new Date(event.date).getTime(), // Use event date as creation time
    };
  });
  
  // Apply filters
  if (filters) {
    eventsWithPerformance = eventsWithPerformance.filter(event => {
      if (filters.status && event.status !== filters.status) return false;
      if (filters.category && event.category !== filters.category) return false;
      if (filters.city && event.city !== filters.city) return false;
      if (filters.country && event.country !== filters.country) return false;
      if (filters.eventType && event.eventType !== filters.eventType) return false;
      
      if (filters.dateFrom || filters.dateTo) {
        const eventDate = new Date(event.date);
        if (filters.dateFrom && eventDate < new Date(filters.dateFrom)) return false;
        if (filters.dateTo && eventDate > new Date(filters.dateTo)) return false;
      }
      
      return true;
    });
  }
  
  // Apply sorting
  eventsWithPerformance.sort((a, b) => {
    let aValue: any = a[sortBy];
    let bValue: any = b[sortBy];
    
    // Handle date sorting
    if (sortBy === 'date') {
      aValue = new Date(a.date).getTime();
      bValue = new Date(b.date).getTime();
    }
    
    // Handle string sorting
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });
  
  // Apply pagination
  const total = eventsWithPerformance.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedEvents = eventsWithPerformance.slice(startIndex, endIndex);
  
  return {
    events: paginatedEvents,
    total,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * Get event performance summary statistics
 */
export function getEventPerformanceSummary(): {
  totalEvents: number;
  totalRevenue: number;
  totalTicketsSold: number;
  averageTicketsPerEvent: number;
  averageRevenuePerEvent: number;
  topPerformingCategory: string;
  topPerformingCity: string;
} {
  const { events: allEventsWithPerformance } = getAllEventsWithPerformance();
  
  const totalEvents = allEventsWithPerformance.length;
  const totalRevenue = allEventsWithPerformance.reduce((sum, event) => sum + event.revenue, 0);
  const totalTicketsSold = allEventsWithPerformance.reduce((sum, event) => sum + event.ticketsSold, 0);
  
  const averageTicketsPerEvent = totalEvents > 0 ? totalTicketsSold / totalEvents : 0;
  const averageRevenuePerEvent = totalEvents > 0 ? totalRevenue / totalEvents : 0;
  
  // Find top performing category by revenue
  const categoryRevenue: Record<string, number> = {};
  allEventsWithPerformance.forEach(event => {
    categoryRevenue[event.category] = (categoryRevenue[event.category] || 0) + event.revenue;
  });
  const topPerformingCategory = Object.entries(categoryRevenue)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';
  
  // Find top performing city by revenue
  const cityRevenue: Record<string, number> = {};
  allEventsWithPerformance.forEach(event => {
    cityRevenue[event.city] = (cityRevenue[event.city] || 0) + event.revenue;
  });
  const topPerformingCity = Object.entries(cityRevenue)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';
  
  return {
    totalEvents,
    totalRevenue,
    totalTicketsSold,
    averageTicketsPerEvent,
    averageRevenuePerEvent,
    topPerformingCategory,
    topPerformingCity,
  };
}

// ── Commission Tracking Functions ─────────────────────────────────────────────

/**
 * Calculate and create commission for an event when it receives revenue
 */
export function calculateEventCommission(
  eventId: string,
  organizerId: string,
  commissionRate: number = 5 // Default 5% platform commission
): EventCommission | null {
  const { getEventById } = require('./events');
  const event = getEventById(eventId);
  if (!event) return null;

  // Calculate total revenue from paid orders for this event
  const eventOrders = Object.values(orders).filter(order => 
    order.eventId === eventId && order.status === 'paid'
  );
  
  const totalRevenue = eventOrders.reduce((sum, order) => sum + order.total, 0);
  
  if (totalRevenue === 0) return null;

  const commissionAmount = Math.round(totalRevenue * (commissionRate / 100));
  
  // Check if commission already exists for this event
  const existingCommissionId = commissionsByEvent[eventId];
  if (existingCommissionId) {
    // Update existing commission
    const existingCommission = eventCommissions[existingCommissionId];
    if (existingCommission) {
      existingCommission.totalRevenue = totalRevenue;
      existingCommission.commissionAmount = commissionAmount;
      return existingCommission;
    }
  }

  // Create new commission
  const commission: EventCommission = {
    id: id('comm'),
    eventId,
    organizerId,
    eventTitle: event.title,
    eventDate: event.date,
    totalRevenue,
    commissionRate,
    commissionAmount,
    status: 'pending',
    createdAt: Date.now(),
  };

  // Store commission
  eventCommissions[commission.id] = commission;
  commissionsByEvent[eventId] = commission.id;
  
  // Add to organizer's commissions
  if (!commissionsByOrganizer[organizerId]) {
    commissionsByOrganizer[organizerId] = [];
  }
  commissionsByOrganizer[organizerId].push(commission.id);

  return commission;
}

/**
 * Get commission for a specific event
 */
export function getEventCommission(eventId: string): EventCommission | null {
  const commissionId = commissionsByEvent[eventId];
  return commissionId ? eventCommissions[commissionId] : null;
}

/**
 * Get all commissions for an organizer
 */
export function getOrganizerCommissions(organizerId: string): EventCommission[] {
  const commissionIds = commissionsByOrganizer[organizerId] || [];
  return commissionIds.map(id => eventCommissions[id]).filter(Boolean);
}

/**
 * Get all commissions with optional filtering
 */
export function getAllCommissions(filters?: {
  status?: CommissionStatus;
  organizerId?: string;
  dateFrom?: string;
  dateTo?: string;
}): EventCommission[] {
  let commissions = Object.values(eventCommissions);

  if (filters) {
    if (filters.status) {
      commissions = commissions.filter(c => c.status === filters.status);
    }
    
    if (filters.organizerId) {
      commissions = commissions.filter(c => c.organizerId === filters.organizerId);
    }
    
    if (filters.dateFrom || filters.dateTo) {
      commissions = commissions.filter(c => {
        const commissionDate = new Date(c.eventDate);
        if (filters.dateFrom && commissionDate < new Date(filters.dateFrom)) return false;
        if (filters.dateTo && commissionDate > new Date(filters.dateTo)) return false;
        return true;
      });
    }
  }

  return commissions.sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * Update commission status
 */
export function updateCommissionStatus(
  commissionId: string,
  status: CommissionStatus,
  notes?: string,
  settlementReference?: string
): EventCommission | null {
  const commission = eventCommissions[commissionId];
  if (!commission) return null;

  commission.status = status;
  if (notes) commission.notes = notes;
  if (settlementReference) commission.settlementReference = settlementReference;
  
  if (status === 'paid') {
    commission.settledAt = Date.now();
  }

  return commission;
}

/**
 * Create a commission settlement batch
 */
export function createCommissionSettlement(
  commissionIds: string[],
  settlementMethod: CommissionSettlement['settlementMethod'],
  settlementDetails: Record<string, any>,
  initiatedBy: string
): CommissionSettlement {
  // Validate all commissions exist and are pending
  const commissions = commissionIds.map(id => eventCommissions[id]).filter(Boolean);
  const pendingCommissions = commissions.filter(c => c.status === 'pending');
  
  if (pendingCommissions.length !== commissionIds.length) {
    throw new Error('Some commissions are not in pending status');
  }

  const totalAmount = pendingCommissions.reduce((sum, c) => sum + c.commissionAmount, 0);

  const settlement: CommissionSettlement = {
    id: id('settlement'),
    commissionIds: pendingCommissions.map(c => c.id),
    totalAmount,
    settlementMethod,
    settlementDetails,
    status: 'pending',
    initiatedBy,
    initiatedAt: Date.now(),
  };

  // Store settlement
  commissionSettlements[settlement.id] = settlement;

  // Update commission statuses to processing
  pendingCommissions.forEach(commission => {
    commission.status = 'processing';
    commission.settlementReference = settlement.id;
  });

  return settlement;
}

/**
 * Update settlement status
 */
export function updateSettlementStatus(
  settlementId: string,
  status: CommissionSettlement['status'],
  failureReason?: string
): CommissionSettlement | null {
  const settlement = commissionSettlements[settlementId];
  if (!settlement) return null;

  settlement.status = status;
  
  if (status === 'completed') {
    settlement.completedAt = Date.now();
    // Update all associated commissions to paid
    settlement.commissionIds.forEach(commissionId => {
      const commission = eventCommissions[commissionId];
      if (commission) {
        commission.status = 'paid';
        commission.settledAt = Date.now();
      }
    });
  } else if (status === 'failed') {
    settlement.failureReason = failureReason;
    // Revert commissions back to pending
    settlement.commissionIds.forEach(commissionId => {
      const commission = eventCommissions[commissionId];
      if (commission) {
        commission.status = 'pending';
        commission.settlementReference = undefined;
      }
    });
  }

  return settlement;
}

/**
 * Get all settlements
 */
export function getAllSettlements(): CommissionSettlement[] {
  return Object.values(commissionSettlements).sort((a, b) => b.initiatedAt - a.initiatedAt);
}

/**
 * Get settlement by ID
 */
export function getSettlement(settlementId: string): CommissionSettlement | null {
  return commissionSettlements[settlementId] || null;
}

/**
 * Generate commission report
 */
export function generateCommissionReport(
  reportType: CommissionReport['reportType'],
  startDate: string,
  endDate: string,
  generatedBy: string
): CommissionReport {
  // Get commissions in the specified period
  const commissionsInPeriod = getAllCommissions({
    dateFrom: startDate,
    dateTo: endDate,
  });

  const totalCommissions = commissionsInPeriod.reduce((sum, c) => sum + c.commissionAmount, 0);
  const totalSettled = commissionsInPeriod
    .filter(c => c.status === 'paid')
    .reduce((sum, c) => sum + c.commissionAmount, 0);
  const totalPending = commissionsInPeriod
    .filter(c => c.status === 'pending')
    .reduce((sum, c) => sum + c.commissionAmount, 0);

  // Group by status
  const commissionsByStatus: Record<CommissionStatus, number> = {
    pending: 0,
    processing: 0,
    paid: 0,
    disputed: 0,
  };

  commissionsInPeriod.forEach(c => {
    commissionsByStatus[c.status] += c.commissionAmount;
  });

  // Top organizers by commission
  const organizerCommissions: Record<string, { total: number; count: number; name: string }> = {};
  commissionsInPeriod.forEach(c => {
    if (!organizerCommissions[c.organizerId]) {
      // Get organizer name from user profiles
      const profile = userProfiles[c.organizerId];
      organizerCommissions[c.organizerId] = {
        total: 0,
        count: 0,
        name: profile?.displayName || `Organizer ${c.organizerId}`,
      };
    }
    organizerCommissions[c.organizerId].total += c.commissionAmount;
    organizerCommissions[c.organizerId].count += 1;
  });

  const topOrganizers = Object.entries(organizerCommissions)
    .map(([organizerId, data]) => ({
      organizerId,
      organizerName: data.name,
      totalCommission: data.total,
      eventCount: data.count,
    }))
    .sort((a, b) => b.totalCommission - a.totalCommission)
    .slice(0, 10);

  // Commissions by category
  const categoryCommissions: Record<string, { total: number; count: number }> = {};
  commissionsInPeriod.forEach(c => {
    // Get event category from event data
    const { getEventById } = require('./events');
    const event = getEventById(c.eventId);
    const category = event?.category || 'Other';
    
    if (!categoryCommissions[category]) {
      categoryCommissions[category] = { total: 0, count: 0 };
    }
    categoryCommissions[category].total += c.commissionAmount;
    categoryCommissions[category].count += 1;
  });

  const commissionsByCategory = Object.entries(categoryCommissions)
    .map(([category, data]) => ({
      category,
      totalCommission: data.total,
      eventCount: data.count,
    }))
    .sort((a, b) => b.totalCommission - a.totalCommission);

  const report: CommissionReport = {
    id: id('report'),
    reportType,
    period: { startDate, endDate },
    totalCommissions,
    totalSettled,
    totalPending,
    commissionsByStatus,
    topOrganizers,
    commissionsByCategory,
    generatedBy,
    generatedAt: Date.now(),
  };

  // Store report
  commissionReports[report.id] = report;

  return report;
}

/**
 * Get all commission reports
 */
export function getAllCommissionReports(): CommissionReport[] {
  return Object.values(commissionReports).sort((a, b) => b.generatedAt - a.generatedAt);
}

/**
 * Get commission report by ID
 */
export function getCommissionReport(reportId: string): CommissionReport | null {
  return commissionReports[reportId] || null;
}

/**
 * Get commission summary statistics
 */
export function getCommissionSummary(): {
  totalCommissions: number;
  totalSettled: number;
  totalPending: number;
  totalProcessing: number;
  totalDisputed: number;
  averageCommissionPerEvent: number;
  commissionRate: number;
  monthlyGrowth: number;
} {
  const allCommissions = getAllCommissions();
  
  const totalCommissions = allCommissions.reduce((sum, c) => sum + c.commissionAmount, 0);
  const totalSettled = allCommissions
    .filter(c => c.status === 'paid')
    .reduce((sum, c) => sum + c.commissionAmount, 0);
  const totalPending = allCommissions
    .filter(c => c.status === 'pending')
    .reduce((sum, c) => sum + c.commissionAmount, 0);
  const totalProcessing = allCommissions
    .filter(c => c.status === 'processing')
    .reduce((sum, c) => sum + c.commissionAmount, 0);
  const totalDisputed = allCommissions
    .filter(c => c.status === 'disputed')
    .reduce((sum, c) => sum + c.commissionAmount, 0);

  const averageCommissionPerEvent = allCommissions.length > 0 
    ? totalCommissions / allCommissions.length 
    : 0;

  // Calculate average commission rate
  const totalRevenue = allCommissions.reduce((sum, c) => sum + c.totalRevenue, 0);
  const commissionRate = totalRevenue > 0 ? (totalCommissions / totalRevenue) * 100 : 5;

  // Calculate monthly growth
  const now = Date.now();
  const lastMonth = now - (30 * 24 * 60 * 60 * 1000);
  const previousMonth = lastMonth - (30 * 24 * 60 * 60 * 1000);

  const currentMonthCommissions = allCommissions
    .filter(c => c.createdAt >= lastMonth)
    .reduce((sum, c) => sum + c.commissionAmount, 0);
  
  const previousMonthCommissions = allCommissions
    .filter(c => c.createdAt >= previousMonth && c.createdAt < lastMonth)
    .reduce((sum, c) => sum + c.commissionAmount, 0);

  const monthlyGrowth = previousMonthCommissions > 0 
    ? ((currentMonthCommissions - previousMonthCommissions) / previousMonthCommissions) * 100
    : 0;

  return {
    totalCommissions,
    totalSettled,
    totalPending,
    totalProcessing,
    totalDisputed,
    averageCommissionPerEvent,
    commissionRate,
    monthlyGrowth,
  };
}

/**
 * Auto-calculate commissions for all events with revenue
 * This should be called periodically or when orders are marked as paid
 */
export function updateAllEventCommissions(): EventCommission[] {
  const { getAllEvents } = require('./events');
  const allEvents = getAllEvents();
  const updatedCommissions: EventCommission[] = [];

  allEvents.forEach((event: any) => {
    // Get organizer ID (assuming it's stored in event or can be derived)
    const organizerId = event.organizerId || event.userId;
    if (!organizerId) return;

    const commission = calculateEventCommission(event.id, organizerId);
    if (commission) {
      updatedCommissions.push(commission);
    }
  });

  return updatedCommissions;
}

// ── User Management Types and Functions ──────────────────────────────────────

export type UserRole = 'attendee' | 'organizer' | 'vendor' | 'admin';

export type UserStatus = 'active' | 'suspended' | 'pending' | 'banned';

export type AdminUser = {
  id: string;
  email: string;
  displayName?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: number;
  lastLoginAt?: number;
  lastActivityAt?: number;
  eventsCreated?: number;
  eventsAttended?: number;
  totalSpent?: number;
  totalEarned?: number;
  walletBalance?: number;
  profileCompleteness?: number;
  location?: {
    city: string;
    country: string;
  };
};

// Store for admin user management
const adminUsers: Record<string, AdminUser> = {};

/**
 * Initialize admin users store with existing user data
 */
export function initializeAdminUsers(): void {
  // Get all user profiles and create admin user records
  const profiles = getAllUserProfiles();
  
  profiles.forEach(profile => {
    if (!adminUsers[profile.userId]) {
      // Determine role based on existing data
      let role: UserRole = 'attendee';
      if (profile.eventsOrganized && profile.eventsOrganized.length > 0) {
        role = 'organizer';
      }
      
      // Check if user is a vendor
      const vendorProfile = Object.values(vendors).find(v => v.userId === profile.userId);
      if (vendorProfile) {
        role = 'vendor';
      }
      
      // Calculate stats
      const userOrders = getUserOrders(profile.userId);
      const totalSpent = userOrders
        .filter(order => order.status === 'paid')
        .reduce((sum, order) => sum + order.total, 0);
      
      const wallet = getWallet(profile.userId);
      
      adminUsers[profile.userId] = {
        id: profile.userId,
        email: profile.userId, // Using userId as email for now
        displayName: profile.displayName,
        role,
        status: 'active',
        createdAt: profile.createdAt,
        lastActivityAt: profile.updatedAt,
        eventsCreated: profile.eventsOrganized?.length || 0,
        eventsAttended: profile.eventsAttended?.length || 0,
        totalSpent,
        walletBalance: wallet?.balance || 0,
        profileCompleteness: calculateProfileCompleteness(profile),
        location: profile.location,
      };
    }
  });
}

/**
 * Calculate profile completeness percentage
 */
function calculateProfileCompleteness(profile: UserProfile): number {
  let completed = 0;
  const total = 7;
  
  if (profile.displayName) completed++;
  if (profile.bio) completed++;
  if (profile.avatar) completed++;
  if (profile.location) completed++;
  if (profile.interests && profile.interests.length > 0) completed++;
  if (profile.socialLinks && Object.keys(profile.socialLinks).length > 0) completed++;
  if (profile.eventsAttended && profile.eventsAttended.length > 0) completed++;
  
  return Math.round((completed / total) * 100);
}

/**
 * Get all users for admin management
 */
export function getAllAdminUsers(): AdminUser[] {
  initializeAdminUsers(); // Ensure data is up to date
  return Object.values(adminUsers).sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * Get user by ID for admin management
 */
export function getAdminUser(userId: string): AdminUser | null {
  initializeAdminUsers();
  return adminUsers[userId] || null;
}

/**
 * Update user role
 */
export function updateUserRole(userId: string, newRole: UserRole): AdminUser | null {
  initializeAdminUsers();
  const user = adminUsers[userId];
  if (!user) return null;
  
  user.role = newRole;
  return user;
}

/**
 * Update user status
 */
export function updateUserStatus(userId: string, newStatus: UserStatus): AdminUser | null {
  initializeAdminUsers();
  const user = adminUsers[userId];
  if (!user) return null;
  
  user.status = newStatus;
  return user;
}

/**
 * Search users by email or display name
 */
export function searchUsers(query: string): AdminUser[] {
  initializeAdminUsers();
  const lowercaseQuery = query.toLowerCase();
  
  return Object.values(adminUsers).filter(user => 
    user.email.toLowerCase().includes(lowercaseQuery) ||
    (user.displayName && user.displayName.toLowerCase().includes(lowercaseQuery))
  );
}

/**
 * Filter users by role
 */
export function filterUsersByRole(role: UserRole): AdminUser[] {
  initializeAdminUsers();
  return Object.values(adminUsers).filter(user => user.role === role);
}

/**
 * Filter users by status
 */
export function filterUsersByStatus(status: UserStatus): AdminUser[] {
  initializeAdminUsers();
  return Object.values(adminUsers).filter(user => user.status === status);
}

/**
 * Get user activity stats
 */
export function getUserActivityStats(userId: string): {
  totalOrders: number;
  totalSpent: number;
  eventsCreated: number;
  eventsAttended: number;
  walletTransactions: number;
  lastActivity: number;
} {
  const userOrders = getUserOrders(userId);
  const userTransactions = listTransactions(userId);
  const profile = getUserProfile(userId);
  
  return {
    totalOrders: userOrders.length,
    totalSpent: userOrders
      .filter(order => order.status === 'paid')
      .reduce((sum, order) => sum + order.total, 0),
    eventsCreated: profile?.eventsOrganized?.length || 0,
    eventsAttended: profile?.eventsAttended?.length || 0,
    walletTransactions: userTransactions.length,
    lastActivity: profile?.updatedAt || 0,
  };
}

/**
 * Get platform user statistics
 */
export function getUserStatistics(): {
  totalUsers: number;
  activeUsers: number;
  usersByRole: Record<UserRole, number>;
  usersByStatus: Record<UserStatus, number>;
  newUsersThisMonth: number;
  averageProfileCompleteness: number;
} {
  initializeAdminUsers();
  const users = Object.values(adminUsers);
  const now = Date.now();
  const monthAgo = now - (30 * 24 * 60 * 60 * 1000);
  
  const usersByRole = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<UserRole, number>);
  
  const usersByStatus = users.reduce((acc, user) => {
    acc[user.status] = (acc[user.status] || 0) + 1;
    return acc;
  }, {} as Record<UserStatus, number>);
  
  const newUsersThisMonth = users.filter(user => user.createdAt > monthAgo).length;
  const activeUsers = users.filter(user => 
    user.status === 'active' && 
    user.lastActivityAt && 
    user.lastActivityAt > monthAgo
  ).length;
  
  const averageProfileCompleteness = users.reduce((sum, user) => 
    sum + (user.profileCompleteness || 0), 0
  ) / users.length;
  
  return {
    totalUsers: users.length,
    activeUsers,
    usersByRole,
    usersByStatus,
    newUsersThisMonth,
    averageProfileCompleteness: Math.round(averageProfileCompleteness),
  };
}

// ── Dispute and Refund Management Functions ──────────────────────────────────

/**
 * Create a new dispute
 */
export function createDispute(
  orderId: string,
  userId: string,
  reason: DisputeReason,
  description: string
): Dispute {
  const order = getOrder(orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  // Check if dispute already exists for this order
  if (disputesByOrder[orderId]) {
    throw new Error("Dispute already exists for this order");
  }

  const { getEventById } = require('./events');
  const event = getEventById(order.eventId);
  const user = getAdminUser(userId);

  const dispute: Dispute = {
    id: id("dispute"),
    orderId,
    userId,
    userName: user?.displayName || user?.email || "Unknown User",
    eventId: order.eventId,
    eventTitle: event?.title || "Unknown Event",
    organizerId: event?.organizerId || event?.userId || "",
    reason,
    description,
    status: 'open',
    orderAmount: order.total,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  disputes[dispute.id] = dispute;
  disputesByOrder[orderId] = dispute.id;
  
  if (!disputesByUser[userId]) {
    disputesByUser[userId] = [];
  }
  disputesByUser[userId].push(dispute.id);

  return dispute;
}

/**
 * Get dispute by ID
 */
export function getDispute(disputeId: string): Dispute | null {
  return disputes[disputeId] || null;
}

/**
 * Get dispute by order ID
 */
export function getDisputeByOrder(orderId: string): Dispute | null {
  const disputeId = disputesByOrder[orderId];
  return disputeId ? disputes[disputeId] : null;
}

/**
 * Get all disputes with optional filtering
 */
export function getAllDisputes(filters?: {
  status?: DisputeStatus;
  userId?: string;
  organizerId?: string;
  reason?: DisputeReason;
  assignedTo?: string;
}): Dispute[] {
  let result = Object.values(disputes);

  if (filters?.status) {
    result = result.filter(d => d.status === filters.status);
  }
  if (filters?.userId) {
    result = result.filter(d => d.userId === filters.userId);
  }
  if (filters?.organizerId) {
    result = result.filter(d => d.organizerId === filters.organizerId);
  }
  if (filters?.reason) {
    result = result.filter(d => d.reason === filters.reason);
  }
  if (filters?.assignedTo) {
    result = result.filter(d => d.assignedTo === filters.assignedTo);
  }

  return result.sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * Get disputes for a user
 */
export function getUserDisputes(userId: string): Dispute[] {
  const disputeIds = disputesByUser[userId] || [];
  return disputeIds.map(id => disputes[id]).filter(Boolean);
}

/**
 * Update dispute status and details
 */
export function updateDispute(
  disputeId: string,
  updates: Partial<Dispute>,
  adminUserId?: string
): Dispute | null {
  const dispute = disputes[disputeId];
  if (!dispute) return null;

  const updatedDispute = {
    ...dispute,
    ...updates,
    updatedAt: Date.now(),
  };

  // If resolving the dispute, set resolved timestamp and admin
  if (updates.status && ['resolved', 'rejected'].includes(updates.status)) {
    updatedDispute.resolvedAt = Date.now();
    if (adminUserId) {
      updatedDispute.resolvedBy = adminUserId;
    }
  }

  disputes[disputeId] = updatedDispute;
  return updatedDispute;
}

/**
 * Assign dispute to admin
 */
export function assignDispute(disputeId: string, adminUserId: string): Dispute | null {
  return updateDispute(disputeId, { 
    assignedTo: adminUserId,
    status: 'investigating'
  });
}

/**
 * Resolve dispute with action
 */
export function resolveDispute(
  disputeId: string,
  resolution: string,
  action: 'full_refund' | 'partial_refund' | 'no_refund' | 'event_credit',
  refundAmount?: number,
  adminUserId?: string
): { dispute: Dispute; refund?: RefundProcessing } {
  const dispute = disputes[disputeId];
  if (!dispute) {
    throw new Error("Dispute not found");
  }

  // Update dispute
  const updatedDispute = updateDispute(disputeId, {
    status: 'resolved',
    resolution,
    resolutionAction: action,
    refundAmount: refundAmount || (action === 'full_refund' ? dispute.orderAmount : 0),
  }, adminUserId);

  if (!updatedDispute) {
    throw new Error("Failed to update dispute");
  }

  let refund: RefundProcessing | undefined;

  // Process refund if applicable
  if (action === 'full_refund' || action === 'partial_refund') {
    const amount = refundAmount || (action === 'full_refund' ? dispute.orderAmount : 0);
    if (amount > 0) {
      refund = processRefund(
        dispute.orderId,
        dispute.userId,
        amount,
        `Dispute resolution: ${resolution}`,
        adminUserId || 'system',
        disputeId
      );
    }
  }

  return { dispute: updatedDispute, refund };
}

/**
 * Process a refund (can be called independently or from dispute resolution)
 */
export function processRefund(
  orderId: string,
  userId: string,
  amount: number,
  reason: string,
  processedBy: string,
  disputeId?: string
): RefundProcessing {
  const order = getOrder(orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  const refund: RefundProcessing = {
    id: id("refund"),
    disputeId,
    orderId,
    userId,
    amount,
    method: 'wallet', // Default to wallet refund for instant processing
    status: 'pending',
    reason,
    processedBy,
    createdAt: Date.now(),
  };

  refundProcessing[refund.id] = refund;
  
  if (disputeId) {
    refundsByDispute[disputeId] = refund.id;
  }

  // Process the refund immediately to wallet
  try {
    addMoney(userId, amount, `Refund: ${reason}`);
    refund.status = 'completed';
    refund.completedAt = Date.now();
    refund.transactionId = `wallet_${Date.now()}`;
  } catch (error) {
    refund.status = 'failed';
    refund.failureReason = error instanceof Error ? error.message : 'Unknown error';
  }

  return refund;
}

/**
 * Get refund by ID
 */
export function getRefund(refundId: string): RefundProcessing | null {
  return refundProcessing[refundId] || null;
}

/**
 * Get all refunds with optional filtering
 */
export function getAllRefunds(filters?: {
  status?: RefundProcessing['status'];
  userId?: string;
  processedBy?: string;
}): RefundProcessing[] {
  let result = Object.values(refundProcessing);

  if (filters?.status) {
    result = result.filter(r => r.status === filters.status);
  }
  if (filters?.userId) {
    result = result.filter(r => r.userId === filters.userId);
  }
  if (filters?.processedBy) {
    result = result.filter(r => r.processedBy === filters.processedBy);
  }

  return result.sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * Get refund for a dispute
 */
export function getDisputeRefund(disputeId: string): RefundProcessing | null {
  const refundId = refundsByDispute[disputeId];
  return refundId ? refundProcessing[refundId] : null;
}

/**
 * Get dispute statistics for admin dashboard
 */
export function getDisputeStats(): {
  total: number;
  open: number;
  investigating: number;
  resolved: number;
  rejected: number;
  totalRefunded: number;
  averageResolutionTime: number; // in hours
} {
  const allDisputes = Object.values(disputes);
  
  const stats = {
    total: allDisputes.length,
    open: allDisputes.filter(d => d.status === 'open').length,
    investigating: allDisputes.filter(d => d.status === 'investigating').length,
    resolved: allDisputes.filter(d => d.status === 'resolved').length,
    rejected: allDisputes.filter(d => d.status === 'rejected').length,
    totalRefunded: 0,
    averageResolutionTime: 0,
  };

  // Calculate total refunded amount
  const allRefunds = Object.values(refundProcessing);
  stats.totalRefunded = allRefunds
    .filter(r => r.status === 'completed')
    .reduce((sum, r) => sum + r.amount, 0);

  // Calculate average resolution time
  const resolvedDisputes = allDisputes.filter(d => d.resolvedAt);
  if (resolvedDisputes.length > 0) {
    const totalResolutionTime = resolvedDisputes.reduce((sum, d) => {
      return sum + (d.resolvedAt! - d.createdAt);
    }, 0);
    stats.averageResolutionTime = totalResolutionTime / resolvedDisputes.length / (1000 * 60 * 60); // Convert to hours
  }

  return stats;
}

// ── Seed Data for Testing ────────────────────────────────────────────────────

// Dispute data comes from the backend API

// ── Featured Event Placement Types and Functions ─────────────────────────────

export type FeaturedPlacement = {
  id: string;
  eventId: string;
  position: number; // 1 = top position, 2 = second, etc.
  startDate: number; // Timestamp when placement starts
  endDate: number; // Timestamp when placement ends
  sponsorshipFee?: number; // Optional fee paid for the placement
  createdBy: string; // Admin user ID who created the placement
  createdAt: number;
  updatedAt: number;
  status: 'active' | 'expired' | 'cancelled';
  notes?: string; // Optional admin notes
};

// Storage for featured placements
const featuredPlacements: Record<string, FeaturedPlacement> = {};
const placementsByEvent: Record<string, string> = {}; // eventId -> placementId
const placementsByPosition: Record<number, string[]> = {}; // position -> placementIds (for overlapping periods)

/**
 * Create a new featured placement
 */
export function createFeaturedPlacement(
  eventId: string,
  position: number,
  startDate: number,
  endDate: number,
  createdBy: string,
  sponsorshipFee?: number,
  notes?: string
): FeaturedPlacement {
  // Validate dates
  if (startDate >= endDate) {
    throw new Error("Start date must be before end date");
  }

  if (startDate < Date.now()) {
    throw new Error("Start date cannot be in the past");
  }

  // Check if event exists
  const { getEventById } = require('./events');
  const event = getEventById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  // Check for conflicts at the same position during the same time period
  const conflicts = getPlacementConflicts(position, startDate, endDate);
  if (conflicts.length > 0) {
    throw new Error(`Position ${position} is already occupied during this time period`);
  }

  const placement: FeaturedPlacement = {
    id: id("featured"),
    eventId,
    position,
    startDate,
    endDate,
    sponsorshipFee,
    createdBy,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    status: 'active',
    notes,
  };

  // Store placement
  featuredPlacements[placement.id] = placement;
  placementsByEvent[eventId] = placement.id;
  
  // Add to position tracking
  if (!placementsByPosition[position]) {
    placementsByPosition[position] = [];
  }
  placementsByPosition[position].push(placement.id);

  return placement;
}

/**
 * Get featured placement by ID
 */
export function getFeaturedPlacement(placementId: string): FeaturedPlacement | null {
  return featuredPlacements[placementId] || null;
}

/**
 * Get featured placement for an event
 */
export function getEventFeaturedPlacement(eventId: string): FeaturedPlacement | null {
  const placementId = placementsByEvent[eventId];
  return placementId ? featuredPlacements[placementId] : null;
}

/**
 * Get all featured placements with optional filtering
 */
export function getAllFeaturedPlacements(filters?: {
  status?: FeaturedPlacement['status'];
  position?: number;
  createdBy?: string;
  activeOnly?: boolean;
}): FeaturedPlacement[] {
  let result = Object.values(featuredPlacements);

  if (filters?.status) {
    result = result.filter(p => p.status === filters.status);
  }
  if (filters?.position) {
    result = result.filter(p => p.position === filters.position);
  }
  if (filters?.createdBy) {
    result = result.filter(p => p.createdBy === filters.createdBy);
  }
  if (filters?.activeOnly) {
    const now = Date.now();
    result = result.filter(p => 
      p.status === 'active' && 
      p.startDate <= now && 
      p.endDate > now
    );
  }

  return result.sort((a, b) => {
    // Sort by position first, then by start date
    if (a.position !== b.position) {
      return a.position - b.position;
    }
    return b.startDate - a.startDate;
  });
}

/**
 * Get currently active featured placements
 */
export function getActiveFeaturedPlacements(): FeaturedPlacement[] {
  const now = Date.now();
  return Object.values(featuredPlacements)
    .filter(p => 
      p.status === 'active' && 
      p.startDate <= now && 
      p.endDate > now
    )
    .sort((a, b) => a.position - b.position);
}

/**
 * Get featured placements by position
 */
export function getFeaturedPlacementsByPosition(position: number): FeaturedPlacement[] {
  const placementIds = placementsByPosition[position] || [];
  return placementIds
    .map(id => featuredPlacements[id])
    .filter(Boolean)
    .sort((a, b) => b.startDate - a.startDate);
}

/**
 * Check for placement conflicts at a position during a time period
 */
export function getPlacementConflicts(
  position: number,
  startDate: number,
  endDate: number,
  excludePlacementId?: string
): FeaturedPlacement[] {
  const placementsAtPosition = getFeaturedPlacementsByPosition(position);
  
  return placementsAtPosition.filter(p => {
    // Skip the placement we're excluding (for updates)
    if (excludePlacementId && p.id === excludePlacementId) {
      return false;
    }
    
    // Skip cancelled or expired placements
    if (p.status === 'cancelled' || p.status === 'expired') {
      return false;
    }
    
    // Check for time overlap
    return (
      (startDate >= p.startDate && startDate < p.endDate) ||
      (endDate > p.startDate && endDate <= p.endDate) ||
      (startDate <= p.startDate && endDate >= p.endDate)
    );
  });
}

/**
 * Update featured placement
 */
export function updateFeaturedPlacement(
  placementId: string,
  updates: Partial<FeaturedPlacement>
): FeaturedPlacement | null {
  const placement = featuredPlacements[placementId];
  if (!placement) return null;

  // If updating position or dates, check for conflicts
  if (updates.position !== undefined || updates.startDate !== undefined || updates.endDate !== undefined) {
    const newPosition = updates.position ?? placement.position;
    const newStartDate = updates.startDate ?? placement.startDate;
    const newEndDate = updates.endDate ?? placement.endDate;
    
    // Validate dates
    if (newStartDate >= newEndDate) {
      throw new Error("Start date must be before end date");
    }
    
    const conflicts = getPlacementConflicts(newPosition, newStartDate, newEndDate, placementId);
    if (conflicts.length > 0) {
      throw new Error(`Position ${newPosition} is already occupied during this time period`);
    }
    
    // Update position tracking if position changed
    if (updates.position !== undefined && updates.position !== placement.position) {
      // Remove from old position
      const oldPositionPlacements = placementsByPosition[placement.position] || [];
      placementsByPosition[placement.position] = oldPositionPlacements.filter(id => id !== placementId);
      
      // Add to new position
      if (!placementsByPosition[updates.position]) {
        placementsByPosition[updates.position] = [];
      }
      placementsByPosition[updates.position].push(placementId);
    }
  }

  const updatedPlacement = {
    ...placement,
    ...updates,
    updatedAt: Date.now(),
  };

  featuredPlacements[placementId] = updatedPlacement;
  return updatedPlacement;
}

/**
 * Cancel featured placement
 */
export function cancelFeaturedPlacement(placementId: string, reason?: string): FeaturedPlacement | null {
  const placement = featuredPlacements[placementId];
  if (!placement) return null;

  const updatedPlacement = {
    ...placement,
    status: 'cancelled' as const,
    updatedAt: Date.now(),
    notes: placement.notes ? `${placement.notes}\n\nCancelled: ${reason || 'No reason provided'}` : `Cancelled: ${reason || 'No reason provided'}`,
  };

  featuredPlacements[placementId] = updatedPlacement;
  return updatedPlacement;
}

/**
 * Delete featured placement (permanent removal)
 */
export function deleteFeaturedPlacement(placementId: string): boolean {
  const placement = featuredPlacements[placementId];
  if (!placement) return false;

  // Remove from all tracking records
  delete featuredPlacements[placementId];
  
  // Remove from event mapping
  if (placementsByEvent[placement.eventId] === placementId) {
    delete placementsByEvent[placement.eventId];
  }
  
  // Remove from position tracking
  const positionPlacements = placementsByPosition[placement.position] || [];
  placementsByPosition[placement.position] = positionPlacements.filter(id => id !== placementId);

  return true;
}

/**
 * Expire old placements (should be called periodically)
 */
export function expireOldPlacements(): FeaturedPlacement[] {
  const now = Date.now();
  const expiredPlacements: FeaturedPlacement[] = [];

  Object.values(featuredPlacements).forEach(placement => {
    if (placement.status === 'active' && placement.endDate <= now) {
      placement.status = 'expired';
      placement.updatedAt = now;
      expiredPlacements.push(placement);
    }
  });

  return expiredPlacements;
}

/**
 * Get featured events for display (with event details)
 */
export function getFeaturedEventsWithDetails(): Array<{
  placement: FeaturedPlacement;
  event: any;
  position: number;
}> {
  const { getEventById } = require('./events');
  const activePlacements = getActiveFeaturedPlacements();
  
  return activePlacements
    .map(placement => {
      const event = getEventById(placement.eventId);
      return event ? {
        placement,
        event,
        position: placement.position,
      } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a!.position - b!.position) as Array<{
      placement: FeaturedPlacement;
      event: any;
      position: number;
    }>;
}

/**
 * Get available positions for a time period
 */
export function getAvailablePositions(startDate: number, endDate: number, maxPositions: number = 10): number[] {
  const availablePositions: number[] = [];
  
  for (let position = 1; position <= maxPositions; position++) {
    const conflicts = getPlacementConflicts(position, startDate, endDate);
    if (conflicts.length === 0) {
      availablePositions.push(position);
    }
  }
  
  return availablePositions;
}

/**
 * Calculate total sponsorship revenue
 */
export function calculateSponsorshipRevenue(filters?: {
  startDate?: number;
  endDate?: number;
  position?: number;
}): {
  totalRevenue: number;
  placementCount: number;
  averageRevenue: number;
  revenueByPosition: Record<number, number>;
} {
  let placements = Object.values(featuredPlacements);
  
  // Apply filters
  if (filters?.startDate) {
    placements = placements.filter(p => p.startDate >= filters.startDate!);
  }
  if (filters?.endDate) {
    placements = placements.filter(p => p.endDate <= filters.endDate!);
  }
  if (filters?.position) {
    placements = placements.filter(p => p.position === filters.position);
  }
  
  // Only include placements with sponsorship fees
  const paidPlacements = placements.filter(p => p.sponsorshipFee && p.sponsorshipFee > 0);
  
  const totalRevenue = paidPlacements.reduce((sum, p) => sum + (p.sponsorshipFee || 0), 0);
  const placementCount = paidPlacements.length;
  const averageRevenue = placementCount > 0 ? totalRevenue / placementCount : 0;
  
  // Revenue by position
  const revenueByPosition: Record<number, number> = {};
  paidPlacements.forEach(p => {
    revenueByPosition[p.position] = (revenueByPosition[p.position] || 0) + (p.sponsorshipFee || 0);
  });
  
  return {
    totalRevenue,
    placementCount,
    averageRevenue,
    revenueByPosition,
  };
}

/**
 * Get placement statistics for admin dashboard
 */
export function getFeaturedPlacementStats(): {
  totalPlacements: number;
  activePlacements: number;
  expiredPlacements: number;
  cancelledPlacements: number;
  totalRevenue: number;
  averageRevenue: number;
  positionUtilization: Record<number, number>; // position -> count
  upcomingExpirations: FeaturedPlacement[]; // expiring in next 7 days
} {
  const allPlacements = Object.values(featuredPlacements);
  const now = Date.now();
  const weekFromNow = now + (7 * 24 * 60 * 60 * 1000);
  
  const stats = {
    totalPlacements: allPlacements.length,
    activePlacements: allPlacements.filter(p => 
      p.status === 'active' && p.startDate <= now && p.endDate > now
    ).length,
    expiredPlacements: allPlacements.filter(p => p.status === 'expired').length,
    cancelledPlacements: allPlacements.filter(p => p.status === 'cancelled').length,
    totalRevenue: 0,
    averageRevenue: 0,
    positionUtilization: {} as Record<number, number>,
    upcomingExpirations: [] as FeaturedPlacement[],
  };
  
  // Calculate revenue
  const paidPlacements = allPlacements.filter(p => p.sponsorshipFee && p.sponsorshipFee > 0);
  stats.totalRevenue = paidPlacements.reduce((sum, p) => sum + (p.sponsorshipFee || 0), 0);
  stats.averageRevenue = paidPlacements.length > 0 ? stats.totalRevenue / paidPlacements.length : 0;
  
  // Position utilization
  allPlacements.forEach(p => {
    stats.positionUtilization[p.position] = (stats.positionUtilization[p.position] || 0) + 1;
  });
  
  // Upcoming expirations
  stats.upcomingExpirations = allPlacements
    .filter(p => 
      p.status === 'active' && 
      p.endDate > now && 
      p.endDate <= weekFromNow
    )
    .sort((a, b) => a.endDate - b.endDate);
  
  return stats;
}

// Featured placement data comes from the backend API

// ── Fraud Detection Types and Functions ──────────────────────────────────────

export type FraudAlertType = 
  | 'suspicious_refund_rate'
  | 'duplicate_accounts'
  | 'unusual_payment_pattern'
  | 'rapid_account_creation'
  | 'suspicious_login_activity'
  | 'high_value_transactions'
  | 'velocity_abuse'
  | 'geographic_anomaly';

export type FraudAlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export type FraudAlert = {
  id: string;
  type: FraudAlertType;
  severity: FraudAlertSeverity;
  title: string;
  description: string;
  affectedUsers: string[]; // User IDs involved
  affectedEvents?: string[]; // Event IDs involved (if applicable)
  affectedOrders?: string[]; // Order IDs involved (if applicable)
  metadata: Record<string, any>; // Additional context data
  status: 'active' | 'investigating' | 'resolved' | 'false_positive';
  assignedTo?: string; // Admin user ID
  createdAt: number;
  updatedAt: number;
  resolvedAt?: number;
  resolution?: string;
};

export type FraudPattern = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  thresholds: Record<string, number>;
  lastChecked: number;
  alertsGenerated: number;
};

// Fraud detection storage
const fraudAlerts: Record<string, FraudAlert> = {};
const fraudPatterns: Record<string, FraudPattern> = {};
const fraudAlertsByUser: Record<string, string[]> = {}; // userId -> alertIds
const fraudAlertsByEvent: Record<string, string[]> = {}; // eventId -> alertIds

// Export fraud alerts for API access
export { fraudAlerts };

/**
 * Create a new fraud alert
 */
export function createFraudAlert(
  type: FraudAlertType,
  severity: FraudAlertSeverity,
  title: string,
  description: string,
  affectedUsers: string[],
  metadata: Record<string, any> = {},
  affectedEvents?: string[],
  affectedOrders?: string[]
): FraudAlert {
  const alert: FraudAlert = {
    id: id('fraud_alert'),
    type,
    severity,
    title,
    description,
    affectedUsers,
    affectedEvents,
    affectedOrders,
    metadata,
    status: 'active',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  fraudAlerts[alert.id] = alert;

  // Index by users
  affectedUsers.forEach(userId => {
    if (!fraudAlertsByUser[userId]) {
      fraudAlertsByUser[userId] = [];
    }
    fraudAlertsByUser[userId].push(alert.id);
  });

  // Index by events
  if (affectedEvents) {
    affectedEvents.forEach(eventId => {
      if (!fraudAlertsByEvent[eventId]) {
        fraudAlertsByEvent[eventId] = [];
      }
      fraudAlertsByEvent[eventId].push(alert.id);
    });
  }

  return alert;
}

/**
 * Get all fraud alerts with optional filtering
 */
export function getFraudAlerts(filters?: {
  status?: FraudAlert['status'];
  severity?: FraudAlertSeverity;
  type?: FraudAlertType;
  assignedTo?: string;
  limit?: number;
}): FraudAlert[] {
  let alerts = Object.values(fraudAlerts);

  if (filters?.status) {
    alerts = alerts.filter(a => a.status === filters.status);
  }
  if (filters?.severity) {
    alerts = alerts.filter(a => a.severity === filters.severity);
  }
  if (filters?.type) {
    alerts = alerts.filter(a => a.type === filters.type);
  }
  if (filters?.assignedTo) {
    alerts = alerts.filter(a => a.assignedTo === filters.assignedTo);
  }

  // Sort by severity (critical first) then by creation date (newest first)
  const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
  alerts.sort((a, b) => {
    const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
    if (severityDiff !== 0) return severityDiff;
    return b.createdAt - a.createdAt;
  });

  if (filters?.limit) {
    alerts = alerts.slice(0, filters.limit);
  }

  return alerts;
}

/**
 * Update fraud alert status
 */
export function updateFraudAlert(
  alertId: string,
  updates: Partial<Pick<FraudAlert, 'status' | 'assignedTo' | 'resolution'>>
): FraudAlert | null {
  const alert = fraudAlerts[alertId];
  if (!alert) return null;

  Object.assign(alert, updates, { updatedAt: Date.now() });

  if (updates.status === 'resolved' || updates.status === 'false_positive') {
    alert.resolvedAt = Date.now();
  }

  return alert;
}

/**
 * Check for suspicious refund rates
 */
export function checkSuspiciousRefundRates(): FraudAlert[] {
  const alerts: FraudAlert[] = [];
  const now = Date.now();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  const recentOrders = Object.values(orders).filter(o => o.createdAt > now - oneWeek);

  // Group orders by user
  const ordersByUser: Record<string, Order[]> = {};
  recentOrders.forEach(order => {
    if (!ordersByUser[order.userId]) {
      ordersByUser[order.userId] = [];
    }
    ordersByUser[order.userId].push(order);
  });

  // Check each user's refund rate
  Object.entries(ordersByUser).forEach(([userId, userOrders]) => {
    if (userOrders.length < 3) return; // Need at least 3 orders to detect pattern

    const refundedOrders = userOrders.filter(o => o.status === 'refunded');
    const refundRate = refundedOrders.length / userOrders.length;

    if (refundRate > 0.5) { // More than 50% refund rate
      const severity: FraudAlertSeverity = refundRate > 0.8 ? 'critical' : 'high';
      
      alerts.push(createFraudAlert(
        'suspicious_refund_rate',
        severity,
        `High refund rate detected for user ${userId}`,
        `User has ${refundedOrders.length} refunds out of ${userOrders.length} orders (${Math.round(refundRate * 100)}%) in the past week`,
        [userId],
        {
          refundRate,
          totalOrders: userOrders.length,
          refundedOrders: refundedOrders.length,
          timeframe: 'past_week'
        },
        undefined,
        userOrders.map(o => o.id)
      ));
    }
  });

  return alerts;
}

/**
 * Check for duplicate accounts (same email patterns, similar names, etc.)
 */
export function checkDuplicateAccounts(): FraudAlert[] {
  const alerts: FraudAlert[] = [];
  const profiles = Object.values(userProfiles);

  // Group by similar display names (fuzzy matching)
  const nameGroups: Record<string, UserProfile[]> = {};
  profiles.forEach(profile => {
    const normalizedName = profile.displayName.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (normalizedName.length < 3) return; // Skip very short names

    if (!nameGroups[normalizedName]) {
      nameGroups[normalizedName] = [];
    }
    nameGroups[normalizedName].push(profile);
  });

  // Check for suspicious name duplicates
  Object.entries(nameGroups).forEach(([normalizedName, groupProfiles]) => {
    if (groupProfiles.length > 1) {
      // Check if accounts were created close together
      const creationTimes = groupProfiles.map(p => p.createdAt).sort();
      const timeDiffs = creationTimes.slice(1).map((time, i) => time - creationTimes[i]);
      const hasRapidCreation = timeDiffs.some(diff => diff < 60 * 60 * 1000); // Within 1 hour

      if (hasRapidCreation) {
        alerts.push(createFraudAlert(
          'duplicate_accounts',
          'medium',
          `Potential duplicate accounts detected`,
          `${groupProfiles.length} accounts with similar names created within short timeframe`,
          groupProfiles.map(p => p.userId),
          {
            similarName: normalizedName,
            accountCount: groupProfiles.length,
            creationTimes: creationTimes,
            profiles: groupProfiles.map(p => ({
              userId: p.userId,
              displayName: p.displayName,
              createdAt: p.createdAt
            }))
          }
        ));
      }
    }
  });

  return alerts;
}

/**
 * Check for unusual payment patterns
 */
export function checkUnusualPaymentPatterns(): FraudAlert[] {
  const alerts: FraudAlert[] = [];
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  const recentTransactions = transactions.filter(t => t.createdAt > now - oneHour);

  // Group transactions by user
  const transactionsByUser: Record<string, Transaction[]> = {};
  recentTransactions.forEach(transaction => {
    if (!transactionsByUser[transaction.userId]) {
      transactionsByUser[transaction.userId] = [];
    }
    transactionsByUser[transaction.userId].push(transaction);
  });

  // Check for velocity abuse (too many transactions in short time)
  Object.entries(transactionsByUser).forEach(([userId, userTransactions]) => {
    const creditTransactions = userTransactions.filter(t => t.type === 'credit');
    
    if (creditTransactions.length > 10) { // More than 10 credits in 1 hour
      alerts.push(createFraudAlert(
        'velocity_abuse',
        'high',
        `Velocity abuse detected for user ${userId}`,
        `User made ${creditTransactions.length} credit transactions in the past hour`,
        [userId],
        {
          transactionCount: creditTransactions.length,
          timeframe: 'past_hour',
          totalAmount: creditTransactions.reduce((sum, t) => sum + t.amount, 0)
        }
      ));
    }

    // Check for high-value transactions
    const highValueTransactions = userTransactions.filter(t => t.amount > 100000); // > $1000
    if (highValueTransactions.length > 0) {
      alerts.push(createFraudAlert(
        'high_value_transactions',
        'medium',
        `High-value transactions detected for user ${userId}`,
        `User made ${highValueTransactions.length} transactions over $1000`,
        [userId],
        {
          highValueCount: highValueTransactions.length,
          amounts: highValueTransactions.map(t => t.amount),
          descriptions: highValueTransactions.map(t => t.description)
        }
      ));
    }
  });

  return alerts;
}

/**
 * Check for rapid account creation patterns
 */
export function checkRapidAccountCreation(): FraudAlert[] {
  const alerts: FraudAlert[] = [];
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  const recentProfiles = Object.values(userProfiles).filter(p => p.createdAt > now - oneHour);

  if (recentProfiles.length > 20) { // More than 20 accounts in 1 hour
    alerts.push(createFraudAlert(
      'rapid_account_creation',
      'high',
      `Rapid account creation detected`,
      `${recentProfiles.length} accounts created in the past hour`,
      recentProfiles.map(p => p.userId),
      {
        accountCount: recentProfiles.length,
        timeframe: 'past_hour',
        creationTimes: recentProfiles.map(p => p.createdAt)
      }
    ));
  }

  return alerts;
}

/**
 * Run all fraud detection checks
 */
export function runFraudDetection(): {
  newAlerts: FraudAlert[];
  totalActiveAlerts: number;
  criticalAlerts: number;
} {
  const newAlerts: FraudAlert[] = [];

  // Run all detection checks
  newAlerts.push(...checkSuspiciousRefundRates());
  newAlerts.push(...checkDuplicateAccounts());
  newAlerts.push(...checkUnusualPaymentPatterns());
  newAlerts.push(...checkRapidAccountCreation());

  // Get current alert counts
  const activeAlerts = getFraudAlerts({ status: 'active' });
  const criticalAlerts = getFraudAlerts({ status: 'active', severity: 'critical' });

  return {
    newAlerts,
    totalActiveAlerts: activeAlerts.length,
    criticalAlerts: criticalAlerts.length,
  };
}

/**
 * Get fraud detection statistics for admin dashboard
 */
export function getFraudDetectionStats(): {
  totalAlerts: number;
  activeAlerts: number;
  criticalAlerts: number;
  resolvedAlerts: number;
  falsePositives: number;
  alertsByType: Record<FraudAlertType, number>;
  alertsBySeverity: Record<FraudAlertSeverity, number>;
  recentAlerts: FraudAlert[];
} {
  const allAlerts = Object.values(fraudAlerts);
  
  const stats = {
    totalAlerts: allAlerts.length,
    activeAlerts: allAlerts.filter(a => a.status === 'active').length,
    criticalAlerts: allAlerts.filter(a => a.status === 'active' && a.severity === 'critical').length,
    resolvedAlerts: allAlerts.filter(a => a.status === 'resolved').length,
    falsePositives: allAlerts.filter(a => a.status === 'false_positive').length,
    alertsByType: {} as Record<FraudAlertType, number>,
    alertsBySeverity: {} as Record<FraudAlertSeverity, number>,
    recentAlerts: getFraudAlerts({ limit: 5 }),
  };

  // Count by type
  allAlerts.forEach(alert => {
    stats.alertsByType[alert.type] = (stats.alertsByType[alert.type] || 0) + 1;
    stats.alertsBySeverity[alert.severity] = (stats.alertsBySeverity[alert.severity] || 0) + 1;
  });

  return stats;
}

/**
 * Initialize sample fraud alerts for testing
 */
// Fraud alert data comes from the backend API

// ── Platform Announcement Functions ──────────────────────────────────────────

/**
 * Create a new platform announcement
 */
export function createAnnouncement(data: {
  title: string;
  content: string;
  targetType: AnnouncementTargetType;
  priority: AnnouncementPriority;
  scheduledAt?: number;
  expiresAt?: number;
  createdBy: string;
}): Announcement {
  const announcement: Announcement = {
    id: id("ann"),
    title: data.title,
    content: data.content,
    targetType: data.targetType,
    priority: data.priority,
    status: data.scheduledAt ? 'scheduled' : 'published',
    scheduledAt: data.scheduledAt,
    publishedAt: data.scheduledAt ? undefined : Date.now(),
    expiresAt: data.expiresAt,
    createdBy: data.createdBy,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  announcements[announcement.id] = announcement;
  return announcement;
}

/**
 * Get all announcements with optional filtering
 */
export function getAnnouncements(filters?: {
  status?: AnnouncementStatus;
  targetType?: AnnouncementTargetType;
  priority?: AnnouncementPriority;
  limit?: number;
  offset?: number;
}): Announcement[] {
  let results = Object.values(announcements);

  // Apply filters
  if (filters?.status) {
    results = results.filter(a => a.status === filters.status);
  }
  if (filters?.targetType) {
    results = results.filter(a => a.targetType === filters.targetType);
  }
  if (filters?.priority) {
    results = results.filter(a => a.priority === filters.priority);
  }

  // Sort by creation date (newest first)
  results.sort((a, b) => b.createdAt - a.createdAt);

  // Apply pagination
  if (filters?.offset || filters?.limit) {
    const offset = filters.offset || 0;
    const limit = filters.limit || results.length;
    results = results.slice(offset, offset + limit);
  }

  return results;
}

/**
 * Get active announcements for a specific user type
 */
export function getActiveAnnouncementsForUser(userRole: string): Announcement[] {
  const now = Date.now();
  
  return Object.values(announcements).filter(announcement => {
    // Check if announcement is published and not expired
    if (announcement.status !== 'published') return false;
    if (announcement.expiresAt && announcement.expiresAt < now) return false;
    
    // Check if announcement targets this user type
    if (announcement.targetType === 'all') return true;
    if (announcement.targetType === userRole) return true;
    
    return false;
  }).sort((a, b) => {
    // Sort by priority first (urgent > high > medium > low), then by creation date
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    const aPriority = priorityOrder[a.priority];
    const bPriority = priorityOrder[b.priority];
    
    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }
    
    return b.createdAt - a.createdAt;
  });
}

/**
 * Get a specific announcement by ID
 */
export function getAnnouncement(announcementId: string): Announcement | null {
  return announcements[announcementId] || null;
}

/**
 * Update an announcement
 */
export function updateAnnouncement(
  announcementId: string, 
  updates: Partial<Omit<Announcement, 'id' | 'createdAt' | 'createdBy'>>
): Announcement | null {
  const announcement = announcements[announcementId];
  if (!announcement) return null;

  const updatedAnnouncement = {
    ...announcement,
    ...updates,
    updatedAt: Date.now(),
  };

  announcements[announcementId] = updatedAnnouncement;
  return updatedAnnouncement;
}

/**
 * Delete an announcement
 */
export function deleteAnnouncement(announcementId: string): boolean {
  if (!announcements[announcementId]) return false;
  delete announcements[announcementId];
  
  // Also delete all views for this announcement
  Object.keys(announcementViews).forEach(userId => {
    announcementViews[userId] = announcementViews[userId].filter(
      view => view.announcementId !== announcementId
    );
  });
  
  return true;
}

/**
 * Record that a user viewed an announcement
 */
export function recordAnnouncementView(userId: string, announcementId: string): AnnouncementView {
  if (!announcementViews[userId]) {
    announcementViews[userId] = [];
  }

  // Check if user already viewed this announcement
  const existingView = announcementViews[userId].find(v => v.announcementId === announcementId);
  if (existingView) {
    return existingView;
  }

  const view: AnnouncementView = {
    id: id("view"),
    announcementId,
    userId,
    viewedAt: Date.now(),
  };

  announcementViews[userId].push(view);
  return view;
}

/**
 * Mark an announcement as dismissed by a user
 */
export function dismissAnnouncement(userId: string, announcementId: string): AnnouncementView | null {
  if (!announcementViews[userId]) {
    announcementViews[userId] = [];
  }

  const view = announcementViews[userId].find(v => v.announcementId === announcementId);
  if (view) {
    view.dismissed = true;
    view.dismissedAt = Date.now();
    return view;
  }

  // Create a new view record if it doesn't exist
  const newView: AnnouncementView = {
    id: id("view"),
    announcementId,
    userId,
    viewedAt: Date.now(),
    dismissed: true,
    dismissedAt: Date.now(),
  };

  announcementViews[userId].push(newView);
  return newView;
}

/**
 * Get announcement views for a specific announcement
 */
export function getAnnouncementViews(announcementId: string): AnnouncementView[] {
  const views: AnnouncementView[] = [];
  
  Object.values(announcementViews).forEach(userViews => {
    const announcementView = userViews.find(v => v.announcementId === announcementId);
    if (announcementView) {
      views.push(announcementView);
    }
  });
  
  return views;
}

/**
 * Get announcement statistics
 */
export function getAnnouncementStats(announcementId?: string): {
  totalAnnouncements: number;
  activeAnnouncements: number;
  scheduledAnnouncements: number;
  expiredAnnouncements: number;
  totalViews: number;
  totalDismissals: number;
  viewsByAnnouncement?: { announcementId: string; views: number; dismissals: number };
} {
  const allAnnouncements = Object.values(announcements);
  const now = Date.now();
  
  const stats = {
    totalAnnouncements: allAnnouncements.length,
    activeAnnouncements: allAnnouncements.filter(a => 
      a.status === 'published' && (!a.expiresAt || a.expiresAt > now)
    ).length,
    scheduledAnnouncements: allAnnouncements.filter(a => a.status === 'scheduled').length,
    expiredAnnouncements: allAnnouncements.filter(a => 
      a.expiresAt && a.expiresAt < now
    ).length,
    totalViews: 0,
    totalDismissals: 0,
  };

  // Count total views and dismissals
  Object.values(announcementViews).forEach(userViews => {
    userViews.forEach(view => {
      if (!announcementId || view.announcementId === announcementId) {
        stats.totalViews++;
        if (view.dismissed) {
          stats.totalDismissals++;
        }
      }
    });
  });

  // If specific announcement requested, get its stats
  if (announcementId) {
    const views = getAnnouncementViews(announcementId);
    return {
      ...stats,
      viewsByAnnouncement: {
        announcementId,
        views: views.length,
        dismissals: views.filter(v => v.dismissed).length,
      },
    };
  }

  return stats;
}

/**
 * Process scheduled announcements (should be called periodically)
 */
export function processScheduledAnnouncements(): Announcement[] {
  const now = Date.now();
  const publishedAnnouncements: Announcement[] = [];
  
  Object.values(announcements).forEach(announcement => {
    if (
      announcement.status === 'scheduled' && 
      announcement.scheduledAt && 
      announcement.scheduledAt <= now
    ) {
      announcement.status = 'published';
      announcement.publishedAt = now;
      announcement.updatedAt = now;
      publishedAnnouncements.push(announcement);
    }
  });
  
  return publishedAnnouncements;
}

/**
 * Get unread announcements for a user
 */
export function getUnreadAnnouncementsForUser(userId: string, userRole: string): Announcement[] {
  const activeAnnouncements = getActiveAnnouncementsForUser(userRole);
  const userViews = announcementViews[userId] || [];
  
  return activeAnnouncements.filter(announcement => {
    const view = userViews.find(v => v.announcementId === announcement.id);
    return !view || !view.dismissed;
  });
}

// ── Audit Logging Types ──────────────────────────────────────────────────────

// ── Audit Logging Functions ──────────────────────────────────────────────────

/**
 * Log an admin action to the audit log.
 * Signature: (adminUserId, adminUserName, action, targetType, targetId, details, targetName?, request?)
 */
export function logAdminAction(
  adminUserId: string,
  adminUserName: string,
  action: AuditLogAction,
  targetType: AuditLogTargetType,
  targetId: string,
  details: Record<string, any>,
  targetName?: string,
  request?: { headers?: { get?: (key: string) => string | null } }
): AuditLog {
  const log: AuditLog = {
    id: `audit_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`,
    adminUserId,
    adminUserName,
    action,
    targetType,
    targetId,
    targetName,
    details,
    ipAddress: request?.headers?.get?.('x-forwarded-for') || undefined,
    userAgent: request?.headers?.get?.('user-agent') || undefined,
    timestamp: Date.now(),
  };
  auditLogs.push(log);
  return log;
}

/**
 * Get audit logs with optional filters and pagination
 */
export function getAuditLogs(params?: {
  adminUserId?: string;
  action?: AuditLogAction;
  targetType?: AuditLogTargetType;
  startDate?: number;
  endDate?: number;
  page?: number;
  limit?: number;
}): { logs: AuditLog[]; total: number; page: number; totalPages: number } {
  let filtered = [...auditLogs];

  if (params?.adminUserId) {
    filtered = filtered.filter(l => l.adminUserId === params.adminUserId);
  }
  if (params?.action) {
    filtered = filtered.filter(l => l.action === params.action);
  }
  if (params?.targetType) {
    filtered = filtered.filter(l => l.targetType === params.targetType);
  }
  if (params?.startDate) {
    filtered = filtered.filter(l => l.timestamp >= params.startDate!);
  }
  if (params?.endDate) {
    filtered = filtered.filter(l => l.timestamp <= params.endDate!);
  }

  // Sort newest first
  filtered.sort((a, b) => b.timestamp - a.timestamp);

  const total = filtered.length;
  const page = params?.page || 1;
  const limit = params?.limit || 50;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const logs = filtered.slice(offset, offset + limit);

  return { logs, total, page, totalPages };
}

/**
 * Get audit log statistics for a given period
 */
export function getAuditLogStats(period: 'day' | 'week' | 'month' = 'month'): {
  total: number;
  byAction: Record<string, number>;
  byTargetType: Record<string, number>;
  recentActivity: AuditLog[];
} {
  const periodMs = {
    day: 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
  };
  const since = Date.now() - periodMs[period];
  const recent = auditLogs.filter(l => l.timestamp >= since);

  const byAction: Record<string, number> = {};
  const byTargetType: Record<string, number> = {};

  for (const log of recent) {
    byAction[log.action] = (byAction[log.action] || 0) + 1;
    byTargetType[log.targetType] = (byTargetType[log.targetType] || 0) + 1;
  }

  return {
    total: recent.length,
    byAction,
    byTargetType,
    recentActivity: recent.slice(0, 10),
  };
}

// Audit log data comes from the backend API

// ── Vendor Listing Helper ────────────────────────────────────────────────────

/**
 * Get all approved vendor profiles as an array
 */
export function getAllVendors(): VendorProfile[] {
  return Object.values(vendors).filter(v => v.status === 'approved');
}
