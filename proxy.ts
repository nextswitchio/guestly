import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const PROTECTED_ROUTES = [
  "/dashboard",
  "/attendee",
  "/vendor",
  "/affiliate",
  "/admin",
  "/organiser",
  "/wallet",
  "/payment",
];

// Routes that should redirect if already authenticated
const AUTH_ROUTES = ["/login", "/register", "/signup"];

// Admin-only routes
const ADMIN_ROUTES = ["/admin"];

// Vendor-only routes
const VENDOR_ROUTES = ["/vendor"];

// Affiliate-only routes
const AFFILIATE_ROUTES = ["/affiliate"];

// Routes that should redirect to dashboard if authenticated
const AUTH_REDIRECT_MAP: Record<string, string> = {
  "/login": "/attendee",
  "/register": "/attendee",
  "/signup": "/attendee",
};

// Role-specific redirect if user tries to access wrong role area
const ROLE_REDIRECT_MAP: Record<string, Record<string, string>> = {
  attendee: {
    "/admin": "/attendee",
    "/vendor": "/attendee",
    "/affiliate": "/attendee",
    "/organiser": "/attendee",
  },
  organiser: {
    "/admin": "/dashboard",
    "/vendor": "/dashboard",
    "/affiliate": "/dashboard",
  },
  vendor: {
    "/admin": "/vendor",
    "/affiliate": "/vendor",
    "/organiser": "/vendor",
  },
  affiliate: {
    "/admin": "/affiliate",
    "/vendor": "/affiliate",
    "/organiser": "/affiliate",
  },
  admin: {
    "/vendor": "/admin",
    "/affiliate": "/admin",
    "/organiser": "/admin",
  },
};

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => {
    const nextChar = pathname[route.length];
    return pathname.startsWith(route) && (nextChar === "/" || nextChar === undefined);
  });
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));
}

function isAdminRoute(pathname: string): boolean {
  const nextChar = pathname["/admin".length];
  return pathname.startsWith("/admin") && (nextChar === "/" || nextChar === undefined);
}

function isVendorRoute(pathname: string): boolean {
  const nextChar = pathname["/vendor".length];
  return pathname.startsWith("/vendor") && (nextChar === "/" || nextChar === undefined);
}

function isAffiliateRoute(pathname: string): boolean {
  const nextChar = pathname["/affiliate".length];
  return pathname.startsWith("/affiliate") && (nextChar === "/" || nextChar === undefined);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get("role")?.value;
  const accessToken = request.cookies.get("access_token")?.value;

  // API routes are always public (individual routes handle auth)
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Static files and Next.js internals
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname.startsWith("/public/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if user is authenticated (has role and access token cookies)
  const isAuthenticated = !!role && !!accessToken;

  // If trying to access auth pages while authenticated, redirect to appropriate dashboard
  if (isAuthRoute(pathname) && isAuthenticated) {
    const redirectPath = AUTH_REDIRECT_MAP[pathname] || "/attendee";
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // If trying to access protected route without authentication
  if (isProtectedRoute(pathname) && !isAuthenticated) {
    // Determine the login page based on the route
    if (isAdminRoute(pathname)) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    if (isVendorRoute(pathname)) {
      return NextResponse.redirect(new URL("/vendor-auth/login", request.url));
    }
    if (isAffiliateRoute(pathname)) {
      return NextResponse.redirect(new URL("/affiliate-auth/login", request.url));
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role-based access control: prevent users from accessing other role areas
  if (isAuthenticated && role) {
    const roleRedirects = ROLE_REDIRECT_MAP[role];
    if (roleRedirects) {
      for (const [restrictedPath, redirectPath] of Object.entries(roleRedirects)) {
        const nextChar = pathname[restrictedPath.length];
        if (pathname.startsWith(restrictedPath) && (nextChar === "/" || nextChar === undefined)) {
          return NextResponse.redirect(new URL(redirectPath, request.url));
        }
      }
    }
  }

  // Admin route protection: only admin role can access /admin
  const adminNext = pathname["/admin".length];
  if (pathname.startsWith("/admin") && (adminNext === "/" || adminNext === undefined) && isAuthenticated && role !== "admin") {
    return NextResponse.redirect(new URL("/attendee", request.url));
  }

  // Vendor route protection: only vendor role can access /vendor
  const vendorNext = pathname["/vendor".length];
  if (pathname.startsWith("/vendor") && (vendorNext === "/" || vendorNext === undefined) && isAuthenticated && role !== "vendor") {
    return NextResponse.redirect(new URL("/attendee", request.url));
  }

  // Affiliate route protection: only affiliate role can access /affiliate
  const affiliateNext = pathname["/affiliate".length];
  if (pathname.startsWith("/affiliate") && (affiliateNext === "/" || affiliateNext === undefined) && isAuthenticated && role !== "affiliate") {
    return NextResponse.redirect(new URL("/attendee", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
