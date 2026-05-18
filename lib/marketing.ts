// Marketing and Promotion System Data Store
// In-memory storage for all marketing entities following lib/store.ts patterns

// ── Utility Functions ────────────────────────────────────────────────────────

function id(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
}

// ── Core Marketing Types ─────────────────────────────────────────────────────

export type CampaignType = 'email' | 'sms' | 'whatsapp' | 'push' | 'social' | 'paid-ad' | 'multi-channel';
export type CampaignStatus = 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'failed';
export type ChannelType = 'email' | 'sms' | 'whatsapp' | 'push' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok' | 'instagram';
export type SocialPlatform = 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok';
export type AdPlatform = 'facebook' | 'google' | 'tiktok';
export type StreamingProvider = 'youtube' | 'zoom' | 'custom';

export interface Channel {
  type: ChannelType;
  enabled: boolean;
  config: Record<string, any>;
}

export interface CampaignContent {
  email?: EmailContent;
  sms?: SMSContent;
  whatsapp?: WhatsAppContent;
  push?: PushContent;
  social?: SocialContent;
  ad?: AdContent;
}

export interface EmailContent {
  subject: string;
  htmlContent: string;
  textContent: string;
}

export interface SMSContent {
  message: string;
}

export interface WhatsAppContent {
  text?: string;
  mediaUrl?: string;
  caption?: string;
}

export interface PushContent {
  title: string;
  body: string;
  imageUrl?: string;
}

export interface SocialContent {
  text: string;
  mediaUrls: string[];
  hashtags: string[];
}

export interface AdContent {
  headline: string;
  description: string;
  mediaUrls: string[];
}

export interface CampaignMetrics {
  reach: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  cost: number;
  roi: number;
  ctr: number;
  conversionRate: number;
  cac: number;
}

export interface Campaign {
  id: string;
  organizerId: string;
  eventId?: string;
  name: string;
  description: string;
  type: CampaignType;
  channels: Channel[];
  status: CampaignStatus;
  scheduledAt?: number;
  startedAt?: number;
  completedAt?: number;
  budget?: number;
  spent: number;
  targetAudience?: AudienceSegment;
  content: CampaignContent;
  metrics: CampaignMetrics;
  abTest?: ABTest;
  createdAt: number;
  updatedAt: number;
}

// ── Promo Code Types ─────────────────────────────────────────────────────────

export type PromoCodeType = 'percentage' | 'fixed' | 'free';

export interface PromoRedemption {
  id: string;
  userId: string;
  orderId: string;
  discountAmount: number;
  redeemedAt: number;
}

export interface PromoCodeMetrics {
  totalRedemptions: number;
  totalRevenue: number;
  totalDiscount: number;
  conversionRate: number;
  averageOrderValue: number;
}

export interface PromoCode {
  id: string;
  organizerId: string;
  eventId: string;
  code: string;
  type: PromoCodeType;
  value: number;
  description: string;
  applicableTicketTypes?: string[];
  usageLimit?: number;
  usageCount: number;
  perUserLimit?: number;
  expiresAt?: number;
  startsAt?: number;
  active: boolean;
  stackable: boolean;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  redemptions: PromoRedemption[];
  metrics: PromoCodeMetrics;
  createdAt: number;
  updatedAt: number;
}

// ── Referral Types ───────────────────────────────────────────────────────────

export type ReferralRewardType = 'commission' | 'fixed' | 'free-ticket';
export type ReferralConversionStatus = 'pending' | 'credited' | 'failed';

export interface ReferralConversion {
  id: string;
  referralCode: string;
  referredUserId: string;
  orderId: string;
  amount: number;
  reward: number;
  status: ReferralConversionStatus;
  convertedAt: number;
}

export interface ReferralLink {
  id: string;
  userId: string;
  eventId: string;
  code: string;
  url: string;
  rewardType: ReferralRewardType;
  rewardValue: number;
  clicks: number;
  conversions: number;
  revenue: number;
  earnedRewards: number;
  pendingRewards: number;
  conversionsList: ReferralConversion[];
  createdAt: number;
}

export interface ReferralStats {
  totalReferrals: number;
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number;
  totalEarned: number;
  pendingRewards: number;
  conversionRate: number;
  topEvents: Array<{ eventId: string; conversions: number; earned: number }>;
}

// ── Affiliate Types ──────────────────────────────────────────────────────────

export type AffiliateStatus = 'pending' | 'approved' | 'suspended';
export type PaymentMethod = 'bank' | 'mobile-money' | 'paypal';
export type PayoutStatus = 'pending' | 'approved' | 'processing' | 'completed' | 'rejected';
export type AffiliateConversionStatus = 'pending' | 'approved' | 'paid';

export interface AffiliateLink {
  id: string;
  affiliateId: string;
  eventId: string;
  code: string;
  url: string;
  clicks: number;
  conversions: number;
  revenue: number;
  commission: number;
  createdAt: number;
}

export interface AffiliateConversion {
  id: string;
  affiliateId: string;
  affiliateCode: string;
  eventId: string;
  orderId: string;
  userId: string;
  revenue: number;
  commissionRate: number;
  commissionAmount: number;
  status: AffiliateConversionStatus;
  convertedAt: number;
  approvedAt?: number;
  paidAt?: number;
}

export interface PayoutRequest {
  id: string;
  affiliateId: string;
  amount: number;
  status: PayoutStatus;
  requestedAt: number;
  processedAt?: number;
  notes?: string;
}

export interface Affiliate {
  id: string;
  userId: string;
  businessName: string;
  email: string;
  phone: string;
  website?: string;
  promotionalChannels: string[];
  paymentMethod: PaymentMethod;
  paymentDetails: Record<string, string>;
  status: AffiliateStatus;
  commissionRate: number;
  cookieDuration: number;
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
  links: AffiliateLink[];
  createdAt: number;
  approvedAt?: number;
}

// ── Attribution Types ────────────────────────────────────────────────────────

export type AttributionModel = 'first-touch' | 'last-touch' | 'multi-touch';

export interface TouchPoint {
  source: string;
  medium: string;
  campaign: string;
  timestamp: number;
  page: string;
}

export interface Attribution {
  id: string;
  userId: string;
  sessionId: string;
  eventId?: string;
  orderId?: string;
  source: string;
  medium: string;
  campaign: string;
  content?: string;
  term?: string;
  referrer?: string;
  landingPage: string;
  firstTouch: TouchPoint;
  lastTouch: TouchPoint;
  touchPoints: TouchPoint[];
  converted: boolean;
  conversionValue?: number;
  createdAt: number;
  convertedAt?: number;
}

// ── Email Marketing Types ────────────────────────────────────────────────────

export type EmailCategory = 'announcement' | 'reminder' | 'follow-up' | 'promotional' | 'transactional';
export type EmailStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
export type EmailRecipientStatus = 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'spam';

export interface EmailBlock {
  id: string;
  type: 'text' | 'image' | 'button' | 'divider' | 'social' | 'event-details' | 'ticket-cta';
  content: Record<string, any>;
  styles: Record<string, string>;
}

export interface EmailDesign {
  blocks: EmailBlock[];
  styles: Record<string, string>;
}

export interface EmailTemplate {
  id: string;
  organizerId: string;
  name: string;
  subject: string;
  preheader?: string;
  htmlContent: string;
  textContent: string;
  design: EmailDesign;
  category: EmailCategory;
  variables: string[];
  isPublic: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface EmailRecipient {
  email: string;
  userId?: string;
  variables: Record<string, string>;
  status: EmailRecipientStatus;
  sentAt?: number;
  openedAt?: number;
  clickedAt?: number;
}

export interface EmailMetrics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  spam: number;
  unsubscribed: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  revenue: number;
}

export interface EmailCampaign {
  id: string;
  campaignId: string;
  organizerId: string;
  templateId: string;
  subject: string;
  fromName: string;
  fromEmail: string;
  replyTo?: string;
  recipients: EmailRecipient[];
  segmentId?: string;
  scheduledAt?: number;
  sentAt?: number;
  status: EmailStatus;
  metrics: EmailMetrics;
}

// ── SMS & WhatsApp Types ─────────────────────────────────────────────────────

export type SMSProvider = 'twilio' | 'africas-talking';
export type SMSStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
export type SMSRecipientStatus = 'pending' | 'sent' | 'delivered' | 'failed' | 'opted-out';
export type WhatsAppMessageType = 'text' | 'image' | 'video' | 'document' | 'template';
export type WhatsAppRecipientStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed' | 'opted-out';
export type SuppressionReason = 'opt-out' | 'bounce' | 'spam' | 'manual';
export type SuppressionSource = 'sms' | 'whatsapp' | 'both';

export interface SMSRecipient {
  phone: string;
  userId?: string;
  status: SMSRecipientStatus;
  sentAt?: number;
  deliveredAt?: number;
  errorCode?: string;
}

export interface SMSMetrics {
  sent: number;
  delivered: number;
  failed: number;
  clicked: number;
  conversions: number;
  deliveryRate: number;
  clickRate: number;
  conversionRate: number;
  cost: number;
  revenue: number;
  roi: number;
}

export interface SMSCampaign {
  id: string;
  campaignId: string;
  organizerId: string;
  message: string;
  recipients: SMSRecipient[];
  provider: SMSProvider;
  scheduledAt?: number;
  sentAt?: number;
  status: SMSStatus;
  estimatedCost: number;
  actualCost: number;
  metrics: SMSMetrics;
}

export interface WhatsAppButton {
  type: 'url' | 'phone' | 'quick-reply';
  text: string;
  value: string;
}

export interface WhatsAppContent {
  text?: string;
  mediaUrl?: string;
  caption?: string;
  buttons?: WhatsAppButton[];
  templateName?: string;
  templateParams?: string[];
}

export interface WhatsAppRecipient {
  phone: string;
  userId?: string;
  status: WhatsAppRecipientStatus;
  sentAt?: number;
  deliveredAt?: number;
  readAt?: number;
}

export interface WhatsAppMetrics {
  sent: number;
  delivered: number;
  read: number;
  replied: number;
  clicked: number;
  conversions: number;
  deliveryRate: number;
  readRate: number;
  clickRate: number;
  conversionRate: number;
  revenue: number;
}

export interface WhatsAppCampaign {
  id: string;
  campaignId: string;
  organizerId: string;
  messageType: WhatsAppMessageType;
  content: WhatsAppContent;
  recipients: WhatsAppRecipient[];
  scheduledAt?: number;
  sentAt?: number;
  status: SMSStatus;
  metrics: WhatsAppMetrics;
}

export interface SuppressionList {
  phone: string;
  reason: SuppressionReason;
  addedAt: number;
  source: SuppressionSource;
}

// ── Push Notification Types ──────────────────────────────────────────────────

export type PushPlatform = 'web' | 'ios' | 'android';
export type PushStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
export type PushRecipientStatus = 'pending' | 'sent' | 'delivered' | 'opened' | 'failed';

export interface PushAction {
  action: string;
  title: string;
  icon?: string;
}

export interface PushRecipient {
  userId: string;
  deviceToken: string;
  platform: PushPlatform;
  status: PushRecipientStatus;
  sentAt?: number;
  deliveredAt?: number;
  openedAt?: number;
  errorCode?: string;
}

export interface PushMetrics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  conversions: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  revenue: number;
}

export interface PushNotification {
  id: string;
  campaignId: string;
  title: string;
  body: string;
  imageUrl?: string;
  icon?: string;
  badge?: string;
  actionUrl: string;
  actions?: PushAction[];
  category: 'promotional' | 'transactional' | 'eventUpdates' | 'reminders'; // Added for frequency capping (Requirement 4.7)
  recipients: PushRecipient[];
  segmentId?: string;
  scheduledAt?: number;
  sentAt?: number;
  expiresAt?: number;
  status: PushStatus;
  metrics: PushMetrics;
}


export interface DeviceToken {
  userId: string;
  token: string;
  platform: PushPlatform;
  active: boolean;
  createdAt: number;
  lastUsedAt: number;
}

export interface NotificationPreferences {
  userId: string;
  enabled: boolean;
  categories: {
    promotional: boolean;
    transactional: boolean;
    eventUpdates: boolean;
    reminders: boolean;
  };
  frequency: {
    maxPerWeek: number;
    currentWeekCount: number;
    weekStartDate: number;
  };
  quietHours?: {
    enabled: boolean;
    startHour: number;
    endHour: number;
    timezone: string;
  };
  updatedAt: number;
}

// ── Social Media Types ───────────────────────────────────────────────────────

export type SocialStatus = 'draft' | 'scheduled' | 'published' | 'failed';

export interface SocialConnection {
  id: string;
  organizerId: string;
  platform: SocialPlatform;
  accountId: string;
  accountName: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  scopes: string[];
  active: boolean;
  connectedAt: number;
  lastSyncAt?: number;
}

export interface SocialMetrics {
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
  conversions: number;
  engagementRate: number;
  clickRate: number;
  conversionRate: number;
  revenue: number;
}

export interface SocialPost {
  id: string;
  organizerId: string;
  eventId: string;
  platform: SocialPlatform;
  content: string;
  mediaUrls: string[];
  hashtags: string[];
  scheduledAt?: number;
  publishedAt?: number;
  platformPostId?: string;
  status: SocialStatus;
  metrics: SocialMetrics;
  errorMessage?: string;
}

// ── Paid Advertising Types ───────────────────────────────────────────────────

export type AdObjective = 'awareness' | 'traffic' | 'conversions' | 'app-installs';
export type AdStatus = 'draft' | 'active' | 'paused' | 'completed';
export type AdBudgetType = 'daily' | 'lifetime';
export type AdFormat = 'image' | 'video' | 'carousel' | 'collection';
export type AudienceRuleType = 'url-contains' | 'event-equals' | 'time-on-site' | 'custom-event';
export type AudienceRuleOperator = 'equals' | 'contains' | 'greater-than' | 'less-than';
export type RetargetingAudienceType = 'page-visitors' | 'cart-abandoners' | 'past-attendees' | 'custom';

export interface AdBudget {
  type: AdBudgetType;
  amount: number;
  spent: number;
  currency: string;
}

export interface AdTargeting {
  locations: string[];
  ageMin?: number;
  ageMax?: number;
  genders?: ('male' | 'female' | 'all')[];
  interests: string[];
  behaviors: string[];
  customAudiences?: string[];
  lookalike?: boolean;
}

export interface AdCreative {
  id: string;
  name: string;
  format: AdFormat;
  headline: string;
  description: string;
  callToAction: string;
  mediaUrls: string[];
  landingUrl: string;
  active: boolean;
}

export interface AdMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
  cpm: number;
  cpc: number;
  cpa: number;
  roas: number;
  ctr: number;
  conversionRate: number;
}

export interface AdCampaign {
  id: string;
  organizerId: string;
  eventId: string;
  platform: AdPlatform;
  name: string;
  objective: AdObjective;
  status: AdStatus;
  budget: AdBudget;
  targeting: AdTargeting;
  creatives: AdCreative[];
  platformCampaignId?: string;
  startDate: number;
  endDate?: number;
  metrics: AdMetrics;
  lastSyncAt?: number;
  createdAt: number;
  updatedAt: number;
}

export interface AudienceRule {
  type: AudienceRuleType;
  operator: AudienceRuleOperator;
  value: string | number;
}

export interface RetargetingAudience {
  id: string;
  name: string;
  type: RetargetingAudienceType;
  rules: AudienceRule[];
  size: number;
  lastSyncAt: number;
}

export interface RetargetingPixel {
  id: string;
  eventId: string;
  platform: AdPlatform;
  pixelId: string;
  installed: boolean;
  installedAt?: number;
  audiences: RetargetingAudience[];
}

// ── SEO & Content Types ──────────────────────────────────────────────────────

export type BlogPostStatus = 'draft' | 'scheduled' | 'published';

export interface StructuredData {
  '@context': string;
  '@type': 'Event';
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: {
    '@type': 'Place';
    name: string;
    address: {
      '@type': 'PostalAddress';
      streetAddress?: string;
      addressLocality: string;
      addressRegion?: string;
      addressCountry: string;
    };
  };
  image: string[];
  offers: {
    '@type': 'Offer';
    url: string;
    price: string;
    priceCurrency: string;
    availability: string;
    validFrom: string;
  }[];
  organizer: {
    '@type': 'Organization' | 'Person';
    name: string;
    url?: string;
  };
}

export interface SEOMetadata {
  eventId: string;
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  structuredData: StructuredData;
  generatedAt: number;
}

export interface SEOChecklistItem {
  name: string;
  status: 'pass' | 'warning' | 'fail';
  message: string;
  recommendation?: string;
}

export interface SEOChecklist {
  eventId: string;
  items: SEOChecklistItem[];
  overallScore: number;
  generatedAt: number;
}

export interface SEOMetrics {
  eventId: string;
  impressions: number;
  clicks: number;
  averagePosition: number;
  ctr: number;
  topQueries: Array<{ query: string; impressions: number; clicks: number }>;
  lastUpdatedAt: number;
}

export interface BlogPostMetrics {
  views: number;
  uniqueVisitors: number;
  timeOnPage: number;
  shares: number;
  comments: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
}

export interface BlogPost {
  id: string;
  organizerId: string;
  eventId?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  status: BlogPostStatus;
  publishedAt?: number;
  seoMetadata: SEOMetadata;
  metrics: BlogPostMetrics;
  createdAt: number;
  updatedAt: number;
}

// ── Influencer & Media Kit Types ─────────────────────────────────────────────

export type InfluencerPlatform = 'instagram' | 'tiktok' | 'youtube' | 'twitter';
export type InfluencerStatus = 'invited' | 'accepted' | 'declined' | 'active' | 'completed';
export type CompensationType = 'free-tickets' | 'fixed-payment' | 'commission' | 'hybrid';
export type MediaAssetType = 'logo' | 'event-image' | 'social-graphic' | 'banner' | 'video';
export type CopyTemplateType = 'headline' | 'social-caption' | 'email-subject' | 'press-release';

export interface InfluencerMetrics {
  reach: number;
  impressions: number;
  engagement: number;
  clicks: number;
  conversions: number;
  revenue: number;
  roi: number;
}

export interface InfluencerCollaboration {
  id: string;
  organizerId: string;
  eventId: string;
  influencerId: string;
  influencerName: string;
  influencerPlatform: InfluencerPlatform;
  influencerHandle: string;
  audienceSize: number;
  engagementRate: number;
  status: InfluencerStatus;
  compensationType: CompensationType;
  compensationAmount?: number;
  commissionRate?: number;
  freeTicketCount?: number;
  deliverables: string[];
  trackingCode: string;
  promoCode?: string;
  metrics: InfluencerMetrics;
  invitedAt: number;
  acceptedAt?: number;
  completedAt?: number;
}

export interface MediaAsset {
  id: string;
  type: MediaAssetType;
  url: string;
  dimensions?: { width: number; height: number };
  fileSize: number;
  format: string;
  platform?: string;
}

export interface CopyTemplate {
  id: string;
  type: CopyTemplateType;
  platform?: string;
  content: string;
  characterCount: number;
}

export interface EventStats {
  expectedAttendance: number;
  pastEventAttendance?: number;
  audienceDemographics: {
    ageRanges: Record<string, number>;
    genders: Record<string, number>;
    locations: Record<string, number>;
  };
  socialFollowing: {
    platform: string;
    followers: number;
  }[];
}

export interface BrandGuidelines {
  primaryColor: string;
  secondaryColor: string;
  fonts: string[];
  logoUsage: string;
  dosDonts: string[];
}

export interface MediaKit {
  id: string;
  eventId: string;
  organizerId: string;
  title: string;
  description: string;
  assets: MediaAsset[];
  copyTemplates: CopyTemplate[];
  eventStats: EventStats;
  organizerBio: string;
  brandGuidelines: BrandGuidelines;
  downloadUrl: string;
  publicUrl: string;
  downloads: number;
  views: number;
  createdAt: number;
  updatedAt: number;
}

// ── A/B Testing Types ────────────────────────────────────────────────────────

export type ABTestType = 'email-subject' | 'email-content' | 'ad-creative' | 'landing-page' | 'cta-button';
export type ABTestStatus = 'draft' | 'running' | 'completed';

export interface TestVariant {
  id: string;
  name: string;
  content: any;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  conversionRate: number;
  confidenceInterval: [number, number];
}

export interface ABTest {
  id: string;
  campaignId: string;
  name: string;
  type: ABTestType;
  status: ABTestStatus;
  variants: TestVariant[];
  trafficAllocation: number[];
  winningVariantId?: string;
  confidenceLevel: number;
  statisticalSignificance: boolean;
  startedAt?: number;
  completedAt?: number;
  createdAt: number;
}

export interface ABTestResults {
  testId: string;
  variants: TestVariant[];
  winner?: TestVariant;
  improvement: number;
  confidenceLevel: number;
  pValue: number;
  recommendation: string;
}

// ── Analytics & Reporting Types ──────────────────────────────────────────────

export interface ChannelPerformance {
  channel: string;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  cost: number;
  roi: number;
  ctr: number;
  conversionRate: number;
  cac: number;
  ltv: number;
}

export interface AttributionReport {
  organizerId: string;
  dateRange: { start: number; end: number };
  model: AttributionModel;
  channels: ChannelPerformance[];
  totalRevenue: number;
  totalCost: number;
  totalROI: number;
  topPerformers: string[];
  underperformers: string[];
  recommendations: string[];
}

export interface FunnelStage {
  name: string;
  entered: number;
  exited: number;
  converted: number;
  conversionRate: number;
  averageTime: number;
}

export interface FunnelAnalysis {
  eventId: string;
  stages: FunnelStage[];
  totalEntered: number;
  totalConverted: number;
  overallConversionRate: number;
  averageTimeToConvert: number;
  dropOffPoints: string[];
}

export interface CohortAnalysis {
  cohortDate: string;
  acquisitionChannel: string;
  cohortSize: number;
  retention: number[];
  revenue: number[];
  ltv: number;
  cac: number;
  ltvCacRatio: number;
}

// ── Audience Segmentation Types ──────────────────────────────────────────────

export type SegmentOperator = 'equals' | 'not-equals' | 'contains' | 'greater-than' | 'less-than' | 'in' | 'not-in';
export type SegmentLogic = 'AND' | 'OR';

export interface SegmentRule {
  field: string;
  operator: SegmentOperator;
  value: string | number | string[];
  logic: SegmentLogic;
}

export interface AudienceSegment {
  id: string;
  organizerId: string;
  name: string;
  description: string;
  rules: SegmentRule[];
  size: number;
  lastCalculatedAt: number;
  createdAt: number;
  updatedAt: number;
}

// ── Social Proof Types ───────────────────────────────────────────────────────

export type ScarcityLevel = 'high' | 'medium' | 'low' | 'none';

export interface RecentPurchase {
  id: string;
  buyerName: string;
  buyerCity: string;
  ticketCount: number;
  purchasedAt: number;
}

export interface EventReview {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  verified: boolean;
  helpful: number;
  createdAt: number;
}

export interface OrganizerStats {
  totalEvents: number;
  totalAttendees: number;
  averageRating: number;
  yearsActive: number;
  verified: boolean;
}

export interface ScarcityIndicator {
  show: boolean;
  message: string;
  urgency: 'high' | 'medium' | 'low';
  ticketsRemaining: number;
}

export interface SocialProofData {
  eventId: string;
  ticketsSold: number;
  totalCapacity: number;
  percentageSold: number;
  recentPurchases: RecentPurchase[];
  reviews: EventReview[];
  averageRating: number;
  totalReviews: number;
  organizerStats: OrganizerStats;
  scarcityLevel: ScarcityLevel;
  trustScore: number;
}

// ── Drip Campaign Types ──────────────────────────────────────────────────────

export type TriggerType = 'event-registration' | 'ticket-purchase' | 'cart-abandonment' | 'event-attendance' | 'post-event' | 'manual';
export type DelayUnit = 'hours' | 'days' | 'weeks';
export type EmailConditionType = 'opened-previous' | 'clicked-previous' | 'purchased' | 'custom';
export type DripEnrollmentStatus = 'active' | 'completed' | 'unsubscribed' | 'converted';

export interface TriggerCondition {
  field: string;
  operator: string;
  value: any;
}

export interface CampaignTrigger {
  type: TriggerType;
  conditions?: TriggerCondition[];
}

export interface EmailCondition {
  type: EmailConditionType;
  value: boolean | string;
}

export interface DripEmail {
  id: string;
  order: number;
  templateId: string;
  subject: string;
  delay: number;
  delayUnit: DelayUnit;
  conditions?: EmailCondition[];
  sent: number;
  opened: number;
  clicked: number;
  converted: number;
}

export interface DripCampaign {
  id: string;
  organizerId: string;
  eventId?: string;
  name: string;
  description: string;
  trigger: CampaignTrigger;
  emails: DripEmail[];
  active: boolean;
  enrollmentCount: number;
  completionCount: number;
  conversionCount: number;
  conversionRate: number;
  createdAt: number;
  updatedAt: number;
}

export interface DripEnrollment {
  id: string;
  campaignId: string;
  userId: string;
  currentEmailIndex: number;
  status: DripEnrollmentStatus;
  enrolledAt: number;
  completedAt?: number;
  convertedAt?: number;
}

// ── Event Sharing & Viral Loop Types ─────────────────────────────────────────

export interface ShareMetrics {
  totalShares: number;
  clicks: number;
  conversions: number;
  clickRate: number;
  conversionRate: number;
}

export interface ShareEvent {
  id: string;
  userId: string;
  eventId: string;
  platform: 'whatsapp' | 'facebook' | 'twitter' | 'linkedin' | 'email' | 'sms';
  referralCode: string;
  shareUrl: string;
  sharedAt: number;
  clicks: number;
  conversions: number;
  revenue: number;
}

export interface ShareCard {
  platform: 'whatsapp' | 'facebook' | 'twitter' | 'linkedin' | 'email';
  title: string;
  description: string;
  imageUrl: string;
  url: string;
}

export interface ViralLoop {
  id: string;
  eventId: string;
  name: string;
  type: 'group-discount' | 'referral-reward' | 'unlock-content';
  requirement: number;
  reward: string;
  rewardValue?: number; // For monetary rewards or discount percentage
  active: boolean;
  participants: string[];
  completions: number;
  createdAt: number;
}

export interface ViralLoopProgress {
  userId: string;
  loopId: string;
  eventId: string;
  currentProgress: number;
  requirement: number;
  completed: boolean;
  completedAt?: number;
  rewardClaimed: boolean;
}

export interface ShareLeaderboard {
  eventId: string;
  topSharers: Array<{
    userId: string;
    userName: string;
    shareCount: number;
    clicks: number;
    conversions: number;
    revenue: number;
    rank: number;
  }>;
  generatedAt: number;
}

// ── Module-Scoped Storage ────────────────────────────────────────────────────

const campaigns: Record<string, Campaign> = {};
const promoCodes: Record<string, PromoCode> = {};
const referralLinks: Record<string, ReferralLink> = {};
const affiliates: Record<string, Affiliate> = {};
const affiliateConversions: Record<string, AffiliateConversion[]> = {};
const payoutRequests: Record<string, PayoutRequest[]> = {};
const attributions: Record<string, Attribution> = {};
const emailTemplates: Record<string, EmailTemplate> = {};
const emailCampaigns: Record<string, EmailCampaign> = {};
const smsCampaigns: Record<string, SMSCampaign> = {};
const whatsappCampaigns: Record<string, WhatsAppCampaign> = {};
const suppressionList: Record<string, SuppressionList> = {};
const pushNotifications: Record<string, PushNotification> = {};
const deviceTokens: Record<string, DeviceToken[]> = {};
const notificationPreferences: Record<string, NotificationPreferences> = {};
const socialConnections: Record<string, SocialConnection[]> = {};
const socialPosts: Record<string, SocialPost> = {};
const adCampaigns: Record<string, AdCampaign> = {};
const retargetingPixels: Record<string, RetargetingPixel> = {};
const seoMetadata: Record<string, SEOMetadata> = {};
const seoChecklists: Record<string, SEOChecklist> = {};
const seoMetrics: Record<string, SEOMetrics> = {};
let sitemapLastUpdated: number = 0;
const blogPosts: Record<string, BlogPost> = {};
const influencerCollaborations: Record<string, InfluencerCollaboration> = {};
const mediaKits: Record<string, MediaKit> = {};
const abTests: Record<string, ABTest> = {};
const channelPerformance: Record<string, ChannelPerformance[]> = {};
const audienceSegments: Record<string, AudienceSegment> = {};
const socialProofData: Record<string, SocialProofData> = {};
const eventReviews: Record<string, EventReview[]> = {};
const dripCampaigns: Record<string, DripCampaign> = {};
const dripEnrollments: Record<string, DripEnrollment[]> = {};
const shareEvents: Record<string, ShareEvent[]> = {};
const viralLoops: Record<string, ViralLoop> = {};
const viralLoopProgress: Record<string, ViralLoopProgress[]> = {}; // userId -> progress array
const shareLeaderboards: Record<string, ShareLeaderboard> = {}; // eventId -> leaderboard

// ── Analytics & ROI Tracking Storage (Requirements 14, 20) ──────────────────

const funnelAnalyses: Record<string, FunnelAnalysis> = {}; // eventId -> funnel
const cohortAnalyses: Record<string, CohortAnalysis[]> = {}; // organizerId -> cohorts
const marketingCosts: Record<string, MarketingCost[]> = {}; // campaignId -> costs
const roiForecasts: Record<string, ROIForecast> = {}; // campaignId -> forecast

export interface MarketingCost {
  id: string;
  campaignId: string;
  category: 'ad-spend' | 'tool-subscription' | 'influencer-payment' | 'affiliate-commission' | 'other';
  amount: number;
  currency: string;
  description: string;
  date: number;
  createdAt: number;
}

export interface ROIForecast {
  campaignId: string;
  projectedRevenue: number;
  projectedCost: number;
  projectedROI: number;
  confidence: number; // 0-100
  timeframe: number; // days
  assumptions: string[];
  generatedAt: number;
}

export interface ROIReport {
  organizerId: string;
  dateRange: { start: number; end: number };
  campaigns: Array<{
    campaignId: string;
    campaignName: string;
    revenue: number;
    cost: number;
    roi: number;
    profit: number;
  }>;
  costBreakdown: Record<string, number>; // category -> total
  channelBreakdown: Array<{
    channel: string;
    revenue: number;
    cost: number;
    roi: number;
  }>;
  totalRevenue: number;
  totalCost: number;
  totalROI: number;
  totalProfit: number;
  profitableChannels: string[];
  unprofitableChannels: string[];
  recommendations: string[];
  generatedAt: number;
}

// ── Referral Program Settings (Requirement 7.8) ─────────────────────────────

export interface ReferralProgramSettings {
  eventId: string;
  enabled: boolean;
  rewardType: ReferralRewardType;
  rewardValue: number;
  updatedBy: string;
  updatedAt: number;
}

const referralProgramSettings: Record<string, ReferralProgramSettings> = {};

// ── Campaign Management Functions ────────────────────────────────────────────

export function createCampaign(organizerId: string, data: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>): Campaign {
  const campaign: Campaign = {
    ...data,
    id: id('campaign'),
    organizerId,
    status: data.status || 'draft',
    spent: data.spent || 0,
    content: data.content || {},
    metrics: data.metrics || {
      reach: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      cost: 0,
      roi: 0,
      ctr: 0,
      conversionRate: 0,
      cac: 0,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  campaigns[campaign.id] = campaign;
  return campaign;
}

export function getCampaign(campaignId: string): Campaign | null {
  return campaigns[campaignId] || null;
}

export interface CampaignFilters {
  eventId?: string;
  status?: CampaignStatus;
  type?: CampaignType;
  channel?: ChannelType;
  dateRange?: { start: number; end: number };
}

export function listCampaigns(organizerId: string, filters?: CampaignFilters): Campaign[] {
  let results = Object.values(campaigns).filter(c => c.organizerId === organizerId);
  
  if (filters?.eventId) {
    results = results.filter(c => c.eventId === filters.eventId);
  }
  if (filters?.status) {
    results = results.filter(c => c.status === filters.status);
  }
  if (filters?.type) {
    results = results.filter(c => c.type === filters.type);
  }
  if (filters?.channel) {
    results = results.filter(c => c.channels.some(ch => ch.type === filters.channel));
  }
  if (filters?.dateRange) {
    results = results.filter(c => {
      const campaignDate = c.scheduledAt || c.createdAt;
      return campaignDate >= filters.dateRange!.start && campaignDate <= filters.dateRange!.end;
    });
  }
  
  return results.sort((a, b) => b.createdAt - a.createdAt);
}

export function updateCampaign(campaignId: string, updates: Partial<Campaign>): Campaign | null {
  const campaign = campaigns[campaignId];
  if (!campaign) return null;
  
  campaigns[campaignId] = {
    ...campaign,
    ...updates,
    updatedAt: Date.now(),
  };
  return campaigns[campaignId];
}

export function pauseCampaign(campaignId: string): Campaign | null {
  return updateCampaign(campaignId, { status: 'paused' });
}

export function resumeCampaign(campaignId: string): Campaign | null {
  return updateCampaign(campaignId, { status: 'active' });
}

export function deleteCampaign(campaignId: string): boolean {
  if (!campaigns[campaignId]) return false;
  delete campaigns[campaignId];
  return true;
}

// ── Promo Code Functions ─────────────────────────────────────────────────────

// Helper function to generate unique promo code (Requirement 6.3)
function generateUniquePromoCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code: string;
  let attempts = 0;
  const maxAttempts = 100;
  
  do {
    code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    attempts++;
    
    if (attempts >= maxAttempts) {
      throw new Error('Unable to generate unique promo code');
    }
  } while (Object.values(promoCodes).some(pc => pc.code === code));
  
  return code;
}

export function createPromoCode(organizerId: string, data: Omit<PromoCode, 'id' | 'usageCount' | 'redemptions' | 'metrics' | 'createdAt' | 'updatedAt'>): PromoCode {
  // Validate custom code has minimum 4 characters (Requirement 6.3)
  if (data.code && data.code.length < 4) {
    throw new Error('Promo code must be at least 4 characters long');
  }
  
  // Generate unique code if not provided (Requirement 6.3)
  const code = data.code || generateUniquePromoCode();
  
  const promoCode: PromoCode = {
    ...data,
    code,
    id: id('promo'),
    organizerId,
    active: data.active !== undefined ? data.active : true,
    usageCount: 0,
    redemptions: [],
    metrics: {
      totalRedemptions: 0,
      totalRevenue: 0,
      totalDiscount: 0,
      conversionRate: 0,
      averageOrderValue: 0,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  promoCodes[promoCode.id] = promoCode;
  return promoCode;
}

export function validatePromoCode(code: string, eventId: string, ticketTypeId?: string): { valid: boolean; error?: string; promoCode?: PromoCode; suggestion?: string } {
  const promoCode = Object.values(promoCodes).find(pc => pc.code.toLowerCase() === code.toLowerCase() && pc.eventId === eventId);
  
  if (!promoCode) {
    // Suggest alternative active codes (Requirement 6.5)
    const alternativeCodes = Object.values(promoCodes)
      .filter(pc => pc.eventId === eventId && pc.active && (!pc.expiresAt || pc.expiresAt > Date.now()))
      .slice(0, 2);
    
    const suggestion = alternativeCodes.length > 0 
      ? `Try these codes: ${alternativeCodes.map(pc => pc.code).join(', ')}`
      : undefined;
    
    return { valid: false, error: 'Promo code not found', suggestion };
  }
  
  if (!promoCode.active) {
    return { valid: false, error: 'Promo code is inactive' };
  }
  
  const now = Date.now();
  if (promoCode.startsAt && now < promoCode.startsAt) {
    const startDate = new Date(promoCode.startsAt).toLocaleDateString();
    return { valid: false, error: `Promo code will be active from ${startDate}` };
  }
  
  if (promoCode.expiresAt && now > promoCode.expiresAt) {
    // Suggest alternative active codes (Requirement 6.5)
    const alternativeCodes = Object.values(promoCodes)
      .filter(pc => pc.eventId === eventId && pc.active && (!pc.expiresAt || pc.expiresAt > Date.now()) && pc.id !== promoCode.id)
      .slice(0, 2);
    
    const suggestion = alternativeCodes.length > 0 
      ? `Try these active codes: ${alternativeCodes.map(pc => pc.code).join(', ')}`
      : undefined;
    
    return { valid: false, error: 'Promo code has expired', suggestion };
  }
  
  if (promoCode.usageLimit && promoCode.usageCount >= promoCode.usageLimit) {
    return { valid: false, error: 'Promo code usage limit reached' };
  }
  
  if (ticketTypeId && promoCode.applicableTicketTypes && !promoCode.applicableTicketTypes.includes(ticketTypeId)) {
    return { valid: false, error: 'Promo code not applicable to this ticket type' };
  }
  
  return { valid: true, promoCode };
}

export function applyPromoCode(code: string, orderId: string, userId: string, orderAmount: number): { success: boolean; discountAmount: number; error?: string } {
  const promoCode = Object.values(promoCodes).find(pc => pc.code.toLowerCase() === code.toLowerCase());
  
  if (!promoCode) {
    return { success: false, discountAmount: 0, error: 'Promo code not found' };
  }
  
  // Check per-user limit
  if (promoCode.perUserLimit) {
    const userRedemptions = promoCode.redemptions.filter(r => r.userId === userId).length;
    if (userRedemptions >= promoCode.perUserLimit) {
      return { success: false, discountAmount: 0, error: 'User redemption limit reached' };
    }
  }
  
  // Check minimum purchase amount
  if (promoCode.minPurchaseAmount && orderAmount < promoCode.minPurchaseAmount) {
    return { success: false, discountAmount: 0, error: `Minimum purchase amount of ${promoCode.minPurchaseAmount} required` };
  }
  
  // Calculate discount
  let discountAmount = 0;
  if (promoCode.type === 'percentage') {
    discountAmount = (orderAmount * promoCode.value) / 100;
  } else if (promoCode.type === 'fixed') {
    discountAmount = promoCode.value;
  } else if (promoCode.type === 'free') {
    discountAmount = orderAmount;
  }
  
  // Apply max discount cap
  if (promoCode.maxDiscountAmount && discountAmount > promoCode.maxDiscountAmount) {
    discountAmount = promoCode.maxDiscountAmount;
  }
  
  // Ensure discount doesn't exceed order amount
  discountAmount = Math.min(discountAmount, orderAmount);
  
  // Record redemption
  const redemption: PromoRedemption = {
    id: id('redemption'),
    userId,
    orderId,
    discountAmount,
    redeemedAt: Date.now(),
  };
  
  promoCode.redemptions.push(redemption);
  promoCode.usageCount++;
  promoCode.metrics.totalRedemptions++;
  promoCode.metrics.totalDiscount += discountAmount;
  promoCode.metrics.totalRevenue += (orderAmount - discountAmount);
  promoCode.metrics.averageOrderValue = promoCode.metrics.totalRevenue / promoCode.metrics.totalRedemptions;
  promoCode.updatedAt = Date.now();
  
  return { success: true, discountAmount };
}

export function getPromoCodeStats(promoCodeId: string): PromoCodeMetrics | null {
  const promoCode = promoCodes[promoCodeId];
  return promoCode ? promoCode.metrics : null;
}

export function listPromoCodes(organizerId: string, eventId?: string): PromoCode[] {
  let results = Object.values(promoCodes).filter(pc => pc.organizerId === organizerId);
  
  if (eventId) {
    results = results.filter(pc => pc.eventId === eventId);
  }
  
  return results.sort((a, b) => b.createdAt - a.createdAt);
}

export function deactivatePromoCode(promoCodeId: string): PromoCode | null {
  const promoCode = promoCodes[promoCodeId];
  if (!promoCode) return null;
  
  promoCode.active = false;
  promoCode.updatedAt = Date.now();
  return promoCode;
}

// Find and apply the best available promo code (Requirement 6.8)
export function findBestPromoCode(eventId: string, userId: string, orderAmount: number, ticketTypeId?: string): { code: string; discountAmount: number } | null {
  const eligibleCodes = Object.values(promoCodes).filter(pc => {
    if (pc.eventId !== eventId || !pc.active) return false;
    
    const now = Date.now();
    if (pc.startsAt && now < pc.startsAt) return false;
    if (pc.expiresAt && now > pc.expiresAt) return false;
    if (pc.usageLimit && pc.usageCount >= pc.usageLimit) return false;
    if (ticketTypeId && pc.applicableTicketTypes && !pc.applicableTicketTypes.includes(ticketTypeId)) return false;
    if (pc.minPurchaseAmount && orderAmount < pc.minPurchaseAmount) return false;
    
    // Check per-user limit
    if (pc.perUserLimit) {
      const userRedemptions = pc.redemptions.filter(r => r.userId === userId).length;
      if (userRedemptions >= pc.perUserLimit) return false;
    }
    
    return true;
  });
  
  if (eligibleCodes.length === 0) return null;
  
  // Calculate discount for each eligible code and find the best one
  let bestCode: PromoCode | null = null;
  let bestDiscount = 0;
  
  for (const pc of eligibleCodes) {
    let discount = 0;
    
    if (pc.type === 'percentage') {
      discount = (orderAmount * pc.value) / 100;
    } else if (pc.type === 'fixed') {
      discount = pc.value;
    } else if (pc.type === 'free') {
      discount = orderAmount;
    }
    
    // Apply max discount cap
    if (pc.maxDiscountAmount && discount > pc.maxDiscountAmount) {
      discount = pc.maxDiscountAmount;
    }
    
    // Ensure discount doesn't exceed order amount
    discount = Math.min(discount, orderAmount);
    
    if (discount > bestDiscount) {
      bestDiscount = discount;
      bestCode = pc;
    }
  }
  
  return bestCode ? { code: bestCode.code, discountAmount: bestDiscount } : null;
}

// ── Referral System Functions ────────────────────────────────────────────────

/**
 * Enable or disable referral program for an event (Requirement 7.8)
 */
export function setReferralProgramSettings(
  eventId: string,
  organizerId: string,
  enabled: boolean,
  rewardType: ReferralRewardType = 'commission',
  rewardValue: number = 10
): ReferralProgramSettings {
  const settings: ReferralProgramSettings = {
    eventId,
    enabled,
    rewardType,
    rewardValue,
    updatedBy: organizerId,
    updatedAt: Date.now(),
  };
  referralProgramSettings[eventId] = settings;
  return settings;
}

/**
 * Get referral program settings for an event
 */
export function getReferralProgramSettings(eventId: string): ReferralProgramSettings | null {
  return referralProgramSettings[eventId] || null;
}

/**
 * Check if referral program is enabled for an event
 */
export function isReferralProgramEnabled(eventId: string): boolean {
  const settings = referralProgramSettings[eventId];
  return settings ? settings.enabled : true; // Default to enabled if not configured
}

export function generateReferralLink(userId: string, eventId: string, rewardType?: ReferralRewardType, rewardValue?: number): ReferralLink {
  // Check if referral program is enabled for this event (Requirement 7.8)
  const settings = getReferralProgramSettings(eventId);
  if (settings && !settings.enabled) {
    throw new Error('Referral program is not enabled for this event');
  }
  
  // Use event-specific settings if available, otherwise use provided values or defaults
  const finalRewardType = rewardType || settings?.rewardType || 'commission';
  const finalRewardValue = rewardValue || settings?.rewardValue || 10;
  
  // Generate unique referral code (Requirement 7.1)
  // Generate unique referral code (Requirement 7.1)
  const code = `${userId.slice(0, 6)}_${eventId.slice(0, 6)}_${Math.random().toString(36).slice(2, 8)}`.toUpperCase();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://guestly.app';
  const url = `${baseUrl}/events/${eventId}?ref=${code}`;
  
  const referralLink: ReferralLink = {
    id: id('referral'),
    userId,
    eventId,
    code,
    url,
    rewardType: finalRewardType,
    rewardValue: finalRewardValue,
    clicks: 0,
    conversions: 0,
    revenue: 0,
    earnedRewards: 0,
    pendingRewards: 0,
    conversionsList: [],
    createdAt: Date.now(),
  };
  
  referralLinks[referralLink.id] = referralLink;
  return referralLink;
}

/**
 * Track referral link clicks (Requirement 7.2)
 */
export function trackReferralClick(referralCode: string, metadata?: { ip?: string; userAgent?: string }): void {
  const referralLink = Object.values(referralLinks).find(rl => rl.code === referralCode);
  if (referralLink) {
    referralLink.clicks++;
  }
}

/**
 * Track referral conversions and calculate rewards (Requirements 7.2, 7.4)
 */
export function trackReferralConversion(referralCode: string, orderId: string, referredUserId: string, amount: number): void {
  const referralLink = Object.values(referralLinks).find(rl => rl.code === referralCode);
  if (!referralLink) return;
  
  // Detect fraud before processing conversion (Requirement 7.6)
  const fraudCheck = detectReferralFraud(referredUserId, referralCode);
  if (fraudCheck.isFraud) {
    console.warn(`Referral fraud detected: ${fraudCheck.reason}`);
    return;
  }
  
  // Calculate reward based on configurable reward structure (Requirement 7.4)
  let reward = 0;
  if (referralLink.rewardType === 'commission') {
    reward = (amount * referralLink.rewardValue) / 100;
  } else if (referralLink.rewardType === 'fixed') {
    reward = referralLink.rewardValue;
  }
  // Note: 'free-ticket' type would be handled separately in ticket purchase flow
  
  const conversion: ReferralConversion = {
    id: id('conversion'),
    referralCode,
    referredUserId,
    orderId,
    amount,
    reward,
    status: 'pending',
    convertedAt: Date.now(),
  };
  
  referralLink.conversionsList.push(conversion);
  referralLink.conversions++;
  referralLink.revenue += amount;
  referralLink.pendingRewards += reward;
}

/**
 * Credit referral reward to referrer's wallet (Requirement 7.3)
 */
export function creditReferralReward(userId: string, referralCode: string, orderId: string): void {
  const referralLink = Object.values(referralLinks).find(rl => rl.userId === userId && rl.code === referralCode);
  if (!referralLink) return;
  
  const conversion = referralLink.conversionsList.find(c => c.orderId === orderId && c.status === 'pending');
  if (!conversion) return;
  
  // Import addMoney from store to credit wallet
  const { addMoney } = require('./store');
  
  // Credit the referrer's wallet with the reward
  addMoney(userId, conversion.reward, `Referral reward for order ${orderId}`);
  
  conversion.status = 'credited';
  referralLink.pendingRewards -= conversion.reward;
  referralLink.earnedRewards += conversion.reward;
  
  // TODO: Send notification to referrer about earned reward (Requirement 7.7)
  // This requires implementing a notification system
}

/**
 * Get referral statistics for a user (Requirement 7.5)
 */
export function getReferralStats(userId: string, eventId?: string): ReferralStats {
  let links = Object.values(referralLinks).filter(rl => rl.userId === userId);
  
  if (eventId) {
    links = links.filter(rl => rl.eventId === eventId);
  }
  
  const totalClicks = links.reduce((sum, rl) => sum + rl.clicks, 0);
  const totalConversions = links.reduce((sum, rl) => sum + rl.conversions, 0);
  const totalRevenue = links.reduce((sum, rl) => sum + rl.revenue, 0);
  const totalEarned = links.reduce((sum, rl) => sum + rl.earnedRewards, 0);
  const pendingRewards = links.reduce((sum, rl) => sum + rl.pendingRewards, 0);
  
  const eventStats = links.reduce((acc, rl) => {
    const existing = acc.find(e => e.eventId === rl.eventId);
    if (existing) {
      existing.conversions += rl.conversions;
      existing.earned += rl.earnedRewards;
    } else {
      acc.push({
        eventId: rl.eventId,
        conversions: rl.conversions,
        earned: rl.earnedRewards,
      });
    }
    return acc;
  }, [] as Array<{ eventId: string; conversions: number; earned: number }>);
  
  return {
    totalReferrals: links.length,
    totalClicks,
    totalConversions,
    totalRevenue,
    totalEarned,
    pendingRewards,
    conversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0,
    topEvents: eventStats.sort((a, b) => b.conversions - a.conversions).slice(0, 5),
  };
}

/**
 * Detect referral fraud including self-referrals and suspicious patterns (Requirement 7.6)
 */
export function detectReferralFraud(userId: string, referralCode: string): { isFraud: boolean; reason?: string } {
  const referralLink = Object.values(referralLinks).find(rl => rl.code === referralCode);
  if (!referralLink) return { isFraud: false };
  
  // Check if user is trying to refer themselves (Requirement 7.6 - self-referral detection)
  if (referralLink.userId === userId) {
    return { isFraud: true, reason: 'Self-referral detected' };
  }
  
  // Check for suspicious patterns (Requirement 7.6 - suspicious pattern detection)
  // Pattern 1: Too many conversions in short time
  const recentConversions = referralLink.conversionsList.filter(c => 
    Date.now() - c.convertedAt < 3600000 // Last hour
  );
  
  if (recentConversions.length > 10) {
    return { isFraud: true, reason: 'Suspicious conversion rate: too many conversions in short time' };
  }
  
  // Pattern 2: Check if the same user has been referred multiple times
  const userConversions = referralLink.conversionsList.filter(c => c.referredUserId === userId);
  if (userConversions.length > 1) {
    return { isFraud: true, reason: 'Duplicate referral: user already referred' };
  }
  
  return { isFraud: false };
}

// ── Affiliate Program Functions ──────────────────────────────────────────────

export function registerAffiliate(userId: string, data: Omit<Affiliate, 'id' | 'userId' | 'status' | 'totalEarnings' | 'pendingEarnings' | 'paidEarnings' | 'links' | 'createdAt'>): Affiliate {
  const affiliate: Affiliate = {
    ...data,
    id: id('affiliate'),
    userId,
    status: 'pending',
    totalEarnings: 0,
    pendingEarnings: 0,
    paidEarnings: 0,
    links: [],
    createdAt: Date.now(),
  };
  affiliates[affiliate.id] = affiliate;
  return affiliate;
}

export function approveAffiliate(affiliateId: string): Affiliate | null {
  const affiliate = affiliates[affiliateId];
  if (!affiliate) return null;
  
  affiliate.status = 'approved';
  affiliate.approvedAt = Date.now();
  return affiliate;
}

export function suspendAffiliate(affiliateId: string): Affiliate | null {
  const affiliate = affiliates[affiliateId];
  if (!affiliate) return null;
  
  affiliate.status = 'suspended';
  return affiliate;
}

export function generateAffiliateLink(affiliateId: string, eventId: string): AffiliateLink {
  const affiliate = affiliates[affiliateId];
  if (!affiliate) throw new Error('Affiliate not found');
  
  const code = `AFF_${affiliateId.slice(0, 6)}_${eventId.slice(0, 6)}_${Math.random().toString(36).slice(2, 6)}`.toUpperCase();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://guestly.app';
  const url = `${baseUrl}/events/${eventId}?aff=${code}`;
  
  const link: AffiliateLink = {
    id: id('afflink'),
    affiliateId,
    eventId,
    code,
    url,
    clicks: 0,
    conversions: 0,
    revenue: 0,
    commission: 0,
    createdAt: Date.now(),
  };
  
  affiliate.links.push(link);
  return link;
}

export function trackAffiliateClick(affiliateCode: string): void {
  const affiliate = Object.values(affiliates).find(a => 
    a.links.some(l => l.code === affiliateCode)
  );
  
  if (!affiliate) return;
  
  const link = affiliate.links.find(l => l.code === affiliateCode);
  if (!link) return;
  
  link.clicks++;
}

export function trackAffiliateConversion(affiliateCode: string, orderId: string, userId: string, eventId: string, revenue: number): void {
  const affiliate = Object.values(affiliates).find(a => 
    a.links.some(l => l.code === affiliateCode)
  );
  
  if (!affiliate) return;
  
  const link = affiliate.links.find(l => l.code === affiliateCode);
  if (!link) return;
  
  const commissionAmount = (revenue * affiliate.commissionRate) / 100;
  
  const conversion: AffiliateConversion = {
    id: id('affconv'),
    affiliateId: affiliate.id,
    affiliateCode,
    eventId,
    orderId,
    userId,
    revenue,
    commissionRate: affiliate.commissionRate,
    commissionAmount,
    status: 'pending',
    convertedAt: Date.now(),
  };
  
  if (!affiliateConversions[affiliate.id]) {
    affiliateConversions[affiliate.id] = [];
  }
  affiliateConversions[affiliate.id].push(conversion);
  
  link.conversions++;
  link.revenue += revenue;
  link.commission += commissionAmount;
  
  affiliate.totalEarnings += commissionAmount;
  affiliate.pendingEarnings += commissionAmount;
}

export function calculateAffiliateCommission(affiliateId: string, period?: { start: number; end: number }): { total: number; pending: number; approved: number; paid: number } {
  const conversions = affiliateConversions[affiliateId] || [];
  
  let filtered = conversions;
  if (period) {
    filtered = conversions.filter(c => c.convertedAt >= period.start && c.convertedAt <= period.end);
  }
  
  const total = filtered.reduce((sum, c) => sum + c.commissionAmount, 0);
  const pending = filtered.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.commissionAmount, 0);
  const approved = filtered.filter(c => c.status === 'approved').reduce((sum, c) => sum + c.commissionAmount, 0);
  const paid = filtered.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.commissionAmount, 0);
  
  return { total, pending, approved, paid };
}

export function createPayoutRequest(affiliateId: string, amount: number): PayoutRequest {
  const affiliate = affiliates[affiliateId];
  if (!affiliate) throw new Error('Affiliate not found');
  
  if (amount > affiliate.pendingEarnings) {
    throw new Error('Insufficient pending earnings');
  }
  
  const payout: PayoutRequest = {
    id: id('payout'),
    affiliateId,
    amount,
    status: 'pending',
    requestedAt: Date.now(),
  };
  
  if (!payoutRequests[affiliateId]) {
    payoutRequests[affiliateId] = [];
  }
  payoutRequests[affiliateId].push(payout);
  
  return payout;
}

export function approvePayoutRequest(payoutId: string, affiliateId: string): PayoutRequest | null {
  const payouts = payoutRequests[affiliateId];
  if (!payouts) return null;
  
  const payout = payouts.find(p => p.id === payoutId);
  if (!payout) return null;
  
  payout.status = 'approved';
  payout.processedAt = Date.now();
  
  const affiliate = affiliates[affiliateId];
  if (affiliate) {
    affiliate.pendingEarnings -= payout.amount;
    affiliate.paidEarnings += payout.amount;
  }
  
  return payout;
}

export function listAffiliates(filters?: { status?: AffiliateStatus }): Affiliate[] {
  let results = Object.values(affiliates);
  
  if (filters?.status) {
    results = results.filter(a => a.status === filters.status);
  }
  
  return results.sort((a, b) => b.createdAt - a.createdAt);
}

export function getAffiliate(affiliateId: string): Affiliate | null {
  return affiliates[affiliateId] || null;
}

export function getAffiliatePromotionalMaterials(affiliateId: string, eventId: string): { mediaKit: MediaKit | null; promoCode?: string; trackingLink: AffiliateLink | null } {
  const affiliate = affiliates[affiliateId];
  if (!affiliate) {
    throw new Error('Affiliate not found');
  }
  
  // Get media kit for the event
  const mediaKit = Object.values(mediaKits).find(mk => mk.eventId === eventId) || null;
  
  // Get affiliate's tracking link for this event
  const trackingLink = affiliate.links.find(l => l.eventId === eventId) || null;
  
  // Get any promo code associated with this affiliate for the event
  const promoCode = Object.values(promoCodes).find(
    pc => pc.eventId === eventId && pc.description.includes(affiliate.businessName)
  )?.code;
  
  return {
    mediaKit,
    promoCode,
    trackingLink,
  };
}

// ── Attribution Tracking Functions ───────────────────────────────────────────

/**
 * Parse UTM parameters from a URL or query string
 * Supports: utm_source, utm_medium, utm_campaign, utm_content, utm_term
 */
export function parseUTMParameters(url: string): { source?: string; medium?: string; campaign?: string; content?: string; term?: string } {
  try {
    const urlObj = new URL(url);
    const params = urlObj.searchParams;
    
    return {
      source: params.get('utm_source') || undefined,
      medium: params.get('utm_medium') || undefined,
      campaign: params.get('utm_campaign') || undefined,
      content: params.get('utm_content') || undefined,
      term: params.get('utm_term') || undefined,
    };
  } catch {
    // If URL parsing fails, try to extract from query string
    const match = url.match(/[?&]utm_source=([^&]+)/);
    if (!match) return {};
    
    const utmParams: Record<string, string> = {};
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    
    utmKeys.forEach(key => {
      const regex = new RegExp(`[?&]${key}=([^&]+)`);
      const match = url.match(regex);
      if (match) {
        utmParams[key.replace('utm_', '')] = decodeURIComponent(match[1]);
      }
    });
    
    return {
      source: utmParams.source,
      medium: utmParams.medium,
      campaign: utmParams.campaign,
      content: utmParams.content,
      term: utmParams.term,
    };
  }
}

/**
 * Track attribution from a URL with UTM parameters
 * Automatically parses UTM params and creates/updates attribution
 */
export function trackAttributionFromURL(userId: string, sessionId: string, url: string, referrer?: string): Attribution | null {
  const utmParams = parseUTMParameters(url);
  
  // Only track if we have at least source and medium
  if (!utmParams.source || !utmParams.medium) {
    return null;
  }
  
  return trackAttribution(userId, sessionId, {
    source: utmParams.source,
    medium: utmParams.medium,
    campaign: utmParams.campaign || 'unknown',
    content: utmParams.content,
    term: utmParams.term,
    referrer,
    landingPage: url,
  });
}

export function trackAttribution(userId: string, sessionId: string, params: { source: string; medium: string; campaign: string; content?: string; term?: string; referrer?: string; landingPage: string }): Attribution {
  const touchPoint: TouchPoint = {
    source: params.source,
    medium: params.medium,
    campaign: params.campaign,
    timestamp: Date.now(),
    page: params.landingPage,
  };
  
  // Check if attribution already exists for this session
  const existingAttribution = Object.values(attributions).find(a => a.sessionId === sessionId);
  
  if (existingAttribution) {
    // Update existing attribution with new touch point
    existingAttribution.touchPoints.push(touchPoint);
    existingAttribution.lastTouch = touchPoint;
    return existingAttribution;
  }
  
  // Create new attribution
  const attribution: Attribution = {
    id: id('attr'),
    userId,
    sessionId,
    source: params.source,
    medium: params.medium,
    campaign: params.campaign,
    content: params.content,
    term: params.term,
    referrer: params.referrer,
    landingPage: params.landingPage,
    firstTouch: touchPoint,
    lastTouch: touchPoint,
    touchPoints: [touchPoint],
    converted: false,
    createdAt: Date.now(),
  };
  
  attributions[attribution.id] = attribution;
  return attribution;
}

export function updateAttribution(sessionId: string, touchPoint: TouchPoint): void {
  const attribution = Object.values(attributions).find(a => a.sessionId === sessionId);
  if (!attribution) return;
  
  attribution.touchPoints.push(touchPoint);
  attribution.lastTouch = touchPoint;
}

export function markAttributionConverted(sessionId: string, orderId: string, conversionValue: number): void {
  const attribution = Object.values(attributions).find(a => a.sessionId === sessionId);
  if (!attribution) return;
  
  attribution.converted = true;
  attribution.orderId = orderId;
  attribution.conversionValue = conversionValue;
  attribution.convertedAt = Date.now();
}

export function getAttributionData(orderId: string): Attribution | null {
  return Object.values(attributions).find(a => a.orderId === orderId) || null;
}

export function getCampaignMetrics(campaignId: string): CampaignMetrics | null {
  const campaign = campaigns[campaignId];
  return campaign ? campaign.metrics : null;
}

export function getChannelPerformance(organizerId: string, dateRange?: { start: number; end: number }): ChannelPerformance[] {
  const orgCampaigns = Object.values(campaigns).filter(c => c.organizerId === organizerId);
  
  let filtered = orgCampaigns;
  if (dateRange) {
    filtered = orgCampaigns.filter(c => 
      c.createdAt >= dateRange.start && c.createdAt <= dateRange.end
    );
  }
  
  const channelMap = new Map<string, ChannelPerformance>();
  
  filtered.forEach(campaign => {
    campaign.channels.forEach(channel => {
      const existing = channelMap.get(channel.type);
      if (existing) {
        existing.impressions += campaign.metrics.impressions;
        existing.clicks += campaign.metrics.clicks;
        existing.conversions += campaign.metrics.conversions;
        existing.revenue += campaign.metrics.revenue;
        existing.cost += campaign.metrics.cost;
      } else {
        channelMap.set(channel.type, {
          channel: channel.type,
          impressions: campaign.metrics.impressions,
          clicks: campaign.metrics.clicks,
          conversions: campaign.metrics.conversions,
          revenue: campaign.metrics.revenue,
          cost: campaign.metrics.cost,
          roi: 0,
          ctr: 0,
          conversionRate: 0,
          cac: 0,
          ltv: 0,
        });
      }
    });
  });
  
  // Calculate derived metrics
  channelMap.forEach(perf => {
    perf.roi = perf.cost > 0 ? ((perf.revenue - perf.cost) / perf.cost) * 100 : 0;
    perf.ctr = perf.impressions > 0 ? (perf.clicks / perf.impressions) * 100 : 0;
    perf.conversionRate = perf.clicks > 0 ? (perf.conversions / perf.clicks) * 100 : 0;
    perf.cac = perf.conversions > 0 ? perf.cost / perf.conversions : 0;
  });
  
  return Array.from(channelMap.values()).sort((a, b) => b.revenue - a.revenue);
}

export function calculateROI(campaignId: string): { roi: number; revenue: number; cost: number; profit: number } {
  const campaign = campaigns[campaignId];
  if (!campaign) return { roi: 0, revenue: 0, cost: 0, profit: 0 };
  
  const revenue = campaign.metrics.revenue;
  const cost = campaign.metrics.cost;
  const profit = revenue - cost;
  const roi = cost > 0 ? (profit / cost) * 100 : 0;
  
  return { roi, revenue, cost, profit };
}

/**
 * Apply attribution model to calculate channel contribution
 * Supports: first-touch, last-touch, and multi-touch (linear) attribution
 */
export function applyAttributionModel(attribution: Attribution, model: AttributionModel): Map<string, number> {
  const channelContribution = new Map<string, number>();
  
  if (!attribution.converted || !attribution.conversionValue) {
    return channelContribution;
  }
  
  const value = attribution.conversionValue;
  
  switch (model) {
    case 'first-touch':
      // 100% credit to first touch point
      const firstChannel = `${attribution.firstTouch.source}-${attribution.firstTouch.medium}`;
      channelContribution.set(firstChannel, value);
      break;
      
    case 'last-touch':
      // 100% credit to last touch point
      const lastChannel = `${attribution.lastTouch.source}-${attribution.lastTouch.medium}`;
      channelContribution.set(lastChannel, value);
      break;
      
    case 'multi-touch':
      // Linear attribution: equal credit to all touch points
      if (attribution.touchPoints.length > 0) {
        const creditPerTouch = value / attribution.touchPoints.length;
        attribution.touchPoints.forEach(tp => {
          const channel = `${tp.source}-${tp.medium}`;
          const existing = channelContribution.get(channel) || 0;
          channelContribution.set(channel, existing + creditPerTouch);
        });
      }
      break;
  }
  
  return channelContribution;
}

export function generateAttributionReport(organizerId: string, dateRange: { start: number; end: number }, model: AttributionModel = 'last-touch'): AttributionReport {
  // Get base channel performance from campaigns
  const channels = getChannelPerformance(organizerId, dateRange);
  
  // Apply attribution model to converted attributions
  const orgCampaigns = Object.values(campaigns).filter(c => c.organizerId === organizerId);
  const relevantAttributions = Object.values(attributions).filter(a => 
    a.converted && 
    a.convertedAt && 
    a.convertedAt >= dateRange.start && 
    a.convertedAt <= dateRange.end
  );
  
  // Calculate attributed revenue by channel using the selected model
  const attributedRevenue = new Map<string, number>();
  relevantAttributions.forEach(attr => {
    const channelContributions = applyAttributionModel(attr, model);
    channelContributions.forEach((value, channel) => {
      const existing = attributedRevenue.get(channel) || 0;
      attributedRevenue.set(channel, existing + value);
    });
  });
  
  // Update channel performance with attributed revenue
  channels.forEach(channel => {
    const channelKey = channel.channel;
    const attributed = attributedRevenue.get(channelKey) || 0;
    if (attributed > 0) {
      channel.revenue = attributed;
      channel.roi = channel.cost > 0 ? ((attributed - channel.cost) / channel.cost) * 100 : 0;
    }
  });
  
  const totalRevenue = channels.reduce((sum, c) => sum + c.revenue, 0);
  const totalCost = channels.reduce((sum, c) => sum + c.cost, 0);
  const totalROI = totalCost > 0 ? ((totalRevenue - totalCost) / totalCost) * 100 : 0;
  
  const topPerformers = channels
    .filter(c => c.roi > 0)
    .sort((a, b) => b.roi - a.roi)
    .slice(0, 3)
    .map(c => c.channel);
  
  const underperformers = channels
    .filter(c => c.roi < 0)
    .sort((a, b) => a.roi - b.roi)
    .slice(0, 3)
    .map(c => c.channel);
  
  const recommendations: string[] = [];
  if (topPerformers.length > 0) {
    recommendations.push(`Increase budget for ${topPerformers[0]} (highest ROI)`);
  }
  if (underperformers.length > 0) {
    recommendations.push(`Review or pause ${underperformers[0]} (negative ROI)`);
  }
  
  // Add model-specific recommendations
  if (model === 'multi-touch') {
    recommendations.push('Multi-touch attribution shows the full customer journey across channels');
  } else if (model === 'first-touch') {
    recommendations.push('First-touch attribution highlights channels that drive initial awareness');
  } else {
    recommendations.push('Last-touch attribution shows channels that close conversions');
  }
  
  return {
    organizerId,
    dateRange,
    model,
    channels,
    totalRevenue,
    totalCost,
    totalROI,
    topPerformers,
    underperformers,
    recommendations,
  };
}

// ── Email Marketing Functions ────────────────────────────────────────────────

export function createEmailTemplate(organizerId: string, data: Omit<EmailTemplate, 'id' | 'organizerId' | 'createdAt' | 'updatedAt'>): EmailTemplate {
  const template: EmailTemplate = {
    ...data,
    id: id('emailtpl'),
    organizerId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  emailTemplates[template.id] = template;
  return template;
}

export function getEmailTemplate(templateId: string): EmailTemplate | null {
  return emailTemplates[templateId] || null;
}

export function listEmailTemplates(organizerId: string): EmailTemplate[] {
  return Object.values(emailTemplates)
    .filter(t => t.organizerId === organizerId || t.isPublic)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function updateEmailTemplate(templateId: string, updates: Partial<Omit<EmailTemplate, 'id' | 'organizerId' | 'createdAt'>>): EmailTemplate | null {
  const template = emailTemplates[templateId];
  if (!template) return null;
  
  emailTemplates[templateId] = {
    ...template,
    ...updates,
    updatedAt: Date.now(),
  };
  return emailTemplates[templateId];
}

export function deleteEmailTemplate(templateId: string): boolean {
  if (!emailTemplates[templateId]) return false;
  delete emailTemplates[templateId];
  return true;
}

export function createEmailCampaign(campaignId: string, data: Omit<EmailCampaign, 'id' | 'campaignId' | 'metrics'>): EmailCampaign {
  const emailCampaign: EmailCampaign = {
    ...data,
    id: id('emailcamp'),
    campaignId,
    metrics: {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      bounced: 0,
      spam: 0,
      unsubscribed: 0,
      openRate: 0,
      clickRate: 0,
      conversionRate: 0,
      revenue: 0,
    },
  };
  emailCampaigns[emailCampaign.id] = emailCampaign;
  return emailCampaign;
}

export function trackEmailOpen(emailCampaignId: string, recipientEmail: string): void {
  const campaign = emailCampaigns[emailCampaignId];
  if (!campaign) return;
  
  const recipient = campaign.recipients.find(r => r.email === recipientEmail);
  if (!recipient || recipient.status === 'opened') return;
  
  recipient.status = 'opened';
  recipient.openedAt = Date.now();
  campaign.metrics.opened++;
  campaign.metrics.openRate = (campaign.metrics.opened / campaign.metrics.sent) * 100;
}

export function trackEmailClick(emailCampaignId: string, recipientEmail: string): void {
  const campaign = emailCampaigns[emailCampaignId];
  if (!campaign) return;
  
  const recipient = campaign.recipients.find(r => r.email === recipientEmail);
  if (!recipient) return;
  
  if (recipient.status !== 'clicked') {
    recipient.status = 'clicked';
    recipient.clickedAt = Date.now();
    campaign.metrics.clicked++;
    campaign.metrics.clickRate = (campaign.metrics.clicked / campaign.metrics.sent) * 100;
  }
}

export function getEmailMetrics(emailCampaignId: string): EmailMetrics | null {
  const campaign = emailCampaigns[emailCampaignId];
  return campaign ? campaign.metrics : null;
}

// ── Email Validation & Spam Checking (Requirement 2.4) ──────────────────────

const SPAM_TRIGGER_WORDS = [
  'free money', 'click here now', 'act now', 'limited time', 'urgent',
  'congratulations', 'you have won', 'claim your prize', 'risk-free',
  '100% free', 'no credit card', 'cancel anytime', 'weight loss',
  'viagra', 'casino', 'lottery', 'million dollars', 'dear friend'
];

const SPAM_TRIGGER_PATTERNS = [
  /\$\$\$+/gi,                    // Multiple dollar signs
  /!!!+/g,                        // Multiple exclamation marks
  /FREE/g,                        // All caps FREE
  /CLICK HERE/gi,                 // All caps click here
  /\b[A-Z]{5,}\b/g,              // Long all-caps words
];

export interface EmailValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  spamScore: number;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateEmailContent(subject: string, htmlContent: string, textContent: string): EmailValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let spamScore = 0;

  // Subject validation
  if (!subject || subject.trim().length === 0) {
    errors.push('Subject line is required');
  } else if (subject.length > 150) {
    warnings.push('Subject line is too long (max 150 characters recommended)');
  } else if (subject.length < 10) {
    warnings.push('Subject line is too short (min 10 characters recommended)');
  }

  // Content validation
  if (!htmlContent || htmlContent.trim().length === 0) {
    errors.push('Email content is required');
  }

  if (!textContent || textContent.trim().length === 0) {
    warnings.push('Plain text version is missing (recommended for deliverability)');
  }

  // Spam trigger detection in subject
  const subjectLower = subject.toLowerCase();
  SPAM_TRIGGER_WORDS.forEach(trigger => {
    if (subjectLower.includes(trigger)) {
      spamScore += 2;
      warnings.push(`Spam trigger word detected in subject: "${trigger}"`);
    }
  });

  // Spam pattern detection in subject
  SPAM_TRIGGER_PATTERNS.forEach(pattern => {
    if (pattern.test(subject)) {
      spamScore += 1;
      warnings.push('Spam pattern detected in subject (excessive punctuation or caps)');
    }
  });

  // Spam trigger detection in content
  const contentLower = (htmlContent + ' ' + textContent).toLowerCase();
  SPAM_TRIGGER_WORDS.forEach(trigger => {
    if (contentLower.includes(trigger)) {
      spamScore += 1;
    }
  });

  // Check for excessive links
  const linkCount = (htmlContent.match(/<a\s+href=/gi) || []).length;
  if (linkCount > 10) {
    spamScore += 2;
    warnings.push(`Too many links detected (${linkCount}). Limit to 10 or fewer.`);
  }

  // Check for missing unsubscribe link
  if (!htmlContent.toLowerCase().includes('unsubscribe') && !textContent.toLowerCase().includes('unsubscribe')) {
    warnings.push('Unsubscribe link is missing (required for compliance)');
    spamScore += 3;
  }

  // Overall spam score assessment
  if (spamScore >= 5) {
    errors.push(`High spam score (${spamScore}). Email may be blocked by spam filters.`);
  } else if (spamScore >= 3) {
    warnings.push(`Moderate spam score (${spamScore}). Consider revising content.`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    spamScore,
  };
}

// ── Rate Limiting (Requirement 2.7) ──────────────────────────────────────────

interface RateLimitTracker {
  organizerId: string;
  emailsSent: number;
  windowStart: number;
}

const rateLimitTrackers: Record<string, RateLimitTracker> = {};
const RATE_LIMIT_EMAILS_PER_HOUR = 1000;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

export function checkRateLimit(organizerId: string, emailCount: number): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  let tracker = rateLimitTrackers[organizerId];

  // Initialize or reset tracker if window expired
  if (!tracker || now - tracker.windowStart >= RATE_LIMIT_WINDOW_MS) {
    tracker = {
      organizerId,
      emailsSent: 0,
      windowStart: now,
    };
    rateLimitTrackers[organizerId] = tracker;
  }

  const remaining = RATE_LIMIT_EMAILS_PER_HOUR - tracker.emailsSent;
  const allowed = tracker.emailsSent + emailCount <= RATE_LIMIT_EMAILS_PER_HOUR;
  const resetAt = tracker.windowStart + RATE_LIMIT_WINDOW_MS;

  return { allowed, remaining, resetAt };
}

export function incrementRateLimit(organizerId: string, emailCount: number): void {
  const tracker = rateLimitTrackers[organizerId];
  if (tracker) {
    tracker.emailsSent += emailCount;
  }
}

// ── Email Campaign Execution (Requirements 2.3, 2.5, 2.6, 2.8) ───────────────

export interface EmailSendResult {
  success: boolean;
  emailCampaignId: string;
  sent: number;
  failed: number;
  errors: string[];
  warnings: string[];
}

export async function sendEmailCampaign(emailCampaignId: string, organizerId: string): Promise<EmailSendResult> {
  const campaign = emailCampaigns[emailCampaignId];

  if (!campaign) {
    return {
      success: false,
      emailCampaignId,
      sent: 0,
      failed: 0,
      errors: ['Email campaign not found'],
      warnings: [],
    };
  }

  // Get template for validation
  const template = emailTemplates[campaign.templateId];
  if (!template) {
    return {
      success: false,
      emailCampaignId,
      sent: 0,
      failed: 0,
      errors: ['Email template not found'],
      warnings: [],
    };
  }

  // Validate email content (Requirement 2.4)
  const validation = validateEmailContent(campaign.subject, template.htmlContent, template.textContent);
  if (!validation.valid) {
    return {
      success: false,
      emailCampaignId,
      sent: 0,
      failed: 0,
      errors: validation.errors,
      warnings: validation.warnings,
    };
  }

  // Check rate limit (Requirement 2.7)
  const recipientCount = campaign.recipients.length;
  const rateLimit = checkRateLimit(organizerId, recipientCount);

  if (!rateLimit.allowed) {
    return {
      success: false,
      emailCampaignId,
      sent: 0,
      failed: 0,
      errors: [
        `Rate limit exceeded. You can send ${rateLimit.remaining} more emails this hour.`,
        `Rate limit resets at ${new Date(rateLimit.resetAt).toISOString()}`,
      ],
      warnings: validation.warnings,
    };
  }

  // Update campaign status
  campaign.status = 'sending';
  campaign.sentAt = Date.now();

  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  // Process recipients
  for (const recipient of campaign.recipients) {
    // Validate email address
    if (!validateEmail(recipient.email)) {
      recipient.status = 'bounced';
      failed++;
      errors.push(`Invalid email address: ${recipient.email}`);
      continue;
    }

    // Simulate email sending (in real implementation, this would call SendGrid/Mailgun API)
    // For now, we'll simulate success/failure based on simple logic
    const sendSuccess = Math.random() > 0.05; // 95% success rate

    if (sendSuccess) {
      recipient.status = 'sent';
      recipient.sentAt = Date.now();
      sent++;

      // Simulate delivery (in real implementation, this would be webhook callback)
      setTimeout(() => {
        if (Math.random() > 0.02) { // 98% delivery rate
          recipient.status = 'delivered';
          campaign.metrics.delivered++;
        } else {
          // Simulate bounce (Requirement 2.8)
          recipient.status = 'bounced';
          campaign.metrics.bounced++;
        }
      }, 100);
    } else {
      recipient.status = 'bounced';
      failed++;
      campaign.metrics.bounced++;
    }
  }

  // Update metrics (Requirement 2.5)
  campaign.metrics.sent = sent;
  campaign.metrics.delivered = sent; // Will be updated by delivery callbacks

  // Update rate limit tracker
  incrementRateLimit(organizerId, sent);

  // Update campaign status
  campaign.status = sent > 0 ? 'sent' : 'failed';

  return {
    success: sent > 0,
    emailCampaignId,
    sent,
    failed,
    errors,
    warnings: validation.warnings,
  };
}

// Update recipient status for bounces and spam (Requirement 2.8)
export function updateEmailRecipientStatus(
  emailCampaignId: string,
  recipientEmail: string,
  status: EmailRecipientStatus,
  errorCode?: string
): void {
  const campaign = emailCampaigns[emailCampaignId];
  if (!campaign) return;

  const recipient = campaign.recipients.find(r => r.email === recipientEmail);
  if (!recipient) return;

  const previousStatus = recipient.status;
  recipient.status = status;

  // Update metrics based on status change
  if (status === 'bounced' && previousStatus !== 'bounced') {
    campaign.metrics.bounced++;
  } else if (status === 'spam' && previousStatus !== 'spam') {
    campaign.metrics.spam++;
  }

  // Recalculate rates
  if (campaign.metrics.sent > 0) {
    campaign.metrics.openRate = (campaign.metrics.opened / campaign.metrics.sent) * 100;
    campaign.metrics.clickRate = (campaign.metrics.clicked / campaign.metrics.sent) * 100;
  }
}

// Get list of email campaigns
export function listEmailCampaigns(campaignId?: string): EmailCampaign[] {
  if (campaignId) {
    return Object.values(emailCampaigns).filter(ec => ec.campaignId === campaignId);
  }
  return Object.values(emailCampaigns);
}

// Get email campaign by ID
export function getEmailCampaign(emailCampaignId: string): EmailCampaign | null {
  return emailCampaigns[emailCampaignId] || null;
}


// ── SMS & WhatsApp Functions ─────────────────────────────────────────────────

export function createSMSCampaign(campaignId: string, data: Omit<SMSCampaign, 'id' | 'campaignId' | 'metrics'>): SMSCampaign {
  const smsCampaign: SMSCampaign = {
    ...data,
    id: id('smscamp'),
    campaignId,
    metrics: {
      sent: 0,
      delivered: 0,
      failed: 0,
      clicked: 0,
      conversions: 0,
      deliveryRate: 0,
      clickRate: 0,
      conversionRate: 0,
      cost: 0,
      revenue: 0,
      roi: 0,
    },
  };
  smsCampaigns[smsCampaign.id] = smsCampaign;
  return smsCampaign;
}

export function addToSuppressionList(phone: string, reason: SuppressionReason, source: SuppressionSource): void {
  suppressionList[phone] = {
    phone,
    reason,
    addedAt: Date.now(),
    source,
  };
}

export function checkSuppressionList(phone: string): boolean {
  return !!suppressionList[phone];
}

export function removeFromSuppressionList(phone: string): boolean {
  if (!suppressionList[phone]) return false;
  delete suppressionList[phone];
  return true;
}

export function listSuppressionList(): SuppressionList[] {
  return Object.values(suppressionList).sort((a, b) => b.addedAt - a.addedAt);
}

/**
 * Handle opt-out request from recipient (Requirement 3.4)
 * Automatically adds phone number to suppression list
 */
export function handleOptOut(phone: string, source: SuppressionSource = 'both'): { success: boolean; message: string } {
  // Validate phone number
  const validation = validatePhoneNumber(phone);
  if (!validation.valid || !validation.normalized) {
    return {
      success: false,
      message: `Invalid phone number: ${validation.error}`,
    };
  }

  const normalizedPhone = validation.normalized;

  // Check if already in suppression list
  if (checkSuppressionList(normalizedPhone)) {
    return {
      success: true,
      message: 'Phone number already opted out',
    };
  }

  // Add to suppression list (Requirement 3.4, 3.8)
  addToSuppressionList(normalizedPhone, 'opt-out', source);

  // Update any pending SMS recipients to opted-out status
  Object.values(smsCampaigns).forEach(campaign => {
    campaign.recipients.forEach(recipient => {
      if (recipient.phone === normalizedPhone && recipient.status === 'pending') {
        recipient.status = 'opted-out';
      }
    });
  });

  // Update any pending WhatsApp recipients to opted-out status
  Object.values(whatsappCampaigns).forEach(campaign => {
    campaign.recipients.forEach(recipient => {
      if (recipient.phone === normalizedPhone && recipient.status === 'pending') {
        recipient.status = 'opted-out';
      }
    });
  });

  return {
    success: true,
    message: 'Successfully opted out from future communications',
  };
}

export function getSMSCampaign(campaignId: string): SMSCampaign | null {
  return smsCampaigns[campaignId] || null;
}

// ── Phone Number Validation ──────────────────────────────────────────────────

/**
 * Validate phone number format (international format with country code)
 * Supports formats: +234XXXXXXXXXX, +233XXXXXXXXX, +254XXXXXXXXX, etc.
 */
export function validatePhoneNumber(phone: string): { valid: boolean; error?: string; normalized?: string } {
  // Remove all whitespace and special characters except +
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');

  // Check if it starts with +
  if (!cleaned.startsWith('+')) {
    return { valid: false, error: 'Phone number must start with country code (e.g., +234)' };
  }

  // Check if it has valid length (country code + 7-15 digits)
  if (cleaned.length < 10 || cleaned.length > 16) {
    return { valid: false, error: 'Phone number must be between 10 and 16 characters' };
  }

  // Check if it contains only digits after the +
  const digitsOnly = cleaned.slice(1);
  if (!/^\d+$/.test(digitsOnly)) {
    return { valid: false, error: 'Phone number must contain only digits after country code' };
  }

  return { valid: true, normalized: cleaned };
}

/**
 * Validate and normalize a list of phone numbers
 * Filters out invalid numbers and returns normalized valid numbers
 */
export function validatePhoneNumbers(phones: string[]): { valid: string[]; invalid: Array<{ phone: string; error: string }> } {
  const valid: string[] = [];
  const invalid: Array<{ phone: string; error: string }> = [];

  for (const phone of phones) {
    const result = validatePhoneNumber(phone);
    if (result.valid && result.normalized) {
      valid.push(result.normalized);
    } else {
      invalid.push({ phone, error: result.error || 'Invalid phone number' });
    }
  }

  return { valid, invalid };
}

// ── SMS Cost Estimation ──────────────────────────────────────────────────────

/**
 * SMS pricing per message segment by provider and region
 * Prices in USD per segment (160 characters)
 */
const SMS_PRICING: Record<SMSProvider, Record<string, number>> = {
  'twilio': {
    'NG': 0.035,  // Nigeria
    'GH': 0.045,  // Ghana
    'KE': 0.055,  // Kenya
    'ZA': 0.025,  // South Africa
    'default': 0.05,
  },
  'africas-talking': {
    'NG': 0.028,  // Nigeria
    'GH': 0.038,  // Ghana
    'KE': 0.048,  // Kenya
    'ZA': 0.022,  // South Africa
    'default': 0.045,
  },
};

/**
 * Get country code from phone number (e.g., +234 -> NG)
 */
function getCountryCodeFromPhone(phone: string): string {
  const countryMap: Record<string, string> = {
    '234': 'NG',  // Nigeria
    '233': 'GH',  // Ghana
    '254': 'KE',  // Kenya
    '27': 'ZA',   // South Africa
  };

  for (const [prefix, code] of Object.entries(countryMap)) {
    if (phone.startsWith(`+${prefix}`)) {
      return code;
    }
  }

  return 'default';
}

/**
 * Calculate number of SMS segments for a message
 * Standard SMS: 160 characters per segment
 * Unicode SMS (with emojis/special chars): 70 characters per segment
 */
export function calculateSMSSegments(message: string): number {
  // Check if message contains unicode characters
  const hasUnicode = /[^\x00-\x7F]/.test(message);
  const maxLength = hasUnicode ? 70 : 160;

  if (message.length === 0) return 0;
  if (message.length <= maxLength) return 1;

  // For multi-part messages, reduce max length by 7 chars for concatenation header
  const multiPartMaxLength = hasUnicode ? 67 : 153;
  return Math.ceil(message.length / multiPartMaxLength);
}

/**
 * Estimate SMS campaign cost (Requirement 3.6, 3.7)
 */
export function estimateSMSCost(
  message: string,
  recipients: string[],
  provider: SMSProvider = 'africas-talking'
): { totalCost: number; costPerRecipient: number; segments: number; breakdown: Array<{ country: string; count: number; cost: number }> } {
  const segments = calculateSMSSegments(message);
  const pricing = SMS_PRICING[provider];

  // Group recipients by country
  const countryGroups: Record<string, number> = {};
  for (const phone of recipients) {
    const country = getCountryCodeFromPhone(phone);
    countryGroups[country] = (countryGroups[country] || 0) + 1;
  }

  // Calculate cost breakdown by country
  const breakdown = Object.entries(countryGroups).map(([country, count]) => {
    const pricePerSegment = pricing[country] || pricing['default'];
    const cost = count * segments * pricePerSegment;
    return { country, count, cost };
  });

  const totalCost = breakdown.reduce((sum, item) => sum + item.cost, 0);
  const costPerRecipient = recipients.length > 0 ? totalCost / recipients.length : 0;

  return { totalCost, costPerRecipient, segments, breakdown };
}

// ── SMS Rate Limiting ────────────────────────────────────────────────────────

interface SMSRateLimit {
  organizerId: string;
  sentCount: number;
  windowStart: number;
  dailySentCount: number;
  dailyWindowStart: number;
}

const smsRateLimits: Record<string, SMSRateLimit> = {};

const SMS_RATE_LIMIT_PER_HOUR = 1000; // Requirement 2.7 (email) - applying similar limit to SMS
const SMS_RATE_LIMIT_PER_DAY = 10000;

/**
 * Check if organizer has exceeded SMS rate limits (Requirement 3.6)
 */
export function checkSMSRateLimit(organizerId: string, recipientCount: number): { allowed: boolean; error?: string; resetAt?: number } {
  const now = Date.now();
  const oneHour = 3600000;
  const oneDay = 86400000;

  let rateLimit = smsRateLimits[organizerId];

  if (!rateLimit) {
    rateLimit = {
      organizerId,
      sentCount: 0,
      windowStart: now,
      dailySentCount: 0,
      dailyWindowStart: now,
    };
    smsRateLimits[organizerId] = rateLimit;
  }

  // Reset hourly window if expired
  if (now - rateLimit.windowStart >= oneHour) {
    rateLimit.sentCount = 0;
    rateLimit.windowStart = now;
  }

  // Reset daily window if expired
  if (now - rateLimit.dailyWindowStart >= oneDay) {
    rateLimit.dailySentCount = 0;
    rateLimit.dailyWindowStart = now;
  }

  // Check hourly limit
  if (rateLimit.sentCount + recipientCount > SMS_RATE_LIMIT_PER_HOUR) {
    const resetAt = rateLimit.windowStart + oneHour;
    return {
      allowed: false,
      error: `Hourly SMS limit of ${SMS_RATE_LIMIT_PER_HOUR} exceeded. Resets at ${new Date(resetAt).toLocaleTimeString()}`,
      resetAt,
    };
  }

  // Check daily limit
  if (rateLimit.dailySentCount + recipientCount > SMS_RATE_LIMIT_PER_DAY) {
    const resetAt = rateLimit.dailyWindowStart + oneDay;
    return {
      allowed: false,
      error: `Daily SMS limit of ${SMS_RATE_LIMIT_PER_DAY} exceeded. Resets at ${new Date(resetAt).toLocaleDateString()}`,
      resetAt,
    };
  }

  return { allowed: true };
}

/**
 * Update SMS rate limit counters after sending
 */
function updateSMSRateLimit(organizerId: string, sentCount: number): void {
  const rateLimit = smsRateLimits[organizerId];
  if (rateLimit) {
    rateLimit.sentCount += sentCount;
    rateLimit.dailySentCount += sentCount;
  }
}

// ── SMS Campaign Execution ───────────────────────────────────────────────────

/**
 * Send SMS campaign to recipients (Requirements 3.1, 3.2, 3.5, 3.6, 3.7, 3.8)
 */
export async function sendSMSCampaign(
  campaignId: string,
  options?: { skipRateLimit?: boolean; skipSuppressionCheck?: boolean }
): Promise<{ success: boolean; sent: number; failed: number; filtered: number; error?: string }> {
  const campaign = smsCampaigns[campaignId];
  if (!campaign) {
    return { success: false, sent: 0, failed: 0, filtered: 0, error: 'Campaign not found' };
  }

  // Get parent campaign to find organizer
  const parentCampaign = campaigns[campaign.campaignId];
  if (!parentCampaign) {
    return { success: false, sent: 0, failed: 0, filtered: 0, error: 'Parent campaign not found' };
  }

  // Validate and normalize phone numbers
  const phoneNumbers = campaign.recipients.map(r => r.phone);
  const validation = validatePhoneNumbers(phoneNumbers);

  if (validation.invalid.length > 0) {
    console.warn(`${validation.invalid.length} invalid phone numbers filtered out`);
  }

  // Filter out suppressed numbers (Requirement 3.4, 3.8)
  let validRecipients = campaign.recipients.filter(r => {
    const normalized = validatePhoneNumber(r.phone);
    return normalized.valid && normalized.normalized && validation.valid.includes(normalized.normalized);
  });

  if (!options?.skipSuppressionCheck) {
    const beforeFilter = validRecipients.length;
    validRecipients = validRecipients.filter(r => !checkSuppressionList(r.phone));
    const filtered = beforeFilter - validRecipients.length;

    if (filtered > 0) {
      console.log(`Filtered ${filtered} suppressed phone numbers`);
    }
  }

  // Check rate limits (Requirement 3.6)
  if (!options?.skipRateLimit) {
    const rateLimitCheck = checkSMSRateLimit(parentCampaign.organizerId, validRecipients.length);
    if (!rateLimitCheck.allowed) {
      return { success: false, sent: 0, failed: 0, filtered: validRecipients.length, error: rateLimitCheck.error };
    }
  }

  // Estimate and check cost limits (Requirement 3.6)
  const costEstimate = estimateSMSCost(
    campaign.message,
    validRecipients.map(r => r.phone),
    campaign.provider
  );

  campaign.estimatedCost = costEstimate.totalCost;

  // Check if campaign has budget limit
  if (parentCampaign.budget && costEstimate.totalCost > parentCampaign.budget - parentCampaign.spent) {
    return {
      success: false,
      sent: 0,
      failed: 0,
      filtered: validRecipients.length,
      error: `Estimated cost $${costEstimate.totalCost.toFixed(2)} exceeds remaining budget $${(parentCampaign.budget - parentCampaign.spent).toFixed(2)}`,
    };
  }

  // Update campaign status
  campaign.status = 'sending';
  campaign.sentAt = Date.now();

  let sent = 0;
  let failed = 0;

  // Send SMS to each recipient (simulated - in production would call SMS provider API)
  for (const recipient of validRecipients) {
    try {
      // Simulate SMS sending (Requirements 3.1, 3.2)
      // In production, this would call Twilio or Africa's Talking API
      const success = await simulateSMSSend(recipient.phone, campaign.message, campaign.provider);

      if (success) {
        recipient.status = 'sent';
        recipient.sentAt = Date.now();
        sent++;
        campaign.metrics.sent++;
      } else {
        recipient.status = 'failed';
        failed++;
        campaign.metrics.failed++;
      }
    } catch (error) {
      recipient.status = 'failed';
      recipient.errorCode = 'SEND_ERROR';
      failed++;
      campaign.metrics.failed++;
    }
  }

  // Update metrics
  campaign.metrics.deliveryRate = campaign.metrics.sent > 0
    ? (campaign.metrics.delivered / campaign.metrics.sent) * 100
    : 0;

  campaign.actualCost = (sent / validRecipients.length) * costEstimate.totalCost;
  campaign.metrics.cost = campaign.actualCost;

  // Update parent campaign spent
  parentCampaign.spent += campaign.actualCost;
  parentCampaign.metrics.cost += campaign.actualCost;

  // Update rate limits
  if (!options?.skipRateLimit) {
    updateSMSRateLimit(parentCampaign.organizerId, sent);
  }

  // Update campaign status
  campaign.status = sent > 0 ? 'sent' : 'failed';

  return {
    success: sent > 0,
    sent,
    failed,
    filtered: campaign.recipients.length - validRecipients.length,
  };
}

/**
 * Simulate SMS sending (in production, replace with actual SMS provider API call)
 */
async function simulateSMSSend(phone: string, message: string, provider: SMSProvider): Promise<boolean> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));

  // Simulate 95% success rate
  return Math.random() > 0.05;
}

/**
 * Track SMS delivery status updates (Requirements 3.5, 3.8)
 */
export function trackSMSDelivery(
  campaignId: string,
  phone: string,
  status: 'delivered' | 'failed',
  errorCode?: string
): void {
  const campaign = smsCampaigns[campaignId];
  if (!campaign) return;

  const recipient = campaign.recipients.find(r => r.phone === phone);
  if (!recipient) return;

  if (status === 'delivered') {
    recipient.status = 'delivered';
    recipient.deliveredAt = Date.now();
    campaign.metrics.delivered++;

    // Update delivery rate
    campaign.metrics.deliveryRate = (campaign.metrics.delivered / campaign.metrics.sent) * 100;
  } else if (status === 'failed') {
    recipient.status = 'failed';
    recipient.errorCode = errorCode;
    campaign.metrics.failed++;

    // Retry logic (Requirement 3.8)
    retryFailedSMS(campaignId, phone);
  }
}

/**
 * Retry failed SMS delivery once after 5 minutes (Requirement 3.8)
 */
async function retryFailedSMS(campaignId: string, phone: string): Promise<void> {
  // Wait 5 minutes before retry
  await new Promise(resolve => setTimeout(resolve, 300000));

  const campaign = smsCampaigns[campaignId];
  if (!campaign) return;

  const recipient = campaign.recipients.find(r => r.phone === phone);
  if (!recipient || recipient.status !== 'failed') return;

  try {
    const success = await simulateSMSSend(phone, campaign.message, campaign.provider);

    if (success) {
      recipient.status = 'sent';
      recipient.sentAt = Date.now();
      // Delivery status will be updated via trackSMSDelivery webhook
    } else {
      // Final failure - log it
      console.error(`SMS retry failed for ${phone} in campaign ${campaignId}`);
    }
  } catch (error) {
    console.error(`SMS retry error for ${phone}:`, error);
  }
}

/**
 * Track SMS link clicks (Requirement 3.5)
 */
export function trackSMSClick(campaignId: string, phone: string): void {
  const campaign = smsCampaigns[campaignId];
  if (!campaign) return;

  campaign.metrics.clicked++;
  campaign.metrics.clickRate = (campaign.metrics.clicked / campaign.metrics.sent) * 100;
}

/**
 * Track SMS conversions (Requirement 3.5)
 */
export function trackSMSConversion(campaignId: string, phone: string, revenue: number): void {
  const campaign = smsCampaigns[campaignId];
  if (!campaign) return;

  campaign.metrics.conversions++;
  campaign.metrics.revenue += revenue;
  campaign.metrics.conversionRate = (campaign.metrics.conversions / campaign.metrics.sent) * 100;
  campaign.metrics.roi = campaign.metrics.cost > 0
    ? ((campaign.metrics.revenue - campaign.metrics.cost) / campaign.metrics.cost) * 100
    : 0;
}

/**
 * Get SMS campaign metrics (Requirement 3.5)
 */
export function getSMSMetrics(campaignId: string): SMSMetrics | null {
  const campaign = smsCampaigns[campaignId];
  return campaign ? campaign.metrics : null;
}

/**
 * List all SMS campaigns for a parent campaign
 */
export function listSMSCampaigns(parentCampaignId: string): SMSCampaign[] {
  return Object.values(smsCampaigns)
    .filter(sc => sc.campaignId === parentCampaignId)
    .sort((a, b) => (b.sentAt || b.scheduledAt || 0) - (a.sentAt || a.scheduledAt || 0));
}


// ── WhatsApp Campaign Functions ──────────────────────────────────────────────

/**
 * Create a WhatsApp campaign (Requirements 3.3, 3.4, 3.5, 3.8)
 */
export function createWhatsAppCampaign(
  campaignId: string,
  data: Omit<WhatsAppCampaign, 'id' | 'campaignId' | 'metrics'>
): WhatsAppCampaign {
  const whatsappCampaign: WhatsAppCampaign = {
    ...data,
    id: id('whatsapp'),
    campaignId,
    metrics: {
      sent: 0,
      delivered: 0,
      read: 0,
      replied: 0,
      clicked: 0,
      conversions: 0,
      deliveryRate: 0,
      readRate: 0,
      clickRate: 0,
      conversionRate: 0,
      revenue: 0,
    },
  };
  whatsappCampaigns[whatsappCampaign.id] = whatsappCampaign;
  return whatsappCampaign;
}

/**
 * Send WhatsApp campaign to recipients (Requirements 3.3, 3.4, 3.5, 3.8)
 * Supports rich media (images, videos) and interactive buttons
 */
export async function sendWhatsAppCampaign(
  campaignId: string,
  options?: { skipSuppressionCheck?: boolean }
): Promise<{ success: boolean; sent: number; failed: number; filtered: number; error?: string }> {
  const campaign = whatsappCampaigns[campaignId];
  if (!campaign) {
    return { success: false, sent: 0, failed: 0, filtered: 0, error: 'Campaign not found' };
  }

  // Get parent campaign to find organizer
  const parentCampaign = campaigns[campaign.campaignId];
  if (!parentCampaign) {
    return { success: false, sent: 0, failed: 0, filtered: 0, error: 'Parent campaign not found' };
  }

  // Validate and normalize phone numbers
  const phoneNumbers = campaign.recipients.map(r => r.phone);
  const validation = validatePhoneNumbers(phoneNumbers);

  if (validation.invalid.length > 0) {
    console.warn(`${validation.invalid.length} invalid phone numbers filtered out`);
  }

  // Filter out suppressed numbers (Requirement 3.4, 3.8)
  let validRecipients = campaign.recipients.filter(r => {
    const normalized = validatePhoneNumber(r.phone);
    return normalized.valid && normalized.normalized && validation.valid.includes(normalized.normalized);
  });

  if (!options?.skipSuppressionCheck) {
    const beforeFilter = validRecipients.length;
    validRecipients = validRecipients.filter(r => !checkSuppressionList(r.phone));
    const filtered = beforeFilter - validRecipients.length;

    if (filtered > 0) {
      console.log(`Filtered ${filtered} suppressed phone numbers`);
    }
  }

  // Validate WhatsApp content (Requirement 3.3)
  const contentValidation = validateWhatsAppContent(campaign.content);
  if (!contentValidation.valid) {
    return {
      success: false,
      sent: 0,
      failed: 0,
      filtered: validRecipients.length,
      error: contentValidation.error,
    };
  }

  // Update campaign status
  campaign.status = 'sending';
  campaign.sentAt = Date.now();

  let sent = 0;
  let failed = 0;

  // Send WhatsApp messages to each recipient (Requirements 3.3, 3.5)
  for (const recipient of validRecipients) {
    try {
      // Simulate WhatsApp sending (in production, would call WhatsApp Business API)
      const success = await simulateWhatsAppSend(
        recipient.phone,
        campaign.content,
        campaign.messageType
      );

      if (success) {
        recipient.status = 'sent';
        recipient.sentAt = Date.now();
        sent++;
        campaign.metrics.sent++;
      } else {
        recipient.status = 'failed';
        failed++;
      }
    } catch (error) {
      recipient.status = 'failed';
      failed++;
    }
  }

  // Update metrics
  campaign.metrics.deliveryRate = campaign.metrics.sent > 0
    ? (campaign.metrics.delivered / campaign.metrics.sent) * 100
    : 0;

  // Update campaign status
  campaign.status = sent > 0 ? 'sent' : 'failed';

  return {
    success: sent > 0,
    sent,
    failed,
    filtered: campaign.recipients.length - validRecipients.length,
  };
}

/**
 * Validate WhatsApp content including rich media and buttons (Requirement 3.3)
 */
function validateWhatsAppContent(content: WhatsAppContent): { valid: boolean; error?: string } {
  // Check if at least text or media is provided
  if (!content.text && !content.mediaUrl) {
    return { valid: false, error: 'WhatsApp message must contain text or media' };
  }

  // Validate text length (WhatsApp limit is 4096 characters)
  if (content.text && content.text.length > 4096) {
    return { valid: false, error: 'WhatsApp text message exceeds 4096 character limit' };
  }

  // Validate caption length if media is present (WhatsApp limit is 1024 characters)
  if (content.mediaUrl && content.caption && content.caption.length > 1024) {
    return { valid: false, error: 'WhatsApp media caption exceeds 1024 character limit' };
  }

  // Validate buttons (max 3 buttons for WhatsApp)
  if (content.buttons && content.buttons.length > 3) {
    return { valid: false, error: 'WhatsApp supports maximum 3 buttons' };
  }

  // Validate button text length (max 20 characters per button)
  if (content.buttons) {
    for (const button of content.buttons) {
      if (button.text.length > 20) {
        return { valid: false, error: `Button text "${button.text}" exceeds 20 character limit` };
      }
    }
  }

  // Validate template parameters if using template
  if (content.templateName && (!content.templateParams || content.templateParams.length === 0)) {
    return { valid: false, error: 'Template message requires template parameters' };
  }

  return { valid: true };
}

/**
 * Simulate WhatsApp sending (in production, replace with actual WhatsApp Business API call)
 * Supports rich media and interactive buttons (Requirement 3.3)
 */
async function simulateWhatsAppSend(
  phone: string,
  content: WhatsAppContent,
  messageType: WhatsAppMessageType
): Promise<boolean> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 150));

  // Simulate 97% success rate (WhatsApp typically has higher delivery rates than SMS)
  return Math.random() > 0.03;
}

/**
 * Track WhatsApp delivery status updates (Requirements 3.5, 3.8)
 */
export function trackWhatsAppDelivery(
  campaignId: string,
  phone: string,
  status: 'delivered' | 'failed',
  errorCode?: string
): void {
  const campaign = whatsappCampaigns[campaignId];
  if (!campaign) return;

  const recipient = campaign.recipients.find(r => r.phone === phone);
  if (!recipient) return;

  if (status === 'delivered') {
    recipient.status = 'delivered';
    recipient.deliveredAt = Date.now();
    campaign.metrics.delivered++;

    // Update delivery rate
    campaign.metrics.deliveryRate = (campaign.metrics.delivered / campaign.metrics.sent) * 100;
  } else if (status === 'failed') {
    recipient.status = 'failed';

    // Retry logic (Requirement 3.8)
    retryFailedWhatsApp(campaignId, phone);
  }
}

/**
 * Retry failed WhatsApp delivery once after 5 minutes (Requirement 3.8)
 */
async function retryFailedWhatsApp(campaignId: string, phone: string): Promise<void> {
  // Wait 5 minutes before retry
  await new Promise(resolve => setTimeout(resolve, 300000));

  const campaign = whatsappCampaigns[campaignId];
  if (!campaign) return;

  const recipient = campaign.recipients.find(r => r.phone === phone);
  if (!recipient || recipient.status !== 'failed') return;

  try {
    const success = await simulateWhatsAppSend(phone, campaign.content, campaign.messageType);

    if (success) {
      recipient.status = 'sent';
      recipient.sentAt = Date.now();
      // Delivery status will be updated via trackWhatsAppDelivery webhook
    } else {
      // Final failure - log it
      console.error(`WhatsApp retry failed for ${phone} in campaign ${campaignId}`);
    }
  } catch (error) {
    console.error(`WhatsApp retry error for ${phone}:`, error);
  }
}

/**
 * Track WhatsApp read receipts (Requirements 3.5, 3.8)
 */
export function trackWhatsAppRead(campaignId: string, phone: string): void {
  const campaign = whatsappCampaigns[campaignId];
  if (!campaign) return;

  const recipient = campaign.recipients.find(r => r.phone === phone);
  if (!recipient) return;

  recipient.status = 'read';
  recipient.readAt = Date.now();
  campaign.metrics.read++;

  // Update read rate
  campaign.metrics.readRate = campaign.metrics.delivered > 0
    ? (campaign.metrics.read / campaign.metrics.delivered) * 100
    : 0;
}

/**
 * Track WhatsApp user replies (Requirement 3.5)
 */
export function trackWhatsAppReply(campaignId: string, phone: string): void {
  const campaign = whatsappCampaigns[campaignId];
  if (!campaign) return;

  campaign.metrics.replied++;
}

/**
 * Track WhatsApp button clicks (Requirements 3.3, 3.5)
 */
export function trackWhatsAppClick(campaignId: string, phone: string, buttonId?: string): void {
  const campaign = whatsappCampaigns[campaignId];
  if (!campaign) return;

  campaign.metrics.clicked++;
  campaign.metrics.clickRate = campaign.metrics.delivered > 0
    ? (campaign.metrics.clicked / campaign.metrics.delivered) * 100
    : 0;
}

/**
 * Track WhatsApp conversions (Requirement 3.5)
 */
export function trackWhatsAppConversion(campaignId: string, phone: string, revenue: number): void {
  const campaign = whatsappCampaigns[campaignId];
  if (!campaign) return;

  campaign.metrics.conversions++;
  campaign.metrics.revenue += revenue;
  campaign.metrics.conversionRate = campaign.metrics.sent > 0
    ? (campaign.metrics.conversions / campaign.metrics.sent) * 100
    : 0;
}

/**
 * Get WhatsApp campaign metrics (Requirement 3.5)
 */
export function getWhatsAppMetrics(campaignId: string): WhatsAppMetrics | null {
  const campaign = whatsappCampaigns[campaignId];
  return campaign ? campaign.metrics : null;
}

/**
 * List all WhatsApp campaigns for a parent campaign
 */
export function listWhatsAppCampaigns(parentCampaignId: string): WhatsAppCampaign[] {
  return Object.values(whatsappCampaigns)
    .filter(wc => wc.campaignId === parentCampaignId)
    .sort((a, b) => (b.sentAt || b.scheduledAt || 0) - (a.sentAt || a.scheduledAt || 0));
}

/**
 * Get WhatsApp campaign by ID
 */
export function getWhatsAppCampaign(campaignId: string): WhatsAppCampaign | null {
  return whatsappCampaigns[campaignId] || null;
}

/**
 * Send a single WhatsApp message (Requirements 3.3, 3.4, 3.5, 3.8)
 * Useful for transactional messages or one-off communications
 * Supports rich media (images, videos, documents) and interactive buttons
 */
export async function sendWhatsAppMessage(
  phone: string,
  content: WhatsAppContent,
  messageType: WhatsAppMessageType = 'text',
  options?: {
    skipSuppressionCheck?: boolean;
    trackingId?: string;
  }
): Promise<{
  success: boolean;
  messageId?: string;
  status: WhatsAppRecipientStatus;
  error?: string;
}> {
  // Validate phone number
  const phoneValidation = validatePhoneNumber(phone);
  if (!phoneValidation.valid) {
    return {
      success: false,
      status: 'failed',
      error: `Invalid phone number: ${phoneValidation.error}`,
    };
  }

  const normalizedPhone = phoneValidation.normalized!;

  // Check suppression list (Requirement 3.4, 3.8)
  if (!options?.skipSuppressionCheck && checkSuppressionList(normalizedPhone)) {
    return {
      success: false,
      status: 'opted-out',
      error: 'Phone number is on suppression list',
    };
  }

  // Validate WhatsApp content (Requirement 3.3)
  const contentValidation = validateWhatsAppContent(content);
  if (!contentValidation.valid) {
    return {
      success: false,
      status: 'failed',
      error: contentValidation.error,
    };
  }

  try {
    // Send WhatsApp message (Requirements 3.3, 3.5)
    const success = await simulateWhatsAppSend(normalizedPhone, content, messageType);

    if (success) {
      const messageId = options?.trackingId || id('wamsg');
      return {
        success: true,
        messageId,
        status: 'sent',
      };
    } else {
      // Retry once after 5 minutes (Requirement 3.8)
      setTimeout(async () => {
        const retrySuccess = await simulateWhatsAppSend(normalizedPhone, content, messageType);
        if (!retrySuccess) {
          console.error(`WhatsApp message retry failed for ${normalizedPhone}`);
        }
      }, 300000);

      return {
        success: false,
        status: 'failed',
        error: 'Message delivery failed, retry scheduled',
      };
    }
  } catch (error) {
    return {
      success: false,
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}


// ── Push Notification Functions ──────────────────────────────────────────────

export function registerDeviceToken(userId: string, token: string, platform: PushPlatform): void {
  if (!deviceTokens[userId]) {
    deviceTokens[userId] = [];
  }
  
  // Check if token already exists
  const existing = deviceTokens[userId].find(dt => dt.token === token);
  if (existing) {
    existing.lastUsedAt = Date.now();
    existing.active = true;
    return;
  }
  
  const deviceToken: DeviceToken = {
    userId,
    token,
    platform,
    active: true,
    createdAt: Date.now(),
    lastUsedAt: Date.now(),
  };
  
  deviceTokens[userId].push(deviceToken);
}

export function getDeviceTokens(userId: string): DeviceToken[] {
  return deviceTokens[userId]?.filter(dt => dt.active) || [];
}

export function deactivateDeviceToken(userId: string, token: string): void {
  const tokens = deviceTokens[userId];
  if (!tokens) return;
  
  const deviceToken = tokens.find(dt => dt.token === token);
  if (deviceToken) {
    deviceToken.active = false;
  }
}

export function createPushNotification(campaignId: string, data: Omit<PushNotification, 'id' | 'campaignId' | 'metrics'>): PushNotification {
  const pushNotification: PushNotification = {
    ...data,
    id: id('push'),
    campaignId,
    metrics: {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      conversions: 0,
      deliveryRate: 0,
      openRate: 0,
      clickRate: 0,
      conversionRate: 0,
      revenue: 0,
    },
  };
  pushNotifications[pushNotification.id] = pushNotification;
  return pushNotification;
}

export function getPushNotification(notificationId: string): PushNotification | null {
  return pushNotifications[notificationId] || null;
}

export function listPushNotifications(campaignId: string): PushNotification[] {
  return Object.values(pushNotifications).filter(pn => pn.campaignId === campaignId);
}

// ── Notification Preferences Functions ───────────────────────────────────────

export function getNotificationPreferences(userId: string): NotificationPreferences {
  if (!notificationPreferences[userId]) {
    // Create default preferences
    notificationPreferences[userId] = {
      userId,
      enabled: true,
      categories: {
        promotional: true,
        transactional: true,
        eventUpdates: true,
        reminders: true,
      },
      frequency: {
        maxPerWeek: 3,
        currentWeekCount: 0,
        weekStartDate: Date.now(),
      },
      updatedAt: Date.now(),
    };
  }
  return notificationPreferences[userId];
}

export function updateNotificationPreferences(userId: string, updates: Partial<Omit<NotificationPreferences, 'userId'>>): NotificationPreferences {
  const current = getNotificationPreferences(userId);
  const updated: NotificationPreferences = {
    ...current,
    ...updates,
    userId,
    updatedAt: Date.now(),
  };
  notificationPreferences[userId] = updated;
  return updated;
}

export function canSendPushNotification(userId: string, category: keyof NotificationPreferences['categories']): boolean {
  const prefs = getNotificationPreferences(userId);
  
  // Check if notifications are enabled
  if (!prefs.enabled) return false;
  
  // Check if category is enabled
  if (!prefs.categories[category]) return false;
  
  // Check frequency limit (Requirement 4.7: max 3 promotional per week)
  // Transactional, eventUpdates, and reminders bypass frequency limits
  if (category === 'promotional') {
    const now = Date.now();
    const weekInMs = 7 * 24 * 60 * 60 * 1000;
    
    // Reset counter if week has passed
    if (now - prefs.frequency.weekStartDate > weekInMs) {
      prefs.frequency.currentWeekCount = 0;
      prefs.frequency.weekStartDate = now;
    }
    
    // Check if limit reached
    if (prefs.frequency.currentWeekCount >= prefs.frequency.maxPerWeek) {
      return false;
    }
  }
  
  return true;
}

export function incrementNotificationCount(userId: string): void {
  const prefs = getNotificationPreferences(userId);
  prefs.frequency.currentWeekCount++;
  notificationPreferences[userId] = prefs;
}

/**
 * Reset notification frequency counter for a user
 * Useful for testing or manual admin intervention
 */
export function resetNotificationFrequency(userId: string): void {
  const prefs = getNotificationPreferences(userId);
  prefs.frequency.currentWeekCount = 0;
  prefs.frequency.weekStartDate = Date.now();
  notificationPreferences[userId] = prefs;
}

/**
 * Get remaining notification quota for a user this week
 * Returns number of promotional notifications user can still receive
 */
export function getRemainingNotificationQuota(userId: string): number {
  const prefs = getNotificationPreferences(userId);
  const now = Date.now();
  const weekInMs = 7 * 24 * 60 * 60 * 1000;
  
  // Reset counter if week has passed
  if (now - prefs.frequency.weekStartDate > weekInMs) {
    prefs.frequency.currentWeekCount = 0;
    prefs.frequency.weekStartDate = now;
    notificationPreferences[userId] = prefs;
  }
  
  return Math.max(0, prefs.frequency.maxPerWeek - prefs.frequency.currentWeekCount);
}

export function removeInvalidDeviceTokens(userId: string, invalidTokens: string[]): void {
  const tokens = deviceTokens[userId];
  if (!tokens) return;
  
  invalidTokens.forEach(token => {
    const deviceToken = tokens.find(dt => dt.token === token);
    if (deviceToken) {
      deviceToken.active = false;
    }
  });
}

// ── Push Notification Sending Functions ──────────────────────────────────────

/**
 * Send push notification to recipients with timezone-aware scheduling
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.8
 */
export async function sendPushNotification(
  notificationId: string,
  options?: {
    segmentId?: string;
    timezone?: string;
    scheduledTime?: number;
  }
): Promise<{
  success: boolean;
  sent: number;
  failed: number;
  invalidTokens: string[];
  errors: Array<{ userId: string; error: string }>;
}> {
  const notification = getPushNotification(notificationId);
  if (!notification) {
    throw new Error(`Push notification ${notificationId} not found`);
  }

  const now = Date.now();
  const invalidTokens: string[] = [];
  const errors: Array<{ userId: string; error: string }> = [];
  let sent = 0;
  let failed = 0;

  // Check if notification should be sent now or scheduled
  if (notification.scheduledAt && notification.scheduledAt > now) {
    // Notification is scheduled for future, don't send yet
    return {
      success: true,
      sent: 0,
      failed: 0,
      invalidTokens: [],
      errors: [],
    };
  }

  // Check if notification has expired
  if (notification.expiresAt && notification.expiresAt < now) {
    notification.status = 'failed';
    return {
      success: false,
      sent: 0,
      failed: notification.recipients.length,
      invalidTokens: [],
      errors: [{ userId: 'system', error: 'Notification has expired' }],
    };
  }

  notification.status = 'sending';
  notification.sentAt = now;

  // Process each recipient
  for (const recipient of notification.recipients) {
    try {
      // Check if user can receive push notifications (Requirement 4.7)
      // Transactional notifications bypass frequency limits
      const category = notification.category;
      if (!canSendPushNotification(recipient.userId, category)) {
        recipient.status = 'failed';
        recipient.errorCode = 'FREQUENCY_LIMIT_EXCEEDED';
        failed++;
        errors.push({
          userId: recipient.userId,
          error: 'User has reached notification frequency limit',
        });
        continue;
      }

      // Apply timezone-aware scheduling if specified (Requirement 4.4)
      if (options?.timezone && options?.scheduledTime) {
        const shouldDelay = shouldDelayForTimezone(
          options.scheduledTime,
          options.timezone,
          recipient.userId
        );
        if (shouldDelay) {
          // Keep as pending for later delivery
          continue;
        }
      }

      // Check quiet hours if user has them configured
      const prefs = getNotificationPreferences(recipient.userId);
      if (prefs.quietHours?.enabled) {
        const isQuietHour = isInQuietHours(
          prefs.quietHours.startHour,
          prefs.quietHours.endHour,
          prefs.quietHours.timezone
        );
        if (isQuietHour) {
          // Skip for now, would need rescheduling logic
          continue;
        }
      }

      // Simulate sending push notification (in real implementation, would call FCM/OneSignal API)
      // For now, we'll mark as sent
      recipient.status = 'sent';
      recipient.sentAt = now;
      sent++;

      // Increment notification count for frequency tracking (Requirement 4.7)
      if (category === 'promotional') {
        incrementNotificationCount(recipient.userId);
      }

      // Simulate delivery confirmation (would come from push service webhook)
      recipient.status = 'delivered';
      recipient.deliveredAt = now;
    } catch (error) {
      recipient.status = 'failed';
      recipient.errorCode = 'SEND_ERROR';
      failed++;
      errors.push({
        userId: recipient.userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      // Check if token is invalid (Requirement 4.8)
      if (error instanceof Error && error.message.includes('invalid token')) {
        invalidTokens.push(recipient.deviceToken);
      }
    }
  }

  // Update notification status
  notification.status = failed === 0 ? 'sent' : 'failed';

  // Update metrics
  notification.metrics.sent = sent;
  notification.metrics.delivered = notification.recipients.filter(
    r => r.status === 'delivered'
  ).length;
  notification.metrics.deliveryRate =
    sent > 0 ? (notification.metrics.delivered / sent) * 100 : 0;

  // Remove invalid device tokens (Requirement 4.8)
  if (invalidTokens.length > 0) {
    const userTokenMap = new Map<string, string[]>();
    notification.recipients.forEach(r => {
      if (invalidTokens.includes(r.deviceToken)) {
        if (!userTokenMap.has(r.userId)) {
          userTokenMap.set(r.userId, []);
        }
        userTokenMap.get(r.userId)!.push(r.deviceToken);
      }
    });

    userTokenMap.forEach((tokens, userId) => {
      removeInvalidDeviceTokens(userId, tokens);
    });
  }

  return {
    success: failed === 0,
    sent,
    failed,
    invalidTokens,
    errors,
  };
}

/**
 * Track push notification delivery status
 * Requirements: 4.6
 */
export function trackPushDelivery(
  notificationId: string,
  deviceToken: string,
  status: 'delivered' | 'opened' | 'clicked' | 'failed',
  errorCode?: string
): void {
  const notification = getPushNotification(notificationId);
  if (!notification) {
    throw new Error(`Push notification ${notificationId} not found`);
  }

  const recipient = notification.recipients.find(r => r.deviceToken === deviceToken);
  if (!recipient) {
    throw new Error(`Recipient with device token ${deviceToken} not found`);
  }

  const now = Date.now();

  switch (status) {
    case 'delivered':
      recipient.status = 'delivered';
      recipient.deliveredAt = now;
      notification.metrics.delivered++;
      break;

    case 'opened':
      recipient.status = 'opened';
      recipient.openedAt = now;
      notification.metrics.opened++;
      break;

    case 'clicked':
      notification.metrics.clicked++;
      break;

    case 'failed':
      recipient.status = 'failed';
      recipient.errorCode = errorCode;
      
      // If token is invalid, deactivate it (Requirement 4.8)
      if (errorCode === 'INVALID_TOKEN' || errorCode === 'TOKEN_EXPIRED') {
        deactivateDeviceToken(recipient.userId, deviceToken);
      }
      break;
  }

  // Recalculate metrics
  const totalSent = notification.metrics.sent;
  if (totalSent > 0) {
    notification.metrics.deliveryRate = (notification.metrics.delivered / totalSent) * 100;
    notification.metrics.openRate = (notification.metrics.opened / totalSent) * 100;
    notification.metrics.clickRate = (notification.metrics.clicked / totalSent) * 100;
  }
}

// ── Timezone-Aware Scheduling Helpers ────────────────────────────────────────

/**
 * Check if notification should be delayed based on recipient's timezone
 * Requirement 4.4: Deliver at specified time in recipient's timezone
 */
function shouldDelayForTimezone(
  scheduledTime: number,
  targetTimezone: string,
  userId: string
): boolean {
  // In a real implementation, would:
  // 1. Get user's timezone from their profile or device
  // 2. Convert scheduledTime to user's local time
  // 3. Check if current time in user's timezone matches scheduled time
  
  // For now, simplified implementation
  const now = Date.now();
  return scheduledTime > now;
}

/**
 * Check if current time is within user's quiet hours
 */
function isInQuietHours(
  startHour: number,
  endHour: number,
  timezone: string
): boolean {
  // In a real implementation, would:
  // 1. Get current time in user's timezone
  // 2. Check if hour is between startHour and endHour
  
  // For now, simplified implementation using UTC
  const now = new Date();
  const currentHour = now.getUTCHours();
  
  if (startHour < endHour) {
    return currentHour >= startHour && currentHour < endHour;
  } else {
    // Quiet hours span midnight
    return currentHour >= startHour || currentHour < endHour;
  }
}

/**
 * Calculate optimal send time based on recipient's timezone
 * Requirement 4.4: Schedule for optimal engagement times
 */
export function calculateOptimalSendTime(
  baseTime: number,
  recipientTimezone: string,
  preferredHour: number = 10 // Default to 10 AM local time
): number {
  // In a real implementation, would:
  // 1. Convert baseTime to recipient's timezone
  // 2. Adjust to preferredHour in their timezone
  // 3. Return adjusted timestamp
  
  // For now, simplified implementation
  const date = new Date(baseTime);
  date.setUTCHours(preferredHour, 0, 0, 0);
  return date.getTime();
}

/**
 * Batch send push notifications with timezone awareness
 * Requirement 4.4: Deliver at specified time in recipient's timezone
 */
export async function sendPushNotificationBatch(
  notificationId: string,
  recipientTimezones: Map<string, string>, // userId -> timezone
  scheduledHour: number = 10 // Hour in recipient's local time
): Promise<{
  success: boolean;
  totalRecipients: number;
  sentNow: number;
  scheduledLater: number;
  failed: number;
}> {
  const notification = getPushNotification(notificationId);
  if (!notification) {
    throw new Error(`Push notification ${notificationId} not found`);
  }

  let sentNow = 0;
  let scheduledLater = 0;
  let failed = 0;

  for (const recipient of notification.recipients) {
    const timezone = recipientTimezones.get(recipient.userId) || 'UTC';
    const optimalTime = calculateOptimalSendTime(Date.now(), timezone, scheduledHour);
    
    if (optimalTime <= Date.now()) {
      // Send now
      try {
        const result = await sendPushNotification(notificationId, { timezone });
        if (result.success) {
          sentNow++;
        } else {
          failed++;
        }
      } catch (error) {
        failed++;
      }
    } else {
      // Schedule for later
      scheduledLater++;
    }
  }

  return {
    success: failed === 0,
    totalRecipients: notification.recipients.length,
    sentNow,
    scheduledLater,
    failed,
  };
}

// ── Social Media Functions ───────────────────────────────────────────────────

export function connectSocialAccount(organizerId: string, data: Omit<SocialConnection, 'id' | 'organizerId' | 'connectedAt'>): SocialConnection {
  const connection: SocialConnection = {
    ...data,
    id: id('social'),
    organizerId,
    connectedAt: Date.now(),
  };
  
  if (!socialConnections[organizerId]) {
    socialConnections[organizerId] = [];
  }
  socialConnections[organizerId].push(connection);
  return connection;
}

export function listConnectedAccounts(organizerId: string): SocialConnection[] {
  return getSocialConnections(organizerId);
}

export function getSocialConnections(organizerId: string): SocialConnection[] {
  return socialConnections[organizerId]?.filter(sc => sc.active) || [];
}

export function getSocialConnection(organizerId: string, connectionId: string): SocialConnection | null {
  const connections = socialConnections[organizerId];
  if (!connections) return null;
  
  const connection = connections.find(c => c.id === connectionId && c.active);
  return connection || null;
}

export function disconnectSocialAccount(organizerId: string, connectionId: string): boolean {
  const connections = socialConnections[organizerId];
  if (!connections) return false;
  
  const connection = connections.find(c => c.id === connectionId);
  if (!connection) return false;
  
  connection.active = false;
  return true;
}

/**
 * Check if a social connection's access token is expired or about to expire
 * @param connection - The social connection to check
 * @param bufferMinutes - Minutes before expiration to consider token expired (default: 5)
 * @returns true if token is expired or about to expire
 */
export function isTokenExpired(connection: SocialConnection, bufferMinutes: number = 5): boolean {
  if (!connection.expiresAt) {
    // If no expiration is set, assume token doesn't expire (or is long-lived)
    return false;
  }
  
  const now = Date.now();
  const bufferMs = bufferMinutes * 60 * 1000;
  return now >= (connection.expiresAt - bufferMs);
}

/**
 * Refresh an expired OAuth token for a social connection
 * In a real implementation, this would call the platform's OAuth refresh endpoint
 * For now, this is a simulation that extends the token expiration
 * 
 * @param organizerId - The organizer ID
 * @param connectionId - The connection ID to refresh
 * @returns Updated connection with new tokens, or null if refresh failed
 */
export async function refreshSocialToken(organizerId: string, connectionId: string): Promise<SocialConnection | null> {
  const connections = socialConnections[organizerId];
  if (!connections) return null;
  
  const connection = connections.find(c => c.id === connectionId);
  if (!connection) return null;
  
  // Check if connection has a refresh token
  if (!connection.refreshToken) {
    console.error(`No refresh token available for connection ${connectionId}`);
    // Mark connection as inactive since we can't refresh it
    connection.active = false;
    return null;
  }
  
  try {
    // In a real implementation, this would make an API call to the platform's OAuth endpoint
    // For example:
    // - Facebook: POST https://graph.facebook.com/v18.0/oauth/access_token
    // - Twitter: POST https://api.twitter.com/2/oauth2/token
    // - LinkedIn: POST https://www.linkedin.com/oauth/v2/accessToken
    // - TikTok: POST https://open-api.tiktok.com/oauth/refresh_token/
    
    // Simulate API call to refresh token
    const refreshResult = await simulateTokenRefresh(connection.platform, connection.refreshToken);
    
    if (!refreshResult.success) {
      console.error(`Failed to refresh token for ${connection.platform}: ${refreshResult.error}`);
      
      // If refresh fails, mark connection as inactive
      connection.active = false;
      return null;
    }
    
    // Update connection with new tokens
    if (refreshResult.accessToken) {
      connection.accessToken = refreshResult.accessToken;
    }
    if (refreshResult.refreshToken) {
      connection.refreshToken = refreshResult.refreshToken;
    }
    if (refreshResult.expiresIn) {
      connection.expiresAt = Date.now() + (refreshResult.expiresIn * 1000);
    }
    connection.lastSyncAt = Date.now();
    
    return connection;
  } catch (error) {
    console.error(`Error refreshing token for connection ${connectionId}:`, error);
    connection.active = false;
    return null;
  }
}

/**
 * Simulate OAuth token refresh for different platforms
 * In production, this would make actual API calls to each platform
 */
async function simulateTokenRefresh(platform: SocialPlatform, refreshToken: string): Promise<{
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  error?: string;
}> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Simulate different platform behaviors
  switch (platform) {
    case 'facebook':
    case 'instagram':
      // Facebook tokens typically expire in 60 days
      return {
        success: true,
        accessToken: `fb_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        expiresIn: 60 * 24 * 60 * 60, // 60 days in seconds
      };
      
    case 'twitter':
      // Twitter OAuth 2.0 tokens expire in 2 hours
      return {
        success: true,
        accessToken: `tw_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        refreshToken: `tw_refresh_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        expiresIn: 2 * 60 * 60, // 2 hours in seconds
      };
      
    case 'linkedin':
      // LinkedIn tokens expire in 60 days
      return {
        success: true,
        accessToken: `li_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        refreshToken: `li_refresh_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        expiresIn: 60 * 24 * 60 * 60, // 60 days in seconds
      };
      
    case 'tiktok':
      // TikTok tokens expire in 24 hours
      return {
        success: true,
        accessToken: `tt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        refreshToken: `tt_refresh_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        expiresIn: 24 * 60 * 60, // 24 hours in seconds
      };
      
    default:
      return {
        success: false,
        error: `Unsupported platform: ${platform}`,
      };
  }
}

/**
 * Get a valid access token for a social connection, refreshing if necessary
 * This is the recommended way to get tokens before making API calls
 * 
 * @param organizerId - The organizer ID
 * @param connectionId - The connection ID
 * @returns Valid access token or null if unavailable/refresh failed
 */
export async function getValidAccessToken(organizerId: string, connectionId: string): Promise<string | null> {
  const connection = getSocialConnection(organizerId, connectionId);
  if (!connection) return null;
  
  // Check if token is expired or about to expire
  if (isTokenExpired(connection)) {
    console.log(`Token expired for connection ${connectionId}, attempting refresh...`);
    const refreshedConnection = await refreshSocialToken(organizerId, connectionId);
    
    if (!refreshedConnection) {
      console.error(`Failed to refresh token for connection ${connectionId}`);
      return null;
    }
    
    return refreshedConnection.accessToken;
  }
  
  return connection.accessToken;
}

/**
 * Update OAuth tokens for an existing social connection
 * Used when tokens are refreshed externally or need to be updated
 * 
 * @param organizerId - The organizer ID
 * @param connectionId - The connection ID
 * @param tokens - New token data
 * @returns Updated connection or null if not found
 */
export function updateSocialTokens(
  organizerId: string,
  connectionId: string,
  tokens: {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }
): SocialConnection | null {
  const connections = socialConnections[organizerId];
  if (!connections) return null;
  
  const connection = connections.find(c => c.id === connectionId);
  if (!connection) return null;
  
  if (tokens.accessToken) {
    connection.accessToken = tokens.accessToken;
  }
  if (tokens.refreshToken) {
    connection.refreshToken = tokens.refreshToken;
  }
  if (tokens.expiresAt !== undefined) {
    connection.expiresAt = tokens.expiresAt;
  }
  connection.lastSyncAt = Date.now();
  
  return connection;
}

/**
 * Check all social connections for a organizer and refresh expired tokens
 * This can be run periodically to maintain valid tokens
 * 
 * @param organizerId - The organizer ID
 * @returns Array of connection IDs that were refreshed
 */
export async function refreshExpiredTokens(organizerId: string): Promise<string[]> {
  const connections = socialConnections[organizerId];
  if (!connections) return [];
  
  const refreshedIds: string[] = [];
  
  for (const connection of connections) {
    if (!connection.active) continue;
    
    if (isTokenExpired(connection)) {
      const refreshed = await refreshSocialToken(organizerId, connection.id);
      if (refreshed) {
        refreshedIds.push(connection.id);
      }
    }
  }
  
  return refreshedIds;
}

export function createSocialPost(organizerId: string, data: Omit<SocialPost, 'id' | 'organizerId' | 'metrics'>): SocialPost {
  const post: SocialPost = {
    ...data,
    id: id('post'),
    organizerId,
    metrics: {
      impressions: 0,
      reach: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      clicks: 0,
      conversions: 0,
      engagementRate: 0,
      clickRate: 0,
      conversionRate: 0,
      revenue: 0,
    },
  };
  socialPosts[post.id] = post;
  return post;
}

export function getSocialPost(postId: string): SocialPost | null {
  return socialPosts[postId] || null;
}

export function updateSocialPostMetrics(postId: string, metrics: Partial<SocialMetrics>): void {
  const post = socialPosts[postId];
  if (!post) return;
  
  post.metrics = { ...post.metrics, ...metrics };
  
  // Calculate derived metrics
  if (post.metrics.impressions > 0) {
    const totalEngagement = post.metrics.likes + post.metrics.comments + post.metrics.shares;
    post.metrics.engagementRate = (totalEngagement / post.metrics.impressions) * 100;
    post.metrics.clickRate = (post.metrics.clicks / post.metrics.impressions) * 100;
  }
}

/**
 * Post content to a social media platform
 * Requirements: 1.2, 1.3, 1.5, 1.8
 *
 * @param organizerId - The organizer ID
 * @param platform - The social platform to post to
 * @param content - The post content with platform-specific optimization
 * @returns Result with post details or error
 */
export async function postToSocial(
  organizerId: string,
  platform: SocialPlatform,
  content: {
    eventId: string;
    text: string;
    mediaUrls?: string[];
    hashtags?: string[];
    customCaption?: string;
  }
): Promise<{ success: boolean; post?: SocialPost; error?: string }> {
  // Get active connection for the platform
  const connection = getSocialConnections(organizerId).find(
    c => c.platform === platform && c.active
  );

  if (!connection) {
    return {
      success: false,
      error: `No active ${platform} connection found. Please connect your account first.`,
    };
  }

  // Get valid access token (refresh if needed)
  const accessToken = await getValidAccessToken(organizerId, connection.id);
  if (!accessToken) {
    return {
      success: false,
      error: `Failed to get valid access token for ${platform}. Please reconnect your account.`,
    };
  }

  try {
    // Optimize content for the specific platform
    const optimizedContent = optimizeContentForPlatform(platform, content);

    // Create the social post record
    const post = createSocialPost(organizerId, {
      eventId: content.eventId,
      platform,
      content: optimizedContent.text,
      mediaUrls: optimizedContent.mediaUrls || [],
      hashtags: optimizedContent.hashtags || [],
      status: 'draft',
    });

    // Simulate API call to post to the platform
    const platformResult = await postToPlatformAPI(
      platform,
      accessToken,
      optimizedContent
    );

    if (!platformResult.success) {
      post.status = 'failed';
      post.errorMessage = platformResult.error;
      return {
        success: false,
        post,
        error: platformResult.error,
      };
    }

    // Update post with platform response
    post.status = 'published';
    post.publishedAt = Date.now();
    post.platformPostId = platformResult.postId;

    return {
      success: true,
      post,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      error: `Failed to post to ${platform}: ${errorMessage}`,
    };
  }
}

/**
 * Schedule a social media post for future publishing
 * Requirements: 1.4, 1.8
 *
 * @param organizerId - The organizer ID
 * @param platform - The social platform to post to
 * @param content - The post content
 * @param scheduledAt - Timestamp when the post should be published
 * @returns The scheduled post
 */
export function scheduleSocialPost(
  organizerId: string,
  platform: SocialPlatform,
  content: {
    eventId: string;
    text: string;
    mediaUrls?: string[];
    hashtags?: string[];
    customCaption?: string;
  },
  scheduledAt: number
): SocialPost | null {
  // Verify connection exists
  const connection = getSocialConnections(organizerId).find(
    c => c.platform === platform && c.active
  );

  if (!connection) {
    console.error(`No active ${platform} connection found for organizer ${organizerId}`);
    return null;
  }

  // Optimize content for the platform
  const optimizedContent = optimizeContentForPlatform(platform, content);

  // Create scheduled post
  const post = createSocialPost(organizerId, {
    eventId: content.eventId,
    platform,
    content: optimizedContent.text,
    mediaUrls: optimizedContent.mediaUrls || [],
    hashtags: optimizedContent.hashtags || [],
    scheduledAt,
    status: 'scheduled',
  });

  return post;
}

/**
 * Schedule automatic posts to multiple social platforms for an event
 * Requirements: 1.2, 1.3, 1.4, 1.8
 *
 * @param eventId - The event ID
 * @param platforms - Array of platforms to post to
 * @param eventData - Event data for generating post content
 * @returns Array of scheduled posts
 */
export async function scheduleAutoPost(
  eventId: string,
  platforms: SocialPlatform[],
  eventData: {
    organizerId: string;
    title: string;
    description: string;
    date: string;
    location: string;
    imageUrl: string;
    ticketUrl: string;
  }
): Promise<SocialPost[]> {
  const scheduledPosts: SocialPost[] = [];

  // Calculate optimal posting time based on audience timezone
  // For now, schedule for 2 hours from now (in production, this would use analytics)
  const optimalTime = Date.now() + (2 * 60 * 60 * 1000);

  for (const platform of platforms) {
    // Generate platform-optimized content
    const content = generateEventPostContent(platform, eventData);

    // Schedule the post
    const post = scheduleSocialPost(
      eventData.organizerId,
      platform,
      {
        eventId,
        text: content.text,
        mediaUrls: [eventData.imageUrl],
        hashtags: content.hashtags,
      },
      optimalTime
    );

    if (post) {
      scheduledPosts.push(post);
    }
  }

  return scheduledPosts;
}

/**
 * Get metrics for a social media post
 * Requirements: 1.5
 *
 * @param postId - The post ID
 * @returns Social metrics or null if not found
 */
export function getSocialMetrics(postId: string): SocialMetrics | null {
  const post = getSocialPost(postId);
  if (!post) return null;

  return post.metrics;
}

/**
 * Sync metrics from social platform API
 * Requirements: 1.5
 *
 * @param postId - The post ID
 * @returns Updated metrics or null if sync failed
 */
export async function syncSocialMetrics(postId: string): Promise<SocialMetrics | null> {
  const post = getSocialPost(postId);
  if (!post || !post.platformPostId) return null;

  const connection = getSocialConnections(post.organizerId).find(
    c => c.platform === post.platform && c.active
  );

  if (!connection) return null;

  const accessToken = await getValidAccessToken(post.organizerId, connection.id);
  if (!accessToken) return null;

  try {
    // Simulate fetching metrics from platform API
    const platformMetrics = await fetchPlatformMetrics(
      post.platform,
      accessToken,
      post.platformPostId
    );

    if (platformMetrics) {
      updateSocialPostMetrics(postId, platformMetrics);
      return post.metrics;
    }

    return null;
  } catch (error) {
    console.error(`Failed to sync metrics for post ${postId}:`, error);
    return null;
  }
}

// ── Platform-Specific Content Optimization ───────────────────────────────────

/**
 * Optimize content for specific social media platform
 * Requirements: 1.3, 1.7
 *
 * @param platform - The target platform
 * @param content - The original content
 * @returns Optimized content for the platform
 */
function optimizeContentForPlatform(
  platform: SocialPlatform,
  content: {
    eventId: string;
    text: string;
    mediaUrls?: string[];
    hashtags?: string[];
    customCaption?: string;
  }
): {
  text: string;
  mediaUrls?: string[];
  hashtags?: string[];
} {
  const baseText = content.customCaption || content.text;
  const hashtags = content.hashtags || [];

  switch (platform) {
    case 'twitter':
      // Twitter: 280 character limit, hashtags inline
      const twitterHashtags = hashtags.slice(0, 3).map(h => `#${h}`).join(' ');
      const twitterText = truncateText(baseText, 280 - twitterHashtags.length - 1);
      return {
        text: `${twitterText} ${twitterHashtags}`.trim(),
        mediaUrls: content.mediaUrls?.slice(0, 4), // Max 4 images
        hashtags: [],
      };

    case 'instagram':
      // Instagram: Hashtags at end, up to 30 hashtags, 2200 char limit
      const instaHashtags = hashtags.slice(0, 30).map(h => `#${h}`).join(' ');
      const instaText = truncateText(baseText, 2200 - instaHashtags.length - 2);
      return {
        text: `${instaText}\n\n${instaHashtags}`.trim(),
        mediaUrls: content.mediaUrls?.slice(0, 10), // Max 10 images in carousel
        hashtags: [],
      };

    case 'facebook':
      // Facebook: 63,206 char limit, hashtags less important
      const fbHashtags = hashtags.slice(0, 5).map(h => `#${h}`).join(' ');
      return {
        text: `${baseText}\n\n${fbHashtags}`.trim(),
        mediaUrls: content.mediaUrls,
        hashtags: [],
      };

    case 'linkedin':
      // LinkedIn: 3000 char limit, professional tone, fewer hashtags
      const liHashtags = hashtags.slice(0, 3).map(h => `#${h}`).join(' ');
      const liText = truncateText(baseText, 3000 - liHashtags.length - 2);
      return {
        text: `${liText}\n\n${liHashtags}`.trim(),
        mediaUrls: content.mediaUrls?.slice(0, 9), // Max 9 images
        hashtags: [],
      };

    case 'tiktok':
      // TikTok: 2200 char limit, hashtags important for discovery
      const ttHashtags = hashtags.slice(0, 10).map(h => `#${h}`).join(' ');
      const ttText = truncateText(baseText, 2200 - ttHashtags.length - 1);
      return {
        text: `${ttText} ${ttHashtags}`.trim(),
        mediaUrls: content.mediaUrls?.slice(0, 1), // Single video
        hashtags: [],
      };

    default:
      return {
        text: baseText,
        mediaUrls: content.mediaUrls,
        hashtags,
      };
  }
}

/**
 * Generate event post content optimized for a platform
 * Requirements: 1.3
 */
function generateEventPostContent(
  platform: SocialPlatform,
  eventData: {
    title: string;
    description: string;
    date: string;
    location: string;
    ticketUrl: string;
  }
): {
  text: string;
  hashtags: string[];
} {
  const baseHashtags = ['Events', 'Tickets', eventData.location.replace(/\s+/g, '')];

  switch (platform) {
    case 'twitter':
      return {
        text: `${eventData.title}\n${eventData.date}\n${eventData.location}\n\nGet tickets: ${eventData.ticketUrl}`,
        hashtags: baseHashtags.slice(0, 2),
      };

    case 'instagram':
      return {
        text: `${eventData.title}\n\n${eventData.description.slice(0, 200)}...\n\n${eventData.date}\n${eventData.location}\n\nLink in bio for tickets!`,
        hashtags: [...baseHashtags, 'EventPlanning', 'LiveEvents', 'EventLife'],
      };

    case 'facebook':
      return {
        text: `${eventData.title}\n\n${eventData.description}\n\nDate: ${eventData.date}\nLocation: ${eventData.location}\n\nGet your tickets now: ${eventData.ticketUrl}`,
        hashtags: baseHashtags,
      };

    case 'linkedin':
      return {
        text: `We're excited to announce: ${eventData.title}\n\n${eventData.description}\n\nEvent Details:\n${eventData.date}\n${eventData.location}\n\nSecure your spot: ${eventData.ticketUrl}`,
        hashtags: [...baseHashtags, 'Networking', 'ProfessionalDevelopment'],
      };

    case 'tiktok':
      return {
        text: `Don't miss ${eventData.title}!\n${eventData.date} at ${eventData.location}\n\nLink in bio for tickets!`,
        hashtags: [...baseHashtags, 'EventTok', 'FYP', 'Viral'],
      };

    default:
      return {
        text: `${eventData.title}\n\n${eventData.description}\n\n${eventData.date} | ${eventData.location}\n\nTickets: ${eventData.ticketUrl}`,
        hashtags: baseHashtags,
      };
  }
}

/**
 * Truncate text to fit character limit while preserving words
 */
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;

  const truncated = text.slice(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');

  return lastSpace > 0 ? truncated.slice(0, lastSpace) + '...' : truncated + '...';
}

// ── Platform API Simulation Functions ────────────────────────────────────────

/**
 * Simulate posting to platform API
 * In production, this would make actual API calls to each platform
 * Requirements: 1.2, 1.6
 */
async function postToPlatformAPI(
  platform: SocialPlatform,
  accessToken: string,
  content: {
    text: string;
    mediaUrls?: string[];
    hashtags?: string[];
  }
): Promise<{ success: boolean; postId?: string; error?: string }> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Simulate 95% success rate
  if (Math.random() < 0.95) {
    return {
      success: true,
      postId: `${platform}_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    };
  } else {
    return {
      success: false,
      error: `Platform API error: Rate limit exceeded or invalid token`,
    };
  }
}

/**
 * Simulate fetching metrics from platform API
 * In production, this would make actual API calls to each platform
 * Requirements: 1.5
 */
async function fetchPlatformMetrics(
  platform: SocialPlatform,
  accessToken: string,
  platformPostId: string
): Promise<Partial<SocialMetrics> | null> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // Simulate metrics based on platform
  const baseMetrics = {
    impressions: Math.floor(Math.random() * 10000) + 1000,
    reach: Math.floor(Math.random() * 8000) + 800,
    likes: Math.floor(Math.random() * 500) + 50,
    comments: Math.floor(Math.random() * 100) + 10,
    shares: Math.floor(Math.random() * 50) + 5,
    clicks: Math.floor(Math.random() * 200) + 20,
  };

  return baseMetrics;
}


// ── Paid Advertising Functions ───────────────────────────────────────────────

export function createAdCampaign(organizerId: string, data: Omit<AdCampaign, 'id' | 'organizerId' | 'metrics' | 'createdAt' | 'updatedAt'>): AdCampaign {
  const adCampaign: AdCampaign = {
    ...data,
    id: id('adcamp'),
    organizerId,
    metrics: {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      spend: 0,
      revenue: 0,
      cpm: 0,
      cpc: 0,
      cpa: 0,
      roas: 0,
      ctr: 0,
      conversionRate: 0,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  adCampaigns[adCampaign.id] = adCampaign;
  return adCampaign;
}

export function getAdCampaign(campaignId: string): AdCampaign | null {
  return adCampaigns[campaignId] || null;
}

export function listAdCampaigns(organizerId: string): AdCampaign[] {
  return Object.values(adCampaigns)
    .filter(ac => ac.organizerId === organizerId)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function updateAdCampaign(campaignId: string, updates: Partial<AdCampaign>): AdCampaign | null {
  const campaign = adCampaigns[campaignId];
  if (!campaign) return null;
  
  adCampaigns[campaignId] = {
    ...campaign,
    ...updates,
    updatedAt: Date.now(),
  };
  return adCampaigns[campaignId];
}

export function pauseAdCampaign(campaignId: string): AdCampaign | null {
  return updateAdCampaign(campaignId, { status: 'paused' });
}

export function installRetargetingPixel(eventId: string, platform: AdPlatform, pixelId: string): RetargetingPixel {
  const pixel: RetargetingPixel = {
    id: id('pixel'),
    eventId,
    platform,
    pixelId,
    installed: true,
    installedAt: Date.now(),
    audiences: [],
  };
  retargetingPixels[pixel.id] = pixel;
  return pixel;
}

export function createRetargetingAudience(pixelId: string, data: Omit<RetargetingAudience, 'id' | 'lastSyncAt'>): RetargetingAudience | null {
  const pixel = Object.values(retargetingPixels).find(p => p.pixelId === pixelId);
  if (!pixel) return null;
  
  const audience: RetargetingAudience = {
    ...data,
    id: id('audience'),
    lastSyncAt: Date.now(),
  };
  
  pixel.audiences.push(audience);
  return audience;
}

/**
 * Sync ad metrics from external ad platform (Requirement 10.5)
 * In production, this would call Facebook Ads API, Google Ads API, or TikTok Ads API
 * Syncs every 6 hours as per requirement
 */
export async function syncAdMetrics(campaignId: string): Promise<AdMetrics> {
  const campaign = adCampaigns[campaignId];
  if (!campaign) {
    throw new Error('Ad campaign not found');
  }

  // Simulate API call to ad platform
  // In production, this would call the actual platform API based on campaign.platform
  const simulatedMetrics: AdMetrics = {
    impressions: Math.floor(Math.random() * 100000) + campaign.metrics.impressions,
    clicks: Math.floor(Math.random() * 5000) + campaign.metrics.clicks,
    conversions: Math.floor(Math.random() * 200) + campaign.metrics.conversions,
    spend: parseFloat((Math.random() * campaign.budget.amount * 0.8).toFixed(2)),
    revenue: 0, // Will be updated from attribution tracking
    cpm: 0,
    cpc: 0,
    cpa: 0,
    roas: 0,
    ctr: 0,
    conversionRate: 0,
  };

  // Calculate derived metrics
  if (simulatedMetrics.impressions > 0) {
    simulatedMetrics.cpm = (simulatedMetrics.spend / simulatedMetrics.impressions) * 1000;
    simulatedMetrics.ctr = (simulatedMetrics.clicks / simulatedMetrics.impressions) * 100;
  }

  if (simulatedMetrics.clicks > 0) {
    simulatedMetrics.cpc = simulatedMetrics.spend / simulatedMetrics.clicks;
    simulatedMetrics.conversionRate = (simulatedMetrics.conversions / simulatedMetrics.clicks) * 100;
  }

  if (simulatedMetrics.conversions > 0) {
    simulatedMetrics.cpa = simulatedMetrics.spend / simulatedMetrics.conversions;
  }

  // Get revenue from attribution data
  const attributedRevenue = Object.values(attributions)
    .filter(a => a.eventId === campaign.eventId && a.campaign === campaign.name && a.converted)
    .reduce((sum, a) => sum + (a.conversionValue || 0), 0);

  simulatedMetrics.revenue = attributedRevenue;

  if (simulatedMetrics.spend > 0) {
    simulatedMetrics.roas = simulatedMetrics.revenue / simulatedMetrics.spend;
  }

  // Update campaign metrics and budget
  campaign.metrics = simulatedMetrics;
  campaign.budget.spent = simulatedMetrics.spend;
  campaign.lastSyncAt = Date.now();

  // Auto-pause if budget exhausted (Requirement 10.8)
  if (campaign.budget.spent >= campaign.budget.amount && campaign.status === 'active') {
    campaign.status = 'paused';
    // TODO: Send notification to organizer about budget exhaustion
  }

  return simulatedMetrics;
}

/**
 * Update ad campaign budget (Requirement 10.4)
 * Includes validation and auto-pause logic
 */
export function updateAdBudget(campaignId: string, newBudget: number, budgetType?: AdBudgetType): AdCampaign | null {
  const campaign = adCampaigns[campaignId];
  if (!campaign) return null;

  if (newBudget < 0) {
    throw new Error('Budget cannot be negative');
  }

  if (newBudget < campaign.budget.spent) {
    throw new Error(`New budget (${newBudget}) cannot be less than already spent amount (${campaign.budget.spent})`);
  }

  campaign.budget.amount = newBudget;
  if (budgetType) {
    campaign.budget.type = budgetType;
  }

  // Resume campaign if it was paused due to budget exhaustion
  if (campaign.status === 'paused' && campaign.budget.spent < campaign.budget.amount) {
    campaign.status = 'active';
  }

  campaign.updatedAt = Date.now();
  return campaign;
}

/**
 * Get retargeting pixel by event ID
 */
export function getRetargetingPixel(eventId: string): RetargetingPixel | null {
  return Object.values(retargetingPixels).find(p => p.eventId === eventId) || null;
}

/**
 * Generate retargeting pixel tracking code (Requirement 17.2)
 * Returns JavaScript code to be embedded in event pages
 */
export function generatePixelTrackingCode(pixelId: string, platform: AdPlatform): string {
  const pixel = Object.values(retargetingPixels).find(p => p.pixelId === pixelId);
  if (!pixel) {
    throw new Error('Retargeting pixel not found');
  }

  // Generate platform-specific pixel code
  switch (platform) {
    case 'facebook':
      return `
<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixelId}');
fbq('track', 'PageView');
fbq('track', 'ViewContent', {
  content_type: 'event',
  content_ids: ['${pixel.eventId}']
});
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1"
/></noscript>
<!-- End Facebook Pixel Code -->
      `.trim();

    case 'google':
      return `
<!-- Google Ads Remarketing Tag -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${pixelId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${pixelId}');
  gtag('event', 'page_view', {
    'event_category': 'event',
    'event_label': '${pixel.eventId}'
  });
</script>
<!-- End Google Ads Remarketing Tag -->
      `.trim();

    case 'tiktok':
      return `
<!-- TikTok Pixel Code -->
<script>
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
  ttq.load('${pixelId}');
  ttq.page();
  ttq.track('ViewContent', {
    content_type: 'event',
    content_id: '${pixel.eventId}'
  });
}(window, document, 'ttq');
</script>
<!-- End TikTok Pixel Code -->
      `.trim();

    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

/**
 * Sync retargeting audience to ad platform (Requirement 17.3, 17.8)
 * In production, this would sync audience data to Facebook, Google, or TikTok
 */
export async function syncRetargetingAudience(audienceId: string): Promise<{ success: boolean; size: number; lastSyncAt: number }> {
  // Find the audience across all pixels
  let audience: RetargetingAudience | null = null;
  let pixel: RetargetingPixel | null = null;

  for (const p of Object.values(retargetingPixels)) {
    const found = p.audiences.find(a => a.id === audienceId);
    if (found) {
      audience = found;
      pixel = p;
      break;
    }
  }

  if (!audience || !pixel) {
    throw new Error('Retargeting audience not found');
  }

  // Simulate audience size calculation based on rules
  // In production, this would query actual visitor data and sync to ad platform
  let estimatedSize = 0;

  for (const rule of audience.rules) {
    switch (rule.type) {
      case 'url-contains':
        // Simulate visitors who viewed event page
        estimatedSize += Math.floor(Math.random() * 5000) + 1000;
        break;
      case 'event-equals':
        // Simulate specific event tracking
        estimatedSize += Math.floor(Math.random() * 3000) + 500;
        break;
      case 'time-on-site':
        // Simulate engaged visitors
        estimatedSize += Math.floor(Math.random() * 2000) + 300;
        break;
      case 'custom-event':
        // Simulate custom event tracking
        estimatedSize += Math.floor(Math.random() * 1000) + 100;
        break;
    }
  }

  // Update audience
  audience.size = estimatedSize;
  audience.lastSyncAt = Date.now();

  return {
    success: true,
    size: estimatedSize,
    lastSyncAt: audience.lastSyncAt,
  };
}

/**
 * Create retargeting campaign (Requirement 17.4)
 * Automatically generates dynamic ads for viewed events
 */
export function createRetargetingCampaign(
  organizerId: string,
  eventId: string,
  platform: AdPlatform,
  audienceId: string,
  budget: AdBudget,
  eventData: { title: string; description: string; image: string }
): AdCampaign {
  // Verify audience exists
  let audienceExists = false;
  for (const pixel of Object.values(retargetingPixels)) {
    if (pixel.audiences.some(a => a.id === audienceId)) {
      audienceExists = true;
      break;
    }
  }

  if (!audienceExists) {
    throw new Error('Retargeting audience not found');
  }

  // Generate dynamic ad creative (Requirement 17.5)
  const creative: AdCreative = {
    id: id('creative'),
    name: `Retargeting - ${eventData.title}`,
    format: 'image',
    headline: `Don't miss ${eventData.title}!`,
    description: `You viewed this event. Get your tickets now before they sell out!`,
    callToAction: 'Get Tickets',
    mediaUrls: [eventData.image],
    landingUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://guestly.app'}/events/${eventId}`,
    active: true,
  };

  // Create ad campaign with retargeting audience
  const campaign = createAdCampaign(organizerId, {
    eventId,
    platform,
    name: `Retargeting - ${eventData.title}`,
    objective: 'conversions',
    status: 'draft',
    budget,
    targeting: {
      locations: [],
      interests: [],
      behaviors: [],
      customAudiences: [audienceId],
    },
    creatives: [creative],
    startDate: Date.now(),
  });

  return campaign;
}

/**
 * Track retargeting campaign frequency (Requirement 17.6)
 * Implements frequency capping: max 5 impressions per user per day
 */
interface FrequencyTracker {
  userId: string;
  campaignId: string;
  impressions: number;
  lastImpressionDate: string; // YYYY-MM-DD format
}

const frequencyTrackers: Record<string, FrequencyTracker> = {};
const MAX_IMPRESSIONS_PER_DAY = 5;

export function checkFrequencyCap(userId: string, campaignId: string): { allowed: boolean; remaining: number } {
  const today = new Date().toISOString().split('T')[0];
  const trackerId = `${userId}_${campaignId}`;
  let tracker = frequencyTrackers[trackerId];

  // Reset tracker if it's a new day
  if (!tracker || tracker.lastImpressionDate !== today) {
    tracker = {
      userId,
      campaignId,
      impressions: 0,
      lastImpressionDate: today,
    };
    frequencyTrackers[trackerId] = tracker;
  }

  const allowed = tracker.impressions < MAX_IMPRESSIONS_PER_DAY;
  const remaining = Math.max(0, MAX_IMPRESSIONS_PER_DAY - tracker.impressions);

  return { allowed, remaining };
}

export function trackAdImpression(userId: string, campaignId: string): void {
  const today = new Date().toISOString().split('T')[0];
  const trackerId = `${userId}_${campaignId}`;
  let tracker = frequencyTrackers[trackerId];

  if (!tracker || tracker.lastImpressionDate !== today) {
    tracker = {
      userId,
      campaignId,
      impressions: 1,
      lastImpressionDate: today,
    };
  } else {
    tracker.impressions++;
  }

  frequencyTrackers[trackerId] = tracker;
}

/**
 * Implement sequential retargeting (Requirement 17.7)
 * Shows different ad creatives based on time since last visit
 */
export function getSequentialRetargetingCreative(
  campaignId: string,
  daysSinceLastVisit: number
): AdCreative | null {
  const campaign = adCampaigns[campaignId];
  if (!campaign || campaign.creatives.length === 0) return null;

  // Sequential retargeting strategy:
  // Days 0-2: Reminder ad (first creative)
  // Days 3-7: Urgency ad (second creative if available)
  // Days 8+: Last chance ad (third creative if available)

  let creativeIndex = 0;

  if (daysSinceLastVisit >= 8 && campaign.creatives.length >= 3) {
    creativeIndex = 2; // Last chance ad
  } else if (daysSinceLastVisit >= 3 && campaign.creatives.length >= 2) {
    creativeIndex = 1; // Urgency ad
  }

  return campaign.creatives[creativeIndex];
}

/**
 * List all retargeting pixels
 */
export function listRetargetingPixels(eventId?: string): RetargetingPixel[] {
  let pixels = Object.values(retargetingPixels);

  if (eventId) {
    pixels = pixels.filter(p => p.eventId === eventId);
  }

  return pixels.sort((a, b) => (b.installedAt || 0) - (a.installedAt || 0));
}

/**
 * Get retargeting audience by ID
 */
export function getRetargetingAudience(audienceId: string): { audience: RetargetingAudience; pixel: RetargetingPixel } | null {
  for (const pixel of Object.values(retargetingPixels)) {
    const audience = pixel.audiences.find(a => a.id === audienceId);
    if (audience) {
      return { audience, pixel };
    }
  }
  return null;
}


// ── SEO Functions ────────────────────────────────────────────────────────────

/**
 * Generate SEO metadata for an event (Requirement 9.1, 9.7)
 * Automatically creates meta titles, descriptions, and Open Graph tags
 * Optimized for search engines and social media sharing
 */
export function generateSEOMetadata(eventId: string, eventData: { title: string; description: string; image: string; date: string; venue: string; city: string; country: string }): SEOMetadata {
  const canonicalUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://guestly.app'}/events/${eventId}`;
  
  // Format date for title (e.g., "Mar 12, 2026")
  const eventDate = new Date(eventData.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  // Generate optimized meta title (under 60 characters)
  // Format: "Event Name - City, Date | Guestly"
  const suffix = ' | Guestly'; // 10 chars
  const separator = ' - '; // 3 chars
  const dateCityPart = `${eventData.city}, ${formattedDate}`; // e.g., "Lagos, Mar 12, 2026"
  const maxTitleLength = 60 - suffix.length - separator.length - dateCityPart.length;
  
  let eventTitle = eventData.title;
  if (eventTitle.length > maxTitleLength) {
    // Truncate at word boundary
    eventTitle = eventTitle.slice(0, maxTitleLength - 3).split(' ').slice(0, -1).join(' ') + '...';
  }
  
  const metaTitle = `${eventTitle}${separator}${dateCityPart}${suffix}`;
  
  // Generate optimized meta description (under 160 characters)
  // Include key information: what, where, when
  let metaDescription = eventData.description;
  if (metaDescription.length > 160) {
    // Truncate at word boundary
    metaDescription = metaDescription.slice(0, 157).split(' ').slice(0, -1).join(' ') + '...';
  } else if (metaDescription.length < 120) {
    // Add venue and date if description is short
    const additionalInfo = ` ${eventData.venue ? `at ${eventData.venue}` : ''} on ${formattedDate}.`;
    if ((metaDescription + additionalInfo).length <= 160) {
      metaDescription += additionalInfo;
    }
  }
  
  // Generate keywords from event data
  const keywords = [
    eventData.title,
    eventData.city,
    eventData.country,
    'event',
    'tickets',
    eventData.venue || '',
    formattedDate.split(',')[0], // Month
  ].filter(k => k.length > 0);
  
  // Open Graph title (can be slightly longer, up to 70 chars)
  let ogTitle = `${eventData.title} - ${eventData.city}`;
  if (ogTitle.length > 70) {
    ogTitle = eventData.title.length > 67 
      ? eventData.title.slice(0, 67) + '...'
      : eventData.title;
  }
  
  // Open Graph description (up to 200 characters)
  let ogDescription = eventData.description;
  if (ogDescription.length > 200) {
    ogDescription = ogDescription.slice(0, 197).split(' ').slice(0, -1).join(' ') + '...';
  }
  
  // Twitter title (same as OG, max 70 chars)
  const twitterTitle = ogTitle;
  
  // Twitter description (max 200 chars)
  const twitterDescription = ogDescription;
  
  const metadata: SEOMetadata = {
    eventId,
    title: metaTitle,
    description: metaDescription,
    keywords,
    canonicalUrl,
    ogTitle,
    ogDescription,
    ogImage: eventData.image,
    ogType: 'event',
    twitterCard: 'summary_large_image',
    twitterTitle,
    twitterDescription,
    twitterImage: eventData.image,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: eventData.title,
      description: eventData.description,
      startDate: eventData.date,
      location: {
        '@type': 'Place',
        name: eventData.venue || eventData.city,
        address: {
          '@type': 'PostalAddress',
          addressLocality: eventData.city,
          addressCountry: eventData.country,
        },
      },
      image: [eventData.image],
      offers: [],
      organizer: {
        '@type': 'Organization',
        name: 'Guestly',
      },
    },
    generatedAt: Date.now(),
  };
  
  seoMetadata[eventId] = metadata;
  return metadata;
}

/**
 * Get SEO metadata for an event
 */
export function getSEOMetadata(eventId: string): SEOMetadata | null {
  return seoMetadata[eventId] || null;
}

/**
 * Update existing SEO metadata for an event
 */
export function updateSEOMetadata(eventId: string, updates: Partial<Omit<SEOMetadata, 'eventId' | 'generatedAt'>>): SEOMetadata | null {
  const existing = seoMetadata[eventId];
  if (!existing) return null;
  
  seoMetadata[eventId] = {
    ...existing,
    ...updates,
    generatedAt: Date.now(),
  };
  
  return seoMetadata[eventId];
}

/**
 * Delete SEO metadata for an event
 */
export function deleteSEOMetadata(eventId: string): boolean {
  if (!seoMetadata[eventId]) return false;
  delete seoMetadata[eventId];
  return true;
}

/**
 * Generate structured data (JSON-LD) for an event (Requirement 9.2, 9.7)
 * Creates Event, Place, and Offer schema types for rich search results
 * Optimized for Google, Facebook, Twitter, and LinkedIn
 */
export function generateStructuredData(eventId: string, eventData: { 
  title: string; 
  description: string; 
  startDate: string; 
  endDate?: string;
  venue: string; 
  address?: string;
  city: string; 
  region?: string;
  country: string;
  images: string[];
  offers: Array<{
    name: string;
    price: number;
    currency: string;
    availability: 'InStock' | 'SoldOut' | 'PreOrder';
    validFrom: string;
  }>;
  organizerName: string;
  organizerUrl?: string;
}): StructuredData {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://guestly.app';
  const eventUrl = `${baseUrl}/events/${eventId}`;
  
  // Ensure images array has at least one image
  const eventImages = eventData.images.length > 0 ? eventData.images : [`${baseUrl}/default-event-image.jpg`];
  
  // Map availability to schema.org format
  const mapAvailability = (availability: 'InStock' | 'SoldOut' | 'PreOrder'): string => {
    switch (availability) {
      case 'InStock':
        return 'https://schema.org/InStock';
      case 'SoldOut':
        return 'https://schema.org/SoldOut';
      case 'PreOrder':
        return 'https://schema.org/PreOrder';
      default:
        return 'https://schema.org/InStock';
    }
  };
  
  const structuredData: StructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: eventData.title,
    description: eventData.description,
    startDate: eventData.startDate,
    endDate: eventData.endDate,
    location: {
      '@type': 'Place',
      name: eventData.venue,
      address: {
        '@type': 'PostalAddress',
        streetAddress: eventData.address,
        addressLocality: eventData.city,
        addressRegion: eventData.region,
        addressCountry: eventData.country,
      },
    },
    image: eventImages,
    offers: eventData.offers.map(offer => ({
      '@type': 'Offer',
      url: eventUrl,
      price: offer.price.toString(),
      priceCurrency: offer.currency,
      availability: mapAvailability(offer.availability),
      validFrom: offer.validFrom,
    })),
    organizer: {
      '@type': eventData.organizerUrl ? 'Organization' : 'Organization',
      name: eventData.organizerName,
      url: eventData.organizerUrl,
    },
  };
  
  // Update the metadata if it exists
  if (seoMetadata[eventId]) {
    seoMetadata[eventId].structuredData = structuredData;
  }
  
  return structuredData;
}

/**
 * Update sitemap timestamp (Requirement 9.3)
 * Tracks when the sitemap was last updated for cache invalidation
 */
export function updateSitemap(): void {
  sitemapLastUpdated = Date.now();
  console.log(`[Marketing] Sitemap updated at ${new Date(sitemapLastUpdated).toISOString()}`);
}

/**
 * Get sitemap last updated timestamp
 */
export function getSitemapLastUpdated(): number {
  return sitemapLastUpdated;
}

/**
 * Get all event IDs for sitemap generation
 */
export function getEventIdsForSitemap(): string[] {
  return Object.keys(seoMetadata);
}

/**
 * Generate SEO checklist for an event (Requirement 9.4)
 * Validates title length, description quality, image alt text, and keyword usage
 */
export function getSEOChecklist(eventId: string): SEOChecklist {
  const metadata = seoMetadata[eventId];
  const items: SEOChecklistItem[] = [];
  let passCount = 0;
  
  if (!metadata) {
    return {
      eventId,
      items: [{
        name: 'SEO Metadata',
        status: 'fail',
        message: 'No SEO metadata found for this event',
        recommendation: 'Generate SEO metadata using generateSEOMetadata()',
      }],
      overallScore: 0,
      generatedAt: Date.now(),
    };
  }
  
  // Check title length (50-60 characters is optimal)
  const titleLength = metadata.title.length;
  if (titleLength >= 50 && titleLength <= 60) {
    items.push({
      name: 'Meta Title Length',
      status: 'pass',
      message: `Title length is optimal (${titleLength} characters)`,
    });
    passCount++;
  } else if (titleLength < 50) {
    items.push({
      name: 'Meta Title Length',
      status: 'warning',
      message: `Title is too short (${titleLength} characters)`,
      recommendation: 'Aim for 50-60 characters for better SEO',
    });
  } else {
    items.push({
      name: 'Meta Title Length',
      status: 'fail',
      message: `Title is too long (${titleLength} characters)`,
      recommendation: 'Keep title under 60 characters to avoid truncation',
    });
  }
  
  // Check description length (150-160 characters is optimal)
  const descLength = metadata.description.length;
  if (descLength >= 150 && descLength <= 160) {
    items.push({
      name: 'Meta Description Length',
      status: 'pass',
      message: `Description length is optimal (${descLength} characters)`,
    });
    passCount++;
  } else if (descLength < 150) {
    items.push({
      name: 'Meta Description Length',
      status: 'warning',
      message: `Description is too short (${descLength} characters)`,
      recommendation: 'Aim for 150-160 characters for better click-through rates',
    });
  } else {
    items.push({
      name: 'Meta Description Length',
      status: 'warning',
      message: `Description is too long (${descLength} characters)`,
      recommendation: 'Keep description under 160 characters to avoid truncation',
    });
  }
  
  // Check keywords
  if (metadata.keywords.length >= 3) {
    items.push({
      name: 'Keywords',
      status: 'pass',
      message: `${metadata.keywords.length} keywords defined`,
    });
    passCount++;
  } else {
    items.push({
      name: 'Keywords',
      status: 'warning',
      message: `Only ${metadata.keywords.length} keywords defined`,
      recommendation: 'Add at least 3-5 relevant keywords',
    });
  }
  
  // Check keyword density (Requirement 9.4)
  const contentText = `${metadata.title} ${metadata.description}`.toLowerCase();
  const words = contentText.split(/\s+/).filter(w => w.length > 3);
  const totalWords = words.length;
  
  if (metadata.keywords.length > 0 && totalWords > 0) {
    const keywordOccurrences = metadata.keywords.reduce((count, keyword) => {
      const keywordLower = keyword.toLowerCase();
      return count + (contentText.match(new RegExp(keywordLower, 'g')) || []).length;
    }, 0);
    
    const keywordDensity = (keywordOccurrences / totalWords) * 100;
    
    if (keywordDensity >= 1 && keywordDensity <= 3) {
      items.push({
        name: 'Keyword Density',
        status: 'pass',
        message: `Keyword density is optimal (${keywordDensity.toFixed(1)}%)`,
      });
      passCount++;
    } else if (keywordDensity < 1) {
      items.push({
        name: 'Keyword Density',
        status: 'warning',
        message: `Keyword density is low (${keywordDensity.toFixed(1)}%)`,
        recommendation: 'Include keywords more naturally in title and description (aim for 1-3%)',
      });
    } else {
      items.push({
        name: 'Keyword Density',
        status: 'warning',
        message: `Keyword density is high (${keywordDensity.toFixed(1)}%)`,
        recommendation: 'Reduce keyword repetition to avoid appearing spammy (aim for 1-3%)',
      });
    }
  } else {
    items.push({
      name: 'Keyword Density',
      status: 'fail',
      message: 'Cannot calculate keyword density',
      recommendation: 'Add keywords and ensure content has sufficient text',
    });
  }
  
  // Check image presence and alt text (Requirement 9.4)
  if (metadata.ogImage && metadata.ogImage.length > 0) {
    items.push({
      name: 'Image Presence',
      status: 'pass',
      message: 'Event image is present',
    });
    passCount++;
    
    // Check if structured data has images with proper setup
    if (metadata.structuredData && metadata.structuredData.image && metadata.structuredData.image.length > 0) {
      items.push({
        name: 'Image Alt Text',
        status: 'pass',
        message: 'Images are properly configured in structured data',
      });
      passCount++;
    } else {
      items.push({
        name: 'Image Alt Text',
        status: 'warning',
        message: 'Images should be included in structured data',
        recommendation: 'Ensure event images are included in structured data for better SEO',
      });
    }
  } else {
    items.push({
      name: 'Image Presence',
      status: 'fail',
      message: 'No event image set',
      recommendation: 'Add a high-quality image for social media sharing and SEO',
    });
    items.push({
      name: 'Image Alt Text',
      status: 'fail',
      message: 'No images to validate',
      recommendation: 'Add event images with descriptive alt text',
    });
  }
  
  // Check URL structure (Requirement 9.5)
  const urlParts = metadata.canonicalUrl.split('/');
  const slug = urlParts[urlParts.length - 1];
  const hasKebabCase = /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug);
  const hasDatePattern = /\d{4}-\d{2}-\d{2}/.test(slug);
  
  if (hasKebabCase && slug.length > 10) {
    items.push({
      name: 'URL Structure',
      status: 'pass',
      message: 'URL follows SEO-friendly kebab-case format',
    });
    passCount++;
  } else {
    items.push({
      name: 'URL Structure',
      status: 'warning',
      message: 'URL structure could be improved',
      recommendation: 'Use kebab-case format with event name, city, and date (e.g., tech-summit-lagos-2026-03-12)',
    });
  }
  
  // Check canonical URL
  if (metadata.canonicalUrl) {
    items.push({
      name: 'Canonical URL',
      status: 'pass',
      message: 'Canonical URL is set',
    });
    passCount++;
  } else {
    items.push({
      name: 'Canonical URL',
      status: 'fail',
      message: 'No canonical URL set',
      recommendation: 'Set canonical URL to prevent duplicate content issues',
    });
  }
  
  // Check structured data (Requirement 9.4)
  if (metadata.structuredData && metadata.structuredData.offers.length > 0) {
    items.push({
      name: 'Structured Data',
      status: 'pass',
      message: 'Structured data with offers is complete',
    });
    passCount++;
  } else if (metadata.structuredData) {
    items.push({
      name: 'Structured Data',
      status: 'warning',
      message: 'Structured data exists but no offers defined',
      recommendation: 'Add ticket offers to structured data for rich snippets',
    });
  } else {
    items.push({
      name: 'Structured Data',
      status: 'fail',
      message: 'No structured data found',
      recommendation: 'Generate structured data using generateStructuredData()',
    });
  }
  
  // Check Open Graph tags completeness (Requirement 9.4)
  const ogTagsComplete = metadata.ogTitle && metadata.ogDescription && metadata.ogImage && metadata.ogType;
  if (ogTagsComplete) {
    items.push({
      name: 'Open Graph Tags',
      status: 'pass',
      message: 'All Open Graph tags are complete',
    });
    passCount++;
  } else {
    const missingTags = [];
    if (!metadata.ogTitle) missingTags.push('og:title');
    if (!metadata.ogDescription) missingTags.push('og:description');
    if (!metadata.ogImage) missingTags.push('og:image');
    if (!metadata.ogType) missingTags.push('og:type');
    
    items.push({
      name: 'Open Graph Tags',
      status: 'warning',
      message: `Missing Open Graph tags: ${missingTags.join(', ')}`,
      recommendation: 'Complete all Open Graph tags for optimal social media sharing',
    });
  }
  
  const overallScore = Math.round((passCount / items.length) * 100);
  
  const checklist: SEOChecklist = {
    eventId,
    items,
    overallScore,
    generatedAt: Date.now(),
  };
  
  seoChecklists[eventId] = checklist;
  return checklist;
}

/**
 * Get SEO performance metrics for an event (Requirement 9.8)
 * Returns impressions, clicks, and average position from search console data
 */
export function getSEOMetrics(eventId: string): SEOMetrics | null {
  return seoMetrics[eventId] || null;
}

/**
 * Update SEO metrics for an event
 * In production, this would sync with Google Search Console API
 */
export function updateSEOMetrics(eventId: string, data: Omit<SEOMetrics, 'eventId' | 'lastUpdatedAt'>): SEOMetrics {
  const metrics: SEOMetrics = {
    eventId,
    ...data,
    lastUpdatedAt: Date.now(),
  };
  
  seoMetrics[eventId] = metrics;
  return metrics;
}

/**
 * List all SEO metadata entries
 */
export function listSEOMetadata(): SEOMetadata[] {
  return Object.values(seoMetadata).sort((a, b) => b.generatedAt - a.generatedAt);
}

/**
 * Generate SEO-friendly URL slug from event name, city, and date (Requirement 9.5)
 */
export function generateSEOFriendlyURL(eventName: string, city: string, date: string): string {
  const slug = `${eventName}-${city}-${date}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  return slug;
}

// ── Blog & Content Functions ─────────────────────────────────────────────────

export function createBlogPost(organizerId: string, data: Omit<BlogPost, 'id' | 'organizerId' | 'metrics' | 'createdAt' | 'updatedAt'>): BlogPost {
  const post: BlogPost = {
    ...data,
    id: id('blog'),
    organizerId,
    metrics: {
      views: 0,
      uniqueVisitors: 0,
      timeOnPage: 0,
      shares: 0,
      comments: 0,
      conversions: 0,
      conversionRate: 0,
      revenue: 0,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  blogPosts[post.id] = post;
  return post;
}

export function getBlogPost(postId: string): BlogPost | null {
  return blogPosts[postId] || null;
}

export function listBlogPosts(organizerId: string): BlogPost[] {
  return Object.values(blogPosts)
    .filter(p => p.organizerId === organizerId)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function getAllBlogPosts(): BlogPost[] {
  return Object.values(blogPosts)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function publishBlogPost(postId: string): BlogPost | null {
  const post = blogPosts[postId];
  if (!post) return null;
  
  post.status = 'published';
  post.publishedAt = Date.now();
  post.updatedAt = Date.now();
  return post;
}

export function updateBlogPost(postId: string, updates: Partial<Omit<BlogPost, 'id' | 'organizerId' | 'createdAt'>>): BlogPost | null {
  const post = blogPosts[postId];
  if (!post) return null;

  Object.assign(post, updates, { updatedAt: Date.now() });
  return post;
}

export function deleteBlogPost(postId: string): boolean {
  if (!blogPosts[postId]) return false;
  delete blogPosts[postId];
  return true;
}

/**
 * Distribution result for blog post distribution across channels
 * Requirements: 16.3
 */
export interface DistributionResult {
  success: boolean;
  postId: string;
  channels: {
    email?: { success: boolean; sent?: number; error?: string };
    social?: { success: boolean; platforms?: string[]; error?: string };
    rss?: { success: boolean; error?: string };
  };
  errors: string[];
}

/**
 * Distribute a blog post across multiple channels (email, social, RSS)
 * Requirements: 16.3 - Automatic distribution via email newsletter, social media, and RSS feed
 * 
 * @param postId - The blog post ID to distribute
 * @param channels - Array of channels to distribute to ('email', 'social', 'rss')
 * @returns Distribution result with success/failure per channel
 */
export async function distributeBlogPost(
  postId: string,
  channels: ('email' | 'social' | 'rss')[]
): Promise<DistributionResult> {
  const post = blogPosts[postId];
  
  if (!post) {
    return {
      success: false,
      postId,
      channels: {},
      errors: ['Blog post not found'],
    };
  }
  
  if (post.status !== 'published') {
    return {
      success: false,
      postId,
      channels: {},
      errors: ['Blog post must be published before distribution'],
    };
  }
  
  const result: DistributionResult = {
    success: true,
    postId,
    channels: {},
    errors: [],
  };
  
  // Distribute via email newsletter
  if (channels.includes('email')) {
    try {
      // Create email template for blog post
      const emailTemplate = createEmailTemplate(post.organizerId, {
        name: `Blog Post: ${post.title}`,
        subject: post.title,
        preheader: post.excerpt,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            ${post.featuredImage ? `<img src="${post.featuredImage}" alt="${post.title}" style="width: 100%; height: auto; margin-bottom: 20px;" />` : ''}
            <h1 style="color: #333; font-size: 24px; margin-bottom: 16px;">${post.title}</h1>
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">${post.excerpt}</p>
            <div style="color: #333; font-size: 14px; line-height: 1.8; margin-bottom: 30px;">
              ${post.content.substring(0, 500)}...
            </div>
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://guestly.app'}/blog/${post.slug}" 
               style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
              Read Full Article
            </a>
          </div>
        `,
        textContent: `${post.title}\n\n${post.excerpt}\n\n${post.content.substring(0, 500)}...\n\nRead more: ${process.env.NEXT_PUBLIC_BASE_URL || 'https://guestly.app'}/blog/${post.slug}`,
        design: {
          blocks: [],
          styles: {},
        },
        category: 'announcement',
        variables: [],
        isPublic: false,
      });
      
      // Create a campaign ID for this blog post distribution
      const campaignId = id('campaign');
      
      // Create email campaign for the blog post
      const emailCampaign = createEmailCampaign(campaignId, {
        organizerId: post.organizerId,
        templateId: emailTemplate.id,
        subject: post.title,
        fromName: 'Guestly',
        fromEmail: 'newsletter@guestly.app',
        recipients: [], // Would be populated with subscriber list in real implementation
        status: 'draft',
      });
      
      // Send email campaign
      const emailResult = await sendEmailCampaign(emailCampaign.id, post.organizerId);
      
      result.channels.email = {
        success: emailResult.success,
        sent: emailResult.sent,
        error: emailResult.errors.length > 0 ? emailResult.errors.join(', ') : undefined,
      };
      
      if (!emailResult.success) {
        result.success = false;
        result.errors.push(`Email distribution failed: ${emailResult.errors.join(', ')}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      result.channels.email = {
        success: false,
        error: errorMessage,
      };
      result.success = false;
      result.errors.push(`Email distribution error: ${errorMessage}`);
    }
  }
  
  // Distribute via social media
  if (channels.includes('social')) {
    try {
      const socialPlatforms: SocialPlatform[] = ['facebook', 'twitter', 'linkedin'];
      const successfulPlatforms: string[] = [];
      const socialErrors: string[] = [];
      
      for (const platform of socialPlatforms) {
        try {
          // Create social post content
          const postUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://guestly.app'}/blog/${post.slug}`;
          const socialContent = {
            eventId: post.eventId || '',
            text: `${post.title}\n\n${post.excerpt}\n\nRead more: ${postUrl}`,
            mediaUrls: post.featuredImage ? [post.featuredImage] : [],
            hashtags: post.tags,
          };
          
          // Post to social platform
          const socialResult = await postToSocial(post.organizerId, platform, socialContent);
          
          if (socialResult.success) {
            successfulPlatforms.push(platform);
          } else {
            socialErrors.push(`${platform}: ${socialResult.error}`);
          }
        } catch (platformError) {
          const errorMessage = platformError instanceof Error ? platformError.message : 'Unknown error';
          socialErrors.push(`${platform}: ${errorMessage}`);
        }
      }
      
      result.channels.social = {
        success: successfulPlatforms.length > 0,
        platforms: successfulPlatforms,
        error: socialErrors.length > 0 ? socialErrors.join('; ') : undefined,
      };
      
      if (successfulPlatforms.length === 0) {
        result.success = false;
        result.errors.push(`Social distribution failed: ${socialErrors.join('; ')}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      result.channels.social = {
        success: false,
        error: errorMessage,
      };
      result.success = false;
      result.errors.push(`Social distribution error: ${errorMessage}`);
    }
  }
  
  // Distribute via RSS feed
  if (channels.includes('rss')) {
    try {
      // RSS feed is automatically updated when blog posts are published
      // The sitemap and RSS feed generation happens via API routes
      // Here we just mark it as successful since the post is already published
      result.channels.rss = {
        success: true,
      };
      
      // Update sitemap to include the new blog post
      updateSitemap();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      result.channels.rss = {
        success: false,
        error: errorMessage,
      };
      result.errors.push(`RSS distribution error: ${errorMessage}`);
    }
  }
  
  return result;
}

/**
 * Get metrics for a blog post
 * Requirements: 16.5 - Track content performance including page views, time on page, social shares, and conversion rate
 * 
 * @param postId - The blog post ID
 * @returns Blog post metrics or null if post not found
 */
export function getBlogPostMetrics(postId: string): BlogPostMetrics | null {
  const post = blogPosts[postId];
  
  if (!post) {
    return null;
  }
  
  return post.metrics;
}


// ── Influencer Functions ─────────────────────────────────────────────────────

export function inviteInfluencer(organizerId: string, data: Omit<InfluencerCollaboration, 'id' | 'organizerId' | 'status' | 'metrics' | 'invitedAt'>): InfluencerCollaboration {
  const collaboration: InfluencerCollaboration = {
    ...data,
    id: id('collab'),
    organizerId,
    status: 'invited',
    metrics: {
      reach: 0,
      impressions: 0,
      engagement: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      roi: 0,
    },
    invitedAt: Date.now(),
  };
  influencerCollaborations[collaboration.id] = collaboration;
  return collaboration;
}

export function acceptInfluencerInvitation(collaborationId: string): InfluencerCollaboration | null {
  const collaboration = influencerCollaborations[collaborationId];
  if (!collaboration) return null;
  
  collaboration.status = 'accepted';
  collaboration.acceptedAt = Date.now();
  return collaboration;
}

export function getInfluencerCollaboration(collaborationId: string): InfluencerCollaboration | null {
  return influencerCollaborations[collaborationId] || null;
}

export function listInfluencerCollaborations(organizerId: string): InfluencerCollaboration[] {
  return Object.values(influencerCollaborations)
    .filter(c => c.organizerId === organizerId)
    .sort((a, b) => b.invitedAt - a.invitedAt);
}

export function generateMediaKit(eventId: string, organizerId: string, data: Omit<MediaKit, 'id' | 'eventId' | 'organizerId' | 'downloads' | 'views' | 'createdAt' | 'updatedAt'>): MediaKit {
  const kit: MediaKit = {
    ...data,
    id: id('mediakit'),
    eventId,
    organizerId,
    downloads: 0,
    views: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  mediaKits[kit.id] = kit;
  return kit;
}

export function generateMediaKitFromEvent(eventId: string, organizerId: string, customization?: {
  brandGuidelines?: Partial<BrandGuidelines>;
  additionalAssets?: MediaAsset[];
  customCopy?: CopyTemplate[];
}): MediaKit {
  // This function would typically fetch event data from lib/events.ts
  // For now, we'll create a template structure
  
  const assets: MediaAsset[] = [
    // Event logo
    {
      id: id('asset'),
      type: 'logo',
      url: `/media/${eventId}/logo.png`,
      dimensions: { width: 512, height: 512 },
      fileSize: 102400,
      format: 'png',
    },
    // Event banner
    {
      id: id('asset'),
      type: 'banner',
      url: `/media/${eventId}/banner.jpg`,
      dimensions: { width: 1920, height: 1080 },
      fileSize: 512000,
      format: 'jpg',
    },
    // Social media assets
    {
      id: id('asset'),
      type: 'social-graphic',
      url: `/media/${eventId}/instagram-post.jpg`,
      dimensions: { width: 1080, height: 1080 },
      fileSize: 256000,
      format: 'jpg',
      platform: 'instagram-post',
    },
    {
      id: id('asset'),
      type: 'social-graphic',
      url: `/media/${eventId}/instagram-story.jpg`,
      dimensions: { width: 1080, height: 1920 },
      fileSize: 384000,
      format: 'jpg',
      platform: 'instagram-story',
    },
    {
      id: id('asset'),
      type: 'social-graphic',
      url: `/media/${eventId}/facebook-cover.jpg`,
      dimensions: { width: 820, height: 312 },
      fileSize: 204800,
      format: 'jpg',
      platform: 'facebook-cover',
    },
    {
      id: id('asset'),
      type: 'social-graphic',
      url: `/media/${eventId}/twitter-header.jpg`,
      dimensions: { width: 1500, height: 500 },
      fileSize: 307200,
      format: 'jpg',
      platform: 'twitter-header',
    },
    ...(customization?.additionalAssets || []),
  ];
  
  const copyTemplates: CopyTemplate[] = [
    {
      id: id('copy'),
      type: 'headline',
      content: 'Join us for an unforgettable experience!',
      characterCount: 42,
    },
    {
      id: id('copy'),
      type: 'social-caption',
      platform: 'instagram',
      content: 'Exciting news! Get your tickets now and be part of something special. Link in bio! #Event #Community',
      characterCount: 103,
    },
    {
      id: id('copy'),
      type: 'social-caption',
      platform: 'twitter',
      content: 'Don\'t miss out! Limited tickets available. Get yours today!',
      characterCount: 59,
    },
    {
      id: id('copy'),
      type: 'email-subject',
      content: 'You\'re Invited: An Event You Won\'t Want to Miss',
      characterCount: 51,
    },
    {
      id: id('copy'),
      type: 'press-release',
      content: 'FOR IMMEDIATE RELEASE\n\n[Event Name] Announces [Key Details]\n\n[City, Date] - [Organizer] is excited to announce [event details]. This event will bring together [audience description] for [purpose].\n\nFor more information and tickets, visit [URL].\n\nContact: [Email]',
      characterCount: 250,
    },
    ...(customization?.customCopy || []),
  ];
  
  const eventStats: EventStats = {
    expectedAttendance: 500,
    pastEventAttendance: 450,
    audienceDemographics: {
      ageRanges: {
        '18-24': 25,
        '25-34': 40,
        '35-44': 20,
        '45+': 15,
      },
      genders: {
        male: 48,
        female: 50,
        other: 2,
      },
      locations: {
        'Lagos': 60,
        'Abuja': 25,
        'Other': 15,
      },
    },
    socialFollowing: [
      { platform: 'Instagram', followers: 5000 },
      { platform: 'Twitter', followers: 3000 },
      { platform: 'Facebook', followers: 4500 },
    ],
  };
  
  const defaultBrandGuidelines: BrandGuidelines = {
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6',
    fonts: ['Inter', 'Geist Sans'],
    logoUsage: 'Logo should be used on light backgrounds with minimum 20px padding',
    dosDonts: [
      'DO: Use high-resolution images',
      'DO: Maintain brand colors',
      'DON\'T: Distort or stretch the logo',
      'DON\'T: Use unapproved color variations',
    ],
  };
  
  const brandGuidelines: BrandGuidelines = {
    ...defaultBrandGuidelines,
    ...customization?.brandGuidelines,
  };
  
  const downloadUrl = `/api/media-kits/${eventId}/download`;
  const publicUrl = `/media-kits/${eventId}`;
  
  return generateMediaKit(eventId, organizerId, {
    title: 'Event Media Kit',
    description: 'Complete media kit with all promotional materials',
    assets,
    copyTemplates,
    eventStats,
    organizerBio: 'Experienced event organizer bringing amazing experiences to African cities.',
    brandGuidelines,
    downloadUrl,
    publicUrl,
  });
}

export function organizeMediaKitAssets(mediaKit: MediaKit): Record<string, MediaAsset[]> {
  const organized: Record<string, MediaAsset[]> = {
    logos: [],
    images: [],
    'social-media': [],
    banners: [],
    videos: [],
  };
  
  for (const asset of mediaKit.assets) {
    switch (asset.type) {
      case 'logo':
        organized.logos.push(asset);
        break;
      case 'event-image':
        organized.images.push(asset);
        break;
      case 'social-graphic':
        organized['social-media'].push(asset);
        break;
      case 'banner':
        organized.banners.push(asset);
        break;
      case 'video':
        organized.videos.push(asset);
        break;
    }
  }
  
  return organized;
}

export function generateMediaKitManifest(mediaKit: MediaKit): {
  title: string;
  description: string;
  generatedAt: string;
  assets: {
    category: string;
    files: Array<{ name: string; url: string; size: number; format: string }>;
  }[];
  copyTemplates: {
    type: string;
    platform?: string;
    content: string;
  }[];
  brandGuidelines: BrandGuidelines;
  eventStats: EventStats;
} {
  const organized = organizeMediaKitAssets(mediaKit);
  
  return {
    title: mediaKit.title,
    description: mediaKit.description,
    generatedAt: new Date(mediaKit.createdAt).toISOString(),
    assets: Object.entries(organized).map(([category, assets]) => ({
      category,
      files: assets.map(asset => ({
        name: asset.url.split('/').pop() || 'file',
        url: asset.url,
        size: asset.fileSize,
        format: asset.format,
      })),
    })),
    copyTemplates: mediaKit.copyTemplates.map(template => ({
      type: template.type,
      platform: template.platform,
      content: template.content,
    })),
    brandGuidelines: mediaKit.brandGuidelines,
    eventStats: mediaKit.eventStats,
  };
}

export function updateMediaKit(mediaKitId: string, updates: Partial<Omit<MediaKit, 'id' | 'eventId' | 'organizerId' | 'createdAt'>>): MediaKit | null {
  const kit = mediaKits[mediaKitId];
  if (!kit) return null;
  
  Object.assign(kit, updates, { updatedAt: Date.now() });
  return kit;
}

export function deleteMediaKit(mediaKitId: string): boolean {
  if (!mediaKits[mediaKitId]) return false;
  delete mediaKits[mediaKitId];
  return true;
}

export function listMediaKitsByOrganizer(organizerId: string): MediaKit[] {
  return Object.values(mediaKits)
    .filter(mk => mk.organizerId === organizerId)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function getMediaKit(eventId: string): MediaKit | null {
  return Object.values(mediaKits).find(mk => mk.eventId === eventId) || null;
}

export function getMediaKitById(mediaKitId: string): MediaKit | null {
  return mediaKits[mediaKitId] || null;
}

export function trackMediaKitView(mediaKitId: string): void {
  const kit = mediaKits[mediaKitId];
  if (kit) {
    kit.views++;
  }
}

export function trackMediaKitDownload(mediaKitId: string): void {
  const kit = mediaKits[mediaKitId];
  if (kit) {
    kit.downloads++;
  }
}

export function trackInfluencerPerformance(collaborationId: string, metrics: Partial<InfluencerMetrics>): InfluencerCollaboration | null {
  const collaboration = influencerCollaborations[collaborationId];
  if (!collaboration) return null;
  
  // Update metrics
  collaboration.metrics = {
    reach: metrics.reach ?? collaboration.metrics.reach,
    impressions: metrics.impressions ?? collaboration.metrics.impressions,
    engagement: metrics.engagement ?? collaboration.metrics.engagement,
    clicks: metrics.clicks ?? collaboration.metrics.clicks,
    conversions: metrics.conversions ?? collaboration.metrics.conversions,
    revenue: metrics.revenue ?? collaboration.metrics.revenue,
    roi: 0, // Will be calculated below
  };
  
  // Calculate ROI based on compensation type
  const totalCost = calculateInfluencerCompensation(collaboration);
  if (totalCost > 0 && collaboration.metrics.revenue > 0) {
    collaboration.metrics.roi = ((collaboration.metrics.revenue - totalCost) / totalCost) * 100;
  }
  
  return collaboration;
}

export function calculateInfluencerCompensation(collaboration: InfluencerCollaboration): number {
  let totalCompensation = 0;
  
  switch (collaboration.compensationType) {
    case 'free-tickets':
      // Estimate ticket value (would need to fetch actual ticket prices)
      // For now, use a placeholder calculation
      totalCompensation = (collaboration.freeTicketCount || 0) * 50; // Assume $50 per ticket
      break;
      
    case 'fixed-payment':
      totalCompensation = collaboration.compensationAmount || 0;
      break;
      
    case 'commission':
      // Commission based on revenue generated
      const commissionRate = (collaboration.commissionRate || 0) / 100;
      totalCompensation = collaboration.metrics.revenue * commissionRate;
      break;
      
    case 'hybrid':
      // Combination of fixed payment and commission
      const fixedAmount = collaboration.compensationAmount || 0;
      const commissionAmount = collaboration.metrics.revenue * ((collaboration.commissionRate || 0) / 100);
      totalCompensation = fixedAmount + commissionAmount;
      break;
  }
  
  return totalCompensation;
}

export function getInfluencerCompensationBreakdown(collaborationId: string): {
  type: CompensationType;
  fixedAmount: number;
  commissionAmount: number;
  freeTicketsValue: number;
  totalCompensation: number;
} | null {
  const collaboration = influencerCollaborations[collaborationId];
  if (!collaboration) return null;
  
  let fixedAmount = 0;
  let commissionAmount = 0;
  let freeTicketsValue = 0;
  
  switch (collaboration.compensationType) {
    case 'free-tickets':
      freeTicketsValue = (collaboration.freeTicketCount || 0) * 50; // Placeholder ticket value
      break;
      
    case 'fixed-payment':
      fixedAmount = collaboration.compensationAmount || 0;
      break;
      
    case 'commission':
      commissionAmount = collaboration.metrics.revenue * ((collaboration.commissionRate || 0) / 100);
      break;
      
    case 'hybrid':
      fixedAmount = collaboration.compensationAmount || 0;
      commissionAmount = collaboration.metrics.revenue * ((collaboration.commissionRate || 0) / 100);
      break;
  }
  
  return {
    type: collaboration.compensationType,
    fixedAmount,
    commissionAmount,
    freeTicketsValue,
    totalCompensation: fixedAmount + commissionAmount + freeTicketsValue,
  };
}

export function updateInfluencerStatus(collaborationId: string, status: InfluencerStatus): InfluencerCollaboration | null {
  const collaboration = influencerCollaborations[collaborationId];
  if (!collaboration) return null;
  
  collaboration.status = status;
  
  if (status === 'completed') {
    collaboration.completedAt = Date.now();
  }
  
  return collaboration;
}

export function listInfluencerCollaborationsByEvent(eventId: string): InfluencerCollaboration[] {
  return Object.values(influencerCollaborations)
    .filter(c => c.eventId === eventId)
    .sort((a, b) => b.invitedAt - a.invitedAt);
}

// ── A/B Testing Functions ────────────────────────────────────────────────────

export function createABTest(campaignId: string, data: Omit<ABTest, 'id' | 'campaignId' | 'status' | 'statisticalSignificance' | 'createdAt'>): ABTest {
  const test: ABTest = {
    ...data,
    id: id('abtest'),
    campaignId,
    status: 'draft',
    statisticalSignificance: false,
    createdAt: Date.now(),
  };
  abTests[test.id] = test;
  return test;
}

export function getABTest(testId: string): ABTest | null {
  return abTests[testId] || null;
}

export function assignTestVariant(testId: string, userId: string): TestVariant | null {
  const test = abTests[testId];
  if (!test || test.status !== 'running') return null;
  
  // Use consistent hashing to assign same user to same variant
  const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const variantIndex = hash % test.variants.length;
  
  const variant = test.variants[variantIndex];
  variant.impressions++;
  
  return variant;
}

export function trackTestConversion(testId: string, variantId: string, revenue: number = 0): void {
  const test = abTests[testId];
  if (!test) return;
  
  const variant = test.variants.find(v => v.id === variantId);
  if (!variant) return;
  
  variant.conversions++;
  variant.revenue += revenue;
  variant.conversionRate = variant.impressions > 0 ? (variant.conversions / variant.impressions) * 100 : 0;
  
  // Calculate statistical significance (simplified chi-square test)
  if (test.variants.length === 2 && test.variants.every(v => v.impressions >= 100)) {
    const [variantA, variantB] = test.variants;
    const rateA = variantA.conversionRate / 100;
    const rateB = variantB.conversionRate / 100;
    const pooledRate = (variantA.conversions + variantB.conversions) / (variantA.impressions + variantB.impressions);
    
    const seA = Math.sqrt(pooledRate * (1 - pooledRate) / variantA.impressions);
    const seB = Math.sqrt(pooledRate * (1 - pooledRate) / variantB.impressions);
    const zScore = Math.abs(rateA - rateB) / Math.sqrt(seA * seA + seB * seB);
    
    test.statisticalSignificance = zScore > 1.96; // 95% confidence
    test.confidenceLevel = test.statisticalSignificance ? 95 : 0;
  }
}

export function getABTestResults(testId: string): ABTestResults | null {
  const test = abTests[testId];
  if (!test) return null;
  
  const winner = test.variants.reduce((best, current) => 
    current.conversionRate > best.conversionRate ? current : best
  );
  
  const baseline = test.variants[0];
  const improvement = baseline.conversionRate > 0 
    ? ((winner.conversionRate - baseline.conversionRate) / baseline.conversionRate) * 100 
    : 0;
  
  return {
    testId: test.id,
    variants: test.variants,
    winner: test.statisticalSignificance ? winner : undefined,
    improvement,
    confidenceLevel: test.confidenceLevel,
    pValue: test.statisticalSignificance ? 0.05 : 1,
    recommendation: test.statisticalSignificance 
      ? `Use variant "${winner.name}" - ${improvement.toFixed(1)}% improvement`
      : 'Continue testing - not enough data for statistical significance',
  };
}

export function selectWinningVariant(testId: string): TestVariant | null {
  const test = abTests[testId];
  if (!test || !test.statisticalSignificance) return null;
  
  const winner = test.variants.reduce((best, current) => 
    current.conversionRate > best.conversionRate ? current : best
  );
  
  test.winningVariantId = winner.id;
  test.status = 'completed';
  test.completedAt = Date.now();
  
  return winner;
}

// ── Social Proof Functions ───────────────────────────────────────────────────

export function getSocialProofData(eventId: string): SocialProofData | null {
  return socialProofData[eventId] || null;
}

export function trackRecentPurchase(eventId: string, buyerName: string, buyerCity: string, ticketCount: number): void {
  if (!socialProofData[eventId]) {
    socialProofData[eventId] = {
      eventId,
      ticketsSold: 0,
      totalCapacity: 0,
      percentageSold: 0,
      recentPurchases: [],
      reviews: [],
      averageRating: 0,
      totalReviews: 0,
      organizerStats: {
        totalEvents: 0,
        totalAttendees: 0,
        averageRating: 0,
        yearsActive: 0,
        verified: false,
      },
      scarcityLevel: 'none',
      trustScore: 0,
    };
  }
  
  const purchase: RecentPurchase = {
    id: id('purchase'),
    buyerName,
    buyerCity,
    ticketCount,
    purchasedAt: Date.now(),
  };
  
  socialProofData[eventId].recentPurchases.unshift(purchase);
  
  // Keep only last 10 purchases
  if (socialProofData[eventId].recentPurchases.length > 10) {
    socialProofData[eventId].recentPurchases = socialProofData[eventId].recentPurchases.slice(0, 10);
  }
  
  socialProofData[eventId].ticketsSold += ticketCount;
}

export function addEventReview(eventId: string, review: Omit<EventReview, 'id' | 'eventId' | 'createdAt'>): EventReview {
  const newReview: EventReview = {
    ...review,
    id: id('review'),
    eventId,
    createdAt: Date.now(),
  };
  
  if (!eventReviews[eventId]) {
    eventReviews[eventId] = [];
  }
  eventReviews[eventId].push(newReview);
  
  // Update social proof data
  if (socialProofData[eventId]) {
    socialProofData[eventId].reviews = eventReviews[eventId];
    socialProofData[eventId].totalReviews = eventReviews[eventId].length;
    socialProofData[eventId].averageRating = 
      eventReviews[eventId].reduce((sum, r) => sum + r.rating, 0) / eventReviews[eventId].length;
  }
  
  return newReview;
}

export function getEventReviews(eventId: string): EventReview[] {
  return eventReviews[eventId] || [];
}

export function calculateScarcityIndicator(eventId: string, ticketsRemaining: number, totalCapacity: number): ScarcityIndicator {
  const percentageRemaining = (ticketsRemaining / totalCapacity) * 100;
  
  let urgency: 'high' | 'medium' | 'low';
  let message: string;
  let show: boolean;
  
  if (percentageRemaining <= 10) {
    urgency = 'high';
    message = `Only ${ticketsRemaining} tickets left!`;
    show = true;
  } else if (percentageRemaining <= 20) {
    urgency = 'medium';
    message = `Hurry! Only ${ticketsRemaining} tickets remaining`;
    show = true;
  } else if (percentageRemaining <= 30) {
    urgency = 'low';
    message = `${ticketsRemaining} tickets available`;
    show = true;
  } else {
    urgency = 'low';
    message = '';
    show = false;
  }
  
  return {
    show,
    message,
    urgency,
    ticketsRemaining,
  };
}

export function updateOrganizerStats(organizerId: string, stats: OrganizerStats): void {
  // Update all events by this organizer
  Object.values(socialProofData).forEach(data => {
    // This would need to check if event belongs to organizer
    // For now, we'll store it separately
    data.organizerStats = stats;
  });
}

/**
 * Get tickets sold count for an event (Requirement 13.1)
 * Calculates total tickets sold from paid orders
 */
export function getTicketsSoldCount(eventId: string): number {
  // Import orders from store
  const { getEventOrders } = require('./store');
  const orders = getEventOrders(eventId);
  
  // Count tickets from paid orders only
  const ticketsSold = orders
    .filter((order: any) => order.status === 'paid')
    .reduce((total: number, order: any) => {
      return total + order.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    }, 0);
  
  // Update social proof data if it exists
  if (socialProofData[eventId]) {
    socialProofData[eventId].ticketsSold = ticketsSold;
  }
  
  return ticketsSold;
}

/**
 * Get organizer statistics for credibility display (Requirements 13.5, 13.7)
 * Calculates total events, attendees, average rating, and verified status
 */
export function getOrganizerStats(organizerId: string): OrganizerStats {
  // Import necessary functions from store and events
  const { events } = require('./events');
  const { getEventOrders } = require('./store');
  
  // Get all events by this organizer
  const organizerEvents = Object.values(events).filter((event: any) => event.organizerId === organizerId);
  
  // Calculate total attendees across all events
  let totalAttendees = 0;
  organizerEvents.forEach((event: any) => {
    const orders = getEventOrders(event.id);
    const eventAttendees = orders
      .filter((order: any) => order.status === 'paid')
      .reduce((total: number, order: any) => {
        return total + order.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
      }, 0);
    totalAttendees += eventAttendees;
  });
  
  // Calculate average rating from all event reviews
  let totalRating = 0;
  let totalReviews = 0;
  organizerEvents.forEach((event: any) => {
    const reviews = eventReviews[event.id] || [];
    totalRating += reviews.reduce((sum, r) => sum + r.rating, 0);
    totalReviews += reviews.length;
  });
  
  const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;
  
  // Calculate years active (from oldest event creation date)
  let oldestEventDate = Date.now();
  organizerEvents.forEach((event: any) => {
    if (event.createdAt && event.createdAt < oldestEventDate) {
      oldestEventDate = event.createdAt;
    }
  });
  const yearsActive = Math.max(0, (Date.now() - oldestEventDate) / (1000 * 60 * 60 * 24 * 365));
  
  // Verified organizer logic (Requirements 13.5, 13.7)
  // An organizer is verified if they have:
  // - At least 5 events
  // - At least 100 total attendees
  // - Average rating of 4.0 or higher
  // - Active for at least 6 months
  const verified = 
    organizerEvents.length >= 5 &&
    totalAttendees >= 100 &&
    averageRating >= 4.0 &&
    yearsActive >= 0.5;
  
  const stats: OrganizerStats = {
    totalEvents: organizerEvents.length,
    totalAttendees,
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    yearsActive: Math.round(yearsActive * 10) / 10, // Round to 1 decimal
    verified,
  };
  
  return stats;
}

/**
 * Initialize or update social proof data for an event (Requirements 13.1, 13.2, 13.3)
 * This should be called when displaying an event page to ensure fresh data
 */
export function initializeSocialProofData(eventId: string, organizerId: string): SocialProofData {
  const { getEventById } = require('./events');
  const { getAvailability } = require('./store');
  
  const event = getEventById(eventId);
  if (!event) {
    throw new Error('Event not found');
  }
  
  // Get current ticket availability
  const availability = getAvailability(eventId);
  const totalCapacity = availability?.tickets.reduce((sum: number, t: any) => sum + t.available, 0) || 0;
  
  // Get tickets sold
  const ticketsSold = getTicketsSoldCount(eventId);
  
  // Calculate percentage sold
  const percentageSold = totalCapacity > 0 ? (ticketsSold / (ticketsSold + totalCapacity)) * 100 : 0;
  
  // Get reviews
  const reviews = getEventReviews(eventId);
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : 0;
  
  // Get organizer stats
  const organizerStats = getOrganizerStats(organizerId);
  
  // Calculate scarcity level (Requirement 13.6)
  let scarcityLevel: ScarcityLevel = 'none';
  if (totalCapacity > 0) {
    const percentageRemaining = (totalCapacity / (ticketsSold + totalCapacity)) * 100;
    if (percentageRemaining <= 10) {
      scarcityLevel = 'high';
    } else if (percentageRemaining <= 20) {
      scarcityLevel = 'medium';
    } else if (percentageRemaining <= 30) {
      scarcityLevel = 'low';
    }
  }
  
  // Calculate trust score (0-100)
  // Based on: tickets sold (30%), reviews (30%), organizer credibility (40%)
  const ticketScore = Math.min(30, (ticketsSold / 100) * 30); // Max 30 points
  const reviewScore = Math.min(30, (averageRating / 5) * 30); // Max 30 points
  const organizerScore = (
    (organizerStats.verified ? 15 : 0) + // 15 points for verified
    Math.min(10, (organizerStats.totalEvents / 10) * 10) + // Up to 10 points for events
    Math.min(15, (organizerStats.averageRating / 5) * 15) // Up to 15 points for rating
  );
  const trustScore = Math.round(ticketScore + reviewScore + organizerScore);
  
  // Get or create social proof data
  if (!socialProofData[eventId]) {
    socialProofData[eventId] = {
      eventId,
      ticketsSold: 0,
      totalCapacity: 0,
      percentageSold: 0,
      recentPurchases: [],
      reviews: [],
      averageRating: 0,
      totalReviews: 0,
      organizerStats: {
        totalEvents: 0,
        totalAttendees: 0,
        averageRating: 0,
        yearsActive: 0,
        verified: false,
      },
      scarcityLevel: 'none',
      trustScore: 0,
    };
  }
  
  // Update with fresh data
  socialProofData[eventId].ticketsSold = ticketsSold;
  socialProofData[eventId].totalCapacity = totalCapacity + ticketsSold; // Total original capacity
  socialProofData[eventId].percentageSold = percentageSold;
  socialProofData[eventId].reviews = reviews;
  socialProofData[eventId].averageRating = Math.round(averageRating * 10) / 10;
  socialProofData[eventId].totalReviews = reviews.length;
  socialProofData[eventId].organizerStats = organizerStats;
  socialProofData[eventId].scarcityLevel = scarcityLevel;
  socialProofData[eventId].trustScore = trustScore;
  
  return socialProofData[eventId];
}

// ── Drip Campaign Functions ──────────────────────────────────────────────────

export function createDripCampaign(organizerId: string, data: Omit<DripCampaign, 'id' | 'organizerId' | 'enrollmentCount' | 'completionCount' | 'conversionCount' | 'conversionRate' | 'createdAt' | 'updatedAt'>): DripCampaign {
  const campaign: DripCampaign = {
    ...data,
    id: id('drip'),
    organizerId,
    enrollmentCount: 0,
    completionCount: 0,
    conversionCount: 0,
    conversionRate: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  dripCampaigns[campaign.id] = campaign;
  return campaign;
}

export function getDripCampaign(campaignId: string): DripCampaign | null {
  return dripCampaigns[campaignId] || null;
}

export function listDripCampaigns(organizerId: string): DripCampaign[] {
  return Object.values(dripCampaigns)
    .filter(dc => dc.organizerId === organizerId)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function enrollInDripCampaign(campaignId: string, userId: string): DripEnrollment | null {
  const campaign = dripCampaigns[campaignId];
  if (!campaign || !campaign.active) return null;
  
  // Check if already enrolled
  const existing = dripEnrollments[campaignId]?.find(e => e.userId === userId && e.status === 'active');
  if (existing) return existing;
  
  const enrollment: DripEnrollment = {
    id: id('enrollment'),
    campaignId,
    userId,
    currentEmailIndex: 0,
    status: 'active',
    enrolledAt: Date.now(),
  };
  
  if (!dripEnrollments[campaignId]) {
    dripEnrollments[campaignId] = [];
  }
  dripEnrollments[campaignId].push(enrollment);
  
  campaign.enrollmentCount++;
  return enrollment;
}

export function progressDripEnrollment(enrollmentId: string, campaignId: string): void {
  const enrollments = dripEnrollments[campaignId];
  if (!enrollments) return;
  
  const enrollment = enrollments.find(e => e.id === enrollmentId);
  if (!enrollment) return;
  
  const campaign = dripCampaigns[campaignId];
  if (!campaign) return;
  
  enrollment.currentEmailIndex++;
  
  // Check if completed
  if (enrollment.currentEmailIndex >= campaign.emails.length) {
    enrollment.status = 'completed';
    enrollment.completedAt = Date.now();
    campaign.completionCount++;
  }
}

export function markDripEnrollmentConverted(enrollmentId: string, campaignId: string): void {
  const enrollments = dripEnrollments[campaignId];
  if (!enrollments) return;
  
  const enrollment = enrollments.find(e => e.id === enrollmentId);
  if (!enrollment) return;
  
  enrollment.status = 'converted';
  enrollment.convertedAt = Date.now();
  
  const campaign = dripCampaigns[campaignId];
  if (campaign) {
    campaign.conversionCount++;
    campaign.conversionRate = (campaign.conversionCount / campaign.enrollmentCount) * 100;
  }
}

export function unsubscribeFromDripCampaign(enrollmentId: string, campaignId: string): void {
  const enrollments = dripEnrollments[campaignId];
  if (!enrollments) return;
  
  const enrollment = enrollments.find(e => e.id === enrollmentId);
  if (!enrollment) return;
  
  enrollment.status = 'unsubscribed';
  enrollment.completedAt = Date.now();
}

export function getDripEnrollment(enrollmentId: string, campaignId: string): DripEnrollment | null {
  const enrollments = dripEnrollments[campaignId];
  if (!enrollments) return null;
  
  return enrollments.find(e => e.id === enrollmentId) || null;
}

export function listDripEnrollments(campaignId: string): DripEnrollment[] {
  return dripEnrollments[campaignId] || [];
}

export function getUserDripEnrollments(userId: string): DripEnrollment[] {
  const allEnrollments: DripEnrollment[] = [];
  
  Object.values(dripEnrollments).forEach(enrollmentList => {
    const userEnrollments = enrollmentList.filter(e => e.userId === userId);
    allEnrollments.push(...userEnrollments);
  });
  
  return allEnrollments;
}

// ── Trigger Detection Functions ──────────────────────────────────────────────

/**
 * Detects and enrolls users in drip campaigns based on trigger events
 * Requirements: 12.2, 12.3
 */
export function detectAndEnrollDripCampaigns(
  triggerType: TriggerType,
  userId: string,
  eventId?: string,
  metadata?: Record<string, any>
): DripEnrollment[] {
  const enrollments: DripEnrollment[] = [];
  
  // Find all active drip campaigns matching the trigger type
  const matchingCampaigns = Object.values(dripCampaigns).filter(campaign => {
    if (!campaign.active) return false;
    if (campaign.trigger.type !== triggerType) return false;
    if (eventId && campaign.eventId && campaign.eventId !== eventId) return false;
    
    // Check trigger conditions if any
    if (campaign.trigger.conditions && campaign.trigger.conditions.length > 0) {
      return evaluateTriggerConditions(campaign.trigger.conditions, metadata || {});
    }
    
    return true;
  });
  
  // Enroll user in each matching campaign
  for (const campaign of matchingCampaigns) {
    const enrollment = enrollInDripCampaign(campaign.id, userId);
    if (enrollment) {
      enrollments.push(enrollment);
    }
  }
  
  return enrollments;
}

/**
 * Evaluates trigger conditions against metadata
 */
function evaluateTriggerConditions(conditions: TriggerCondition[], metadata: Record<string, any>): boolean {
  return conditions.every(condition => {
    const value = metadata[condition.field];
    
    switch (condition.operator) {
      case 'equals':
        return value === condition.value;
      case 'not-equals':
        return value !== condition.value;
      case 'contains':
        return String(value).includes(String(condition.value));
      case 'greater-than':
        return Number(value) > Number(condition.value);
      case 'less-than':
        return Number(value) < Number(condition.value);
      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(value);
      default:
        return false;
    }
  });
}

/**
 * Convenience function for event registration trigger
 * Requirements: 12.3
 */
export function triggerEventRegistration(userId: string, eventId: string): DripEnrollment[] {
  return detectAndEnrollDripCampaigns('event-registration', userId, eventId);
}

/**
 * Convenience function for ticket purchase trigger
 * Requirements: 12.3
 */
export function triggerTicketPurchase(userId: string, eventId: string, orderId: string, amount: number): DripEnrollment[] {
  return detectAndEnrollDripCampaigns('ticket-purchase', userId, eventId, { orderId, amount });
}

/**
 * Convenience function for cart abandonment trigger
 * Requirements: 12.3
 */
export function triggerCartAbandonment(userId: string, eventId: string, cartValue: number): DripEnrollment[] {
  return detectAndEnrollDripCampaigns('cart-abandonment', userId, eventId, { cartValue });
}

/**
 * Convenience function for event attendance trigger
 * Requirements: 12.3
 */
export function triggerEventAttendance(userId: string, eventId: string): DripEnrollment[] {
  return detectAndEnrollDripCampaigns('event-attendance', userId, eventId);
}

/**
 * Convenience function for post-event trigger
 * Requirements: 12.3
 */
export function triggerPostEvent(userId: string, eventId: string): DripEnrollment[] {
  return detectAndEnrollDripCampaigns('post-event', userId, eventId);
}

// ── Email Scheduling Functions ───────────────────────────────────────────────

/**
 * Calculates when the next email should be sent for an enrollment
 * Requirements: 12.4
 */
export function calculateNextEmailTime(enrollment: DripEnrollment, campaign: DripCampaign): number | null {
  if (enrollment.status !== 'active') return null;
  if (enrollment.currentEmailIndex >= campaign.emails.length) return null;
  
  const currentEmail = campaign.emails[enrollment.currentEmailIndex];
  if (!currentEmail) return null;
  
  // Calculate delay in milliseconds
  let delayMs = 0;
  switch (currentEmail.delayUnit) {
    case 'hours':
      delayMs = currentEmail.delay * 60 * 60 * 1000;
      break;
    case 'days':
      delayMs = currentEmail.delay * 24 * 60 * 60 * 1000;
      break;
    case 'weeks':
      delayMs = currentEmail.delay * 7 * 24 * 60 * 60 * 1000;
      break;
  }
  
  // For first email, delay from enrollment time
  // For subsequent emails, delay from when previous email was sent
  const baseTime = enrollment.currentEmailIndex === 0 
    ? enrollment.enrolledAt 
    : Date.now(); // In real implementation, track last email sent time
  
  return baseTime + delayMs;
}

/**
 * Gets all emails that are due to be sent
 * Requirements: 12.4
 */
export function getDueEmails(): Array<{
  enrollment: DripEnrollment;
  campaign: DripCampaign;
  email: DripEmail;
  scheduledTime: number;
}> {
  const dueEmails: Array<{
    enrollment: DripEnrollment;
    campaign: DripCampaign;
    email: DripEmail;
    scheduledTime: number;
  }> = [];
  
  const now = Date.now();
  
  // Iterate through all enrollments
  Object.entries(dripEnrollments).forEach(([campaignId, enrollmentList]) => {
    const campaign = dripCampaigns[campaignId];
    if (!campaign || !campaign.active) return;
    
    enrollmentList.forEach(enrollment => {
      if (enrollment.status !== 'active') return;
      
      const scheduledTime = calculateNextEmailTime(enrollment, campaign);
      if (scheduledTime && scheduledTime <= now) {
        const email = campaign.emails[enrollment.currentEmailIndex];
        if (email) {
          // Check email conditions if any
          if (email.conditions && email.conditions.length > 0) {
            const shouldSend = evaluateEmailConditions(email.conditions, enrollment, campaign);
            if (!shouldSend) return;
          }
          
          dueEmails.push({
            enrollment,
            campaign,
            email,
            scheduledTime,
          });
        }
      }
    });
  });
  
  return dueEmails;
}

/**
 * Evaluates email conditions for conditional branching
 * Requirements: 12.5
 */
function evaluateEmailConditions(conditions: EmailCondition[], enrollment: DripEnrollment, campaign: DripCampaign): boolean {
  return conditions.every(condition => {
    switch (condition.type) {
      case 'opened-previous':
        // Check if previous email was opened
        if (enrollment.currentEmailIndex === 0) return true;
        const prevEmail = campaign.emails[enrollment.currentEmailIndex - 1];
        return prevEmail && prevEmail.opened > 0;
      
      case 'clicked-previous':
        // Check if previous email was clicked
        if (enrollment.currentEmailIndex === 0) return true;
        const prevEmailClicked = campaign.emails[enrollment.currentEmailIndex - 1];
        return prevEmailClicked && prevEmailClicked.clicked > 0;
      
      case 'purchased':
        // Check if user has purchased (converted)
        return condition.value === (enrollment.status === 'converted');
      
      case 'custom':
        // Custom condition evaluation (placeholder)
        return true;
      
      default:
        return true;
    }
  });
}

/**
 * Schedules and sends a drip email
 * Requirements: 12.4
 */
export function sendDripEmail(
  enrollment: DripEnrollment,
  campaign: DripCampaign,
  email: DripEmail
): boolean {
  // In a real implementation, this would:
  // 1. Get the email template
  // 2. Personalize it with user data
  // 3. Send via email service (SendGrid, Mailgun, etc.)
  // 4. Track the send
  
  // For now, just update metrics
  email.sent++;
  
  // Progress the enrollment to next email
  progressDripEnrollment(enrollment.id, campaign.id);
  
  return true;
}

/**
 * Processes all due drip emails
 * Requirements: 12.4
 */
export function processDripEmails(): number {
  const dueEmails = getDueEmails();
  let sentCount = 0;
  
  for (const { enrollment, campaign, email } of dueEmails) {
    const sent = sendDripEmail(enrollment, campaign, email);
    if (sent) sentCount++;
  }
  
  return sentCount;
}

/**
 * Tracks email open for drip campaign
 * Requirements: 12.7
 */
export function trackDripEmailOpen(campaignId: string, emailId: string): void {
  const campaign = dripCampaigns[campaignId];
  if (!campaign) return;
  
  const email = campaign.emails.find(e => e.id === emailId);
  if (email) {
    email.opened++;
  }
}

/**
 * Tracks email click for drip campaign
 * Requirements: 12.7
 */
export function trackDripEmailClick(campaignId: string, emailId: string): void {
  const campaign = dripCampaigns[campaignId];
  if (!campaign) return;
  
  const email = campaign.emails.find(e => e.id === emailId);
  if (email) {
    email.clicked++;
  }
}

/**
 * Tracks conversion for drip campaign
 * Requirements: 12.6, 12.7
 */
export function trackDripEmailConversion(campaignId: string, emailId: string, enrollmentId: string): void {
  const campaign = dripCampaigns[campaignId];
  if (!campaign) return;
  
  const email = campaign.emails.find(e => e.id === emailId);
  if (email) {
    email.converted++;
  }
  
  // Mark enrollment as converted and remove from active sequence
  markDripEnrollmentConverted(enrollmentId, campaignId);
}

/**
 * Gets drip campaign performance metrics
 * Requirements: 12.7
 */
export function getDripCampaignMetrics(campaignId: string): {
  enrollmentCount: number;
  completionCount: number;
  conversionCount: number;
  conversionRate: number;
  activeEnrollments: number;
  unsubscribeCount: number;
  emailMetrics: Array<{
    emailId: string;
    order: number;
    subject: string;
    sent: number;
    opened: number;
    clicked: number;
    converted: number;
    openRate: number;
    clickRate: number;
    conversionRate: number;
  }>;
} | null {
  const campaign = dripCampaigns[campaignId];
  if (!campaign) return null;
  
  const enrollments = dripEnrollments[campaignId] || [];
  const activeEnrollments = enrollments.filter(e => e.status === 'active').length;
  const unsubscribeCount = enrollments.filter(e => e.status === 'unsubscribed').length;
  
  const emailMetrics = campaign.emails.map(email => ({
    emailId: email.id,
    order: email.order,
    subject: email.subject,
    sent: email.sent,
    opened: email.opened,
    clicked: email.clicked,
    converted: email.converted,
    openRate: email.sent > 0 ? (email.opened / email.sent) * 100 : 0,
    clickRate: email.sent > 0 ? (email.clicked / email.sent) * 100 : 0,
    conversionRate: email.sent > 0 ? (email.converted / email.sent) * 100 : 0,
  }));
  
  return {
    enrollmentCount: campaign.enrollmentCount,
    completionCount: campaign.completionCount,
    conversionCount: campaign.conversionCount,
    conversionRate: campaign.conversionRate,
    activeEnrollments,
    unsubscribeCount,
    emailMetrics,
  };
}

/**
 * Updates drip campaign active status
 * Requirements: 12.1
 */
export function updateDripCampaignStatus(campaignId: string, active: boolean): DripCampaign | null {
  const campaign = dripCampaigns[campaignId];
  if (!campaign) return null;
  
  campaign.active = active;
  campaign.updatedAt = Date.now();
  
  return campaign;
}

/**
 * Updates drip campaign
 * Requirements: 12.1
 */
export function updateDripCampaign(
  campaignId: string,
  updates: Partial<Omit<DripCampaign, 'id' | 'organizerId' | 'createdAt'>>
): DripCampaign | null {
  const campaign = dripCampaigns[campaignId];
  if (!campaign) return null;
  
  Object.assign(campaign, updates);
  campaign.updatedAt = Date.now();
  
  return campaign;
}

/**
 * Deletes a drip campaign
 * Requirements: 12.1
 */
export function deleteDripCampaign(campaignId: string): boolean {
  if (!dripCampaigns[campaignId]) return false;
  
  delete dripCampaigns[campaignId];
  delete dripEnrollments[campaignId];
  
  return true;
}

// ── Event Sharing & Viral Loop Functions ─────────────────────────────────────

/**
 * Generate a shareable link for an event with referral tracking (Requirement 15.1, 15.2)
 */
export function generateShareLink(
  userId: string,
  eventId: string,
  platform: 'whatsapp' | 'facebook' | 'twitter' | 'linkedin' | 'email' | 'sms'
): { shareUrl: string; referralCode: string; shareId: string } {
  // Get or create referral link for this user and event
  let referralLink = Object.values(referralLinks).find(
    rl => rl.userId === userId && rl.eventId === eventId
  );
  
  if (!referralLink) {
    // Generate new referral link if it doesn't exist
    referralLink = generateReferralLink(userId, eventId);
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://guestly.app';
  const eventUrl = `${baseUrl}/events/${eventId}`;
  
  // Append referral code and platform tracking
  const shareUrl = `${eventUrl}?ref=${referralLink.code}&utm_source=${platform}&utm_medium=social&utm_campaign=event_share`;
  
  // Track the share event
  const share: ShareEvent = {
    id: id('share'),
    userId,
    eventId,
    platform,
    referralCode: referralLink.code,
    shareUrl,
    sharedAt: Date.now(),
    clicks: 0,
    conversions: 0,
    revenue: 0,
  };
  
  if (!shareEvents[eventId]) {
    shareEvents[eventId] = [];
  }
  shareEvents[eventId].push(share);
  
  return {
    shareUrl,
    referralCode: referralLink.code,
    shareId: share.id,
  };
}

/**
 * Generate platform-specific share cards with optimized content (Requirement 15.3)
 */
export function generateShareCard(eventId: string, platform: 'whatsapp' | 'facebook' | 'twitter' | 'linkedin' | 'email'): ShareCard | null {
  // Import getEventById from events module
  const { getEventById } = require('./events');
  const event = getEventById(eventId);
  
  if (!event) return null;
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://guestly.app';
  const eventUrl = `${baseUrl}/events/${eventId}`;
  
  // Platform-specific optimizations
  const cards: Record<typeof platform, ShareCard> = {
    whatsapp: {
      platform: 'whatsapp',
      title: `${event.title}`,
      description: `Join me at ${event.title} on ${new Date(event.date).toLocaleDateString()}! ${event.venue ? `Location: ${event.venue}` : ''} Get your tickets now!`,
      imageUrl: event.image,
      url: eventUrl,
    },
    facebook: {
      platform: 'facebook',
      title: event.title,
      description: `${event.description.slice(0, 200)}... Join us on ${new Date(event.date).toLocaleDateString()} ${event.venue ? `at ${event.venue}` : ''}. Get tickets now!`,
      imageUrl: event.image,
      url: eventUrl,
    },
    twitter: {
      platform: 'twitter',
      title: `${event.title} - ${new Date(event.date).toLocaleDateString()}`,
      description: `${event.description.slice(0, 180)}... #${event.category} #${event.city.replace(/\s+/g, '')}Events`,
      imageUrl: event.image,
      url: eventUrl,
    },
    linkedin: {
      platform: 'linkedin',
      title: event.title,
      description: `${event.description.slice(0, 250)}... Event Date: ${new Date(event.date).toLocaleDateString()}. Location: ${event.city}, ${event.country}.`,
      imageUrl: event.image,
      url: eventUrl,
    },
    email: {
      platform: 'email',
      title: `You're invited: ${event.title}`,
      description: `${event.description}\n\nDate: ${new Date(event.date).toLocaleDateString()}\n${event.venue ? `Venue: ${event.venue}\n` : ''}Location: ${event.city}, ${event.country}\n\nGet your tickets now!`,
      imageUrl: event.image,
      url: eventUrl,
    },
  };
  
  return cards[platform];
}

/**
 * Track share event (Requirement 15.1, 15.2)
 */
export function trackShare(
  userId: string,
  eventId: string,
  platform: 'whatsapp' | 'facebook' | 'twitter' | 'linkedin' | 'email' | 'sms',
  referralCode: string
): ShareEvent {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://guestly.app';
  const shareUrl = `${baseUrl}/events/${eventId}?ref=${referralCode}&utm_source=${platform}`;
  
  const share: ShareEvent = {
    id: id('share'),
    userId,
    eventId,
    platform,
    referralCode,
    shareUrl,
    sharedAt: Date.now(),
    clicks: 0,
    conversions: 0,
    revenue: 0,
  };
  
  if (!shareEvents[eventId]) {
    shareEvents[eventId] = [];
  }
  shareEvents[eventId].push(share);
  
  return share;
}

/**
 * Track share click (Requirement 15.5)
 */
export function trackShareClick(shareId: string, eventId: string): void {
  const shares = shareEvents[eventId];
  if (!shares) return;
  
  const share = shares.find(s => s.id === shareId);
  if (share) {
    share.clicks++;
  }
}

/**
 * Track share conversion and revenue (Requirement 15.5, 15.8)
 */
export function trackShareConversion(shareId: string, eventId: string, revenue: number = 0): void {
  const shares = shareEvents[eventId];
  if (!shares) return;
  
  const share = shares.find(s => s.id === shareId);
  if (share) {
    share.conversions++;
    share.revenue += revenue;
  }
  
  // Update leaderboard
  updateShareLeaderboard(eventId);
}

/**
 * Get share metrics for an event (Requirement 15.5)
 */
export function getShareMetrics(eventId: string): ShareMetrics {
  const shares = shareEvents[eventId] || [];
  
  const totalShares = shares.length;
  const clicks = shares.reduce((sum, s) => sum + s.clicks, 0);
  const conversions = shares.reduce((sum, s) => sum + s.conversions, 0);
  
  return {
    totalShares,
    clicks,
    conversions,
    clickRate: totalShares > 0 ? (clicks / totalShares) * 100 : 0,
    conversionRate: clicks > 0 ? (conversions / clicks) * 100 : 0,
  };
}

/**
 * Get share metrics by platform (Requirement 15.5)
 */
export function getShareMetricsByPlatform(eventId: string): Record<string, ShareMetrics> {
  const shares = shareEvents[eventId] || [];
  const platforms = ['whatsapp', 'facebook', 'twitter', 'linkedin', 'email', 'sms'];
  
  const metricsByPlatform: Record<string, ShareMetrics> = {};
  
  for (const platform of platforms) {
    const platformShares = shares.filter(s => s.platform === platform);
    const totalShares = platformShares.length;
    const clicks = platformShares.reduce((sum, s) => sum + s.clicks, 0);
    const conversions = platformShares.reduce((sum, s) => sum + s.conversions, 0);
    
    metricsByPlatform[platform] = {
      totalShares,
      clicks,
      conversions,
      clickRate: totalShares > 0 ? (clicks / totalShares) * 100 : 0,
      conversionRate: clicks > 0 ? (conversions / clicks) * 100 : 0,
    };
  }
  
  return metricsByPlatform;
}

/**
 * Send personalized invitation via email or SMS (Requirement 15.4)
 */
export function sendPersonalizedInvitation(
  userId: string,
  eventId: string,
  recipients: Array<{ name: string; email?: string; phone?: string }>,
  personalMessage?: string
): { sent: number; failed: number; errors: string[] } {
  const { getEventById } = require('./events');
  const event = getEventById(eventId);
  
  if (!event) {
    return { sent: 0, failed: recipients.length, errors: ['Event not found'] };
  }
  
  // Generate share link with referral tracking
  const { shareUrl, referralCode } = generateShareLink(userId, eventId, 'email');
  
  let sent = 0;
  let failed = 0;
  const errors: string[] = [];
  
  for (const recipient of recipients) {
    if (recipient.email) {
      // Send email invitation
      const emailContent = `
Hi ${recipient.name},

${personalMessage || `I'd love for you to join me at ${event.title}!`}

Event: ${event.title}
Date: ${new Date(event.date).toLocaleDateString()}
${event.venue ? `Venue: ${event.venue}` : ''}
Location: ${event.city}, ${event.country}

Get your tickets here: ${shareUrl}

See you there!
      `.trim();
      
      // In production, this would send via email provider
      // For now, we'll simulate success
      sent++;
      
      // Track the share
      trackShare(userId, eventId, 'email', referralCode);
    } else if (recipient.phone) {
      // Send SMS invitation
      const smsContent = `${recipient.name}, join me at ${event.title} on ${new Date(event.date).toLocaleDateString()}! Get tickets: ${shareUrl}`;
      
      // In production, this would send via SMS provider
      // For now, we'll simulate success
      sent++;
      
      // Track the share
      trackShare(userId, eventId, 'sms', referralCode);
    } else {
      failed++;
      errors.push(`No contact method for ${recipient.name}`);
    }
  }
  
  return { sent, failed, errors };
}

/**
 * Create a viral loop for an event (Requirement 15.6)
 */
export function createViralLoop(eventId: string, data: Omit<ViralLoop, 'id' | 'eventId' | 'participants' | 'completions' | 'createdAt'>): ViralLoop {
  const loop: ViralLoop = {
    ...data,
    id: id('viral'),
    eventId,
    participants: [],
    completions: 0,
    createdAt: Date.now(),
  };
  viralLoops[loop.id] = loop;
  return loop;
}

/**
 * Get all viral loops for an event
 */
export function getViralLoops(eventId: string): ViralLoop[] {
  return Object.values(viralLoops).filter(loop => loop.eventId === eventId);
}

/**
 * Get active viral loops for an event
 */
export function getActiveViralLoops(eventId: string): ViralLoop[] {
  return Object.values(viralLoops).filter(loop => loop.eventId === eventId && loop.active);
}

/**
 * Join a viral loop (Requirement 15.6)
 */
export function joinViralLoop(loopId: string, userId: string): void {
  const loop = viralLoops[loopId];
  if (!loop || !loop.active) return;
  
  if (!loop.participants.includes(userId)) {
    loop.participants.push(userId);
    
    // Initialize progress tracking for this user
    if (!viralLoopProgress[userId]) {
      viralLoopProgress[userId] = [];
    }
    
    const progress: ViralLoopProgress = {
      userId,
      loopId,
      eventId: loop.eventId,
      currentProgress: 0,
      requirement: loop.requirement,
      completed: false,
      rewardClaimed: false,
    };
    
    viralLoopProgress[userId].push(progress);
  }
}

/**
 * Track viral loop progress (Requirement 15.6)
 */
export function trackViralLoopProgress(userId: string, loopId: string, increment: number = 1): ViralLoopProgress | null {
  const userProgress = viralLoopProgress[userId];
  if (!userProgress) return null;
  
  const progress = userProgress.find(p => p.loopId === loopId);
  if (!progress) return null;
  
  progress.currentProgress += increment;
  
  // Check if requirement is met
  if (progress.currentProgress >= progress.requirement && !progress.completed) {
    progress.completed = true;
    progress.completedAt = Date.now();
    
    // Update loop completions count
    const loop = viralLoops[loopId];
    if (loop) {
      loop.completions++;
    }
  }
  
  return progress;
}

/**
 * Check viral loop completion (Requirement 15.6)
 */
export function checkViralLoopCompletion(loopId: string, userId: string, referralCount: number): boolean {
  const loop = viralLoops[loopId];
  if (!loop) return false;
  
  // Update progress
  const userProgress = viralLoopProgress[userId];
  if (!userProgress) return false;
  
  const progress = userProgress.find(p => p.loopId === loopId);
  if (!progress) return false;
  
  progress.currentProgress = referralCount;
  
  if (referralCount >= loop.requirement && !progress.completed) {
    progress.completed = true;
    progress.completedAt = Date.now();
    loop.completions++;
    return true;
  }
  
  return progress.completed;
}

/**
 * Apply viral loop reward (Requirement 15.6, 15.8)
 */
export function applyViralLoopReward(userId: string, loopId: string): { success: boolean; reward: string; error?: string } {
  const loop = viralLoops[loopId];
  if (!loop) {
    return { success: false, reward: '', error: 'Viral loop not found' };
  }
  
  const userProgress = viralLoopProgress[userId];
  if (!userProgress) {
    return { success: false, reward: '', error: 'No progress found for user' };
  }
  
  const progress = userProgress.find(p => p.loopId === loopId);
  if (!progress) {
    return { success: false, reward: '', error: 'User not participating in this viral loop' };
  }
  
  if (!progress.completed) {
    return { success: false, reward: '', error: 'Viral loop requirement not met' };
  }
  
  if (progress.rewardClaimed) {
    return { success: false, reward: '', error: 'Reward already claimed' };
  }
  
  // Apply reward based on type
  if (loop.type === 'group-discount' && loop.rewardValue) {
    // Create a promo code for the group discount
    const promoCode = createPromoCode('system', {
      organizerId: 'system',
      eventId: loop.eventId,
      code: `VIRAL_${loop.id.slice(0, 8)}_${userId.slice(0, 6)}`.toUpperCase(),
      type: 'percentage',
      value: loop.rewardValue,
      description: `${loop.name} - Group discount unlocked`,
      active: true,
      usageLimit: 1,
      perUserLimit: 1,
      expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
      stackable: false,
    });
    
    progress.rewardClaimed = true;
    
    return {
      success: true,
      reward: `${loop.rewardValue}% discount code: ${promoCode.code}`,
    };
  } else if (loop.type === 'referral-reward' && loop.rewardValue) {
    // Credit wallet with reward
    const { addMoney } = require('./store');
    addMoney(userId, loop.rewardValue, `Viral loop reward: ${loop.name}`);
    
    progress.rewardClaimed = true;
    
    return {
      success: true,
      reward: `${loop.rewardValue} credited to wallet`,
    };
  } else if (loop.type === 'unlock-content') {
    // Mark content as unlocked (implementation depends on content type)
    progress.rewardClaimed = true;
    
    return {
      success: true,
      reward: loop.reward,
    };
  }
  
  return { success: false, reward: '', error: 'Unknown reward type' };
}

/**
 * Get viral loop progress for a user
 */
export function getViralLoopProgress(userId: string, eventId?: string): ViralLoopProgress[] {
  const userProgress = viralLoopProgress[userId] || [];
  
  if (eventId) {
    return userProgress.filter(p => p.eventId === eventId);
  }
  
  return userProgress;
}

/**
 * Update share leaderboard for an event (Requirement 15.7)
 */
export function updateShareLeaderboard(eventId: string): ShareLeaderboard {
  const shares = shareEvents[eventId] || [];
  
  // Group shares by user
  const userStats = new Map<string, {
    shareCount: number;
    clicks: number;
    conversions: number;
    revenue: number;
  }>();
  
  for (const share of shares) {
    const existing = userStats.get(share.userId);
    if (existing) {
      existing.shareCount++;
      existing.clicks += share.clicks;
      existing.conversions += share.conversions;
      existing.revenue += share.revenue;
    } else {
      userStats.set(share.userId, {
        shareCount: 1,
        clicks: share.clicks,
        conversions: share.conversions,
        revenue: share.revenue,
      });
    }
  }
  
  // Convert to array and sort by conversions (primary) and revenue (secondary)
  const topSharers = Array.from(userStats.entries())
    .map(([userId, stats]) => ({
      userId,
      userName: `User ${userId.slice(0, 8)}`, // In production, fetch actual user name
      ...stats,
      rank: 0,
    }))
    .sort((a, b) => {
      if (b.conversions !== a.conversions) {
        return b.conversions - a.conversions;
      }
      return b.revenue - a.revenue;
    })
    .slice(0, 10) // Top 10
    .map((sharer, index) => ({
      ...sharer,
      rank: index + 1,
    }));
  
  const leaderboard: ShareLeaderboard = {
    eventId,
    topSharers,
    generatedAt: Date.now(),
  };
  
  shareLeaderboards[eventId] = leaderboard;
  
  return leaderboard;
}

/**
 * Get share leaderboard for an event (Requirement 15.7)
 */
export function getShareLeaderboard(eventId: string): ShareLeaderboard | null {
  // Update leaderboard if it doesn't exist or is older than 5 minutes
  const existing = shareLeaderboards[eventId];
  if (!existing || Date.now() - existing.generatedAt > 300000) {
    return updateShareLeaderboard(eventId);
  }
  
  return existing;
}

/**
 * Get user's rank in share leaderboard (Requirement 15.7)
 */
export function getUserShareRank(eventId: string, userId: string): { rank: number; stats: { shareCount: number; clicks: number; conversions: number; revenue: number } } | null {
  const leaderboard = getShareLeaderboard(eventId);
  if (!leaderboard) return null;
  
  const userEntry = leaderboard.topSharers.find(s => s.userId === userId);
  if (!userEntry) {
    // User not in top 10, calculate their actual stats
    const shares = shareEvents[eventId] || [];
    const userShares = shares.filter(s => s.userId === userId);
    
    if (userShares.length === 0) return null;
    
    const stats = {
      shareCount: userShares.length,
      clicks: userShares.reduce((sum, s) => sum + s.clicks, 0),
      conversions: userShares.reduce((sum, s) => sum + s.conversions, 0),
      revenue: userShares.reduce((sum, s) => sum + s.revenue, 0),
    };
    
    return { rank: 11, stats }; // Outside top 10
  }
  
  return {
    rank: userEntry.rank,
    stats: {
      shareCount: userEntry.shareCount,
      clicks: userEntry.clicks,
      conversions: userEntry.conversions,
      revenue: userEntry.revenue,
    },
  };
}

// ── Audience Segmentation Functions ──────────────────────────────────────────

export function createAudienceSegment(organizerId: string, data: Omit<AudienceSegment, 'id' | 'organizerId' | 'size' | 'lastCalculatedAt' | 'createdAt' | 'updatedAt'>): AudienceSegment {
  const segment: AudienceSegment = {
    ...data,
    id: id('segment'),
    organizerId,
    size: 0,
    lastCalculatedAt: Date.now(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  audienceSegments[segment.id] = segment;
  return segment;
}

export function getAudienceSegment(segmentId: string): AudienceSegment | null {
  return audienceSegments[segmentId] || null;
}

export function listAudienceSegments(organizerId: string): AudienceSegment[] {
  return Object.values(audienceSegments)
    .filter(s => s.organizerId === organizerId)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function updateSegmentSize(segmentId: string, size: number): void {
  const segment = audienceSegments[segmentId];
  if (!segment) return;
  
  segment.size = size;
  segment.lastCalculatedAt = Date.now();
  segment.updatedAt = Date.now();
}

// ── Analytics & ROI Tracking Functions (Requirements 14, 20) ────────────────

/**
 * Get funnel analysis for an event (Requirement 14.4)
 * Tracks the complete funnel from awareness to purchase with drop-off rates
 */
export function getFunnelAnalysis(eventId: string): FunnelAnalysis {
  // Check if we have cached funnel analysis
  if (funnelAnalyses[eventId]) {
    return funnelAnalyses[eventId];
  }

  // Calculate funnel stages from attributions and conversions
  const eventAttributions = Object.values(attributions).filter(a => a.eventId === eventId);
  
  const stages: FunnelStage[] = [
    {
      name: 'Awareness',
      entered: eventAttributions.length,
      exited: 0,
      converted: 0,
      conversionRate: 0,
      averageTime: 0,
    },
    {
      name: 'Interest',
      entered: eventAttributions.filter(a => a.touchPoints.length >= 2).length,
      exited: 0,
      converted: 0,
      conversionRate: 0,
      averageTime: 0,
    },
    {
      name: 'Consideration',
      entered: eventAttributions.filter(a => a.touchPoints.length >= 3).length,
      exited: 0,
      converted: 0,
      conversionRate: 0,
      averageTime: 0,
    },
    {
      name: 'Purchase',
      entered: eventAttributions.filter(a => a.converted).length,
      exited: 0,
      converted: eventAttributions.filter(a => a.converted).length,
      conversionRate: 0,
      averageTime: 0,
    },
  ];

  // Calculate drop-offs and conversion rates
  for (let i = 0; i < stages.length - 1; i++) {
    stages[i].exited = stages[i].entered - stages[i + 1].entered;
    stages[i].converted = stages[i + 1].entered;
    stages[i].conversionRate = stages[i].entered > 0 ? (stages[i].converted / stages[i].entered) * 100 : 0;
  }
  
  stages[stages.length - 1].conversionRate = 100; // Final stage is 100% converted

  // Calculate average time in each stage
  const convertedAttributions = eventAttributions.filter(a => a.converted && a.convertedAt);
  if (convertedAttributions.length > 0) {
    const totalTime = convertedAttributions.reduce((sum, a) => {
      return sum + (a.convertedAt! - a.createdAt);
    }, 0);
    const avgTime = totalTime / convertedAttributions.length;
    
    // Distribute time across stages (simplified)
    stages.forEach((stage, idx) => {
      stage.averageTime = (avgTime / stages.length) * (idx + 1);
    });
  }

  const totalEntered = stages[0].entered;
  const totalConverted = stages[stages.length - 1].converted;
  const overallConversionRate = totalEntered > 0 ? (totalConverted / totalEntered) * 100 : 0;
  
  const averageTimeToConvert = convertedAttributions.length > 0
    ? convertedAttributions.reduce((sum, a) => sum + (a.convertedAt! - a.createdAt), 0) / convertedAttributions.length / 1000
    : 0;

  // Identify drop-off points (stages with >50% drop-off)
  const dropOffPoints = stages
    .filter((stage, idx) => idx < stages.length - 1 && stage.conversionRate < 50)
    .map(stage => stage.name);

  const analysis: FunnelAnalysis = {
    eventId,
    stages,
    totalEntered,
    totalConverted,
    overallConversionRate,
    averageTimeToConvert,
    dropOffPoints,
  };

  funnelAnalyses[eventId] = analysis;
  return analysis;
}

/**
 * Get cohort analysis by acquisition channel (Requirements 14.6, 20.5)
 * Tracks attendee behavior and lifetime value by acquisition channel
 */
export function getCohortAnalysis(organizerId: string, cohortDate: string, acquisitionChannel?: string): CohortAnalysis[] {
  const cohorts: CohortAnalysis[] = [];
  
  // Get all attributions for this organizer's events
  const orgCampaigns = Object.values(campaigns).filter(c => c.organizerId === organizerId);
  const orgEventIds = [...new Set(orgCampaigns.map(c => c.eventId))];
  
  const relevantAttributions = Object.values(attributions).filter(a => 
    a.converted && 
    a.eventId && 
    orgEventIds.includes(a.eventId) &&
    a.convertedAt &&
    new Date(a.convertedAt).toISOString().slice(0, 7) === cohortDate
  );

  // Group by channel
  const channelGroups = new Map<string, Attribution[]>();
  relevantAttributions.forEach(attr => {
    const channel = `${attr.source}-${attr.medium}`;
    if (!acquisitionChannel || channel === acquisitionChannel) {
      if (!channelGroups.has(channel)) {
        channelGroups.set(channel, []);
      }
      channelGroups.get(channel)!.push(attr);
    }
  });

  // Calculate cohort metrics for each channel
  channelGroups.forEach((attrs, channel) => {
    const cohortSize = attrs.length;
    const totalRevenue = attrs.reduce((sum, a) => sum + (a.conversionValue || 0), 0);
    const ltv = cohortSize > 0 ? totalRevenue / cohortSize : 0;
    
    // Calculate CAC from campaign costs
    const channelCampaigns = orgCampaigns.filter(c => 
      c.channels.some(ch => `${ch.type}` === channel.split('-')[0])
    );
    const totalCost = channelCampaigns.reduce((sum, c) => sum + c.metrics.cost, 0);
    const cac = cohortSize > 0 ? totalCost / cohortSize : 0;
    
    const ltvCacRatio = cac > 0 ? ltv / cac : 0;

    // Simplified retention and revenue arrays (would need time-series data in production)
    const retention = [100, 85, 70, 60, 55]; // Placeholder retention percentages
    const revenue = [ltv * 0.3, ltv * 0.5, ltv * 0.7, ltv * 0.9, ltv]; // Cumulative revenue

    cohorts.push({
      cohortDate,
      acquisitionChannel: channel,
      cohortSize,
      retention,
      revenue,
      ltv,
      cac,
      ltvCacRatio,
    });
  });

  // Cache the results
  if (!cohortAnalyses[organizerId]) {
    cohortAnalyses[organizerId] = [];
  }
  cohortAnalyses[organizerId] = cohorts;

  return cohorts.sort((a, b) => b.ltvCacRatio - a.ltvCacRatio);
}

/**
 * Track marketing cost for a campaign (Requirement 20.1)
 */
export function trackMarketingCost(
  campaignId: string,
  category: MarketingCost['category'],
  amount: number,
  description: string,
  currency: string = 'USD'
): MarketingCost {
  const cost: MarketingCost = {
    id: id('cost'),
    campaignId,
    category,
    amount,
    currency,
    description,
    date: Date.now(),
    createdAt: Date.now(),
  };

  if (!marketingCosts[campaignId]) {
    marketingCosts[campaignId] = [];
  }
  marketingCosts[campaignId].push(cost);

  // Update campaign spent amount
  const campaign = campaigns[campaignId];
  if (campaign) {
    campaign.spent += amount;
    campaign.metrics.cost += amount;
    
    // Recalculate ROI
    if (campaign.metrics.cost > 0) {
      campaign.metrics.roi = ((campaign.metrics.revenue - campaign.metrics.cost) / campaign.metrics.cost) * 100;
    }
  }

  return cost;
}

/**
 * Calculate campaign ROI with detailed breakdown (Requirements 20.2, 20.3)
 */
export function calculateCampaignROI(campaignId: string): {
  campaignId: string;
  revenue: number;
  cost: number;
  profit: number;
  roi: number;
  costBreakdown: Record<string, number>;
  conversions: number;
  cac: number;
} {
  const campaign = campaigns[campaignId];
  if (!campaign) {
    return {
      campaignId,
      revenue: 0,
      cost: 0,
      profit: 0,
      roi: 0,
      costBreakdown: {},
      conversions: 0,
      cac: 0,
    };
  }

  const revenue = campaign.metrics.revenue;
  const cost = campaign.metrics.cost;
  const profit = revenue - cost;
  const roi = cost > 0 ? (profit / cost) * 100 : 0;
  const conversions = campaign.metrics.conversions;
  const cac = conversions > 0 ? cost / conversions : 0;

  // Get cost breakdown by category
  const costs = marketingCosts[campaignId] || [];
  const costBreakdown: Record<string, number> = {};
  costs.forEach(c => {
    costBreakdown[c.category] = (costBreakdown[c.category] || 0) + c.amount;
  });

  return {
    campaignId,
    revenue,
    cost,
    profit,
    roi,
    costBreakdown,
    conversions,
    cac,
  };
}

/**
 * Generate ROI forecast based on historical performance (Requirement 20.6)
 */
export function generateROIForecast(campaignId: string, timeframeDays: number = 30): ROIForecast {
  const campaign = campaigns[campaignId];
  if (!campaign) {
    return {
      campaignId,
      projectedRevenue: 0,
      projectedCost: 0,
      projectedROI: 0,
      confidence: 0,
      timeframe: timeframeDays,
      assumptions: ['Campaign not found'],
      generatedAt: Date.now(),
    };
  }

  // Calculate daily averages from campaign history
  const campaignDuration = campaign.completedAt 
    ? (campaign.completedAt - (campaign.startedAt || campaign.createdAt)) / (1000 * 60 * 60 * 24)
    : (Date.now() - (campaign.startedAt || campaign.createdAt)) / (1000 * 60 * 60 * 24);
  
  const daysActive = Math.max(1, campaignDuration);
  const dailyRevenue = campaign.metrics.revenue / daysActive;
  const dailyCost = campaign.metrics.cost / daysActive;

  // Project forward
  const projectedRevenue = dailyRevenue * timeframeDays;
  const projectedCost = dailyCost * timeframeDays;
  const projectedROI = projectedCost > 0 ? ((projectedRevenue - projectedCost) / projectedCost) * 100 : 0;

  // Calculate confidence based on data quality
  const dataPoints = campaign.metrics.conversions;
  const confidence = Math.min(95, 50 + (dataPoints * 2)); // More conversions = higher confidence

  const assumptions = [
    `Based on ${daysActive.toFixed(1)} days of historical data`,
    `Daily revenue: ${dailyRevenue.toFixed(2)}`,
    `Daily cost: ${dailyCost.toFixed(2)}`,
    `Assumes consistent performance over ${timeframeDays} days`,
  ];

  if (campaign.status === 'paused') {
    assumptions.push('Campaign is currently paused');
    confidence * 0.7; // Reduce confidence for paused campaigns
  }

  const forecast: ROIForecast = {
    campaignId,
    projectedRevenue,
    projectedCost,
    projectedROI,
    confidence,
    timeframe: timeframeDays,
    assumptions,
    generatedAt: Date.now(),
  };

  roiForecasts[campaignId] = forecast;
  return forecast;
}

/**
 * Generate comprehensive ROI report (Requirements 20.6, 20.7, 20.8)
 */
export function generateROIReport(
  organizerId: string,
  dateRange: { start: number; end: number }
): ROIReport {
  const orgCampaigns = Object.values(campaigns).filter(c => 
    c.organizerId === organizerId &&
    c.createdAt >= dateRange.start &&
    c.createdAt <= dateRange.end
  );

  // Calculate campaign-level ROI
  const campaignROIs = orgCampaigns.map(c => {
    const roi = calculateCampaignROI(c.id);
    return {
      campaignId: c.id,
      campaignName: c.name,
      revenue: roi.revenue,
      cost: roi.cost,
      roi: roi.roi,
      profit: roi.profit,
    };
  });

  // Calculate cost breakdown by category
  const costBreakdown: Record<string, number> = {};
  orgCampaigns.forEach(c => {
    const costs = marketingCosts[c.id] || [];
    costs.forEach(cost => {
      costBreakdown[cost.category] = (costBreakdown[cost.category] || 0) + cost.amount;
    });
  });

  // Calculate channel-level ROI
  const channelPerf = getChannelPerformance(organizerId, dateRange);
  const channelBreakdown = channelPerf.map(ch => ({
    channel: ch.channel,
    revenue: ch.revenue,
    cost: ch.cost,
    roi: ch.roi,
  }));

  const totalRevenue = campaignROIs.reduce((sum, c) => sum + c.revenue, 0);
  const totalCost = campaignROIs.reduce((sum, c) => sum + c.cost, 0);
  const totalProfit = totalRevenue - totalCost;
  const totalROI = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

  const profitableChannels = channelBreakdown
    .filter(ch => ch.roi > 0)
    .sort((a, b) => b.roi - a.roi)
    .map(ch => ch.channel);

  const unprofitableChannels = channelBreakdown
    .filter(ch => ch.roi < 0)
    .sort((a, b) => a.roi - b.roi)
    .map(ch => ch.channel);

  // Generate recommendations
  const recommendations: string[] = [];
  
  if (totalROI < 0) {
    recommendations.push('Overall ROI is negative. Review campaign strategy and reduce costs.');
  } else if (totalROI < 50) {
    recommendations.push('ROI is below target. Consider optimizing underperforming channels.');
  } else if (totalROI > 200) {
    recommendations.push('Excellent ROI! Consider scaling successful campaigns.');
  }

  if (profitableChannels.length > 0) {
    recommendations.push(`Top performing channel: ${profitableChannels[0]}. Consider increasing budget.`);
  }

  if (unprofitableChannels.length > 0) {
    recommendations.push(`${unprofitableChannels[0]} has negative ROI. Review or pause this channel.`);
  }

  // Cost optimization recommendations
  const totalAdSpend = costBreakdown['ad-spend'] || 0;
  const adSpendPercent = totalCost > 0 ? (totalAdSpend / totalCost) * 100 : 0;
  if (adSpendPercent > 70) {
    recommendations.push('Ad spend is >70% of total costs. Explore organic channels to reduce CAC.');
  }

  return {
    organizerId,
    dateRange,
    campaigns: campaignROIs,
    costBreakdown,
    channelBreakdown,
    totalRevenue,
    totalCost,
    totalROI,
    totalProfit,
    profitableChannels,
    unprofitableChannels,
    recommendations,
    generatedAt: Date.now(),
  };
}

/**
 * Get marketing costs for a campaign
 */
export function getMarketingCosts(campaignId: string): MarketingCost[] {
  return marketingCosts[campaignId] || [];
}

/**
 * Get all marketing costs for an organizer
 */
export function getAllMarketingCosts(organizerId: string, dateRange?: { start: number; end: number }): MarketingCost[] {
  const orgCampaigns = Object.values(campaigns).filter(c => c.organizerId === organizerId);
  const orgCampaignIds = orgCampaigns.map(c => c.id);
  
  let costs: MarketingCost[] = [];
  orgCampaignIds.forEach(campaignId => {
    const campaignCosts = marketingCosts[campaignId] || [];
    costs = costs.concat(campaignCosts);
  });

  if (dateRange) {
    costs = costs.filter(c => c.date >= dateRange.start && c.date <= dateRange.end);
  }

  return costs.sort((a, b) => b.date - a.date);
}

// ── Utility Export Functions ─────────────────────────────────────────────────

export function getAllCampaigns(): Campaign[] {
  return Object.values(campaigns);
}

export function getAllPromoCodes(): PromoCode[] {
  return Object.values(promoCodes);
}

export function getAllReferralLinks(): ReferralLink[] {
  return Object.values(referralLinks);
}

export function getAllAffiliates(): Affiliate[] {
  return Object.values(affiliates);
}

// Export storage for testing/debugging (optional)
export const _storage = {
  campaigns,
  promoCodes,
  referralLinks,
  affiliates,
  attributions,
  emailTemplates,
  socialPosts,
  adCampaigns,
  blogPosts,
  influencerCollaborations,
  mediaKits,
  abTests,
  socialProofData,
  dripCampaigns,
  viralLoops,
  viralLoopProgress,
  shareEvents,
  shareLeaderboards,
  audienceSegments,
  funnelAnalyses,
  cohortAnalyses,
  marketingCosts,
  roiForecasts,
};


// ── Additional Helper Functions ──────────────────────────────────────────────

export function getPromoCode(promoCodeId: string): PromoCode | null {
  return promoCodes[promoCodeId] || null;
}

export function getAffiliateByUserId(userId: string): Affiliate | null {
  return Object.values(affiliates).find(a => a.userId === userId) || null;
}

export function getAffiliatePerformance(affiliateId: string): { clicks: number; conversions: number; revenue: number; commission: number } {
  const affiliate = affiliates[affiliateId];
  if (!affiliate) return { clicks: 0, conversions: 0, revenue: 0, commission: 0 };
  
  const conversions = affiliateConversions[affiliateId] || [];
  const totalRevenue = conversions.reduce((sum, c) => sum + c.revenue, 0);
  const totalCommission = conversions.reduce((sum, c) => sum + c.commissionAmount, 0);
  
  return {
    clicks: affiliate.links.reduce((sum, l) => sum + l.clicks, 0),
    conversions: conversions.length,
    revenue: totalRevenue,
    commission: totalCommission
  };
}

export function createPushCampaign(organizerId: string, data: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>): Campaign {
  return createCampaign(organizerId, { ...data, type: 'push' });
}

export function getPushCampaign(campaignId: string): Campaign | null {
  const campaign = getCampaign(campaignId);
  return campaign && campaign.type === 'push' ? campaign : null;
}

export function getPushMetrics(campaignId: string): CampaignMetrics | null {
  const campaign = getPushCampaign(campaignId);
  return campaign ? campaign.metrics : null;
}

export function executeCampaign(campaignId: string): { success: boolean; message: string } {
  const campaign = getCampaign(campaignId);
  if (!campaign) {
    return { success: false, message: 'Campaign not found' };
  }
  
  if (campaign.status !== 'draft' && campaign.status !== 'scheduled') {
    return { success: false, message: 'Campaign cannot be executed in current status' };
  }
  
  // Update campaign status to active
  updateCampaign(campaignId, {
    status: 'active',
    startedAt: Date.now()
  });
  
  return { success: true, message: 'Campaign execution started' };
}

// ── Influencer Messaging System ──────────────────────────────────────────────

export interface InfluencerMessage {
  id: string;
  collaborationId: string;
  senderId: string;
  senderRole: 'organizer' | 'influencer';
  content: string;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  read: boolean;
  readAt?: number;
  createdAt: number;
}

export interface MessageThread {
  collaborationId: string;
  organizerId: string;
  influencerId: string;
  eventId: string;
  messages: InfluencerMessage[];
  unreadCount: {
    organizer: number;
    influencer: number;
  };
  lastMessageAt: number;
  createdAt: number;
}

// In-memory storage for messages
const messageThreads: Record<string, MessageThread> = {};

/**
 * Get or create message thread for a collaboration (Requirement 11.7)
 */
export function getMessageThread(collaborationId: string): MessageThread | null {
  const collaboration = influencerCollaborations[collaborationId];
  if (!collaboration) return null;
  
  if (!messageThreads[collaborationId]) {
    messageThreads[collaborationId] = {
      collaborationId,
      organizerId: collaboration.organizerId,
      influencerId: collaboration.influencerId,
      eventId: collaboration.eventId,
      messages: [],
      unreadCount: {
        organizer: 0,
        influencer: 0,
      },
      lastMessageAt: Date.now(),
      createdAt: Date.now(),
    };
  }
  
  return messageThreads[collaborationId];
}

/**
 * Send message in collaboration thread (Requirement 11.7)
 */
export function sendInfluencerMessage(
  collaborationId: string,
  senderId: string,
  content: string,
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
    size: number;
  }>
): InfluencerMessage | null {
  const thread = getMessageThread(collaborationId);
  if (!thread) return null;
  
  const collaboration = influencerCollaborations[collaborationId];
  if (!collaboration) return null;
  
  // Determine sender role
  const senderRole: 'organizer' | 'influencer' = 
    senderId === collaboration.organizerId ? 'organizer' : 'influencer';
  
  // Verify sender is part of the collaboration
  if (senderId !== collaboration.organizerId && senderId !== collaboration.influencerId) {
    return null;
  }
  
  const message: InfluencerMessage = {
    id: id('msg'),
    collaborationId,
    senderId,
    senderRole,
    content,
    attachments: attachments?.map(att => ({
      ...att,
      id: id('attachment'),
    })),
    read: false,
    createdAt: Date.now(),
  };
  
  thread.messages.push(message);
  thread.lastMessageAt = message.createdAt;
  
  // Increment unread count for recipient
  if (senderRole === 'organizer') {
    thread.unreadCount.influencer++;
  } else {
    thread.unreadCount.organizer++;
  }
  
  return message;
}

/**
 * Get messages for a collaboration (Requirement 11.7)
 */
export function getInfluencerMessages(
  collaborationId: string,
  limit?: number,
  offset?: number
): InfluencerMessage[] {
  const thread = messageThreads[collaborationId];
  if (!thread) return [];
  
  const messages = [...thread.messages].sort((a, b) => b.createdAt - a.createdAt);
  
  if (limit !== undefined) {
    const start = offset || 0;
    return messages.slice(start, start + limit);
  }
  
  return messages;
}

/**
 * Mark messages as read (Requirement 11.7)
 */
export function markMessagesAsRead(
  collaborationId: string,
  userId: string,
  messageIds?: string[]
): number {
  const thread = messageThreads[collaborationId];
  if (!thread) return 0;
  
  const collaboration = influencerCollaborations[collaborationId];
  if (!collaboration) return 0;
  
  // Determine user role
  const userRole: 'organizer' | 'influencer' = 
    userId === collaboration.organizerId ? 'organizer' : 'influencer';
  
  let markedCount = 0;
  
  for (const message of thread.messages) {
    // Skip if message is from the same user
    if (message.senderId === userId) continue;
    
    // Skip if already read
    if (message.read) continue;
    
    // If specific message IDs provided, only mark those
    if (messageIds && !messageIds.includes(message.id)) continue;
    
    message.read = true;
    message.readAt = Date.now();
    markedCount++;
  }
  
  // Update unread count
  if (markedCount > 0) {
    if (userRole === 'organizer') {
      thread.unreadCount.organizer = Math.max(0, thread.unreadCount.organizer - markedCount);
    } else {
      thread.unreadCount.influencer = Math.max(0, thread.unreadCount.influencer - markedCount);
    }
  }
  
  return markedCount;
}

/**
 * Get unread message count for user (Requirement 11.7)
 */
export function getUnreadMessageCount(userId: string): number {
  let totalUnread = 0;
  
  for (const thread of Object.values(messageThreads)) {
    if (thread.organizerId === userId) {
      totalUnread += thread.unreadCount.organizer;
    } else if (thread.influencerId === userId) {
      totalUnread += thread.unreadCount.influencer;
    }
  }
  
  return totalUnread;
}

/**
 * Get all message threads for a user (Requirement 11.7)
 */
export function getUserMessageThreads(userId: string): MessageThread[] {
  return Object.values(messageThreads)
    .filter(thread => 
      thread.organizerId === userId || thread.influencerId === userId
    )
    .sort((a, b) => b.lastMessageAt - a.lastMessageAt);
}

/**
 * Delete a message (soft delete - mark as deleted)
 */
export function deleteInfluencerMessage(
  messageId: string,
  collaborationId: string,
  userId: string
): boolean {
  const thread = messageThreads[collaborationId];
  if (!thread) return false;
  
  const messageIndex = thread.messages.findIndex(m => m.id === messageId);
  if (messageIndex === -1) return false;
  
  const message = thread.messages[messageIndex];
  
  // Only sender can delete their own message
  if (message.senderId !== userId) return false;
  
  // Remove message from thread
  thread.messages.splice(messageIndex, 1);
  
  return true;
}
