// ── Admin, Announcement & Virtual Event Types ────────────────────────────────

export type AnnouncementTargetType = "all" | "attendee" | "organiser" | "vendor";

export type AnnouncementPriority = "low" | "medium" | "high" | "urgent";

export type AnnouncementStatus = "draft" | "scheduled" | "published" | "expired";

export type Announcement = {
  id: string;
  title: string;
  content: string;
  targetType: AnnouncementTargetType;
  priority: AnnouncementPriority;
  status: AnnouncementStatus;
  scheduledAt?: number;
  publishedAt?: number;
  expiresAt?: number;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
};

export type AnnouncementView = {
  id: string;
  announcementId: string;
  userId: string;
  viewedAt: number;
  dismissed?: boolean;
  dismissedAt?: number;
};

// ── Dispute & Refund Types ───────────────────────────────────────────────────

export type DisputeStatus = "open" | "under_review" | "resolved" | "rejected";

export type DisputeReason =
  | "event_cancelled"
  | "event_changed"
  | "ticket_not_received"
  | "fraudulent_charge"
  | "other";

export type Dispute = {
  id: string;
  orderId: string;
  userId: string;
  reason: DisputeReason;
  description: string;
  status: DisputeStatus;
  assignedTo?: string;
  createdAt: number;
  resolvedAt?: number;
  resolution?: string;
};

export type RefundStatus = "pending" | "processing" | "completed" | "rejected";

export type RefundProcessing = {
  id: string;
  disputeId: string;
  orderId: string;
  userId: string;
  amount: number;
  status: RefundStatus;
  createdAt: number;
  processedAt?: number;
};

// ── Commission Types ─────────────────────────────────────────────────────────

export type CommissionStatus = "pending" | "settled" | "disputed";

export type EventCommission = {
  id: string;
  eventId: string;
  organizerId: string;
  totalRevenue: number;
  commissionRate: number;
  commissionAmount: number;
  netAmount: number;
  status: CommissionStatus;
  createdAt: number;
  settledAt?: number;
};

export type CommissionSettlementStatus = "pending" | "processing" | "completed" | "failed";

export type CommissionSettlement = {
  id: string;
  commissionId: string;
  organizerId: string;
  amount: number;
  status: CommissionSettlementStatus;
  paymentMethod: string;
  createdAt: number;
  completedAt?: number;
};

export type CommissionReport = {
  id: string;
  periodStart: number;
  periodEnd: number;
  totalRevenue: number;
  totalCommissions: number;
  totalSettled: number;
  totalPending: number;
  totalDisputed: number;
  createdAt: number;
};

// ── Fraud Detection Types ────────────────────────────────────────────────────

export type FraudStatus = "flagged" | "under_review" | "confirmed" | "cleared";

export type FraudType =
  | "suspicious_activity"
  | "multiple_refunds"
  | "fake_tickets"
  | "payment_fraud"
  | "account_abuse";

export type FraudCase = {
  id: string;
  userId: string;
  type: FraudType;
  description: string;
  status: FraudStatus;
  evidence: string[];
  createdAt: number;
  resolvedAt?: number;
  resolution?: string;
};

// ── Audit Log Types ──────────────────────────────────────────────────────────

export type AuditAction =
  | "user_created"
  | "user_updated"
  | "user_deleted"
  | "event_created"
  | "event_updated"
  | "event_deleted"
  | "payment_processed"
  | "refund_issued"
  | "dispute_resolved"
  | "announcement_created"
  | "featured_event_added"
  | "featured_event_removed"
  | "commission_settled"
  | "fraud_case_created"
  | "fraud_case_resolved";

export type AuditLog = {
  id: string;
  userId: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  details: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: number;
};

// ── Virtual Event Types ──────────────────────────────────────────────────────

export type ChatMessageType = "message" | "system";

export type ChatMessage = {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: number;
  type: ChatMessageType;
  emoji?: string;
};

export type UserPresenceStatus = "online" | "away" | "offline";

export type UserPresence = {
  userId: string;
  userName: string;
  eventId: string;
  status: UserPresenceStatus;
  lastSeen: number;
  joinedAt: number;
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

export type ReactionType = "clap" | "heart" | "fire" | "party" | "thumbs-up";

export type Reaction = {
  id: string;
  eventId: string;
  userId: string;
  type: ReactionType;
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
  totalWatchTime: number;
  lastHeartbeat: number;
};

// ── Discussion Board Types ───────────────────────────────────────────────────

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
  parentReplyId?: string;
  authorId: string;
  authorName: string;
  content: string;
  likes: number;
  createdAt: number;
};
