import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

function getAuthHeaders(request: NextRequest): Record<string, string> {
  const headerAuth = request.headers.get("authorization") || request.headers.get("Authorization");
  const token = headerAuth ?? request.cookies.get("access_token")?.value;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function GET(request: NextRequest) {
  // Validate token exists - backend will handle role validation via JWT
  const token = request.cookies.get("access_token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "20";
  const search = searchParams.get("search");
  const category = searchParams.get("category");
  const status = searchParams.get("status");

  try {
    const backendParams = new URLSearchParams({
      page,
      page_size: limit,
      role: "vendor",
    });
    if (search) backendParams.set("search", search);
    if (category) backendParams.set("category", category);
    if (status) backendParams.set("status", status);

    const response = await fetch(
      `${BACKEND_URL}/api/v1/admin/users?${backendParams}`,
      { headers: getAuthHeaders(request), credentials: 'include' }
    );
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Failed to fetch vendors" },
        { status: response.status }
      );
    }

    // Build vendor list from admin_list_users response
    const users = (data.users || []).map((u: any) => ({
      id: u.id,
      userId: u.id,
      // User model fields
      display_name: u.display_name,
      email: u.email,
      role: u.role,
      isActive: u.isActive,
      isVerified: u.isVerified,
      avatar: u.avatar,
      bio: u.bio,
      interests: u.interests || [],
      location: u.location,
      eventsCreated: u.eventsCreated || 0,
      eventsAttended: u.eventsAttended || 0,
      totalSpent: u.totalSpent || 0,
      walletBalance: u.walletBalance || 0,
      profileCompleteness: u.profileCompleteness || 0,
      createdAt: u.createdAt,
      lastActivityAt: u.lastActivityAt,
      // Vendor-specific fields (filled from profile enrichment)
      vendorName: null as string | null,
      vendorCategory: null as string | null,
      description: null as string | null,
      contactEmail: u.email,
      contactPhone: null as string | null,
      city: null as string | null,
      rating: null as number | null,
      reviewCount: null as number | null,
      completedEvents: null as number | null,
      services: null as string[] | null,
      pricing: null as string | null,
      portfolio: null as string[] | null,
      rateCard: null as string | null,
      vendorStatus: null as string | null,
      subscriptionPlan: null as string | null,
      subscriptionExpiresAt: null as string | null,
      hasProfile: false,
    }));

    // Enrich with VendorProfile data from public vendors endpoint (approved only)
    try {
      const profilePageSize = Math.max(100, users.length + 50);
      const profileRes = await fetch(
        `${BACKEND_URL}/vendors/?page=1&page_size=${profilePageSize}`,
        { headers: getAuthHeaders(request), credentials: 'include' }
      );
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        const profiles: any[] = profileData.vendors || [];
        const profileByUserId: Record<string, any> = {};
        for (const p of profiles) {
          profileByUserId[p.user_id] = p;
        }
        for (const u of users) {
          const profile = profileByUserId[u.id];
          if (profile) {
            u.vendorName = profile.name;
            u.vendorCategory = profile.category;
            u.description = profile.description;
            u.contactEmail = profile.contact_email || u.email;
            u.contactPhone = profile.contact_phone;
            u.city = profile.city;
            u.rating = profile.rating;
            u.reviewCount = profile.review_count;
            u.completedEvents = profile.completed_events;
            u.services = profile.services || [];
            u.pricing = profile.pricing;
            u.portfolio = profile.portfolio || [];
            u.rateCard = profile.rate_card;
            u.vendorStatus = profile.status;
            u.subscriptionPlan = profile.subscription_plan;
            u.subscriptionExpiresAt = profile.subscription_expires_at;
            u.hasProfile = true;
          }
        }
      }
    } catch (e) {
      // Non-fatal: enrichment is best-effort
    }

    return NextResponse.json({
      data: { vendors: users },
      vendors: users,
      totalPages: data.page_count || 1,
      pagination: {
        page: Number(data.page || page),
        pageSize: Number(limit),
        total: data.total || 0,
        totalPages: data.page_count || 1,
      },
    });
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return NextResponse.json(
      { error: "Failed to fetch vendors from database" },
      { status: 502 }
    );
  }
}
