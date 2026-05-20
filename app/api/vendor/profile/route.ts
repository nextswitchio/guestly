import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

type VendorProfilePayload = {
  name?: string;
  description?: string;
  category?: string;
  portfolio?: string[];
  rate_card?: string | null;
  contact_email?: string;
  contact_phone?: string;
  city?: string | null;
  services?: string[];
  pricing?: string | null;
};

type BackendVendorProfile = VendorProfilePayload & {
  id?: string;
  user_id?: string;
  rating?: number;
  review_count?: number;
  completed_events?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
};

const CATEGORY_MAP: Record<string, string> = {
  "Sound & Lighting": "Sound",
  Decor: "Decoration",
  Videography: "Photography",
  Entertainment: "Sound",
  Transportation: "Logistics",
};

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function stringArrayValue(value: unknown): string[] | undefined {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : undefined;
}

function normalizeCategory(value: unknown): string | undefined {
  const category = stringValue(value);
  if (!category) return undefined;
  return CATEGORY_MAP[category] || category;
}

function compactPayload(payload: VendorProfilePayload): VendorProfilePayload {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => {
      if (value === undefined) return false;
      if (value === "") return false;
      return true;
    })
  ) as VendorProfilePayload;
}

function toClientProfile(profile: BackendVendorProfile) {
  return {
    ...profile,
    businessName: profile.name,
    contactEmail: profile.contact_email,
    contactPhone: profile.contact_phone,
    rateCard: profile.rate_card,
    reviewCount: profile.review_count,
    completedEvents: profile.completed_events,
    location: profile.city,
    phone: profile.contact_phone,
    email: profile.contact_email,
  };
}

async function readBackendError(res: Response, fallback: string) {
  const error = await res.json().catch(() => ({ detail: fallback }));
  return error.detail || error.error || fallback;
}

async function proxyVendorProfileWrite(method: "POST" | "PUT", token: string, payload: VendorProfilePayload) {
  const url = method === "POST" ? `${BACKEND_URL}/api/v1/vendors/` : `${BACKEND_URL}/api/v1/vendors/me`;
  return fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

function normalizeVendorProfilePayload(body: Record<string, unknown>): VendorProfilePayload {
  return compactPayload({
    name: stringValue(body.name) || stringValue(body.businessName),
    description: stringValue(body.description),
    category: normalizeCategory(body.category),
    portfolio: stringArrayValue(body.portfolio) || [],
    rate_card: stringValue(body.rate_card) ?? stringValue(body.rateCard) ?? null,
    contact_email: stringValue(body.contact_email) ?? stringValue(body.contactEmail) ?? stringValue(body.email),
    contact_phone: stringValue(body.contact_phone) ?? stringValue(body.contactPhone) ?? stringValue(body.phone),
    city: stringValue(body.city) ?? stringValue(body.location) ?? null,
    services: stringArrayValue(body.services) || [],
    pricing: stringValue(body.pricing) || null,
  });
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/vendors/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to fetch vendor profile" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json() as BackendVendorProfile;
    const profile = toClientProfile(data);
    return NextResponse.json({ ok: true, success: true, profile, data: profile });
  } catch {
    return NextResponse.json({ error: "Failed to fetch vendor profile" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json() as Record<string, unknown>;

    const payload = normalizeVendorProfilePayload(body);

    if (!payload.name || !payload.description || !payload.category || !payload.contact_email || !payload.contact_phone) {
      return NextResponse.json({ error: "Business name, description, category, phone, and email are required" }, { status: 400 });
    }

    let res = await proxyVendorProfileWrite("POST", token, payload);

    if (res.status === 400) {
      const detail = await readBackendError(res, "Failed to create vendor profile");
      if (typeof detail === "string" && detail.toLowerCase().includes("already exists")) {
        res = await proxyVendorProfileWrite("PUT", token, payload);
      } else {
        return NextResponse.json({ error: detail }, { status: 400 });
      }
    }

    if (!res.ok) {
      const error = await readBackendError(res, "Failed to create vendor profile");
      return NextResponse.json({ error }, { status: res.status });
    }

    const data = await res.json() as BackendVendorProfile;
    const profile = toClientProfile(data);
    return NextResponse.json({ ok: true, success: true, profile, data: profile });
  } catch {
    return NextResponse.json({ error: "Failed to create vendor profile" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json() as Record<string, unknown>;
    const payload = normalizeVendorProfilePayload(body);

    const res = await proxyVendorProfileWrite("PUT", token, payload);

    if (!res.ok) {
      const error = await readBackendError(res, "Failed to update vendor profile");
      return NextResponse.json({ error }, { status: res.status });
    }

    const data = await res.json() as BackendVendorProfile;
    const profile = toClientProfile(data);
    return NextResponse.json({ ok: true, success: true, profile, data: profile });
  } catch {
    return NextResponse.json({ error: "Failed to update vendor profile" }, { status: 500 });
  }
}
