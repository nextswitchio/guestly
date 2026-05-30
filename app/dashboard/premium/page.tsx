"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { formatCurrency, formatDate } from '@/lib/utils';

// Types for Premium Features
type FeatureCategory = "analytics" | "marketing" | "security" | "support" | "customization" | "integration";
type FeatureStatus = "available" | "purchased" | "expired" | "inactive";
type PurchaseStatus = "pending" | "completed" | "failed" | "refunded";
type SubscriptionStatus = "active" | "cancelled" | "expired" | "trialing";

interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  category: FeatureCategory;
  icon: string;
  price: number;
  original_price: number | null;
  discount: number | null;
  billing_cycle: "one-time" | "monthly" | "yearly";
  is_popular: boolean;
  is_new: boolean;
  requirements: string[];
  benefits: string[];
  tags: string[];
}

interface PremiumPackage {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  original_price: number | null;
  discount: number | null;
  billing_cycle: "one-time" | "monthly" | "yearly";
  features: string[];
  included_feature_ids: string[];
  is_popular: boolean;
  is_recommended: boolean;
}

interface FeaturePurchase {
  id: string;
  user_id: string;
  feature_id: string;
  feature_name: string;
  package_id: string | null;
  amount: number;
  currency: string;
  status: PurchaseStatus;
  payment_method: string;
  transaction_reference: string;
  purchase_date: string;
  expires_at: string | null;
  activated_at: string | null;
  created_at: string;
  updated_at: string;
}

interface FeatureSubscription {
  id: string;
  user_id: string;
  feature_id: string;
  package_id: string | null;
  status: SubscriptionStatus;
  billing_cycle: "monthly" | "yearly";
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  payment_method: string;
  created_at: string;
  updated_at: string;
}

interface WishlistItem {
  id: string;
  user_id: string;
  feature_id: string;
  feature_name: string;
  added_at: string;
}

interface FeatureReview {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar: string | null;
  feature_id: string;
  rating: number;
  title: string;
  comment: string;
  is_recommended: boolean;
  created_at: string;
}

const CATEGORY_LABELS: Record<FeatureCategory, string> = {
  analytics: "Analytics & Insights",
  marketing: "Marketing & Growth",
  security: "Security & Compliance",
  support: "Support & Services",
  customization: "Customization",
  integration: "Integrations",
};

const CATEGORY_ICONS: Record<FeatureCategory, string> = {
  analytics: "bar-chart-3",
  marketing: "megaphone",
  security: "shield",
  support: "headphones",
  customization: "settings",
  integration: "link",
};

const CATEGORY_COLORS: Record<FeatureCategory, string> = {
  analytics: "bg-purple-100 text-purple-700",
  marketing: "bg-green-100 text-green-700",
  security: "bg-blue-100 text-blue-700",
  support: "bg-amber-100 text-amber-700",
  customization: "bg-cyan-100 text-cyan-700",
  integration: "bg-indigo-100 text-indigo-700",
};

const BILLING_CYCLE_LABELS: Record<string, string> = {
  "one-time": "One-time",
  monthly: "Monthly",
  yearly: "Yearly",
};

const STATUS_COLORS: Record<FeatureStatus, string> = {
  available: "bg-neutral-100 text-neutral-600",
  purchased: "bg-green-100 text-green-700",
  expired: "bg-gray-100 text-gray-600",
  inactive: "bg-red-100 text-red-600",
};

const STATUS_ICONS: Record<FeatureStatus, string> = {
  available: "circle",
  purchased: "check-circle",
  expired: "alert-circle",
  inactive: "x-circle",
};

const PURCHASE_STATUS_COLORS: Record<PurchaseStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  completed: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-600",
};

// Mock data for premium features
const PREMIUM_FEATURES: PremiumFeature[] = [
  {
    id: "advanced_analytics",
    name: "Advanced Analytics",
    description: "Deep insights and custom reports for your events and performance",
    category: "analytics",
    icon: "bar-chart-3",
    price: 15000,
    original_price: 20000,
    discount: 25,
    billing_cycle: "monthly",
    is_popular: true,
    is_new: false,
    requirements: ["Basic subscription"],
    benefits: [
      "Custom report builder",
      "Advanced filtering",
      "Export to CSV, Excel, PDF",
      "Scheduled reports",
      "Real-time data sync",
    ],
    tags: ["data", "reports", "insights"],
  },
  {
    id: "predictive_analytics",
    name: "Predictive Analytics",
    description: "Use AI to predict ticket sales, attendance, and revenue trends",
    category: "analytics",
    icon: "trending-up",
    price: 30000,
    original_price: null,
    discount: null,
    billing_cycle: "monthly",
    is_popular: false,
    is_new: true,
    requirements: ["Advanced Analytics"],
    benefits: [
      "Sales forecasting",
      "Attendance prediction",
      "Revenue projection",
      "Anomaly detection",
      "AI-powered insights",
    ],
    tags: ["AI", "prediction", "machine-learning"],
  },
  {
    id: "priority_support",
    name: "Priority Support",
    description: "Get faster responses and dedicated support channels",
    category: "support",
    icon: "headphones",
    price: 10000,
    original_price: null,
    discount: null,
    billing_cycle: "monthly",
    is_popular: true,
    is_new: false,
    requirements: [],
    benefits: [
      "24/7 priority support",
      "Dedicated support email",
      "1-hour response time",
      "Phone support",
      "Live chat",
    ],
    tags: ["support", "priority", "24/7"],
  },
  {
    id: "dedicated_manager",
    name: "Dedicated Account Manager",
    description: "Personal account manager for your business needs",
    category: "support",
    icon: "user",
    price: 50000,
    original_price: null,
    discount: null,
    billing_cycle: "monthly",
    is_popular: false,
    is_new: false,
    requirements: ["Priority Support"],
    benefits: [
      "Personal account manager",
      "Customized solutions",
      "Strategic advice",
      "Regular check-ins",
      "Priority feature requests",
    ],
    tags: ["manager", "dedicated", "personal"],
  },
  {
    id: "custom_branding",
    name: "Custom Branding",
    description: "Remove Guestly branding and use your own",
    category: "customization",
    icon: "palette",
    price: 25000,
    original_price: 30000,
    discount: 17,
    billing_cycle: "one-time",
    is_popular: true,
    is_new: false,
    requirements: [],
    benefits: [
      "Remove Guestly logo",
      "Custom colors",
      "Custom domain",
      "White-label solution",
      "Custom CSS",
    ],
    tags: ["branding", "white-label", "custom"],
  },
  {
    id: "api_access",
    name: "API Access",
    description: "Full access to the Guestly API for custom integrations",
    category: "integration",
    icon: "code",
    price: 20000,
    original_price: null,
    discount: null,
    billing_cycle: "monthly",
    is_popular: true,
    is_new: false,
    requirements: [],
    benefits: [
      "Full API access",
      "100,000 requests/month",
      "Webhook support",
      "API documentation",
      "Developer support",
    ],
    tags: ["API", "integration", "developer"],
  },
  {
    id: "email_marketing",
    name: "Email Marketing Pro",
    description: "Advanced email marketing tools and automation",
    category: "marketing",
    icon: "mail",
    price: 18000,
    original_price: 22000,
    discount: 18,
    billing_cycle: "monthly",
    is_popular: false,
    is_new: true,
    requirements: [],
    benefits: [
      "Email campaigns",
      "Automated workflows",
      "A/B testing",
      "Segmentation",
      "Analytics",
    ],
    tags: ["email", "marketing", "automation"],
  },
  {
    id: "social_promotion",
    name: "Social Media Promotion",
    description: "Boost your events on social media platforms",
    category: "marketing",
    icon: "share-2",
    price: 25000,
    original_price: null,
    discount: null,
    billing_cycle: "monthly",
    is_popular: false,
    is_new: false,
    requirements: [],
    benefits: [
      "Auto-posting to social media",
      "Scheduled posts",
      "Cross-platform support",
      "Hashtag suggestions",
      "Performance tracking",
    ],
    tags: ["social", "promotion", "marketing"],
  },
  {
    id: "ssl_certificate",
    name: "Custom SSL Certificate",
    description: "Add custom SSL certificate for your event pages",
    category: "security",
    icon: "lock",
    price: 15000,
    original_price: null,
    discount: null,
    billing_cycle: "yearly",
    is_popular: false,
    is_new: false,
    requirements: ["Custom Domain"],
    benefits: [
      "Custom SSL certificate",
      "HTTPS encryption",
      "Browser trust indicators",
      "SEO benefits",
      "Annual renewal",
    ],
    tags: ["SSL", "security", "HTTPS"],
  },
  {
    id: "two_factor_auth",
    name: "Two-Factor Authentication",
    description: "Add extra security to your account with 2FA",
    category: "security",
    icon: "shield-check",
    price: 5000,
    original_price: null,
    discount: null,
    billing_cycle: "one-time",
    is_popular: true,
    is_new: false,
    requirements: [],
    benefits: [
      "SMS 2FA",
      "Email 2FA",
      "Authenticator app support",
      "Backup codes",
      "Account protection",
    ],
    tags: ["2FA", "security", "authentication"],
  },
];

const PREMIUM_PACKAGES: PremiumPackage[] = [
  {
    id: "starter_bundle",
    name: "Starter Bundle",
    description: "Essential premium features for growing organizers",
    icon: "rocket",
    price: 35000,
    original_price: 50000,
    discount: 30,
    billing_cycle: "monthly",
    features: [
      "Advanced Analytics",
      "Priority Support",
      "Custom Branding",
      "API Access (Basic)",
    ],
    included_feature_ids: ["advanced_analytics", "priority_support", "custom_branding", "api_access"],
    is_popular: true,
    is_recommended: true,
  },
  {
    id: "pro_bundle",
    name: "Pro Bundle",
    description: "Complete solution for professional event organizers",
    icon: "star",
    price: 80000,
    original_price: 120000,
    discount: 33,
    billing_cycle: "monthly",
    features: [
      "Everything in Starter",
      "Predictive Analytics",
      "Dedicated Account Manager",
      "Email Marketing Pro",
      "Social Media Promotion",
    ],
    included_feature_ids: [
      "advanced_analytics", "predictive_analytics", "priority_support", 
      "dedicated_manager", "custom_branding", "email_marketing", 
      "social_promotion", "api_access"
    ],
    is_popular: false,
    is_recommended: false,
  },
  {
    id: "enterprise_bundle",
    name: "Enterprise Bundle",
    description: "All premium features for maximum flexibility",
    icon: "building",
    price: 150000,
    original_price: 200000,
    discount: 25,
    billing_cycle: "monthly",
    features: [
      "Everything in Pro",
      "Custom SSL Certificate",
      "Two-Factor Authentication",
      "Custom Integrations",
      "API Access (Enterprise)",
    ],
    included_feature_ids: [
      "advanced_analytics", "predictive_analytics", "priority_support",
      "dedicated_manager", "custom_branding", "email_marketing",
      "social_promotion", "ssl_certificate", "two_factor_auth", "api_access"
    ],
    is_popular: false,
    is_recommended: false,
  },
];

// Feature Card Component
function FeatureCard({ 
  feature,
  status,
  onPurchase,
  onAddToWishlist,
  onRemoveFromWishlist,
  inWishlist
}: { 
  feature: PremiumFeature;
  status: FeatureStatus;
  onPurchase: (feature: PremiumFeature) => void;
  onAddToWishlist: (feature: PremiumFeature) => void;
  onRemoveFromWishlist: (feature: PremiumFeature) => void;
  inWishlist: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const isDiscounted = feature.discount && feature.discount > 0;
  const hasRequirements = feature.requirements && feature.requirements.length > 0;

  return (
    <Card className={`p-6 hover:shadow-lg transition-shadow ${
      status === "purchased" ? "border-2 border-green-500 bg-green-50" : ""
    }`}>
      <div className="flex items-start gap-4 mb-4">
        <div className={`p-3 rounded-xl ${
          status === "purchased" ? "bg-green-100" : CATEGORY_COLORS[feature.category]
        }`}>
          <Icon name={feature.icon} size={24} className={status === "purchased" ? "text-green-600" : "text-white"} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-neutral-900">{feature.name}</h3>
            {feature.is_new && (
              <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                NEW
              </span>
            )}
            {feature.is_popular && (
              <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
                POPULAR
              </span>
            )}
          </div>
          <p className="text-sm text-neutral-500">{feature.description}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-neutral-900">
              {formatCurrency(feature.price)}
            </span>
            {isDiscounted && (
              <span className="text-lg font-medium text-neutral-500 line-through">
                {formatCurrency(feature.original_price || 0)}
              </span>
            )}
            {isDiscounted && (
              <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                Save {feature.discount}%
              </span>
            )}
          </div>
          <span className="text-sm text-neutral-500">
            {BILLING_CYCLE_LABELS[feature.billing_cycle]}
          </span>
        </div>

        {hasRequirements && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700 mb-1">Requirements:</p>
            <div className="flex flex-wrap gap-1">
              {feature.requirements.map((req, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full"
                >
                  {req}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {status === "purchased" ? (
            <Button variant="secondary" size="sm" className="flex-1">
              <Icon name="check-circle" size={14} />
              Purchased
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                className="flex-1"
                onClick={() => onPurchase(feature)}
              >
                {feature.billing_cycle === "one-time" ? "Purchase" : "Subscribe"}
              </Button>
              {inWishlist ? (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => onRemoveFromWishlist(feature)}
                >
                  <Icon name="heart" size={16} className="fill-current" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onAddToWishlist(feature)}
                >
                  <Icon name="heart" size={16} />
                </Button>
              )}
            </>
          )}
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-sm text-neutral-500 hover:text-neutral-700 mt-2"
        >
          <Icon name={expanded ? "chevron-up" : "chevron-down"} size={16} />
          {expanded ? "Show less" : "Show more"}
        </button>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-neutral-100 space-y-3">
            <h4 className="font-medium text-neutral-900">Benefits:</h4>
            <ul className="space-y-2">
              {feature.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <Icon name="check" size={16} className="text-green-600" />
                  {benefit}
                </li>
              ))}
            </ul>

            {feature.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-2">
                {feature.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 text-xs bg-neutral-100 text-neutral-600 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

// Package Card Component
function PackageCard({ 
  packageData,
  onPurchase
}: { 
  packageData: PremiumPackage;
  onPurchase: (packageData: PremiumPackage) => void;
}) {
  const isDiscounted = packageData.discount && packageData.discount > 0;

  return (
    <Card className={`p-6 hover:shadow-lg transition-shadow ${
      packageData.is_recommended ? "border-2 border-primary-500 bg-primary-50" : ""
    }`}>
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary-100 mb-4">
          <Icon name={packageData.icon} size={32} className="text-primary-600" />
        </div>
        
        {packageData.is_recommended && (
          <div className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full mb-2">
            RECOMMENDED
          </div>
        )}
        
        {packageData.is_popular && (
          <div className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full mb-2">
            POPULAR
          </div>
        )}
        
        <h3 className="text-xl font-bold text-neutral-900">{packageData.name}</h3>
        <p className="text-neutral-500 mt-2">{packageData.description}</p>
      </div>

      <div className="text-center mb-6">
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-4xl font-bold text-neutral-900">
            {formatCurrency(packageData.price)}
          </span>
          <span className="text-lg text-neutral-500">
            /{packageData.billing_cycle}
          </span>
        </div>
        
        {isDiscounted && (
          <div className="mt-2">
            <span className="text-xl font-medium text-neutral-500 line-through">
              {formatCurrency(packageData.original_price || 0)}
            </span>
            <span className="ml-2 px-2 py-0.5 text-sm font-medium bg-green-100 text-green-700 rounded-full">
              Save {packageData.discount}%
            </span>
          </div>
        )}
      </div>

      <ul className="space-y-3 mb-6">
        {packageData.features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm">
            <Icon name="check" size={16} className="text-green-600" />
            {feature}
          </li>
        ))}
      </ul>

      <Button onClick={() => onPurchase(packageData)} className="w-full">
        {packageData.billing_cycle === "one-time" ? "Purchase Package" : "Subscribe"}
      </Button>
    </Card>
  );
}

// Feature Search and Filter Component
function FeatureSearchAndFilter({ 
  onSearch,
  onFilter,
  categories,
  selectedCategory
}: { 
  onSearch: (query: string) => void;
  onFilter: (category: FeatureCategory | null) => void;
  categories: FeatureCategory[];
  selectedCategory: FeatureCategory | null;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  return (
    <div className="grid gap-4 lg:grid-cols-4">
      <div className="lg:col-span-3">
        <div className="relative">
          <Icon name="search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search premium features..."
            className="w-full pl-10 pr-4 p-3 border border-neutral-300 rounded-lg"
          />
        </div>
      </div>
      
      <div>
        <select
          value={selectedCategory || ""}
          onChange={(e) => onFilter(e.target.value as FeatureCategory | null)}
          className="w-full p-3 border border-neutral-300 rounded-lg"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {CATEGORY_LABELS[category]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

// Wishlist Component
function Wishlist({ 
  items,
  features,
  onPurchase,
  onRemove
}: { 
  items: WishlistItem[];
  features: PremiumFeature[];
  onPurchase: (feature: PremiumFeature) => void;
  onRemove: (item: WishlistItem) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <Icon name="heart" size={48} className="text-neutral-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-neutral-900">Empty Wishlist</h3>
        <p className="text-neutral-500 mt-2">Start adding features you like to your wishlist</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {items.map((item) => {
        const feature = features.find((f) => f.id === item.feature_id);
        if (!feature) return null;
        return (
          <Card key={item.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Icon name={feature.icon} size={24} className="text-primary-600" />
                <div>
                  <h4 className="font-semibold text-neutral-900">{feature.name}</h4>
                  <p className="text-sm text-neutral-500">{formatCurrency(feature.price)}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => onPurchase(feature)}>
                  Purchase
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => onRemove(item)}
                >
                  <Icon name="trash-2" size={14} />
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// Purchase History Component
function PurchaseHistory({ 
  purchases,
  features
}: { 
  purchases: FeaturePurchase[];
  features: PremiumFeature[];
}) {
  if (purchases.length === 0) {
    return (
      <div className="text-center py-12">
        <Icon name="shopping-bag" size={48} className="text-neutral-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-neutral-900">No Purchases Yet</h3>
        <p className="text-neutral-500 mt-2">Your purchase history will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {purchases.map((purchase) => {
        const feature = features.find((f) => f.id === purchase.feature_id);
        if (!feature) return null;
        return (
          <Card key={purchase.id} className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <Icon name={feature.icon} size={24} className="text-primary-600" />
                <div>
                  <h4 className="font-semibold text-neutral-900">{purchase.feature_name}</h4>
                  <p className="text-sm text-neutral-500">{feature.category}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-neutral-500">Amount</p>
                <p className="font-semibold text-neutral-900">{formatCurrency(purchase.amount)}</p>
              </div>
              
              <div>
                <p className="text-sm text-neutral-500">Date</p>
                <p className="font-medium text-neutral-900">{formatDate(purchase.purchase_date)}</p>
              </div>
              
              <div className="text-right">
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                  PURCHASE_STATUS_COLORS[purchase.status]
                }`}>
                  {purchase.status.toUpperCase()}
                </span>
                
                {purchase.expires_at && (
                  <p className="text-xs text-neutral-500 mt-2">
                    Expires: {formatDate(purchase.expires_at)}
                  </p>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export default function PremiumFeaturesPage() {
  const [features, setFeatures] = useState<PremiumFeature[]>(PREMIUM_FEATURES);
  const [packages, setPackages] = useState<PremiumPackage[]>(PREMIUM_PACKAGES);
  const [purchases, setPurchases] = useState<FeaturePurchase[]>([]);
  const [subscriptions, setSubscriptions] = useState<FeatureSubscription[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FeatureCategory | null>(null);
  const [activeTab, setActiveTab] = useState("catalog");
  const [showCheckout, setShowCheckout] = useState<PremiumFeature | PremiumPackage | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("wallet");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const categories = Object.keys(CATEGORY_LABELS) as FeatureCategory[];

  const tabs = [
    { id: "catalog", label: "Feature Catalog", icon: "grid" },
    { id: "packages", label: "Bundles & Packages", icon: "package" },
    { id: "purchases", label: "My Purchases", icon: "shopping-bag" },
    { id: "wishlist", label: "My Wishlist", icon: "heart" },
  ];

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch user's purchases
        const purchasesRes = await fetch("/api/premium-features/my-purchases");
        if (purchasesRes.ok) {
          const data = await purchasesRes.json();
          setPurchases(data.purchases || []);
        }

        // Fetch user's subscriptions
        const subsRes = await fetch("/api/premium-features/my-subscriptions");
        if (subsRes.ok) {
          const data = await subsRes.json();
          setSubscriptions(data.subscriptions || []);
        }

        // Fetch user's wishlist
        const wishlistRes = await fetch("/api/premium-features/my-wishlist");
        if (wishlistRes.ok) {
          const data = await wishlistRes.json();
          setWishlist(data.wishlist || []);
        }
      } catch (error) {
        console.error("Failed to fetch premium features data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Get status for each feature
  const getFeatureStatus = (featureId: string): FeatureStatus => {
    // Check if feature is in a purchased package
    const packagePurchase = purchases.find(
      (p) => p.package_id && packages.some(pkg => pkg.id === p.package_id && pkg.included_feature_ids.includes(featureId))
    );
    if (packagePurchase && packagePurchase.status === "completed") {
      return "purchased";
    }

    // Check for direct purchase
    const directPurchase = purchases.find(
      (p) => p.feature_id === featureId && p.status === "completed"
    );
    if (directPurchase) {
      return directPurchase.expires_at && new Date(directPurchase.expires_at) < new Date()
        ? "expired"
        : "purchased";
    }

    // Check for active subscription
    const activeSub = subscriptions.find(
      (s) => s.feature_id === featureId && s.status === "active"
    );
    if (activeSub) {
      return "purchased";
    }

    return "available";
  };

  // Filter and search features
  const filteredFeatures = features.filter((feature) => {
    const matchesSearch = searchQuery === "" ||
      feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.benefits.some((b) => b.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === null || feature.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Check if feature is in wishlist
  const isInWishlist = (featureId: string) => {
    return wishlist.some((item) => item.feature_id === featureId);
  };

  const handlePurchase = (item: PremiumFeature | PremiumPackage) => {
    setShowCheckout(item);
  };

  const handleAddToWishlist = async (feature: PremiumFeature) => {
    try {
      const response = await fetch("/api/premium-features/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feature_id: feature.id }),
      });
      if (response.ok) {
        setWishlist([...wishlist, {
          id: `wishlist-${Date.now()}`,
          user_id: "",
          feature_id: feature.id,
          feature_name: feature.name,
          added_at: new Date().toISOString(),
        }]);
      }
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
    }
  };

  const handleRemoveFromWishlist = async (feature: PremiumFeature) => {
    try {
      const item = wishlist.find(i => i.feature_id === feature.id);
      if (!item) return;
      const response = await fetch(`/api/premium-features/wishlist/${item.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setWishlist(wishlist.filter((i) => i.id !== item.id));
      }
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
    }
  };

  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!showCheckout) return;

    // Only wallet payments are currently supported
    if (selectedPaymentMethod !== "wallet") {
      setCheckoutError("Only wallet payments are currently supported. Please select Wallet Balance.");
      return;
    }

    try {
      setCheckoutLoading(true);
      setCheckoutError(null);

      const isPackage = "included_feature_ids" in showCheckout;
      const endpoint = isPackage 
        ? `/api/premium-features/packages/${showCheckout.id}/purchase`
        : `/api/premium-features/features/${showCheckout.id}/purchase`;
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_method: selectedPaymentMethod,
          auto_renew: isPackage ? false : (showCheckout.billing_cycle !== "one-time"),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.message || "Purchase failed");
      }

      // Refresh user's purchases
      const purchasesRes = await fetch("/api/premium-features/my-purchases");
      if (purchasesRes.ok) {
        const purchasesData = await purchasesRes.json();
        setPurchases(purchasesData.purchases || []);
      }

      // Refresh wallet balance (to show updated balance)
      // This would ideally trigger a wallet balance refresh in the parent component
      
      // Show success message
      alert("Purchase successful! Feature activated.");
      setShowCheckout(null);
      setActiveTab("purchases"); // Switch to purchases tab to see the new purchase

    } catch (error: any) {
      console.error("Failed to complete purchase:", error);
      setCheckoutError(error.message || "Purchase failed. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-neutral-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">Premium Features</h1>
        <p className="text-slate-500 mt-1">Unlock advanced capabilities for your events</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Icon name={tab.icon} size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content based on active tab */}
      {activeTab === "catalog" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-neutral-900">Feature Catalog</h2>
          
          <FeatureSearchAndFilter
            onSearch={setSearchQuery}
            onFilter={setSelectedCategory}
            categories={categories}
            selectedCategory={selectedCategory}
          />

          <div className="grid gap-4">
            {categories.map((category) => {
              const categoryFeatures = filteredFeatures.filter(
                (f) => f.category === category
              );
              if (categoryFeatures.length === 0 && selectedCategory) return null;
              
              return (
                <div key={category} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-neutral-900">
                      {CATEGORY_LABELS[category]}
                    </h3>
                    <Icon 
                      name={CATEGORY_ICONS[category]} 
                      size={20} 
                      className={`text-white p-0.5 rounded ${
                        CATEGORY_COLORS[category]
                      }`}
                    />
                  </div>
                  
                  {categoryFeatures.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {categoryFeatures.map((feature) => (
                        <FeatureCard
                          key={feature.id}
                          feature={feature}
                          status={getFeatureStatus(feature.id)}
                          onPurchase={handlePurchase}
                          onAddToWishlist={handleAddToWishlist}
                          onRemoveFromWishlist={handleRemoveFromWishlist}
                          inWishlist={isInWishlist(feature.id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-neutral-500 py-4">
                      No features found in this category
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "packages" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-neutral-900">Bundles & Packages</h2>
          <p className="text-neutral-500">Save money by bundling multiple features together</p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                packageData={pkg}
                onPurchase={handlePurchase}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === "purchases" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-neutral-900">My Purchases</h2>
            <Button onClick={() => setActiveTab("catalog")}>
              <Icon name="plus" size={16} />
              Browse Features
            </Button>
          </div>

          <PurchaseHistory purchases={purchases} features={features} />
        </div>
      )}

      {activeTab === "wishlist" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-neutral-900">My Wishlist</h2>
            <Button onClick={() => setActiveTab("catalog")}>
              <Icon name="plus" size={16} />
              Browse Features
            </Button>
          </div>

          <Wishlist
            items={wishlist}
            features={features}
            onPurchase={handlePurchase}
            onRemove={(item) => {
              const feature = features.find(f => f.id === item.feature_id);
              if (feature) handleRemoveFromWishlist(feature);
            }}
          />
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-neutral-900">
                Checkout
              </h2>
              <button
                onClick={() => setShowCheckout(null)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <Icon name="x" size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {checkoutError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 text-red-700">
                  <Icon name="alert-circle" size={20} className="flex-shrink-0" />
                  <span className="text-sm">{checkoutError}</span>
                </div>
              )}
              
              <Card className="p-4">
                <div className="flex items-center gap-4">
                  <Icon 
                    name={"included_feature_ids" in showCheckout ? "package" : showCheckout.icon} 
                    size={48} 
                    className="text-primary-600"
                  />
                  <div>
                    <h3 className="font-semibold text-neutral-900">
                      {"included_feature_ids" in showCheckout ? showCheckout.name : showCheckout.name}
                    </h3>
                    <p className="text-sm text-neutral-500">
                      {"included_feature_ids" in showCheckout 
                        ? showCheckout.description
                        : showCheckout.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between mt-4 pt-4 border-t border-neutral-100">
                  <span className="text-sm text-neutral-500">Amount</span>
                  <span className="text-xl font-bold text-neutral-900">
                    {formatCurrency("price" in showCheckout ? showCheckout.price : 0)}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm text-neutral-500 mt-1">
                  <span>Billing Cycle</span>
                  <span>
                    {"billing_cycle" in showCheckout 
                      ? BILLING_CYCLE_LABELS[showCheckout.billing_cycle]
                      : ""}
                  </span>
                </div>
              </Card>

              <div>
                <h4 className="font-semibold text-neutral-900 mb-3">Payment Method</h4>
                <div className="grid gap-2">
                  <button
                    onClick={() => setSelectedPaymentMethod("wallet")}
                    className={`w-full p-4 text-left border-2 rounded-lg transition-colors ${
                      selectedPaymentMethod === "wallet"
                        ? "border-primary-500 bg-primary-50"
                        : "border-neutral-300 hover:border-neutral-400 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon name="credit-card" size={20} className={selectedPaymentMethod === "wallet" ? "text-primary-600" : "text-neutral-400"} />
                      <div>
                        <h4 className="font-medium text-neutral-900">Wallet Balance</h4>
                        <p className="text-sm text-neutral-500">Pay from your Guestly wallet</p>
                      </div>
                      {selectedPaymentMethod === "wallet" && (
                        <div className="ml-auto w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center">
                          <Icon name="check" size={14} className="text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setSelectedPaymentMethod("card")}
                    className={`w-full p-4 text-left border-2 rounded-lg transition-colors ${
                      selectedPaymentMethod === "card"
                        ? "border-primary-500 bg-primary-50"
                        : "border-neutral-300 hover:border-neutral-400 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon name="credit-card" size={20} className={selectedPaymentMethod === "card" ? "text-primary-600" : "text-neutral-400"} />
                      <div>
                        <h4 className="font-medium text-neutral-900">Credit/Debit Card</h4>
                        <p className="text-sm text-neutral-500">Visa, Mastercard, Verve</p>
                      </div>
                      {selectedPaymentMethod === "card" && (
                        <div className="ml-auto w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center">
                          <Icon name="check" size={14} className="text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setSelectedPaymentMethod("bank_transfer")}
                    className={`w-full p-4 text-left border-2 rounded-lg transition-colors ${
                      selectedPaymentMethod === "bank_transfer"
                        ? "border-primary-500 bg-primary-50"
                        : "border-neutral-300 hover:border-neutral-400 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon name="bank" size={20} className={selectedPaymentMethod === "bank_transfer" ? "text-primary-600" : "text-neutral-400"} />
                      <div>
                        <h4 className="font-medium text-neutral-900">Bank Transfer</h4>
                        <p className="text-sm text-neutral-500">Direct bank payment</p>
                      </div>
                      {selectedPaymentMethod === "bank_transfer" && (
                        <div className="ml-auto w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center">
                          <Icon name="check" size={14} className="text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              </div>

              {selectedPaymentMethod === "card" && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-700">
                  <Icon name="alert-triangle" size={16} className="inline mr-2" />
                  Card payment processing will be available soon. Currently, only wallet payments are fully integrated.
                </div>
              )}

              {selectedPaymentMethod === "bank_transfer" && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-700">
                  <Icon name="alert-triangle" size={16} className="inline mr-2" />
                  Bank transfer processing will be available soon. Currently, only wallet payments are fully integrated.
                </div>
              )}

              <div className="flex gap-4 justify-end pt-4">
                <Button variant="secondary" onClick={() => setShowCheckout(null)} disabled={checkoutLoading}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCheckout} 
                  loading={checkoutLoading}
                  disabled={checkoutLoading}
                >
                  <Icon name="dollar-sign" size={16} />
                  {checkoutLoading ? "Processing..." : "Complete Purchase"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
