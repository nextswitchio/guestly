"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { formatDate, formatCurrency } from '@/lib/utils';

// Types for API Access
type ApiKeyStatus = "active" | "inactive" | "suspended" | "revoked" | "expired";
type ApiKeyType = "sandbox" | "production";
type RateLimitType = "requests_per_minute" | "requests_per_hour" | "requests_per_day";

interface ApiKey {
  id: string;
  user_id: string;
  application_id: string;
  name: string;
  key: string;
  secret: string;
  type: ApiKeyType;
  status: ApiKeyStatus;
  rate_limits: ApiRateLimit[];
  permissions: string[];
  ip_whitelist: string[];
  referrer_whitelist: string[];
  last_used_at: string | null;
  usage_count: number;
  usage_limit: number | null;
  created_at: string;
  updated_at: string;
  expires_at: string | null;
}

interface ApiApplication {
  id: string;
  user_id: string;
  name: string;
  description: string;
  website_url: string | null;
  callback_url: string | null;
  logo_url: string | null;
  status: "active" | "inactive" | "suspended";
  is_approved: boolean;
  approval_notes: string | null;
  created_at: string;
  updated_at: string;
  api_keys: ApiKey[];
}

interface ApiRateLimit {
  id: string;
  api_key_id: string;
  limit_type: RateLimitType;
  max_requests: number;
  current_requests: number;
  window_start: string;
  window_end: string;
  last_reset: string;
}

interface ApiUsage {
  label: string;
  requests: number;
  date: string;
  endpoints: string[];
}

interface ApiDocumentation {
  id: string;
  title: string;
  description: string;
  version: string;
  base_url: string;
  authentication: string;
  endpoints: ApiEndpoint[];
}

interface ApiEndpoint {
  id: string;
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  description: string;
  parameters: ApiParameter[];
  response: string;
  example: string;
  requires_auth: boolean;
  rate_limited: boolean;
}

interface ApiParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  default_value: string | null;
}

interface ApiSubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billing_cycle: "monthly" | "yearly";
  features: string[];
  rate_limits: Record<string, number>;
  is_active: boolean;
}

interface BillingInfo {
  current_plan: ApiSubscriptionPlan | null;
  subscription_id: string | null;
  subscription_status: "active" | "cancelled" | "expired" | "trialing";
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  payment_method: string | null;
  invoice_count: number;
  total_billed: number;
}

const API_KEY_STATUS_COLORS: Record<ApiKeyStatus, string> = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-neutral-100 text-neutral-600",
  suspended: "bg-amber-100 text-amber-700",
  revoked: "bg-red-100 text-red-700",
  expired: "bg-gray-100 text-gray-600",
};

const API_KEY_STATUS_ICONS: Record<ApiKeyStatus, string> = {
  active: "check-circle",
  inactive: "pause-circle",
  suspended: "alert-triangle",
  revoked: "x-circle",
  expired: "clock",
};

const API_KEY_TYPE_LABELS: Record<ApiKeyType, string> = {
  sandbox: "Sandbox",
  production: "Production",
};

const API_KEY_TYPE_COLORS: Record<ApiKeyType, string> = {
  sandbox: "bg-orange-100 text-orange-700",
  production: "bg-green-100 text-green-700",
};

const RATE_LIMIT_TYPES: Record<RateLimitType, string> = {
  requests_per_minute: "Requests/Minute",
  requests_per_hour: "Requests/Hour",
  requests_per_day: "Requests/Day",
};

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-green-100 text-green-700",
  POST: "bg-blue-100 text-blue-700",
  PUT: "bg-amber-100 text-amber-700",
  DELETE: "bg-red-100 text-red-700",
  PATCH: "bg-purple-100 text-purple-700",
};

// Mock data for documentation
const API_DOCUMENTATION: ApiDocumentation = {
  id: "main",
  title: "Guestly API",
  description: "Complete RESTful API for integrating with Guestly platform",
  version: "v1.0.0",
  base_url: "https://api.guestly.com/v1",
  authentication: "Bearer Token",
  endpoints: [
    {
      id: "get_events",
      path: "/events",
      method: "GET",
      description: "List all events with optional filters",
      parameters: [
        { name: "page", type: "integer", required: false, description: "Page number", default_value: "1" },
        { name: "limit", type: "integer", required: false, description: "Items per page", default_value: "20" },
        { name: "category", type: "string", required: false, description: "Filter by category slug", default_value: null },
        { name: "location", type: "string", required: false, description: "Filter by city or country", default_value: null },
        { name: "status", type: "string", required: false, description: "Filter by event status", default_value: null },
      ],
      response: "Array of event objects",
      example: 'GET /events?category=music&location=lagos',
      requires_auth: true,
      rate_limited: true,
    },
    {
      id: "create_event",
      path: "/events",
      method: "POST",
      description: "Create a new event",
      parameters: [
        { name: "title", type: "string", required: true, description: "Event title", default_value: null },
        { name: "description", type: "string", required: true, description: "Event description", default_value: null },
        { name: "category_id", type: "string", required: true, description: "Category UUID", default_value: null },
        { name: "start_date", type: "string", required: true, description: "Event start date (ISO 8601)", default_value: null },
        { name: "end_date", type: "string", required: false, description: "Event end date (ISO 8601)", default_value: null },
      ],
      response: "Created event object",
      example: 'POST /events { "title": "My Event", ... }',
      requires_auth: true,
      rate_limited: true,
    },
    {
      id: "get_event",
      path: "/events/{id}",
      method: "GET",
      description: "Get details of a specific event",
      parameters: [
        { name: "id", type: "string", required: true, description: "Event UUID", default_value: null },
      ],
      response: "Event object with full details",
      example: "GET /events/123e4567-e89b-12d3-a456-426614174000",
      requires_auth: false,
      rate_limited: true,
    },
    {
      id: "create_order",
      path: "/orders",
      method: "POST",
      description: "Create a new order for event tickets",
      parameters: [
        { name: "event_id", type: "string", required: true, description: "Event UUID", default_value: null },
        { name: "ticket_type_id", type: "string", required: true, description: "Ticket type UUID", default_value: null },
        { name: "quantity", type: "integer", required: true, description: "Number of tickets", default_value: null },
        { name: "payment_method", type: "string", required: true, description: "Payment method", default_value: null },
      ],
      response: "Created order object",
      example: 'POST /orders { "event_id": "...", "ticket_type_id": "...", "quantity": 2 }',
      requires_auth: true,
      rate_limited: true,
    },
    {
      id: "get_user",
      path: "/users/me",
      method: "GET",
      description: "Get current user profile",
      parameters: [],
      response: "User profile object",
      example: "GET /users/me",
      requires_auth: true,
      rate_limited: false,
    },
  ],
};

const SUBSCRIPTION_PLANS: ApiSubscriptionPlan[] = [
  {
    id: "free",
    name: "Free Tier",
    description: "Perfect for testing and development",
    price: 0,
    billing_cycle: "monthly",
    features: [
      "1,000 requests/day",
      "Sandbox environment",
      "Basic endpoints",
      "Email support",
    ],
    rate_limits: {
      requests_per_minute: 30,
      requests_per_hour: 500,
      requests_per_day: 1000,
    },
    is_active: true,
  },
  {
    id: "basic",
    name: "Basic Plan",
    description: "For small-scale production use",
    price: 10000,
    billing_cycle: "monthly",
    features: [
      "10,000 requests/day",
      "Production environment",
      "All endpoints",
      "Priority email support",
      "API analytics",
    ],
    rate_limits: {
      requests_per_minute: 100,
      requests_per_hour: 2000,
      requests_per_day: 10000,
    },
    is_active: true,
  },
  {
    id: "professional",
    name: "Professional Plan",
    description: "For growing businesses",
    price: 50000,
    billing_cycle: "monthly",
    features: [
      "100,000 requests/day",
      "Production environment",
      "All endpoints",
      "Priority support",
      "Dedicated IP whitelisting",
      "Webhook support",
      "Advanced analytics",
    ],
    rate_limits: {
      requests_per_minute: 500,
      requests_per_hour: 10000,
      requests_per_day: 100000,
    },
    is_active: true,
  },
  {
    id: "enterprise",
    name: "Enterprise Plan",
    description: "For large-scale applications",
    price: 200000,
    billing_cycle: "monthly",
    features: [
      "1,000,000 requests/day",
      "Production environment",
      "All endpoints",
      "24/7 priority support",
      "Multiple IP whitelisting",
      "Custom rate limits",
      "Dedicated account manager",
      "SLA guarantees",
    ],
    rate_limits: {
      requests_per_minute: 2000,
      requests_per_hour: 50000,
      requests_per_day: 1000000,
    },
    is_active: true,
  },
];

// API Key Generator Component
function ApiKeyGenerator({ onGenerate }: { onGenerate: (name: string, type: ApiKeyType) => void }) {
  const [name, setName] = useState("");
  const [type, setType] = useState<ApiKeyType>("sandbox");
  const [permissions, setPermissions] = useState<string[]>(["read:events", "read:orders"]);
  const [ipWhitelist, setIpWhitelist] = useState<string>("");
  const [referrerWhitelist, setReferrerWhitelist] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(name, type);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-neutral-900">Create API Key</h3>
        <p className="text-neutral-500">Generate a new API key for your application</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Key Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-neutral-300 rounded-lg"
            placeholder="My Application Key"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Environment *
          </label>
          <div className="flex gap-2">
            {Object.entries(API_KEY_TYPE_LABELS).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setType(key as ApiKeyType)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  type === key
                    ? "bg-primary-500 text-white border border-primary-500"
                    : "bg-white text-neutral-700 border border-neutral-300 hover:border-neutral-400"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            IP Whitelist (Optional)
          </label>
          <input
            type="text"
            value={ipWhitelist}
            onChange={(e) => setIpWhitelist(e.target.value)}
            className="w-full p-3 border border-neutral-300 rounded-lg"
            placeholder="192.168.1.1, 10.0.0.1 (comma separated)"
          />
          <p className="text-xs text-neutral-500 mt-1">
            Leave empty to allow all IPs. Enter comma-separated IP addresses.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Referrer Whitelist (Optional)
          </label>
          <input
            type="text"
            value={referrerWhitelist}
            onChange={(e) => setReferrerWhitelist(e.target.value)}
            className="w-full p-3 border border-neutral-300 rounded-lg"
            placeholder="https://myapp.com, https://api.myapp.com"
          />
          <p className="text-xs text-neutral-500 mt-1">
            Leave empty to allow all referrers. Enter comma-separated URLs.
          </p>
        </div>
      </div>

      <div className="flex gap-4 justify-end">
        <Button type="button" variant="secondary" onClick={() => {}}>
          Cancel
        </Button>
        <Button type="submit">
          <Icon name="key" size={16} />
          Generate API Key
        </Button>
      </div>
    </form>
  );
}

// API Key Card Component
function ApiKeyCard({ 
  keyData,
  application,
  onRevoke,
  onRegenerate,
  onToggleStatus
}: { 
  keyData: ApiKey;
  application: ApiApplication;
  onRevoke: (key: ApiKey) => void;
  onRegenerate: (key: ApiKey) => void;
  onToggleStatus: (key: ApiKey) => void;
}) {
  const [showKey, setShowKey] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const lastUsed = keyData.last_used_at ? formatDate(keyData.last_used_at) : "Never";
  const isActive = keyData.status === "active";
  const isSandbox = keyData.type === "sandbox";
  const progress = keyData.usage_limit
    ? Math.min((keyData.usage_count / keyData.usage_limit) * 100, 100)
    : 0;

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-neutral-900">{keyData.name}</h3>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
              API_KEY_STATUS_COLORS[keyData.status]
            }`}>
              {keyData.status.toUpperCase()}
            </span>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
              API_KEY_TYPE_COLORS[keyData.type]
            }`}>
              {API_KEY_TYPE_LABELS[keyData.type]}
            </span>
          </div>
          <p className="text-sm text-neutral-500">{application.name}</p>
        </div>
        <Icon name={API_KEY_STATUS_ICONS[keyData.status]} size={20} className="text-neutral-400" />
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-neutral-400">Created</p>
            <p className="font-medium text-neutral-900">{formatDate(keyData.created_at)}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-400">Last Used</p>
            <p className="font-medium text-neutral-900">{lastUsed}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-400">Requests Today</p>
            <p className="font-medium text-neutral-900">
              {keyData.rate_limits.reduce(
                (sum, limit) => sum + limit.current_requests,
                0
              )}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-400">Total Requests</p>
            <p className="font-medium text-neutral-900">{keyData.usage_count.toLocaleString()}</p>
          </div>
        </div>

        {/* Rate Limits Progress */}
        {keyData.usage_limit && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-neutral-500">Usage Limit</span>
              <span className="font-semibold text-neutral-900">
                {keyData.usage_count.toLocaleString()} / {keyData.usage_limit.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div
                className={`bg-${isSandbox ? 'orange' : 'primary'}-500 h-2 rounded-full`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Rate Limits */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-4 border-t border-neutral-100">
          {keyData.rate_limits.map((limit) => {
            const usagePercentage = (limit.current_requests / limit.max_requests) * 100;
            return (
              <div key={limit.id} className="p-3 bg-neutral-50 rounded-lg">
                <p className="text-xs text-neutral-500 mb-1">{RATE_LIMIT_TYPES[limit.limit_type]}</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-neutral-900">
                    {limit.current_requests.toLocaleString()}
                  </span>
                  <span className="text-xs text-neutral-500">/ {limit.max_requests.toLocaleString()}</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-1 mt-2">
                  <div
                    className="bg-primary-500 h-1 rounded-full"
                    style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* API Key and Secret */}
        <div className="space-y-3 pt-4 border-t border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-xs text-neutral-400 mb-0.5">API Key</p>
              <div className="flex items-center gap-2">
                <code className="text-sm font-mono bg-neutral-100 px-2 py-1 rounded">
                  {showKey ? keyData.key : "*".repeat(keyData.key.length)}
                </code>
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="p-1 text-neutral-500 hover:text-neutral-700"
                >
                  <Icon name={showKey ? "eye-off" : "eye"} size={14} />
                </button>
              </div>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(keyData.key);
              }}
              className="p-2 text-neutral-500 hover:text-primary-600"
              title="Copy to clipboard"
            >
              <Icon name="clipboard" size={16} />
            </button>
          </div>

          {keyData.secret && (
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-xs text-neutral-400 mb-0.5">API Secret</p>
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono bg-neutral-100 px-2 py-1 rounded">
                    {showSecret ? keyData.secret : "*".repeat(keyData.secret.length)}
                  </code>
                  <button
                    onClick={() => setShowSecret(!showSecret)}
                    className="p-1 text-neutral-500 hover:text-neutral-700"
                  >
                    <Icon name={showSecret ? "eye-off" : "eye"} size={14} />
                  </button>
                </div>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(keyData.secret);
                }}
                className="p-2 text-neutral-500 hover:text-primary-600"
                title="Copy to clipboard"
              >
                <Icon name="clipboard" size={16} />
              </button>
            </div>
          )}
        </div>

        <div className="p-3 bg-amber-50 rounded-lg mt-4 text-sm text-amber-700">
          <Icon name="alert-triangle" size={16} className="mr-2" />
          Keep your API key and secret secure. Do not share them publicly.
        </div>
      </div>

      <div className="flex gap-2 mt-4 pt-4 border-t border-neutral-100">
        {isActive ? (
          <Button size="sm" variant="amber" onClick={() => onToggleStatus(keyData)}>
            <Icon name="pause" size={14} /> Deactivate
          </Button>
        ) : (
          <Button size="sm" onClick={() => onToggleStatus(keyData)}>
            <Icon name="play" size={14} /> Activate
          </Button>
        )}
        <Button size="sm" onClick={() => onRegenerate(keyData)}>
          <Icon name="refresh-cw" size={14} /> Regenerate
        </Button>
        <Button size="sm" variant="danger" onClick={() => onRevoke(keyData)}>
          <Icon name="trash-2" size={14} /> Revoke
        </Button>
      </div>
    </Card>
  );
}

// Application Form Component
function ApplicationForm({ 
  onSubmit,
  onCancel,
  initialData = null
}: { 
  onSubmit: (data: Partial<ApiApplication>) => void;
  onCancel: () => void;
  initialData?: Partial<ApiApplication> | null;
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website_url: "",
    callback_url: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        website_url: initialData.website_url || "",
        callback_url: initialData.callback_url || "",
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-neutral-900">
          {initialData ? "Edit Application" : "Create New Application"}
        </h3>
        <p className="text-neutral-500">
          {initialData
            ? "Update your application details"
            : "Register a new application to use the Guestly API"}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Application Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3 border border-neutral-300 rounded-lg"
            placeholder="My Awesome App"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-3 border border-neutral-300 rounded-lg h-32 resize-none"
            placeholder="Describe what your application does and how it uses the Guestly API..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Website URL
          </label>
          <input
            type="url"
            value={formData.website_url}
            onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
            className="w-full p-3 border border-neutral-300 rounded-lg"
            placeholder="https://myapp.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Callback URL (for webhooks)
          </label>
          <input
            type="url"
            value={formData.callback_url}
            onChange={(e) => setFormData({ ...formData, callback_url: e.target.value })}
            className="w-full p-3 border border-neutral-300 rounded-lg"
            placeholder="https://myapp.com/api/webhooks"
          />
        </div>
      </div>

      <div className="flex gap-4 justify-end">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? "Save Changes" : "Create Application"}
        </Button>
      </div>
    </form>
  );
}

// API Documentation Viewer Component
function ApiDocumentationViewer({ 
  documentation,
  onClose
}: { 
  documentation: ApiDocumentation;
  onClose: () => void;
}) {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">{documentation.title}</h2>
            <p className="text-neutral-500">v{documentation.version}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <Icon name="x" size={24} />
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Endpoints</h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {documentation.endpoints.map((endpoint) => {
                const MethodBadge = () => (
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      METHOD_COLORS[endpoint.method]
                    }`}
                  >
                    {endpoint.method}
                  </span>
                );
                return (
                  <button
                    key={endpoint.id}
                    onClick={() => setSelectedEndpoint(endpoint)}
                    className={`w-full p-3 text-left rounded-lg transition-colors ${
                      selectedEndpoint?.id === endpoint.id
                        ? "bg-primary-50 border border-primary-500"
                        : "border border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <MethodBadge />
                        <span className="font-medium text-neutral-900">{endpoint.path}</span>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-500 truncate">{endpoint.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedEndpoint ? (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        METHOD_COLORS[selectedEndpoint.method]
                      }`}
                    >
                      {selectedEndpoint.method}
                    </span>
                    <h3 className="text-xl font-semibold text-neutral-900">{selectedEndpoint.path}</h3>
                  </div>
                  <p className="text-neutral-500">{selectedEndpoint.description}</p>
                </div>

                <div className="p-4 bg-neutral-50 rounded-xl">
                  <h4 className="font-semibold text-neutral-900 mb-3">Example Request</h4>
                  <code className="block text-sm font-mono bg-white p-3 rounded border border-neutral-200">
                    {selectedEndpoint.example}
                  </code>
                </div>

                {selectedEndpoint.parameters.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-3">Parameters</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-neutral-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-neutral-600">
                              Name
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-neutral-600">
                              Type
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-neutral-600">
                              Required
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-neutral-600">
                              Description
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedEndpoint.parameters.map((param) => (
                            <tr key={param.name} className="border-t border-neutral-100">
                              <td className="px-4 py-2">
                                <code className="font-mono text-sm">{param.name}</code>
                              </td>
                              <td className="px-4 py-2 text-sm text-neutral-600">
                                {param.type}
                              </td>
                              <td className="px-4 py-2">
                                {param.required ? (
                                  <span className="text-green-600">Yes</span>
                                ) : (
                                  <span className="text-neutral-500">No</span>
                                )}
                              </td>
                              <td className="px-4 py-2 text-sm text-neutral-600">
                                {param.description}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="p-4 bg-neutral-50 rounded-xl">
                  <h4 className="font-semibold text-neutral-900 mb-2">Response</h4>
                  <p className="text-sm text-neutral-600">{selectedEndpoint.response}</p>
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    {selectedEndpoint.requires_auth && (
                      <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                        Requires Auth
                      </span>
                    )}
                    {selectedEndpoint.rate_limited && (
                      <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full">
                        Rate Limited
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Icon name="book-open" size={48} className="text-neutral-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900">
                  Select an endpoint to view details
                </h3>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

// Billing Section Component
function BillingSection({ 
  billingInfo,
  plans,
  onSubscribe,
  onCancelSubscription
}: { 
  billingInfo: BillingInfo;
  plans: ApiSubscriptionPlan[];
  onSubscribe: (plan: ApiSubscriptionPlan) => void;
  onCancelSubscription: () => void;
}) {
  const [showPlanSelection, setShowPlanSelection] = useState(false);

  const isPaidPlan = billingInfo.current_plan?.id !== "free";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-neutral-900">Billing</h2>
        {!billingInfo.current_plan && (
          <Button onClick={() => setShowPlanSelection(true)}>
            <Icon name="plus" size={16} />
            Subscribe
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {/* Current Plan */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Current Plan</h3>
          {billingInfo.current_plan ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-neutral-900">{billingInfo.current_plan.name}</h4>
                <p className="text-sm text-neutral-500">{billingInfo.current_plan.description}</p>
                <div className="mt-3">
                  <span className="text-2xl font-bold text-neutral-900">
                    {formatCurrency(billingInfo.current_plan.price)}
                  </span>
                  <span className="text-sm text-neutral-500">
                    /{billingInfo.current_plan.billing_cycle}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm">
                  <span className="text-neutral-500">Status:</span>{' '}
                  <span className={`font-medium ${
                    billingInfo.subscription_status === "active" ? "text-green-600" :
                    billingInfo.subscription_status === "cancelled" ? "text-red-600" :
                    "text-neutral-600"
                  }`}>
                    {billingInfo.subscription_status}
                  </span>
                </p>
                {billingInfo.current_period_start && billingInfo.current_period_end && (
                  <p className="text-sm text-neutral-500 mt-1">
                    {formatDate(billingInfo.current_period_start)} -{' '}
                    {formatDate(billingInfo.current_period_end)}
                  </p>
                )}
                {isPaidPlan && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={onCancelSubscription}
                    className="mt-3"
                  >
                    Cancel Subscription
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <p className="text-neutral-500">No active subscription</p>
          )}
        </Card>

        {/* Usage */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-4">
            <div className="flex justify-between">
              <span className="text-sm text-neutral-500">Total Requests</span>
              <span className="font-semibold text-neutral-900">{billingInfo.total_billed.toLocaleString()}</span>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex justify-between">
              <span className="text-sm text-neutral-500">Invoices</span>
              <span className="font-semibold text-neutral-900">{billingInfo.invoice_count}</span>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex justify-between">
              <span className="text-sm text-neutral-500">Total Billed</span>
              <span className="font-semibold text-neutral-900">
                {formatCurrency(billingInfo.total_billed)}
              </span>
            </div>
          </Card>
        </div>
      </div>

      {/* Plan Selection Modal */}
      {showPlanSelection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-neutral-900">Select a Plan</h2>
              <button
                onClick={() => setShowPlanSelection(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <Icon name="x" size={24} />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                    billingInfo.current_plan?.id === plan.id
                      ? "border-2 border-primary-500 bg-primary-50"
                      : "border border-neutral-200"
                  }`}
                  onClick={() => onSubscribe(plan)}
                >
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">{plan.name}</h3>
                  <p className="text-sm text-neutral-500 mb-4">{plan.description}</p>
                  
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold text-neutral-900">
                      {formatCurrency(plan.price)}
                    </span>
                    <span className="text-sm text-neutral-500">
                      /{plan.billing_cycle}
                    </span>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Icon name="check" size={16} className="text-green-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSubscribe(plan);
                    }}
                    className={`w-full py-2 rounded-lg font-medium transition-colors ${
                      billingInfo.current_plan?.id === plan.id
                        ? "bg-white text-primary-600 border border-primary-600"
                        : "bg-primary-600 text-white"
                    }`}
                  >
                    {billingInfo.current_plan?.id === plan.id ? "Current Plan" : "Select Plan"}
                  </button>
                </Card>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <Button variant="secondary" onClick={() => setShowPlanSelection(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DeveloperDashboardPage() {
  const [applications, setApplications] = useState<ApiApplication[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<ApiApplication | null>(null);
  const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateApp, setShowCreateApp] = useState(false);
  const [showCreateKey, setShowCreateKey] = useState(false);
  const [showDocumentation, setShowDocumentation] = useState(false);
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    current_plan: null,
    subscription_id: null,
    subscription_status: "active",
    current_period_start: null,
    current_period_end: null,
    cancel_at_period_end: false,
    payment_method: null,
    invoice_count: 0,
    total_billed: 0,
  });
  const [usage, setUsage] = useState<ApiUsage[]>([]);
  const [activeTab, setActiveTab] = useState("applications");

  const tabs = [
    { id: "applications", label: "My Applications", icon: "layers" },
    { id: "analytics", label: "Analytics", icon: "bar-chart-3" },
    { id: "documentation", label: "Documentation", icon: "book-open" },
    { id: "billing", label: "Billing", icon: "credit-card" },
  ];

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch applications
        const appsRes = await fetch("/api/api-access/applications");
        if (appsRes.ok) {
          const data = await appsRes.json();
          setApplications(data.applications || []);
        }

        // Fetch billing info
        const billingRes = await fetch("/api/api-access/billing");
        if (billingRes.ok) {
          const data = await billingRes.json();
          setBillingInfo(data);
        }

        // Fetch usage
        const usageRes = await fetch("/api/api-access/usage");
        if (usageRes.ok) {
          const data = await usageRes.json();
          setUsage(data.usage || []);
        }
      } catch (error) {
        console.error("Failed to fetch developer data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleCreateApplication = async (data: Partial<ApiApplication>) => {
    try {
      const response = await fetch("/api/api-access/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setShowCreateApp(false);
        // Refresh applications
      }
    } catch (error) {
      console.error("Failed to create application:", error);
    }
  };

  const handleUpdateApplication = async (application: ApiApplication, data: Partial<ApiApplication>) => {
    try {
      const response = await fetch(`/api/api-access/applications/${application.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setSelectedApplication(null);
        setShowCreateApp(false);
        // Refresh applications
      }
    } catch (error) {
      console.error("Failed to update application:", error);
    }
  };

  const handleDeleteApplication = async (application: ApiApplication) => {
    if (!confirm(`Are you sure you want to delete "${application.name}"?`)) return;
    try {
      const response = await fetch(`/api/api-access/applications/${application.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        // Refresh applications
      }
    } catch (error) {
      console.error("Failed to delete application:", error);
    }
  };

  const handleGenerateKey = async (name: string, type: ApiKeyType) => {
    try {
      const response = await fetch("/api/api-access/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          application_id: selectedApplication?.id,
          name,
          type,
        }),
      });
      if (response.ok) {
        setShowCreateKey(false);
        // Refresh applications to get the new key
      }
    } catch (error) {
      console.error("Failed to generate API key:", error);
    }
  };

  const handleRevokeKey = async (key: ApiKey) => {
    if (!confirm(`Are you sure you want to revoke this API key? This action cannot be undone.`)) return;
    try {
      const response = await fetch(`/api/api-access/keys/${key.id}/revoke`, {
        method: "POST",
      });
      if (response.ok) {
        // Refresh applications
      }
    } catch (error) {
      console.error("Failed to revoke API key:", error);
    }
  };

  const handleToggleKeyStatus = async (key: ApiKey) => {
    try {
      const response = await fetch(`/api/api-access/keys/${key.id}/toggle`, {
        method: "POST",
      });
      if (response.ok) {
        // Refresh applications
      }
    } catch (error) {
      console.error("Failed to toggle API key status:", error);
    }
  };

  const handleRegenerateKey = async (key: ApiKey) => {
    if (!confirm(`Are you sure you want to regenerate this API key? The old key will be immediately revoked.`)) return;
    try {
      const response = await fetch(`/api/api-access/keys/${key.id}/regenerate`, {
        method: "POST",
      });
      if (response.ok) {
        // Refresh applications
      }
    } catch (error) {
      console.error("Failed to regenerate API key:", error);
    }
  };

  const handleSubscribe = async (plan: ApiSubscriptionPlan) => {
    try {
      const response = await fetch("/api/api-access/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan_id: plan.id }),
      });
      if (response.ok) {
        // Refresh billing info
      }
    } catch (error) {
      console.error("Failed to subscribe:", error);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your subscription? You will be downgraded to the free plan at the end of your current billing period.")) return;
    try {
      const response = await fetch("/api/api-access/subscribe/cancel", {
        method: "POST",
      });
      if (response.ok) {
        // Refresh billing info
      }
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
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
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">Developer Portal</h1>
        <p className="text-slate-500 mt-1">Manage your API applications and keys</p>
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

      {/* Applications Tab */}
      {activeTab === "applications" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-neutral-900">My Applications</h2>
            <Button onClick={() => setShowCreateApp(true)}>
              <Icon name="plus" size={16} />
              Create Application
            </Button>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="code" size={48} className="text-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-900">No Applications Yet</h3>
              <p className="text-neutral-500 mt-2">Create your first application to start using the API</p>
              <Button onClick={() => setShowCreateApp(true)} className="mt-6">
                <Icon name="plus" size={16} />
                Create First Application
              </Button>
            </div>
          ) : (
            <div className="grid gap-6">
              {applications.map((app) => (
                <div key={app.id} className="space-y-4">
                  <Card className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-neutral-900 mb-2">{app.name}</h3>
                        <p className="text-neutral-500 mb-4">{app.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-neutral-400">Status</p>
                            <p className={`font-medium ${
                              app.status === "active" ? "text-green-600" :
                              app.status === "suspended" ? "text-amber-600" :
                              "text-neutral-600"
                            }`}>
                              {app.status.toUpperCase()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-neutral-400">Created</p>
                            <p className="font-medium text-neutral-900">{formatDate(app.created_at)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-neutral-400">API Keys</p>
                            <p className="font-medium text-neutral-900">{app.api_keys.length}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setSelectedApplication(app);
                            setActiveTab("analytics");
                          }}
                        >
                          <Icon name="bar-chart-3" size={14} /> View Analytics
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedApplication(app);
                            setShowCreateApp(true);
                          }}
                        >
                          <Icon name="edit-3" size={14} /> Edit
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedApplication(app);
                            setShowCreateKey(true);
                          }}
                        >
                          <Icon name="plus" size={14} /> Create Key
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDeleteApplication(app)}
                        >
                          <Icon name="trash-2" size={14} /> Delete
                        </Button>
                      </div>
                    </div>
                  </Card>

                  {/* API Keys for this application */}
                  {selectedApplication?.id === app.id && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {app.api_keys.map((key) => (
                        <ApiKeyCard
                          key={key.id}
                          keyData={key}
                          application={app}
                          onRevoke={handleRevokeKey}
                          onRegenerate={handleRegenerateKey}
                          onToggleStatus={handleToggleKeyStatus}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-neutral-900">API Analytics</h2>
            {selectedApplication && (
              <Button variant="secondary" onClick={() => setSelectedApplication(null)}>
                <Icon name="arrow-left" size={16} />
                Back to Applications
              </Button>
            )}
          </div>

          {selectedApplication ? (
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Application: {selectedApplication.name}</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-neutral-50 rounded-xl">
                    <p className="text-sm text-neutral-400">Total Requests</p>
                    <p className="text-2xl font-bold text-neutral-900">
                      {selectedApplication.api_keys.reduce(
                        (sum, key) => sum + key.usage_count,
                        0
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-neutral-50 rounded-xl">
                    <p className="text-sm text-neutral-400">Active Keys</p>
                    <p className="text-2xl font-bold text-neutral-900">
                      {selectedApplication.api_keys.filter(
                        (key) => key.status === "active"
                      ).length}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-neutral-900">Recent Activity</h4>
                  <p className="text-neutral-500">Request history for this application</p>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">API Keys</h3>
                <div className="space-y-4">
                  {selectedApplication.api_keys.map((key) => (
                    <div key={key.id} className="p-3 border border-neutral-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-neutral-900">{key.name}</h4>
                          <p className="text-sm text-neutral-500">{key.key.slice(0, 20)}...</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            API_KEY_STATUS_COLORS[key.status]
                          }`}>
                            {key.status.toUpperCase()}
                          </span>
                          <span className="font-medium text-neutral-900">
                            {key.usage_count.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12">
              <Icon name="bar-chart-3" size={48} className="text-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-900">Select an Application</h3>
              <p className="text-neutral-500 mt-2">Choose an application to view its analytics</p>
            </div>
          )}

          {/* Overall Usage Chart */}
          {usage.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Usage Over Time</h3>
              {/* Placeholder for chart - in production, use LineChart or BarChart */}
              <div className="h-64 bg-neutral-50 rounded-xl flex items-center justify-center">
                <p className="text-neutral-500">API usage chart would be displayed here</p>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Documentation Tab */}
      {activeTab === "documentation" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">API Documentation</h2>
              <p className="text-neutral-500">Complete reference for the Guestly API</p>
            </div>
            <Button onClick={() => setShowDocumentation(true)}>
              <Icon name="book-open" size={16} />
              Open Documentation
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Getting Started</h3>
              <div className="space-y-4">
                <p className="text-neutral-500">Quick start guide for the Guestly API</p>
                <ol className="space-y-2 text-sm">
                  <li>1. Create an application in the Developer Portal</li>
                  <li>2. Generate API keys for your application</li>
                  <li>3. Choose a subscription plan (free tier available)</li>
                  <li>4. Start making API requests</li>
                </ol>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">API Basics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-500">Base URL</span>
                  <code className="font-mono text-sm bg-neutral-100 px-2 py-1 rounded">
                    {API_DOCUMENTATION.base_url}
                  </code>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-500">Version</span>
                  <span className="font-medium text-neutral-900">{API_DOCUMENTATION.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-500">Authentication</span>
                  <span className="font-medium text-neutral-900">{API_DOCUMENTATION.authentication}</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Endpoints</h3>
              <p className="text-2xl font-bold text-neutral-900">{API_DOCUMENTATION.endpoints.length}</p>
              <p className="text-sm text-neutral-500">Available endpoints</p>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Rate Limits</h3>
              <p className="text-neutral-500">Depends on your subscription plan</p>
              <p className="text-sm text-neutral-400 mt-2">Free tier: 1,000 requests/day</p>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Support</h3>
              <p className="text-neutral-500">Email: api-support@guestly.com</p>
              <p className="text-sm text-neutral-400 mt-2">Response time: 24-48 hours</p>
            </Card>
          </div>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === "billing" && (
        <BillingSection
          billingInfo={billingInfo}
          plans={SUBSCRIPTION_PLANS}
          onSubscribe={handleSubscribe}
          onCancelSubscription={handleCancelSubscription}
        />
      )}

      {/* Modals */}
      {showCreateApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-neutral-900">
                {selectedApplication ? "Edit Application" : "Create New Application"}
              </h2>
              <button
                onClick={() => {
                  setShowCreateApp(false);
                  setSelectedApplication(null);
                }}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <Icon name="x" size={24} />
              </button>
            </div>
            <ApplicationForm
              onSubmit={selectedApplication
                ? (data) => handleUpdateApplication(selectedApplication, data)
                : handleCreateApplication
              }
              onCancel={() => {
                setShowCreateApp(false);
                setSelectedApplication(null);
              }}
              initialData={selectedApplication || null}
            />
          </div>
        </div>
      )}

      {showCreateKey && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-neutral-900">Generate API Key</h2>
              <button
                onClick={() => {
                  setShowCreateKey(false);
                  setSelectedApplication(null);
                }}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <Icon name="x" size={24} />
              </button>
            </div>
            <ApiKeyGenerator onGenerate={handleGenerateKey} />
          </div>
        </div>
      )}

      {showDocumentation && (
        <ApiDocumentationViewer
          documentation={API_DOCUMENTATION}
          onClose={() => setShowDocumentation(false)}
        />
      )}
    </div>
  );
}
