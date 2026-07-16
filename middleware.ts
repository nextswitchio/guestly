import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = [
  "/organizer/dashboard",
  "/attendee",
  "/vendor",
  "/affiliate",
  "/admin",
  "/organiser",
  "/organizer",
  "/wallet",
  "/payment",
];

const AUTH_ROUTES = ["/login", "/register", "/signup"];
const ADMIN_PUBLIC_ROUTES = ["/admin/login", "/admin/forgot-password"];

function getRoleDashboardPath(role: string): string {
  switch (role) {
    case "organizer":
    case "organiser":
      return "/organizer/dashboard";
    case "vendor":
      return "/vendor/dashboard";
    case "affiliate":
      return "/affiliate/dashboard";
    case "admin":
      return "/admin";
    default:
      return "/attendee";
  }
}

const ROLE_REDIRECT_MAP: Record<string, Record<string, string>> = {
  attendee: {
    "/admin": "/attendee",
    "/vendor": "/attendee",
    "/affiliate": "/attendee",
    "/organiser": "/attendee",
    "/organizer": "/attendee",
  },
  organiser: {
    "/admin": "/organizer/dashboard",
    "/vendor": "/organizer/dashboard",
    "/affiliate": "/organizer/dashboard",
    "/attendee": "/organizer/dashboard",
  },
  organizer: {
    "/admin": "/organizer/dashboard",
    "/vendor": "/organizer/dashboard",
    "/affiliate": "/organizer/dashboard",
    "/attendee": "/organizer/dashboard",
  },
  vendor: {
    "/admin": "/vendor/dashboard",
    "/affiliate": "/vendor/dashboard",
    "/organiser": "/vendor/dashboard",
    "/organizer": "/vendor/dashboard",
    "/attendee": "/vendor/dashboard",
  },
  affiliate: {
    "/admin": "/affiliate/dashboard",
    "/vendor": "/affiliate/dashboard",
    "/organiser": "/affiliate/dashboard",
    "/organizer": "/affiliate/dashboard",
    "/attendee": "/affiliate/dashboard",
  },
  admin: {
    "/vendor": "/admin",
    "/affiliate": "/admin",
    "/organiser": "/admin",
    "/organizer": "/admin",
    "/attendee": "/admin",
  },
};

function isProtectedRoute(pathname: string): boolean {
  if (ADMIN_PUBLIC_ROUTES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return false;
  }
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

function isOrganizerRoute(pathname: string): boolean {
  const nextCharOrganizer = pathname["/organizer".length];
  const nextCharOrganiser = pathname["/organiser".length];
  return (
    (pathname.startsWith("/organizer") && (nextCharOrganizer === "/" || nextCharOrganizer === undefined)) ||
    (pathname.startsWith("/organiser") && (nextCharOrganiser === "/" || nextCharOrganiser === undefined))
  );
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get("role")?.value;
  const accessToken = request.cookies.get("access_token")?.value;

  if (pathname.startsWith("/api/")) {
    const publicApiRoutes = [
      "/api/admin/login",
      "/api/auth/",
      "/api/newsletter/",
    ];
    if (publicApiRoutes.some((p) => pathname.startsWith(p))) {
      return NextResponse.next();
    }

    const protectedApiPrefixes = ["/api/admin/", "/api/orders/", "/api/wallet/", "/api/profile/"];
    const isProtectedApi = protectedApiPrefixes.some((prefix) => pathname.startsWith(prefix));

    if (isProtectedApi && !accessToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.next();
  }

  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname.startsWith("/public/")
  ) {
    return NextResponse.next();
  }

  const isAuthenticated = !!role && !!accessToken;

  if (isAuthRoute(pathname) && isAuthenticated) {
    const redirectPath = getRoleDashboardPath(role);
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  if (isProtectedRoute(pathname) && !isAuthenticated) {
    if (isAdminRoute(pathname)) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    if (isVendorRoute(pathname)) {
      return NextResponse.redirect(new URL("/vendor-auth/login", request.url));
    }
    if (isAffiliateRoute(pathname)) {
      return NextResponse.redirect(new URL("/affiliate-auth/login", request.url));
    }
    if (isOrganizerRoute(pathname)) {
      return NextResponse.redirect(new URL("/login?role=organizer", request.url));
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

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

  if (isAdminRoute(pathname) && !ADMIN_PUBLIC_ROUTES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    if (isAuthenticated && role !== "admin") {
      return NextResponse.redirect(new URL("/attendee", request.url));
    }
  }

  if (isVendorRoute(pathname) && isAuthenticated && role !== "vendor") {
    return NextResponse.redirect(new URL("/vendor/dashboard", request.url));
  }

  if (isAffiliateRoute(pathname) && isAuthenticated && role !== "affiliate") {
    return NextResponse.redirect(new URL("/affiliate/dashboard", request.url));
  }

  if (isOrganizerRoute(pathname) && isAuthenticated && role !== "organizer" && role !== "organiser") {
    const roleDashboard = getRoleDashboardPath(role);
    return NextResponse.redirect(new URL(roleDashboard, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
