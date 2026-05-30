export interface FeaturePurchase {
  id: string;
  user_id: string;
  feature_id: string;
  feature_name: string;
  package_id: string | null;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  payment_method: string;
  transaction_reference: string;
  purchase_date: string;
  expires_at: string | null;
  activated_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface FeatureSubscription {
  id: string;
  user_id: string;
  feature_id: string;
  package_id: string | null;
  status: "active" | "cancelled" | "expired" | "trialing";
  billing_cycle: "monthly" | "yearly";
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  payment_method: string;
  created_at: string;
  updated_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  feature_id: string;
  feature_name: string;
  added_at: string;
}

const now = new Date().toISOString();

export const samplePurchases: FeaturePurchase[] = [
  {
    id: "purchase_advanced_analytics",
    user_id: "user_123",
    feature_id: "advanced_analytics",
    feature_name: "Advanced Analytics",
    package_id: null,
    amount: 15000,
    currency: "USD",
    status: "completed",
    payment_method: "card",
    transaction_reference: "txn_advanced_analytics_01",
    purchase_date: now,
    expires_at: null,
    activated_at: now,
    created_at: now,
    updated_at: now,
  },
];

export const sampleSubscriptions: FeatureSubscription[] = [
  {
    id: "sub_api_access",
    user_id: "user_123",
    feature_id: "api_access",
    package_id: null,
    status: "active",
    billing_cycle: "monthly",
    current_period_start: now,
    current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    cancel_at_period_end: false,
    payment_method: "card",
    created_at: now,
    updated_at: now,
  },
];

export const sampleWishlist: WishlistItem[] = [
  {
    id: "wishlist_api_access",
    user_id: "user_123",
    feature_id: "api_access",
    feature_name: "API Access",
    added_at: now,
  },
];

export const featureNamesById: Record<string, string> = {
  advanced_analytics: "Advanced Analytics",
  predictive_analytics: "Predictive Analytics",
  priority_support: "Priority Support",
  dedicated_manager: "Dedicated Account Manager",
  custom_branding: "Custom Branding",
  api_access: "API Access",
  email_marketing: "Email Marketing Pro",
  social_promotion: "Social Media Promotion",
  ssl_certificate: "Custom SSL Certificate",
  two_factor_auth: "Two-Factor Authentication",
};
